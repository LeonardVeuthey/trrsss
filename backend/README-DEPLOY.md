# 🚀 Déploiement Strapi - Guide Rapide

Ce guide rapide vous permet de déployer votre application Strapi sur Infomaniak en quelques étapes.

## ⚡ Déploiement en 5 minutes

### 1. Préparation locale
```bash
# Générer les clés de sécurité
npm run generate:keys

# Créer le fichier .env
npm run setup:env

# Configurer .env avec vos valeurs
nano .env
```

### 2. Configuration GitHub
Dans votre repo GitHub → Settings → Secrets and variables → Actions, ajoutez :

| Secret | Valeur |
|--------|--------|
| `SSH_HOST` | `ssh-xxx.infomaniak.com` |
| `SSH_PORT` | `22` |
| `SSH_USER` | `votre-user` |
| `SSH_KEY` | Contenu de `~/.ssh/id_deploy` |
| `REMOTE_PATH` | `/home/USER/apps/strapi` |
| `GIT_REPO_URL` | `git@github.com:user/repo.git` |

### 3. Premier déploiement
```bash
# Push sur main
git add .
git commit -m "feat: initial deployment setup"
git push origin main
```

### 4. Vérification
- Allez dans GitHub → Actions pour voir le déploiement
- Connectez-vous au serveur : `ssh USER@HOST`
- Vérifiez : `pm2 status` et `pm2 logs strapi-app`

## 🔧 Commandes utiles

### Scripts npm
```bash
npm run generate:keys    # Générer les clés de sécurité
npm run setup:env        # Créer .env depuis .env.example
npm run pm2:start        # Démarrer PM2
npm run pm2:reload       # Recharger l'app
npm run pm2:logs         # Voir les logs
npm run clean            # Nettoyer les builds
```

### PM2
```bash
pm2 status               # Status des apps
pm2 logs strapi-app      # Logs en temps réel
pm2 restart strapi-app   # Redémarrer
pm2 delete strapi-app    # Supprimer
pm2 save                 # Sauvegarder config
```

## 📁 Structure des fichiers

```
backend/
├── .github/workflows/   # GitHub Actions
├── docs/               # Documentation
├── scripts/            # Scripts utilitaires
├── ecosystem.config.js # Configuration PM2
├── .env.example        # Variables d'exemple
└── .gitignore          # Fichiers ignorés
```

## 🔒 Sécurité

- ✅ `.env` jamais commité
- ✅ `public/uploads/` préservé
- ✅ Base de données SQLite sauvegardée
- ✅ Clés SSH dans les secrets GitHub

## 🐛 Dépannage rapide

### Problème de connexion SSH
```bash
# Test de connexion
ssh -i ~/.ssh/id_deploy USER@HOST -p PORT

# Vérifier les permissions
chmod 600 ~/.ssh/id_deploy
chmod 644 ~/.ssh/id_deploy.pub
```

### PM2 ne démarre pas
```bash
# Voir les logs
pm2 logs strapi-app

# Redémarrer proprement
pm2 delete strapi-app
pm2 start ecosystem.config.js
```

### Problème de permissions
```bash
# Sur le serveur
chmod 755 public/uploads
chmod 644 .env
```

## 📞 Support

- 📖 Documentation complète : `docs/DEPLOY.md`
- 🔍 Logs PM2 : `pm2 logs strapi-app`
- 🐛 Issues : GitHub Issues

---

**🎯 Objectif atteint** : Déploiement automatique à chaque push sur `main` !
