import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

export async function createEquipe(membreData) {
  try {
    const membre = await prisma.equipe.create({
      data: {
        nom: membreData.nom,
        role: membreData.role,
        email: membreData.email,
        telephone: membreData.telephone,
        utilisateurId: membreData.utilisateurId
      }
    });
    return membre;
  } catch (error) {
    logger.error("Erreur lors de l'ajout du membre", { error: error.message });
    throw error;
  }
}

export async function getEquipe(utilisateurId) {
  try {
    const equipe = await prisma.equipe.findMany({
      where: { utilisateurId },
      orderBy: { createdAt: 'desc' }
    });
    return equipe;
  } catch (error) {
    logger.error("Erreur lors de la récupération de l'équipe", { error: error.message });
    throw error;
  }
}

export async function updateEquipe(id, membreData, utilisateurId) {
  try {
    // Vérifier que le membre appartient à l'utilisateur
    const existingMembre = await prisma.equipe.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingMembre) {
      return null;
    }

    const membre = await prisma.equipe.update({
      where: { id: parseInt(id) },
      data: {
        nom: membreData.nom,
        role: membreData.role,
        email: membreData.email,
        telephone: membreData.telephone
      }
    });
    return membre;
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du membre', { error: error.message });
    throw error;
  }
}

export async function deleteEquipe(id, utilisateurId) {
  try {
    // Vérifier que le membre appartient à l'utilisateur
    const existingMembre = await prisma.equipe.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingMembre) {
      return false;
    }

    await prisma.equipe.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression du membre', { error: error.message });
    throw error;
  }
}