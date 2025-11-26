import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

export async function createMateriel(data) {
  try {
    const materiel = await prisma.materiel.create({ data: { ...data } });
    return materiel;
  } catch (error) {
    logger.error('Erreur création matériel', { error: error.message });
    throw error;
  }
}

export async function getMateriels(utilisateurId) {
  try {
    const list = await prisma.materiel.findMany({ where: { utilisateurId }, orderBy: { createdAt: 'desc' } });
    return list;
  } catch (error) {
    logger.error('Erreur récupération matériels', { error: error.message });
    throw error;
  }
}

export async function updateMateriel(id, data, utilisateurId) {
  try {
    const existing = await prisma.materiel.findFirst({ where: { id: parseInt(id), utilisateurId } });
    if (!existing) return null;
    const updated = await prisma.materiel.update({ where: { id: parseInt(id) }, data });
    return updated;
  } catch (error) {
    logger.error('Erreur mise à jour matériel', { error: error.message });
    throw error;
  }
}

export async function deleteMateriel(id, utilisateurId) {
  try {
    const existing = await prisma.materiel.findFirst({ where: { id: parseInt(id), utilisateurId } });
    if (!existing) return false;
    await prisma.materiel.delete({ where: { id: parseInt(id) } });
    return true;
  } catch (error) {
    logger.error('Erreur suppression matériel', { error: error.message });
    throw error;
  }
}
