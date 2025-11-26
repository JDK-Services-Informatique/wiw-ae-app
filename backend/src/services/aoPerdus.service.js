import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service de gestion des AO non emportés (perdus)
 * Analyse post-mortem et statistiques
 */

/**
 * Marquer un AO comme perdu et créer l'analyse post-mortem
 * @param {number} aoId - ID de l'AO
 * @param {object} analyseData - Données de l'analyse
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<object>} - AO mis à jour avec analyse
 */
export async function marquerCommePerdu(aoId, analyseData, utilisateurId) {
  try {
    // Mettre à jour le statut de l'AO
    const ao = await prisma.appelOffre.update({
      where: { id: aoId },
      data: { statut: 'Perdu' },
      include: { analysePostMortem: true }
    });

    // Créer ou mettre à jour l'analyse post-mortem
    const analyse = await prisma.analysePostMortem.upsert({
      where: { appelOffreId: aoId },
      update: {
        raison: analyseData.raison || null,
        concurrentGagnant: analyseData.concurrentGagnant || null,
        montantGagnant: analyseData.montantGagnant || null,
        leconsApprises: analyseData.leconsApprises || null,
        pointsForts: analyseData.pointsForts || null,
        pointsFaibles: analyseData.pointsFaibles || null,
        utilisateurId
      },
      create: {
        appelOffreId: aoId,
        raison: analyseData.raison || null,
        concurrentGagnant: analyseData.concurrentGagnant || null,
        montantGagnant: analyseData.montantGagnant || null,
        leconsApprises: analyseData.leconsApprises || null,
        pointsForts: analyseData.pointsForts || null,
        pointsFaibles: analyseData.pointsFaibles || null,
        utilisateurId
      }
    });

    logger.info('AO marqué comme perdu avec analyse', { aoId, analyseId: analyse.id });

    return {
      ...ao,
      analysePostMortem: analyse
    };
  } catch (error) {
    logger.error('Erreur lors du marquage de l\'AO comme perdu', { 
      error: error.message, 
      aoId 
    });
    throw error;
  }
}

/**
 * Récupérer tous les AO perdus avec leurs analyses
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<Array>} - Liste des AO perdus
 */
export async function getAOPerdus(utilisateurId) {
  try {
    const aos = await prisma.appelOffre.findMany({
      where: {
        statut: 'Perdu',
        projet: { utilisateurId }
      },
      include: {
        analysePostMortem: true,
        projet: {
          select: { id: true, titre: true, domaine: true, type: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return aos;
  } catch (error) {
    logger.error('Erreur lors de la récupération des AO perdus', { error: error.message });
    throw error;
  }
}

/**
 * Calculer les statistiques des AO perdus
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<object>} - Statistiques
 */
export async function getStatistiquesAOPerdus(utilisateurId) {
  try {
    const aosPerdus = await prisma.appelOffre.findMany({
      where: {
        statut: 'Perdu',
        projet: { utilisateurId }
      },
      include: {
        analysePostMortem: true
      }
    });

    // Raisons principales
    const raisons = {};
    aosPerdus.forEach(ao => {
      if (ao.analysePostMortem?.raison) {
        raisons[ao.analysePostMortem.raison] = (raisons[ao.analysePostMortem.raison] || 0) + 1;
      }
    });

    // Par domaine
    const parDomaine = {};
    aosPerdus.forEach(ao => {
      const domaine = ao.domaine || 'Non défini';
      parDomaine[domaine] = (parDomaine[domaine] || 0) + 1;
    });

    // Par type
    const parType = {};
    aosPerdus.forEach(ao => {
      const type = ao.type || 'Non défini';
      parType[type] = (parType[type] || 0) + 1;
    });

    // Taux de réussite global (nécessite aussi les AO gagnés)
    const totalAOs = await prisma.appelOffre.count({
      where: {
        projet: { utilisateurId },
        statut: { in: ['Gagné', 'Perdu'] }
      }
    });

    const nbGagnes = await prisma.appelOffre.count({
      where: {
        projet: { utilisateurId },
        statut: 'Gagné'
      }
    });

    const tauxReussite = totalAOs > 0 ? (nbGagnes / totalAOs) * 100 : 0;

    return {
      totalPerdus: aosPerdus.length,
      totalAOs,
      nbGagnes,
      tauxReussite: Math.round(tauxReussite * 10) / 10,
      raisons: Object.entries(raisons)
        .map(([raison, count]) => ({ raison, count }))
        .sort((a, b) => b.count - a.count),
      parDomaine: Object.entries(parDomaine)
        .map(([domaine, count]) => ({ domaine, count }))
        .sort((a, b) => b.count - a.count),
      parType: Object.entries(parType)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
    };
  } catch (error) {
    logger.error('Erreur lors du calcul des statistiques', { error: error.message });
    throw error;
  }
}

/**
 * Archiver un AO perdu (déplacer vers les archives)
 * @param {number} aoId - ID de l'AO
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<object>} - AO archivé
 */
export async function archiverAO(aoId, utilisateurId) {
  try {
    const ao = await prisma.appelOffre.update({
      where: { id: aoId },
      data: { statut: 'Archivé' }
    });

    logger.info('AO archivé', { aoId });
    return ao;
  } catch (error) {
    logger.error('Erreur lors de l\'archivage de l\'AO', { error: error.message, aoId });
    throw error;
  }
}

