#!/bin/bash

set -e

echo "🚀 Déploiement Infomaniak - Monorepo TRRSSS"
echo "=============================================="

# 1. Nettoyage du cache npm
echo "🧹 Nettoyage du cache npm..."
npm cache clean --force

# 2. Nettoyage complet pour éviter les conflits
echo "🧹 Nettoyage complet..."
cd backend && rm -rf node_modules package-lock.json && cd ..
cd frontend && rm -rf node_modules package-lock.json && cd ..

# 3. Installation des dépendances backend avec npm install
echo "📦 Installation des dépendances backend..."
cd backend
npm install --no-audit --no-fund --legacy-peer-deps
cd ..

# 4. Build du backend
echo "🔨 Build du backend Strapi..."
cd backend
npm run build
cd ..

# 5. Installation des dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install --no-audit --no-fund --legacy-peer-deps
cd ..

# 6. Build du frontend
echo "🔨 Build du frontend SvelteKit..."
cd frontend
npm run build
cd ..

echo "✅ Déploiement terminé avec succès !"
echo "📁 Backend build: backend/dist"
echo "📁 Frontend build: frontend/.svelte-kit/output"
