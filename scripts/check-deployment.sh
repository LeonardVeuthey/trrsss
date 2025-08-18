#!/bin/bash

# ===================================
# Script de vérification du déploiement
# ===================================

set -e

echo "🔍 Vérification du déploiement"
echo "=============================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Vérifier la structure du projet
print_status "Vérification de la structure du projet..."

if [ ! -d "backend" ]; then
    print_error "Dossier backend manquant"
    exit 1
fi

if [ ! -d "frontend" ]; then
    print_error "Dossier frontend manquant"
    exit 1
fi

if [ ! -d ".github/workflows" ]; then
    print_error "Workflows GitHub Actions manquants"
    exit 1
fi

print_success "Structure du projet OK"

# Vérifier les fichiers de configuration
print_status "Vérification des fichiers de configuration..."

# Backend
if [ ! -f "backend/package.json" ]; then
    print_error "backend/package.json manquant"
    exit 1
fi

if [ ! -f "backend/ecosystem.config.js" ]; then
    print_error "backend/ecosystem.config.js manquant"
    exit 1
fi

if [ ! -f "backend/.env.example" ]; then
    print_warning "backend/.env.example manquant"
fi

# Frontend
if [ ! -f "frontend/package.json" ]; then
    print_error "frontend/package.json manquant"
    exit 1
fi

if [ ! -f "frontend/.env.example" ]; then
    print_warning "frontend/.env.example manquant"
fi

# Workflows
if [ ! -f ".github/workflows/deploy.yml" ]; then
    print_error ".github/workflows/deploy.yml manquant"
    exit 1
fi

print_success "Fichiers de configuration OK"

# Vérifier les scripts
print_status "Vérification des scripts..."

if [ ! -f "scripts/setup.sh" ]; then
    print_warning "scripts/setup.sh manquant"
fi

if [ ! -f "backend/scripts/generate-keys.js" ]; then
    print_warning "backend/scripts/generate-keys.js manquant"
fi

print_success "Scripts OK"

# Vérifier Git
print_status "Vérification Git..."

if [ ! -d ".git" ]; then
    print_error "Repository Git non initialisé"
    exit 1
fi

if ! git remote -v | grep -q origin; then
    print_warning "Remote origin non configuré"
    echo "  Configurez avec: git remote add origin git@github.com:USER/REPO.git"
fi

print_success "Git OK"

# Vérifier les dépendances
print_status "Vérification des dépendances..."

# Backend
if [ ! -d "backend/node_modules" ]; then
    print_warning "Dépendances backend non installées"
    echo "  Installez avec: cd backend && npm install"
fi

# Frontend
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Dépendances frontend non installées"
    echo "  Installez avec: cd frontend && npm install"
fi

print_success "Dépendances vérifiées"

# Vérifier les variables d'environnement
print_status "Vérification des variables d'environnement..."

if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env manquant"
    echo "  Créez avec: cp backend/.env.example backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    print_warning "frontend/.env manquant"
    echo "  Créez avec: cp frontend/.env.example frontend/.env"
fi

print_success "Variables d'environnement vérifiées"

# Instructions finales
echo ""
echo "🎯 Checklist de déploiement"
echo "=========================="
echo ""
echo "✅ Structure du projet"
echo "✅ Fichiers de configuration"
echo "✅ Workflows GitHub Actions"
echo "✅ Repository Git"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurer les GitHub Secrets :"
echo "   - SSH_HOST, SSH_PORT, SSH_USER"
echo "   - SSH_KEY, REMOTE_PATH, GIT_REPO_URL"
echo ""
echo "2. Configurer le serveur Infomaniak :"
echo "   - Installer PM2: npm install -g pm2"
echo "   - Configurer Apache/Nginx (voir docs/SERVER-SETUP.md)"
echo ""
echo "3. Premier déploiement :"
echo "   git add ."
echo "   git commit -m 'feat: initial deployment setup'"
echo "   git push origin main"
echo ""
echo "4. Vérifier le déploiement :"
echo "   - GitHub Actions → Voir les workflows"
echo "   - Serveur → pm2 status"
echo ""
print_success "Vérification terminée ! 🚀"
