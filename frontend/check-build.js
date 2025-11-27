#!/usr/bin/env node
/**
 * Script de vérification du build frontend
 * Vérifie que tous les fichiers nécessaires existent
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredFiles = [
  'package.json',
  'vite.config.js',
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/styles/index.css',
  'src/i18n/config.js',
  'src/i18n/locales/fr.json',
  'src/i18n/locales/en.json',
  'src/services/analytics.js',
  'public/sw.js',
  'public/manifest.json'
];

const optionalFiles = [
  'public/favicon.png'
];

console.log('🔍 Vérification des fichiers frontend...\n');

let hasErrors = false;
let hasWarnings = false;

// Vérifier les fichiers requis
console.log('📋 Fichiers requis:');
requiredFiles.forEach(file => {
  const path = join(__dirname, file);
  if (existsSync(path)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    hasErrors = true;
  }
});

// Vérifier les fichiers optionnels
console.log('\n📋 Fichiers optionnels:');
optionalFiles.forEach(file => {
  const path = join(__dirname, file);
  if (existsSync(path)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  ${file} - Manquant (non critique)`);
    hasWarnings = true;
  }
});

// Vérifier le dossier dist
console.log('\n📦 Dossier de build:');
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  console.log(`  ✅ dist/ existe`);
  const indexHtml = join(distPath, 'index.html');
  if (existsSync(indexHtml)) {
    console.log(`  ✅ dist/index.html existe`);
  } else {
    console.log(`  ❌ dist/index.html - MANQUANT (exécutez npm run build)`);
    hasErrors = true;
  }
} else {
  console.log(`  ⚠️  dist/ n'existe pas (exécutez npm run build)`);
  hasWarnings = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ ERREURS DÉTECTÉES - Corrigez les fichiers manquants');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Avertissements - Certains fichiers optionnels manquent');
  process.exit(0);
} else {
  console.log('✅ Tous les fichiers requis sont présents');
  process.exit(0);
}


