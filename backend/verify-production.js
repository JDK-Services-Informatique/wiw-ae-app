#!/usr/bin/env node

/**
 * Script de vérification de configuration de production
 * Usage: node verify-production.js
 */

const crypto = require('crypto');

console.log('\n🔍 Vérification de la configuration de production...\n');

const errors = [];
const warnings = [];
const success = [];

// Vérifier les variables d'environnement
const requiredVars = {
  NODE_ENV: 'production',
  PORT: '4000',
  DATABASE_URL: null,
  JWT_SECRET: null,
  ALLOWED_ORIGINS: null,
  FRONTEND_URL: null,
  EMAIL_HOST: null,
  EMAIL_PORT: '587',
  EMAIL_USER: null,
  EMAIL_PASSWORD: null,
  EMAIL_FROM: null,
};

console.log('📋 Variables d\'environnement:\n');

// Vérifier chaque variable requise
for (const [key, expectedValue] of Object.entries(requiredVars)) {
  const value = process.env[key];

  if (!value) {
    errors.push(`❌ ${key} manquante`);
  } else if (expectedValue && value !== expectedValue) {
    warnings.push(`⚠️  ${key}=${value} (attendu: ${expectedValue})`);
  } else {
    // Vérifications spécifiques
    if (key === 'JWT_SECRET') {
      if (value.length < 32) {
        errors.push(`❌ ${key} trop court (minimum 32 caractères, recommandé 64+)`);
      } else if (value === 'change_me_to_something_secure_in_production') {
        errors.push(`❌ ${key} utilise la valeur par défaut - DANGEREUX!`);
      } else {
        success.push(`✅ ${key} configuré (${value.length} caractères)`);
      }
    } else if (key === 'ALLOWED_ORIGINS') {
      if (value.includes('*')) {
        errors.push(`❌ ${key} contient un wildcard (*) - NON SÉCURISÉ en production`);
      } else if (value.includes('localhost')) {
        warnings.push(`⚠️  ${key} contient localhost - vérifier si intentionnel`);
      } else {
        success.push(`✅ ${key} configuré`);
      }
    } else if (key === 'FRONTEND_URL') {
      if (value.endsWith('/')) {
        warnings.push(`⚠️  ${key} a un slash final - peut causer des problèmes`);
      } else {
        success.push(`✅ ${key} configuré`);
      }
    } else if (key === 'DATABASE_URL') {
      if (value.includes('file:')) {
        errors.push(`❌ ${key} utilise SQLite - PostgreSQL requis en production`);
      } else if (!value.includes('postgresql://')) {
        warnings.push(`⚠️  ${key} ne semble pas être PostgreSQL`);
      } else {
        success.push(`✅ ${key} configuré (PostgreSQL)`);
      }
    } else if (key === 'EMAIL_PASSWORD') {
      if (value.length < 8) {
        warnings.push(`⚠️  ${key} semble court - vérifier`);
      } else {
        success.push(`✅ ${key} configuré`);
      }
    } else {
      success.push(`✅ ${key} configuré`);
    }
  }
}

// Vérifier les variables optionnelles
const optionalVars = [
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'SENTRY_DSN',
  'CORS_ALLOW_ALL',
];

console.log('\n📋 Variables optionnelles:\n');

optionalVars.forEach((key) => {
  const value = process.env[key];
  if (value) {
    if (key === 'CORS_ALLOW_ALL' && value === 'true') {
      errors.push(`❌ ${key}=true - TRÈS DANGEREUX en production!`);
    } else {
      console.log(`  ℹ️  ${key}=${value}`);
    }
  }
});

// Vérifier la cohérence CORS
console.log('\n🔐 Vérifications de sécurité:\n');

const allowedOrigins = process.env.ALLOWED_ORIGINS;
const frontendUrl = process.env.FRONTEND_URL;

if (allowedOrigins && frontendUrl) {
  if (!allowedOrigins.includes(frontendUrl)) {
    warnings.push(
      `⚠️  FRONTEND_URL (${frontendUrl}) n'est pas dans ALLOWED_ORIGINS (${allowedOrigins})`
    );
  }
}

// Vérifier NODE_ENV
if (process.env.NODE_ENV !== 'production') {
  errors.push(`❌ NODE_ENV doit être 'production' (actuellement: ${process.env.NODE_ENV})`);
}

// Afficher les résultats
console.log('\n═══════════════════════════════════════════════\n');

if (success.length > 0) {
  console.log('✅ SUCCÈS:\n');
  success.forEach((msg) => console.log(`  ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  AVERTISSEMENTS:\n');
  warnings.forEach((msg) => console.log(`  ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERREURS CRITIQUES:\n');
  errors.forEach((msg) => console.log(`  ${msg}`));
  console.log('\n❌ Configuration invalide - ne PAS déployer!\n');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('⚠️  Configuration valide mais avec avertissements');
  console.log('   Vérifier les warnings avant de déployer\n');
  process.exit(0);
}

console.log('✅ Configuration de production VALIDE!\n');
console.log('═══════════════════════════════════════════════\n');

// Générer un nouveau JWT secret si besoin
console.log('💡 Pour générer un nouveau JWT_SECRET sécurisé:\n');
console.log('   ' + crypto.randomBytes(64).toString('hex'));
console.log('\n');

process.exit(0);
