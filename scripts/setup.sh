#!/bin/bash

# ===================================
# Script de setup pour le monorepo
# ===================================

set -e

echo "🚀 Setup du monorepo Territoires Sensibles"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier Node.js
print_status "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ requise. Version actuelle: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) détecté"

# Vérifier npm
print_status "Vérification de npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_success "npm $(npm --version) détecté"

# Installation des dépendances backend
print_status "Installation des dépendances backend..."
cd backend
if [ ! -f "package.json" ]; then
    print_error "package.json manquant dans le dossier backend"
    exit 1
fi

npm install
print_success "Dépendances backend installées"

# Configuration backend
print_status "Configuration du backend..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Fichier .env créé depuis .env.example"
        print_warning "⚠️  Veuillez configurer les variables d'environnement dans backend/.env"
    else
        print_warning "Aucun fichier .env.example trouvé pour le backend"
    fi
fi

# Génération des clés de sécurité
print_status "Génération des clés de sécurité..."
if [ -f "scripts/generate-keys.js" ]; then
    node scripts/generate-keys.js
    print_warning "⚠️  Copiez les clés générées dans backend/.env"
else
    print_warning "Script de génération de clés non trouvé"
fi

cd ..

# Installation des dépendances frontend
print_status "Installation des dépendances frontend..."
cd frontend
if [ ! -f "package.json" ]; then
    print_error "package.json manquant dans le dossier frontend"
    exit 1
fi

npm install
print_success "Dépendances frontend installées"

# Configuration frontend
print_status "Configuration du frontend..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Fichier .env créé depuis .env.example"
        print_warning "⚠️  Veuillez configurer les variables d'environnement dans frontend/.env"
    else
        print_warning "Aucun fichier .env.example trouvé pour le frontend"
    fi
fi

cd ..

# Création des dossiers nécessaires
print_status "Création des dossiers nécessaires..."
mkdir -p backend/logs
mkdir -p backend/public/uploads
mkdir -p backend/.tmp

print_success "Dossiers créés"

# Instructions finales
echo ""
echo "🎉 Setup terminé avec succès !"
echo "=============================="
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurer backend/.env avec vos clés de sécurité"
echo "2. Configurer frontend/.env avec l'URL de votre API"
echo "3. Lancer le développement :"
echo "   - Terminal 1: cd backend && npm run dev"
echo "   - Terminal 2: cd frontend && npm run dev"
echo ""
echo "🌐 URLs locales :"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:1337"
echo "   - Admin Strapi: http://localhost:1337/admin"
echo ""
echo "📚 Documentation :"
echo "   - Guide de déploiement: backend/docs/DEPLOY.md"
echo "   - Guide rapide: backend/README-DEPLOY.md"
echo ""
print_success "Setup terminé ! 🚀"
