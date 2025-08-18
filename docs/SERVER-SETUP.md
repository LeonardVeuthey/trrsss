# Configuration Serveur Web Infomaniak

Ce guide explique comment configurer votre serveur Infomaniak pour héberger le backend Strapi et le frontend SvelteKit.

## 🏗️ Architecture de déploiement

```
Infomaniak Server
├── /home/USER/apps/trrsss/
│   ├── backend/          # Strapi CMS (Port 1337)
│   │   ├── .env
│   │   ├── ecosystem.config.js
│   │   └── public/uploads/
│   └── frontend/         # SvelteKit (Port 80/443)
│       ├── build/
│       └── .htaccess
```

## 🌐 Configuration du serveur web

### Option 1 : Apache (Recommandé pour Infomaniak)

#### Configuration du Virtual Host

Créez un fichier de configuration Apache dans votre panneau Infomaniak :

```apache
<VirtualHost *:80>
    ServerName votre-domaine.com
    ServerAlias www.votre-domaine.com
    
    # Frontend SvelteKit
    DocumentRoot /home/USER/apps/trrsss/frontend/build
    
    <Directory /home/USER/apps/trrsss/frontend/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Backend Strapi (Proxy)
    ProxyPreserveHost On
    ProxyPass /api http://localhost:1337/api
    ProxyPassReverse /api http://localhost:1337/api
    ProxyPass /admin http://localhost:1337/admin
    ProxyPassReverse /admin http://localhost:1337/admin
    ProxyPass /uploads http://localhost:1337/uploads
    ProxyPassReverse /uploads http://localhost:1337/uploads
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/trrsss_error.log
    CustomLog ${APACHE_LOG_DIR}/trrsss_access.log combined
</VirtualHost>
```

#### Modules Apache requis

Assurez-vous que ces modules sont activés :
- `mod_proxy`
- `mod_proxy_http`
- `mod_rewrite`
- `mod_deflate`

### Option 2 : Nginx

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Frontend
    location / {
        root /home/USER/apps/trrsss/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache statique
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Admin Strapi
    location /admin/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads/ {
        proxy_pass http://localhost:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Configuration Infomaniak

### 1. Accès SSH
- Activez l'accès SSH dans votre panneau Infomaniak
- Notez les informations de connexion (host, port, user)

### 2. Node.js
Infomaniak fournit Node.js. Vérifiez la version :
```bash
node --version  # Doit être >= 18
npm --version
```

### 3. PM2
Installez PM2 globalement :
```bash
npm install -g pm2
```

### 4. Structure des dossiers
```bash
# Créer la structure
mkdir -p /home/USER/apps/trrsss
cd /home/USER/apps/trrsss

# Permissions
chmod 755 /home/USER/apps/trrsss
```

## 🔒 Sécurité

### 1. Firewall
Configurez le firewall pour limiter l'accès :
```bash
# Autoriser seulement les ports nécessaires
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 2. SSL/TLS
Activez HTTPS dans votre panneau Infomaniak :
- Certificat Let's Encrypt (gratuit)
- Redirection automatique HTTP → HTTPS

### 3. Variables d'environnement
```bash
# Backend (.env)
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
CORS_ORIGIN=https://votre-domaine.com

# Frontend (.env)
PUBLIC_STRAPI_URL=https://votre-domaine.com
PUBLIC_SITE_URL=https://votre-domaine.com
```

## 📊 Monitoring

### 1. PM2
```bash
# Status des applications
pm2 status

# Logs en temps réel
pm2 logs strapi-app

# Monitoring
pm2 monit
```

### 2. Logs serveur
```bash
# Logs Apache
tail -f /var/log/apache2/trrsss_error.log
tail -f /var/log/apache2/trrsss_access.log

# Logs Nginx
tail -f /var/log/nginx/trrsss_error.log
tail -f /var/log/nginx/trrsss_access.log
```

## 🚀 Déploiement

### 1. Premier déploiement
```bash
# Le workflow GitHub Actions s'occupe de tout
# Mais vous pouvez vérifier manuellement :

# Backend
cd /home/USER/apps/trrsss/backend
pm2 start ecosystem.config.js

# Frontend
cd /home/USER/apps/trrsss/frontend
# Les fichiers sont déployés automatiquement
```

### 2. Vérification
```bash
# Vérifier que Strapi fonctionne
curl http://localhost:1337/api/health

# Vérifier le frontend
curl http://localhost

# Vérifier PM2
pm2 status
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Port 1337 non accessible
```bash
# Vérifier que Strapi écoute sur 0.0.0.0
netstat -tulpn | grep :1337

# Vérifier les logs PM2
pm2 logs strapi-app
```

#### 2. Problème de proxy
```bash
# Vérifier la configuration Apache/Nginx
apache2ctl -t
nginx -t

# Redémarrer le serveur web
sudo systemctl restart apache2
sudo systemctl restart nginx
```

#### 3. Permissions
```bash
# Vérifier les permissions
ls -la /home/USER/apps/trrsss/
chmod -R 755 /home/USER/apps/trrsss/
chown -R USER:USER /home/USER/apps/trrsss/
```

## 📞 Support Infomaniak

- **Documentation** : https://www.infomaniak.com/fr/support
- **Support technique** : Via le panneau de contrôle
- **Chat en ligne** : Disponible dans le panneau

---

**✅ Configuration terminée !** Votre site sera accessible sur `https://votre-domaine.com`
