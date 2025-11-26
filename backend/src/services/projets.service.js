import prisma from '../prismaClient.js';

export async function getAllProjets(utilisateurId) {
  return await prisma.projet.findMany({
    where: { utilisateurId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProjetById(id, utilisateurId) {
  return await prisma.projet.findFirst({
    where: { id: parseInt(id), utilisateurId }
  });
}

export async function createProjet(projetData, utilisateurId) {
  return await prisma.projet.create({
    data: { ...projetData, utilisateurId }
  });
}

export async function updateProjet(id, projetData, utilisateurId) {
  const existing = await getProjetById(id, utilisateurId);
  if (!existing) return null;
  return await prisma.projet.update({
    where: { id: parseInt(id) },
    data: projetData
  });
}

export async function deleteProjet(id, utilisateurId) {
  const existing = await getProjetById(id, utilisateurId);
  if (!existing) return false;
  await prisma.projet.delete({ where: { id: parseInt(id) } });
  return true;
}
