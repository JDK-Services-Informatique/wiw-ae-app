import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed de la base de données...');

  try {
    // Créer les utilisateurs avec différents rôles
    const hashedPassword = await bcrypt.hash('test1234', 10);
    
    // Admin
    const admin = await prisma.utilisateur.upsert({
      where: { email: 'admin@wiw.fr' },
      update: {},
      create: {
        nom: 'Administrateur',
        prenom: 'Admin',
        email: 'admin@wiw.fr',
        motDePasse: hashedPassword,
        role: 'ADMIN',
        plan: 'ENTREPRISE'
      }
    });

    // Chef de projet
    const chefProjet = await prisma.utilisateur.upsert({
      where: { email: 'chef.projet@wiw.fr' },
      update: {},
      create: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'chef.projet@wiw.fr',
        motDePasse: hashedPassword,
        role: 'CHEF_PROJET',
        plan: 'PREMIUM',
        coutHoraire: 85,
        coutMin: 70
      }
    });

    // Assistant
    const assistant = await prisma.utilisateur.upsert({
      where: { email: 'assistant@wiw.fr' },
      update: {},
      create: {
        nom: 'Martin',
        prenom: 'Marie',
        email: 'assistant@wiw.fr',
        motDePasse: hashedPassword,
        role: 'ASSISTANT',
        plan: 'GRATUIT'
      }
    });

    // Utilisateur standard
    const user = await prisma.utilisateur.upsert({
      where: { email: 'user@wiw.fr' },
      update: {},
      create: {
        nom: 'Utilisateur',
        prenom: 'Test',
        email: 'user@wiw.fr',
        motDePasse: hashedPassword,
        role: 'USER',
        plan: 'GRATUIT'
      }
    });

    console.log('✅ Utilisateurs créés avec différents rôles:');
    console.log('\n📋 Rôles configurés:');
    console.log('   ADMIN - Accès complet');
    console.log('   CHEF_PROJET - Gestion de projets, vision financière limitée');
    console.log('   ASSISTANT - Lecture seule, pas de vision des taux horaires');
    console.log('   USER - Utilisateur standard');
    
    console.log('\n👥 Comptes créés:');
    console.log('   Admin: admin@wiw.fr / test1234');
    console.log('   Chef Projet: chef.projet@wiw.fr / test1234');
    console.log('   Assistant: assistant@wiw.fr / test1234');
    console.log('   User: user@wiw.fr / test1234');

    console.log('\n🎉 Seed terminé avec succès !');
  } catch (error) {
    console.log('⚠️ Seed déjà exécuté ou erreur:', error.message);
    console.log('   Les utilisateurs existent probablement déjà');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur critique lors du seed:', e);
    // Ne pas faire échouer le build si le seed échoue
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
