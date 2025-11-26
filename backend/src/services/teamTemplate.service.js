import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service de gestion des templates d'équipe
 * Permet de créer et gérer des configurations d'équipe réutilisables
 */

/**
 * Créer un nouveau template d'équipe
 * @param {object} templateData - Données du template
 * @param {number} utilisateurId - ID de l'utilisateur créateur
 * @returns {object} - Template créé
 */
export async function createTeamTemplate(templateData, utilisateurId) {
  try {
    const template = await prisma.teamTemplate.create({
      data: {
        nom: templateData.nom,
        description: templateData.description,
        domaine: templateData.domaine,
        typeProjet: templateData.typeProjet,
        membres: JSON.stringify(templateData.membres),
        competencesRequises: JSON.stringify(templateData.competencesRequises || []),
        budgetEstime: templateData.budgetEstime,
        dureeEstimee: templateData.dureeEstimee,
        utilisateurId
      }
    });

    logger.info('Template d\'équipe créé', {
      templateId: template.id,
      nom: template.nom,
      utilisateurId
    });

    return template;
  } catch (error) {
    logger.error('Erreur lors de la création du template d\'équipe', {
      error: error.message,
      utilisateurId
    });
    throw error;
  }
}

/**
 * Récupérer tous les templates d'équipe
 * @param {number} utilisateurId - ID de l'utilisateur (optionnel, pour filtrer)
 * @returns {Array} - Liste des templates
 */
export async function getTeamTemplates(utilisateurId = null) {
  try {
    const where = utilisateurId ? { utilisateurId } : {};
    const templates = await prisma.teamTemplate.findMany({
      where,
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Désérialiser les données JSON
    return templates.map(template => ({
      ...template,
      membres: JSON.parse(template.membres),
      competencesRequises: JSON.parse(template.competencesRequises)
    }));
  } catch (error) {
    logger.error('Erreur lors de la récupération des templates d\'équipe', {
      error: error.message,
      utilisateurId
    });
    throw error;
  }
}

/**
 * Récupérer un template spécifique
 * @param {number} templateId - ID du template
 * @returns {object} - Template avec données désérialisées
 */
export async function getTeamTemplate(templateId) {
  try {
    const template = await prisma.teamTemplate.findUnique({
      where: { id: templateId },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true }
        }
      }
    });

    if (!template) {
      throw new Error('Template non trouvé');
    }

    return {
      ...template,
      membres: JSON.parse(template.membres),
      competencesRequises: JSON.parse(template.competencesRequises)
    };
  } catch (error) {
    logger.error('Erreur lors de la récupération du template d\'équipe', {
      error: error.message,
      templateId
    });
    throw error;
  }
}

/**
 * Mettre à jour un template d'équipe
 * @param {number} templateId - ID du template
 * @param {object} updateData - Données à mettre à jour
 * @returns {object} - Template mis à jour
 */
export async function updateTeamTemplate(templateId, updateData) {
  try {
    const updatePayload = {
      ...updateData
    };

    // Resérialiser les données JSON si elles sont fournies
    if (updateData.membres) {
      updatePayload.membres = JSON.stringify(updateData.membres);
    }
    if (updateData.competencesRequises) {
      updatePayload.competencesRequises = JSON.stringify(updateData.competencesRequises);
    }

    const template = await prisma.teamTemplate.update({
      where: { id: templateId },
      data: updatePayload,
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true }
        }
      }
    });

    logger.info('Template d\'équipe mis à jour', {
      templateId,
      nom: template.nom
    });

    return {
      ...template,
      membres: JSON.parse(template.membres),
      competencesRequises: JSON.parse(template.competencesRequises)
    };
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du template d\'équipe', {
      error: error.message,
      templateId
    });
    throw error;
  }
}

/**
 * Supprimer un template d'équipe
 * @param {number} templateId - ID du template à supprimer
 * @returns {boolean} - Succès de la suppression
 */
export async function deleteTeamTemplate(templateId) {
  try {
    await prisma.teamTemplate.delete({
      where: { id: templateId }
    });

    logger.info('Template d\'équipe supprimé', { templateId });

    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression du template d\'équipe', {
      error: error.message,
      templateId
    });
    throw error;
  }
}

/**
 * Appliquer un template à une équipe existante
 * @param {number} templateId - ID du template
 * @param {number} projetId - ID du projet
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {object} - Équipe créée
 */
export async function applyTeamTemplate(templateId, projetId, utilisateurId) {
  try {
    const template = await getTeamTemplate(templateId);

    // Créer l'équipe basée sur le template
    const equipe = await prisma.equipe.create({
      data: {
        projetId,
        utilisateurId,
        membres: template.membres,
        competencesRequises: template.competencesRequises,
        budgetEstime: template.budgetEstime,
        dureeEstimee: template.dureeEstimee
      }
    });

    logger.info('Template d\'équipe appliqué', {
      templateId,
      projetId,
      equipeId: equipe.id
    });

    return equipe;
  } catch (error) {
    logger.error('Erreur lors de l\'application du template d\'équipe', {
      error: error.message,
      templateId,
      projetId
    });
    throw error;
  }
}