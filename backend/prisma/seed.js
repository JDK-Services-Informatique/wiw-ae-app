import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed de la base de données...');

  try {
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('test1234', 10);
    
    const user = await prisma.utilisateur.upsert({
      where: { email: 'test@wiw.fr' },
      update: {},
      create: {
        nom: 'Utilisateur Test',
        email: 'test@wiw.fr',
        motDePasse: hashedPassword,
        role: 'ADMIN',
        plan: 'premium'
      }
    });

    console.log('✅ Utilisateur de test créé:');
    console.log('   Email: test@wiw.fr');
    console.log('   Mot de passe: test1234');
    console.log('   Plan:', user.plan);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📝 Vous pouvez maintenant vous connecter avec:');
    console.log('   Email: test@wiw.fr');
    console.log('   Mot de passe: test1234');
  } catch (error) {
    console.log('⚠️ Seed déjà exécuté ou erreur:', error.message);
    console.log('   Utilisateur test@wiw.fr existe probablement déjà');
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
