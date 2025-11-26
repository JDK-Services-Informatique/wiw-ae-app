import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.utilisateur.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      nom: 'Test User',
      email: 'test@example.com',
      motDePasse: hashedPassword,
      plan: 'PREMIUM'
    }
  });
  console.log('Utilisateur créé:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });