# 🚀 Guide de Déploiement - TRRSSS

## Configuration Infomaniak

Ce projet utilise la solution GitHub Infomaniak pour le déploiement automatique.

### Structure du projet
- **Backend** : Strapi CMS (Node.js)
- **Frontend** : SvelteKit (Node.js)
- **Configuration** : `infomaniak.json`

### Processus de déploiement

1. **Build automatique** : Lors d'un push sur la branche `main`
2. **Script de déploiement** : `scripts/deploy-infomaniak.sh`
3. **Installation des dépendances** : Backend et Frontend
4. **Build des applications** : Strapi + SvelteKit
5. **Démarrage** : Application Strapi

### Fichiers de configuration

#### `infomaniak.json`
```json
{
  "name": "trrsss",
  "type": "nodejs",
  "build": {
    "command": "bash scripts/deploy-infomaniak.sh",
    "output": "backend/dist"
  },
  "deploy": {
    "source": "backend/dist",
    "destination": "/"
  },
  "environment": {
    "NODE_ENV": "production"
  },
  "start": {
    "command": "npm start"
  },
  "install": {
    "command": "npm run postinstall"
  }
}
```

#### Scripts disponibles

- `npm run postinstall` : Installation des dépendances
- `npm run build` : Build complet (backend + frontend)
- `npm start` : Démarrage de Strapi
- `npm run clean` : Nettoyage des dépendances
- `bash scripts/deploy-infomaniak.sh` : Script de déploiement complet

### Résolution des problèmes

#### Erreur Rollup
Si vous rencontrez des erreurs liées à Rollup :
```bash
npm run clean
npm run postinstall
```

#### Erreur de build Strapi
Si le dossier `dist` n'existe pas :
```bash
cd backend
npm run build
```

#### Problèmes de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### URLs d'accès

- **Site principal** : `https://trrsss.ch`
- **Admin Strapi** : `https://trrsss.ch/admin`
- **API Strapi** : `https://trrsss.ch/api`

### Variables d'environnement

Assurez-vous que le fichier `.env` est configuré sur le serveur avec :
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `API_TOKEN_SALT`
- `APP_KEYS`
