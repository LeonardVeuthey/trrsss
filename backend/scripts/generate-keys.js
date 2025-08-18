#!/usr/bin/env node

/**
 * Script de génération des clés de sécurité pour Strapi
 * Usage: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('🔐 Génération des clés de sécurité Strapi\n');

// Fonction pour générer une clé aléatoire
function generateKey() {
  return crypto.randomBytes(32).toString('base64');
}

// Fonction pour générer une clé hexadécimale
function generateHexKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Génération des clés
const keys = {
  APP_KEYS: `${generateKey()},${generateKey()},${generateKey()},${generateKey()}`,
  API_TOKEN_SALT: generateKey(),
  ADMIN_JWT_SECRET: generateKey(),
  JWT_SECRET: generateKey(),
  TRANSFER_TOKEN_SALT: generateKey()
};

console.log('📋 Clés générées :\n');

// Affichage des clés
Object.entries(keys).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n📝 Instructions :');
console.log('1. Copiez ces clés dans votre fichier .env');
console.log('2. Ne partagez jamais ces clés');
console.log('3. Gardez une sauvegarde sécurisée de votre .env');
console.log('4. Utilisez des clés différentes pour chaque environnement\n');

console.log('⚠️  IMPORTANT :');
console.log('- Ces clés sont générées aléatoirement');
console.log('- Ne les réutilisez pas dans d\'autres projets');
console.log('- Changez-les si elles ont été compromises');

// Option pour sauvegarder dans un fichier temporaire
const fs = require('fs');
const path = require('path');

const tempFile = path.join(__dirname, '..', '.env.generated');
const envContent = Object.entries(keys)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(tempFile, envContent);
console.log(`\n💾 Clés sauvegardées temporairement dans : ${tempFile}`);
console.log('   (Supprimez ce fichier après avoir copié les clés dans .env)');
