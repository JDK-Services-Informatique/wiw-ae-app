import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

export async function createDevis(devisData) {
  try {
    const devis = await prisma.devis.create({
      data: {
        numero: devisData.numero,
        date: devisData.date ? new Date(devisData.date) : new Date(),
        clientNom: devisData.clientNom,
        clientAdresse: devisData.clientAdresse,
        clientCodePostal: devisData.clientCodePostal,
        clientVille: devisData.clientVille,
        clientTelephone: devisData.clientTelephone,
        clientEmail: devisData.clientEmail,
        tauxHoraire: devisData.tauxHoraire || 0,
        rabais: devisData.rabais || 0,
        rabaisType: devisData.rabaisType || 'pourcentage',
        statut: devisData.statut || 'brouillon',
        notes: devisData.notes,
        conditionsReglement: devisData.conditionsReglement || '30 jours',
        utilisateurId: devisData.utilisateurId,
        lignes: {
          create: devisData.lignes || []
        },
        chapitres: {
          create: devisData.chapitres || []
        }
      },
      include: {
        lignes: true,
        chapitres: {
          include: {
            lignes: true
          }
        },
        tracabilite: true,
        medias: true,
        versionsPDF: true,
        lettreEnvoi: true
      }
    });
    return devis;
  } catch (error) {
    logger.error('Erreur lors de la création du devis', { error: error.message });
    throw error;
  }
}

export async function getAllDevis(utilisateurId) {
  try {
    const devis = await prisma.devis.findMany({
      where: { utilisateurId },
      include: {
        lignes: true,
        chapitres: {
          include: {
            lignes: true
          }
        },
        tracabilite: true,
        medias: true,
        versionsPDF: true,
        lettreEnvoi: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return devis;
  } catch (error) {
    logger.error('Erreur lors de la récupération des devis', { error: error.message });
    throw error;
  }
}

export async function getDevis(id, utilisateurId) {
  try {
    const devis = await prisma.devis.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      },
      include: {
        lignes: true,
        chapitres: {
          include: {
            lignes: true
          }
        },
        tracabilite: true,
        medias: true,
        versionsPDF: true,
        lettreEnvoi: true
      }
    });
    return devis;
  } catch (error) {
    logger.error('Erreur lors de la récupération du devis', { error: error.message });
    throw error;
  }
}

export async function updateDevis(id, devisData, utilisateurId) {
  try {
    // Vérifier que le devis appartient à l'utilisateur
    const existingDevis = await prisma.devis.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingDevis) {
      return null;
    }

    const devis = await prisma.devis.update({
      where: { id: parseInt(id) },
      data: {
        numero: devisData.numero,
        date: devisData.date ? new Date(devisData.date) : undefined,
        clientNom: devisData.clientNom,
        clientAdresse: devisData.clientAdresse,
        clientCodePostal: devisData.clientCodePostal,
        clientVille: devisData.clientVille,
        clientTelephone: devisData.clientTelephone,
        clientEmail: devisData.clientEmail,
        tauxHoraire: devisData.tauxHoraire,
        rabais: devisData.rabais,
        rabaisType: devisData.rabaisType,
        statut: devisData.statut,
        notes: devisData.notes,
        conditionsReglement: devisData.conditionsReglement,
        lignes: devisData.lignes ? {
          deleteMany: {},
          create: devisData.lignes
        } : undefined,
        chapitres: devisData.chapitres ? {
          deleteMany: {},
          create: devisData.chapitres
        } : undefined
      },
      include: {
        lignes: true,
        chapitres: {
          include: {
            lignes: true
          }
        },
        tracabilite: true,
        medias: true,
        versionsPDF: true,
        lettreEnvoi: true
      }
    });
    return devis;
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du devis', { error: error.message });
    throw error;
  }
}

export async function deleteDevis(id, utilisateurId) {
  try {
    // Vérifier que le devis appartient à l'utilisateur
    const existingDevis = await prisma.devis.findFirst({
      where: {
        id: parseInt(id),
        utilisateurId
      }
    });

    if (!existingDevis) {
      return false;
    }

    await prisma.devis.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression du devis', { error: error.message });
    throw error;
  }
}