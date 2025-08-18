# Déploiement Strapi sur Infomaniak (Node) via GitHub Actions

Ce guide détaille la configuration et le déploiement automatique d'une application Strapi sur un serveur Infomaniak Node.js avec PM2.

## 📋 Prérequis

- **Accès SSH** au serveur Infomaniak (user, host, port)
- **PM2** installé globalement sur le serveur
- **Node.js 18+ ou 20+** sur le serveur
- **Git** configuré sur le serveur
- **Clés SSH** pour l'authentification GitHub Actions

## 🔧 Installation des prérequis sur le serveur

### 1. Installation de PM2
```bash
npm install -g pm2
```

### 2. Vérification de Node.js
```bash
node --version  # Doit être >= 18
npm --version
```

### 3. Installation de Git (si nécessaire)
```bash
# Sur Ubuntu/Debian
sudo apt update && sudo apt install git

# Sur CentOS/RHEL
sudo yum install git
```

## 🔑 Configuration des clés SSH

### 1. Génération des clés SSH (sur votre machine locale)
```bash
# Générer une nouvelle paire de clés pour le déploiement
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_deploy

# Afficher la clé publique
cat ~/.ssh/id_deploy.pub
```

### 2. Ajout de la clé publique au serveur
```bash
# Copier la clé publique vers le serveur
ssh-copy-id -i ~/.ssh/id_deploy.pub USER@SSH_HOST -p SSH_PORT

# Ou manuellement, ajouter le contenu de ~/.ssh/id_deploy.pub à ~/.ssh/authorized_keys
```

### 3. Test de connexion SSH
```bash
ssh -i ~/.ssh/id_deploy USER@SSH_HOST -p SSH_PORT
```

## ⚙️ Configuration GitHub Secrets

Dans votre repository GitHub, allez dans **Settings → Secrets and variables → Actions** et ajoutez les secrets suivants :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SSH_HOST` | Host Infomaniak | `ssh-xxx.infomaniak.com` ou IP |
| `SSH_PORT` | Port SSH | `22` |
| `SSH_USER` | Utilisateur SSH | `votre-user` |
| `SSH_KEY` | Clé privée SSH | Contenu de `~/.ssh/id_deploy` |
| `REMOTE_PATH` | Chemin absolu sur le serveur | `/home/USER/apps/strapi` |
| `GIT_REPO_URL` | URL SSH du repo GitHub | `git@github.com:user/repo.git` |

### Format de la clé SSH
La clé privée doit être au format PEM. Si vous avez généré une clé OpenSSH, convertissez-la :
```bash
ssh-keygen -p -f ~/.ssh/id_deploy -m pem
```

## 🚀 Premier déploiement (manuel)

### 1. Connexion au serveur
```bash
ssh -i ~/.ssh/id_deploy USER@SSH_HOST -p SSH_PORT
```

### 2. Préparation du dossier
```bash
# Créer le dossier de l'application
mkdir -p /home/USER/apps/strapi
cd /home/USER/apps/strapi

# Cloner le repository
git clone --branch main git@github.com:user/repo.git .
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos valeurs de production
nano .env
```

### 4. Variables d'environnement essentielles
```env
# Configuration serveur
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Clés de sécurité (GÉNÉRER DES VALEURS UNIQUES !)
APP_KEYS=votre-clé-1,votre-clé-2,votre-clé-3,votre-clé-4
API_TOKEN_SALT=votre-salt
ADMIN_JWT_SECRET=votre-jwt-secret
JWT_SECRET=votre-jwt-secret
TRANSFER_TOKEN_SALT=votre-transfer-salt

# Base de données SQLite
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Configuration CORS (ajoutez vos domaines)
CORS_ORIGIN=https://votre-domaine.com,https://www.votre-domaine.com
```

### 5. Génération des clés de sécurité
```bash
# Générer des clés aléatoires
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6. Premier démarrage
```bash
# Installation des dépendances
npm ci --omit=dev

# Build de l'application
npm run build

# Création des dossiers nécessaires
mkdir -p public/uploads logs .tmp

# Démarrage avec PM2
pm2 start ecosystem.config.js

# Sauvegarde de la configuration PM2
pm2 save

# Vérification du statut
pm2 status
pm2 logs --lines 50
```

## 🔄 Déploiement continu

Une fois configuré, le déploiement se fait automatiquement :

1. **Push sur main** → Déclenche le workflow GitHub Actions
2. **Connexion SSH** → GitHub Actions se connecte au serveur
3. **Mise à jour du code** → `git fetch/reset` sur main
4. **Installation des dépendances** → `npm ci --omit=dev`
5. **Build Strapi** → `npm run build`
6. **Redémarrage PM2** → `pm2 reload`

### Déclenchement manuel
Vous pouvez aussi déclencher le déploiement manuellement depuis l'onglet **Actions** de GitHub.

## 📊 Gestion PM2

### Commandes utiles
```bash
# Status des applications
pm2 status

# Logs en temps réel
pm2 logs strapi-app

# Logs des 100 dernières lignes
pm2 logs strapi-app --lines 100

# Redémarrage
pm2 restart strapi-app

# Arrêt
pm2 stop strapi-app

# Suppression
pm2 delete strapi-app

# Sauvegarde de la configuration
pm2 save

# Restauration de la configuration
pm2 resurrect
```

### Scripts npm disponibles
```bash
# Démarrage PM2
npm run pm2:start

# Rechargement PM2
npm run pm2:reload

# Logs PM2
npm run pm2:logs

# Status PM2
npm run pm2:status
```

## 🔒 Sécurité

### 1. Protection des fichiers sensibles
- Le fichier `.env` n'est jamais commité
- Les uploads (`public/uploads/`) sont préservés lors du déploiement
- La base de données SQLite locale est sauvegardée

### 2. Limitation d'accès SSH
```bash
# Configuration du firewall (optionnel)
sudo ufw allow from VOTRE_IP to any port 22
sudo ufw enable
```

### 3. Fail2ban (optionnel)
```bash
# Installation et configuration de fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreur de permissions
```bash
# Vérifier les permissions
ls -la public/uploads
chmod 755 public/uploads
chmod 644 .env
```

#### 2. PM2 ne démarre pas
```bash
# Vérifier les logs
pm2 logs strapi-app

# Redémarrer PM2
pm2 delete strapi-app
pm2 start ecosystem.config.js
```

#### 3. Problème de port
```bash
# Vérifier si le port est utilisé
netstat -tulpn | grep :1337

# Tuer le processus si nécessaire
kill -9 PID
```

#### 4. Problème de base de données
```bash
# Vérifier la base de données
ls -la .tmp/data.db

# Recréer si nécessaire
rm .tmp/data.db
npm run build
```

### Logs utiles
```bash
# Logs PM2
pm2 logs strapi-app

# Logs système
journalctl -u pm2-USER

# Logs Strapi
tail -f logs/combined.log
```

## 📈 Monitoring

### 1. Monitoring PM2
```bash
# Interface web PM2 (optionnel)
pm2 install pm2-server-monit
pm2 web
```

### 2. Métriques système
```bash
# Utilisation mémoire
pm2 monit

# Status détaillé
pm2 show strapi-app
```

## 🔄 Mise à jour de Strapi

### 1. Mise à jour locale
```bash
# Vérifier les mises à jour disponibles
npm run upgrade:dry

# Effectuer la mise à jour
npm run upgrade
```

### 2. Test et déploiement
```bash
# Test local
npm run dev

# Commit et push
git add .
git commit -m "feat: upgrade Strapi to vX.X.X"
git push origin main
```

## 📝 Notes importantes

### 1. Stockage des médias
Pour éviter la dépendance au disque local, considérez l'utilisation d'un stockage externe :
- **Cloudinary** (gratuit jusqu'à 25GB)
- **AWS S3**
- **Wasabi** (S3 compatible, très économique)
- **Backblaze B2**

### 2. Base de données
En production, considérez l'utilisation d'une base de données externe :
- **PostgreSQL** (recommandé)
- **MySQL**
- **MongoDB**

### 3. Sauvegarde
Configurez des sauvegardes automatiques :
```bash
# Script de sauvegarde (cron)
0 2 * * * /usr/bin/tar -czf /backup/strapi-$(date +\%Y\%m\%d).tar.gz /home/USER/apps/strapi
```

### 4. SSL/TLS
Configurez HTTPS avec Let's Encrypt ou le certificat Infomaniak.

## 🆘 Support

En cas de problème :
1. Vérifiez les logs PM2 : `pm2 logs strapi-app`
2. Consultez la documentation Strapi
3. Vérifiez les permissions et la configuration SSH
4. Testez la connexion SSH manuellement

---

**⚠️ Important** : Gardez toujours une copie de sauvegarde de votre fichier `.env` et de votre base de données !
