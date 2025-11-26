import prisma from '../prismaClient.js';

export async function getAllAppels(utilisateurId) {
  return await prisma.appelOffre.findMany({
    where: { projet: { utilisateurId } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAppelById(id, utilisateurId) {
  return await prisma.appelOffre.findFirst({
    where: { id: parseInt(id), projet: { utilisateurId } }
  });
}

export async function createAppel(appelData, utilisateurId) {
  return await prisma.appelOffre.create({
    data: {
      ...appelData,
      projet: { connect: { id: appelData.projetId } }
    }
  });
}

export async function updateAppel(id, appelData, utilisateurId) {
  // Vérifier l'appartenance
  const existing = await getAppelById(id, utilisateurId);
  if (!existing) return null;
  return await prisma.appelOffre.update({
    where: { id: parseInt(id) },
    data: appelData
  });
}

export async function deleteAppel(id, utilisateurId) {
  const existing = await getAppelById(id, utilisateurId);
  if (!existing) return false;
  await prisma.appelOffre.delete({ where: { id: parseInt(id) } });
  return true;
}
