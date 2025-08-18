# 🗺️ Territoires Sensibles

Site web présentant des projets territoriaux sensibles avec une carte interactive.

## 🏗️ Architecture

### Stack Technique
- **Frontend** : SvelteKit + SCSS + Leaflet.js
- **Backend** : Strapi CMS v5 + SQLite
- **Déploiement** : Infomaniak (Node.js) + PM2
- **CI/CD** : GitHub Actions

### Structure du Monorepo
```
trrsss.ch/
├── frontend/          # Application SvelteKit
│   ├── src/
│   ├── static/
│   └── package.json
├── backend/           # CMS Strapi
│   ├── src/
│   ├── config/
│   └── package.json
├── .github/           # Workflows GitHub Actions
├── docs/             # Documentation
└── README.md
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Git

### Installation complète
```bash
# Cloner le repository
git clone git@github.com:USER/trrsss.ch.git
cd trrsss.ch

# Installer les dépendances
cd backend && npm install
cd ../frontend && npm install
```

### Développement local
```bash
# Terminal 1 - Backend Strapi
cd backend
npm run dev

# Terminal 2 - Frontend SvelteKit
cd frontend
npm run dev
```

**URLs locales :**
- Frontend : http://localhost:5173
- Backend Strapi : http://localhost:1337
- Admin Strapi : http://localhost:1337/admin

## 🔧 Configuration

### Variables d'environnement
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Configurer les clés de sécurité et la base de données

# Frontend (.env)
cp frontend/.env.example frontend/.env
# Configurer l'URL de l'API Strapi
```

### Génération des clés de sécurité
```bash
cd backend
npm run generate:keys
```

## 🚀 Déploiement

### Déploiement complet sur Infomaniak
- **Backend Strapi** : Déployé automatiquement via GitHub Actions
- **Frontend SvelteKit** : Build et déployé automatiquement
- **Configuration PM2** : Gestion des processus Node.js
- **Proxy Apache/Nginx** : Routage intelligent entre frontend et backend

### Architecture de production
```
https://votre-domaine.com/          → Frontend SvelteKit
https://votre-domaine.com/api/      → Backend Strapi API
https://votre-domaine.com/admin/    → Admin Strapi
https://votre-domaine.com/uploads/  → Fichiers uploadés
```

### Configuration requise
- Serveur Infomaniak avec accès SSH
- PM2 installé globalement
- Configuration Apache/Nginx avec proxy
- Certificat SSL/TLS

## 📚 Documentation

- [Guide de déploiement complet](backend/docs/DEPLOY.md)
- [Configuration serveur web](docs/SERVER-SETUP.md)
- [Guide rapide](backend/README-DEPLOY.md)
- [Structure des données Strapi](backend/README.md)

## 🛠️ Scripts utiles

### Backend
```bash
cd backend
npm run dev          # Développement
npm run build        # Build production
npm run pm2:start    # Démarrage PM2
npm run pm2:logs     # Logs PM2
```

### Frontend
```bash
cd frontend
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Preview build
```

## 🔒 Sécurité

- Variables d'environnement sécurisées
- Clés SSH pour le déploiement
- Uploads protégés
- Base de données isolée

## 📞 Support

- Issues : GitHub Issues
- Documentation : `/docs`
- Logs : PM2 logs sur le serveur

---

**Développé avec ❤️ pour les territoires sensibles** 