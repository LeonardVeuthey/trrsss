#!/usr/bin/env node

/**
 * Script pour activer/désactiver la protection par mot de passe
 * Usage: node scripts/toggle-protection.js [on|off]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const action = args[0] || 'status';

const htaccessPath = path.join(__dirname, '..', 'frontend', '.htaccess');

function readHtaccess() {
    if (fs.existsSync(htaccessPath)) {
        return fs.readFileSync(htaccessPath, 'utf8');
    }
    return '';
}

function writeHtaccess(content) {
    fs.writeFileSync(htaccessPath, content);
}

function enableProtection() {
    const content = readHtaccess();
    
    if (content.includes('AuthType Basic')) {
        console.log('🔒 Protection déjà activée');
        return;
    }
    
    const protectedContent = `# Protection par mot de passe pour le développement
AuthType Basic
AuthName "Zone protégée - Développement en cours"
AuthUserFile /home/USER/.htpasswd
Require valid-user

${content}`;
    
    writeHtaccess(protectedContent);
    console.log('✅ Protection activée !');
    console.log('🔑 Mot de passe : trrsss2025');
}

function disableProtection() {
    const content = readHtaccess();
    
    if (!content.includes('AuthType Basic')) {
        console.log('🔓 Protection déjà désactivée');
        return;
    }
    
    const unprotectedContent = content.replace(/^# Protection par mot de passe pour le développement\nAuthType Basic\nAuthName "Zone protégée - Développement en cours"\nAuthUserFile \/home\/USER\/\.htpasswd\nRequire valid-user\n\n/g, '');
    
    writeHtaccess(unprotectedContent);
    console.log('✅ Protection désactivée !');
}

function showStatus() {
    const content = readHtaccess();
    const isProtected = content.includes('AuthType Basic');
    
    console.log('🔍 Statut de la protection :');
    console.log(isProtected ? '🔒 PROTÉGÉ' : '🔓 NON PROTÉGÉ');
    console.log('');
    
    if (isProtected) {
        console.log('📋 Pour désactiver : node scripts/toggle-protection.js off');
        console.log('🔑 Mot de passe : trrsss2025');
    } else {
        console.log('📋 Pour activer : node scripts/toggle-protection.js on');
    }
}

// Exécution
switch (action) {
    case 'on':
    case 'enable':
        enableProtection();
        break;
    case 'off':
    case 'disable':
        disableProtection();
        break;
    case 'status':
    default:
        showStatus();
        break;
}
