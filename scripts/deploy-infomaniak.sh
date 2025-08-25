#!/bin/bash

set -e

echo "🚀 Déploiement Infomaniak - Monorepo TRRSSS"
echo "=============================================="

# 1. Nettoyage complet
echo "🧹 Nettoyage des dépendances..."
cd backend && rm -rf node_modules package-lock.json && cd ..
cd frontend && rm -rf node_modules package-lock.json && cd ..

# 2. Installation des dépendances backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install --omit=dev --no-audit --no-fund
cd ..

# 3. Build du backend
echo "🔨 Build du backend Strapi..."
cd backend
npm run build
cd ..

# 4. Installation des dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install --no-audit --no-fund
cd ..

# 5. Build du frontend
echo "🔨 Build du frontend SvelteKit..."
cd frontend
npm run build
cd ..

echo "✅ Déploiement terminé avec succès !"
echo "📁 Backend build: backend/dist"
echo "📁 Frontend build: frontend/build"
