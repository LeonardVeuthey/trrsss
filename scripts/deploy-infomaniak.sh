#!/bin/bash

set -e

echo "🚀 Déploiement Infomaniak - Monorepo TRRSSS"
echo "=============================================="

# 1. Nettoyage des node_modules seulement (garder package-lock.json)
echo "🧹 Nettoyage des node_modules..."
cd backend && rm -rf node_modules && cd ..
cd frontend && rm -rf node_modules && cd ..

# 2. Installation des dépendances backend avec npm ci
echo "📦 Installation des dépendances backend..."
cd backend
npm ci --omit=dev --no-audit --no-fund
cd ..

# 3. Build du backend
echo "🔨 Build du backend Strapi..."
cd backend
npm run build
cd ..

# 4. Installation des dépendances frontend avec npm ci
echo "📦 Installation des dépendances frontend..."
cd frontend
npm ci --no-audit --no-fund
cd ..

# 5. Build du frontend
echo "🔨 Build du frontend SvelteKit..."
cd frontend
npm run build
cd ..

echo "✅ Déploiement terminé avec succès !"
echo "📁 Backend build: backend/dist"
echo "📁 Frontend build: frontend/.svelte-kit/output"
