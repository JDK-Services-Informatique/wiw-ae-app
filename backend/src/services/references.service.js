import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

export async function createReference(referenceData) {
  try {
    const reference = await prisma.reference.create({
      data: {
        designation: referenceData.designation,
        unite: referenceData.unite,
        puHT: referenceData.puHT,
        categorie: referenceData.categorie,
        description: referenceData.description,
        tags: referenceData.tags ? JSON.stringify(referenceData.tags) : null,
        utilisateurId: referenceData.utilisateurId
      }
    });
    return reference;
  } catch (error) {
    logger.error('Erreur lors de la création de la référence', { error: error.message });
    throw error;
  }
}

export async function getReferences(utilisateurId) {
  try {
    const references = await prisma.reference.findMany({
      where: { utilisateurId },
      orderBy: { createdAt: 'desc' }
    });
    return references;
  } catch (error) {
    logger.error('Erreur lors de la récupération des références', { error: error.message });
    throw error;
  }
}

export async function updateReference(id, referenceData, utilisateurId) {
  try {
    // Vérifier que la référence appartient à l'utilisateur
    const existingReference = await prisma.reference.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingReference) {
      return null;
    }

    const reference = await prisma.reference.update({
      where: { id: parseInt(id) },
      data: {
        designation: referenceData.designation,
        unite: referenceData.unite,
        puHT: referenceData.puHT,
        categorie: referenceData.categorie,
        description: referenceData.description,
        tags: referenceData.tags ? JSON.stringify(referenceData.tags) : null
      }
    });
    return reference;
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de la référence', { error: error.message });
    throw error;
  }
}

export async function deleteReference(id, utilisateurId) {
  try {
    // Vérifier que la référence appartient à l'utilisateur
    const existingReference = await prisma.reference.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingReference) {
      return false;
    }

    await prisma.reference.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression de la référence', { error: error.message });
    throw error;
  }
}