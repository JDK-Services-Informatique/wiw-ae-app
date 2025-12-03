#!/usr/bin/env node

/**
 * Script de préparation déploiement WIW-AE+
 * Génère un résumé de toutes les informations nécessaires
 */

import crypto from 'crypto';

console.log('═'.repeat(80));
console.log('🚀 PRÉPARATION DÉPLOIEMENT WIW-AE+ PRODUCTION');
console.log('═'.repeat(80));
console.log('');

// ===== INFORMATIONS À PRÉPARER =====
console.log('📋 ÉTAPE 1 : INFORMATIONS À PRÉPARER');
console.log('─'.repeat(80));
console.log('');

console.log('✅ Comptes nécessaires :');
console.log('   1. Compte Vercel : https://vercel.com');
console.log('   2. Compte Neon : https://neon.tech (déjà configuré ✅)');
console.log('   3. Gmail App Password : https://myaccount.google.com/apppasswords');
console.log('');

console.log('✅ Domaines :');
console.log('   - wiw-ae-plus.com');
console.log('   - wiw-ae-plus.fr');
console.log('   - wiw-ae-plus.net');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== VARIABLES D'ENVIRONNEMENT =====
console.log('🔐 ÉTAPE 2 : VARIABLES D\'ENVIRONNEMENT BACKEND (10 variables)');
console.log('─'.repeat(80));
console.log('');

console.log('Copiez ces variables dans Vercel Backend Project → Settings → Environment Variables');
console.log('');

console.log('1. DATABASE_URL');
console.log('   Value : Votre connection string Neon');
console.log('   Exemple : postgresql://neondb_owner:xxx@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require');
console.log('');

console.log('2. JWT_SECRET');
console.log('   Value : 70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92');
console.log('');

console.log('3. ALLOWED_ORIGINS');
console.log('   Value : https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,https://wiw-ae-plus.fr,https://www.wiw-ae-plus.fr,https://wiw-ae-plus.net,https://www.wiw-ae-plus.net');
console.log('');

console.log('4. FRONTEND_URL');
console.log('   Value : https://wiw-ae-plus.com');
console.log('');

console.log('5. EMAIL_HOST');
console.log('   Value : smtp.gmail.com');
console.log('');

console.log('6. EMAIL_PORT');
console.log('   Value : 587');
console.log('');

console.log('7. EMAIL_USER');
console.log('   Value : Votre adresse Gmail complète (ex: votre-email@gmail.com)');
console.log('');

console.log('8. EMAIL_PASSWORD');
console.log('   Value : Votre App Password Gmail (16 caractères)');
console.log('   ⚠️  Comment obtenir :');
console.log('       1. https://myaccount.google.com/apppasswords');
console.log('       2. Créer pour "Mail" / "Autre"');
console.log('       3. Nommer : WIW-AE Backend');
console.log('       4. Copier les 16 caractères (sans espaces)');
console.log('');

console.log('9. EMAIL_FROM');
console.log('   Value : noreply@wiw-ae-plus.com');
console.log('');

console.log('10. NODE_ENV');
console.log('    Value : production');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== VARIABLES FRONTEND =====
console.log('🎨 ÉTAPE 3 : VARIABLES D\'ENVIRONNEMENT FRONTEND (1 variable)');
console.log('─'.repeat(80));
console.log('');

console.log('Copiez cette variable dans Vercel Frontend Project → Settings → Environment Variables');
console.log('');

console.log('VITE_API_URL');
console.log('Value : https://api.wiw-ae-plus.com/api');
console.log('⚠️  Important : N\'oubliez pas /api à la fin !');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== CONFIGURATION DNS =====
console.log('🌐 ÉTAPE 4 : CONFIGURATION DNS');
console.log('─'.repeat(80));
console.log('');

console.log('📍 Pour api.wiw-ae-plus.com (Backend) :');
console.log('   Type : CNAME');
console.log('   Name : api');
console.log('   Target : cname.vercel-dns.com. (fourni par Vercel après ajout du domaine)');
console.log('   TTL : Auto');
console.log('');

console.log('📍 Pour wiw-ae-plus.com (Frontend - Apex) :');
console.log('   Type : A');
console.log('   Name : @');
console.log('   Target : 76.76.21.21');
console.log('   TTL : Auto');
console.log('');

console.log('📍 Pour www.wiw-ae-plus.com (Frontend - www) :');
console.log('   Type : CNAME');
console.log('   Name : www');
console.log('   Target : cname.vercel-dns.com. (fourni par Vercel)');
console.log('   TTL : Auto');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== ORDRE DES ÉTAPES =====
console.log('✅ ÉTAPE 5 : ORDRE DE DÉPLOIEMENT');
console.log('─'.repeat(80));
console.log('');

console.log('1️⃣  BACKEND (20 min)');
console.log('   a. Obtenir App Password Gmail');
console.log('   b. Créer projet Vercel backend');
console.log('   c. Configurer 10 environment variables');
console.log('   d. Déployer');
console.log('   e. Ajouter domaine api.wiw-ae-plus.com');
console.log('   f. Configurer DNS CNAME');
console.log('   g. Tester : curl https://api.wiw-ae-plus.com/api/health');
console.log('');

console.log('2️⃣  FRONTEND (15 min)');
console.log('   a. Créer projet Vercel frontend');
console.log('   b. Configurer VITE_API_URL');
console.log('   c. Déployer');
console.log('   d. Ajouter domaines wiw-ae-plus.com et www.wiw-ae-plus.com');
console.log('   e. Configurer DNS A et CNAME');
console.log('   f. Tester : ouvrir https://wiw-ae-plus.com');
console.log('');

console.log('3️⃣  REDIRECTIONS (10 min)');
console.log('   Option A : Redirection DNS native (recommandé si disponible)');
console.log('   Option B : Projet Vercel redirections');
console.log('');

console.log('4️⃣  TESTS COMPLETS (5 min)');
console.log('   a. API health check');
console.log('   b. Inscription/Login');
console.log('   c. Reset password (vérifier email)');
console.log('   d. Redirections .fr et .net');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== LIENS UTILES =====
console.log('🔗 LIENS UTILES');
console.log('─'.repeat(80));
console.log('');

console.log('Vercel Dashboard    : https://vercel.com/dashboard');
console.log('Nouveau Projet      : https://vercel.com/new');
console.log('Neon Console        : https://console.neon.tech');
console.log('Gmail App Passwords : https://myaccount.google.com/apppasswords');
console.log('');

console.log('═'.repeat(80));
console.log('');

// ===== DOCUMENTATION =====
console.log('📚 DOCUMENTATION');
console.log('─'.repeat(80));
console.log('');

console.log('Guide Principal : DEPLOY_PRODUCTION_FINAL.md');
console.log('Configuration Domaines : DOMAINES_CONFIG.md');
console.log('Test Connexion Neon : cd backend && node scripts/test-neon-connection.js');
console.log('');

console.log('═'.repeat(80));
console.log('');
console.log('🎯 PRÊT POUR LE DÉPLOIEMENT !');
console.log('');
console.log('Suivez les étapes ci-dessus dans l\'ordre.');
console.log('Documentation complète disponible dans DEPLOY_PRODUCTION_FINAL.md');
console.log('');
console.log('═'.repeat(80));
