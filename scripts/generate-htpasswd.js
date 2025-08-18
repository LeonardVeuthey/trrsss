#!/usr/bin/env node

/**
 * Script pour générer le fichier .htpasswd
 * Usage: node scripts/generate-htpasswd.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const USERNAME = 'admin';
const PASSWORD = 'trrsss2025';

// Fonction pour générer le hash MD5 (format .htpasswd)
function generateHtpasswd(username, password) {
    const salt = crypto.randomBytes(2).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    const hash = crypto.createHash('md5').update(password + salt).digest('base64');
    return `${username}:$$apr1$$${salt}$$${hash}`;
}

// Générer le contenu .htpasswd
const htpasswdContent = generateHtpasswd(USERNAME, PASSWORD);

// Chemin du fichier
const htpasswdPath = path.join(__dirname, '..', '.htpasswd');

// Écrire le fichier
fs.writeFileSync(htpasswdPath, htpasswdContent);

console.log('🔐 Fichier .htpasswd généré avec succès !');
console.log('📁 Fichier créé : .htpasswd');
console.log('');
console.log('📋 Instructions :');
console.log('1. Copiez le fichier .htpasswd sur votre serveur');
console.log('2. Placez-le dans un dossier sécurisé (ex: /home/USER/.htpasswd)');
console.log('3. Mettez à jour le chemin dans frontend/.htaccess');
console.log('');
console.log('🔑 Identifiants :');
console.log(`   Username: ${USERNAME}`);
console.log(`   Password: ${PASSWORD}`);
console.log('');
console.log('⚠️  IMPORTANT :');
console.log('- Gardez ce fichier en sécurité');
console.log('- Ne le commitez jamais dans Git');
console.log('- Changez le mot de passe en production');
