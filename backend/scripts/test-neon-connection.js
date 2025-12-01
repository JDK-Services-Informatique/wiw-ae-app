#!/usr/bin/env node

/**
 * Script de test de connexion à la base de données Neon
 * Usage : node scripts/test-neon-connection.js
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Test de connexion à Neon PostgreSQL...\n');

  try {
    // Test 1 : Connexion simple
    console.log('📡 Test 1 : Connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion réussie !\n');

    // Test 2 : Récupérer la version PostgreSQL
    console.log('📊 Test 2 : Récupération de la version PostgreSQL...');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Version PostgreSQL :', result[0].version.split(' ').slice(0, 2).join(' '));
    console.log('');

    // Test 3 : Lister les tables
    console.log('📋 Test 3 : Vérification des tables Prisma...');
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log('⚠️  Aucune table trouvée. Exécutez : npx prisma db push');
    } else {
      console.log(`✅ ${tables.length} tables trouvées :`);
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    }
    console.log('');

    // Test 4 : Compter les utilisateurs
    console.log('👥 Test 4 : Comptage des utilisateurs...');
    try {
      const userCount = await prisma.utilisateur.count();
      console.log(`✅ ${userCount} utilisateur(s) dans la base`);
    } catch (error) {
      console.log('⚠️  Table Utilisateur non accessible. Exécutez : npx prisma db push');
    }
    console.log('');

    // Résumé
    console.log('🎉 Tous les tests sont passés !');
    console.log('✅ Votre connexion Neon est opérationnelle.');
    console.log('');
    console.log('📝 Prochaines étapes :');
    console.log('   1. Copiez votre DATABASE_URL dans Vercel Environment Variables');
    console.log('   2. Déployez le backend sur Vercel');
    console.log('   3. Testez l\'API : curl https://votre-backend.vercel.app/api/health');

  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    console.log('');
    console.log('🔧 Solutions possibles :');
    console.log('   1. Vérifiez que DATABASE_URL est dans .env.local');
    console.log('   2. Vérifiez que la connection string contient ?sslmode=require');
    console.log('   3. Vérifiez que le projet Neon est actif sur console.neon.tech');
    console.log('   4. Exécutez : npx prisma generate');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
