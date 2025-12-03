#!/usr/bin/env node

/**
 * Script de génération des secrets pour le déploiement
 * Usage : node scripts/generate-secrets.js
 */

import crypto from 'crypto';

console.log('🔐 Génération des Secrets pour Vercel\n');
console.log('═'.repeat(70));
console.log('');

// Générer JWT_SECRET
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('📝 JWT_SECRET (64 caractères) :');
console.log('');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('⚠️  IMPORTANT : Gardez ce secret confidentiel !');
console.log('');
console.log('═'.repeat(70));
console.log('');

// Générer une clé pour 2FA (optionnel)
const twoFactorSecret = crypto.randomBytes(20).toString('base32');
console.log('📝 2FA_SECRET (optionnel pour TOTP) :');
console.log('');
console.log(`2FA_SECRET=${twoFactorSecret}`);
console.log('');
console.log('═'.repeat(70));
console.log('');

// Template des variables d'environnement
console.log('📋 Template Complet pour Vercel Environment Variables :');
console.log('');
console.log('---[ À copier dans Backend Vercel Settings ]---');
console.log('');
console.log('# Database (Neon PostgreSQL)');
console.log('DATABASE_URL=postgresql://neondb_owner:XXX@ep-XXX.eu-central-1.aws.neon.tech/neondb?sslmode=require');
console.log('');
console.log('# JWT Secret');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('# Email Configuration (Gmail)');
console.log('EMAIL_HOST=smtp.gmail.com');
console.log('EMAIL_PORT=587');
console.log('EMAIL_USER=votre-email@gmail.com');
console.log('EMAIL_PASSWORD=votre-app-password-16-chars');
console.log('EMAIL_FROM=noreply@wiw-ae.com');
console.log('');
console.log('# Frontend URL (CORS)');
console.log('FRONTEND_URL=https://wiw-ae-frontend.vercel.app');
console.log('');
console.log('# Node Environment');
console.log('NODE_ENV=production');
console.log('');
console.log('---[ Fin du template ]---');
console.log('');
console.log('═'.repeat(70));
console.log('');

// Instructions
console.log('📚 Prochaines Étapes :');
console.log('');
console.log('1. ✅ Copiez JWT_SECRET ci-dessus');
console.log('2. 🔗 Créez votre base Neon : https://console.neon.tech');
console.log('3. 📧 Créez un App Password Gmail :');
console.log('   https://myaccount.google.com/apppasswords');
console.log('4. 🚀 Configurez Vercel avec toutes ces variables');
console.log('5. 📖 Suivez le guide : DEPLOYMENT_CHECKLIST.md');
console.log('');
console.log('═'.repeat(70));
console.log('');
console.log('🎉 Génération terminée !');
console.log('');
