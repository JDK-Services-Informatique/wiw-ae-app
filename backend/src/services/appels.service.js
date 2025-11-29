import prisma from '../prismaClient.js';
import { validateAO } from './aoValidation.service.js';
import logger from '../utils/logger.js';

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
  // Valider la cohérence des données avant création
  const validation = validateAO(appelData);

  if (!validation.valid) {
    const error = new Error('Validation AO échouée');
    error.statusCode = 400;
    error.validationErrors = validation.errors;
    error.validationWarnings = validation.warnings;
    throw error;
  }

  // Logger les avertissements si présents
  if (validation.warnings.length > 0) {
    logger.warn('AO créé avec avertissements', {
      utilisateurId,
      warnings: validation.warnings
    });
  }

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

  // Valider la cohérence des données avant mise à jour
  const validation = validateAO(appelData);

  if (!validation.valid) {
    const error = new Error('Validation AO échouée');
    error.statusCode = 400;
    error.validationErrors = validation.errors;
    error.validationWarnings = validation.warnings;
    throw error;
  }

  // Logger les avertissements si présents
  if (validation.warnings.length > 0) {
    logger.warn('AO mis à jour avec avertissements', {
      aoId: id,
      utilisateurId,
      warnings: validation.warnings
    });
  }

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
