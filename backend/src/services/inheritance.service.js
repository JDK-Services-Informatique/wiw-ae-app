import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service d'héritage automatique AO → Mission → Honoraires
 * Selon le plan d'amélioration - Héritage automatique avec validation
 */

/**
 * Hériter les données d'un AO vers une Mission
 * @param {number} appelOffreId - ID de l'AO
 * @param {object} missionData - Données de la mission (peuvent surcharger l'héritage)
 * @returns {object} - Données de mission avec héritage
 */
export async function inheritFromAO(appelOffreId, missionData = {}) {
  try {
    const ao = await prisma.appelOffre.findUnique({
      where: { id: appelOffreId },
      include: { projet: true }
    });

    if (!ao) {
      throw new Error('Appel d\'offre non trouvé');
    }

    // Données héritées de l'AO
    const inheritedData = {
      // Montant travaux (unique et invariant)
      montantTravaux: ao.montantTravaux || ao.montant || null,
      // Client (depuis AO ou Projet)
      client: {
        nom: ao.clientNom || ao.projet?.titre || '',
        email: ao.clientEmail || '',
        telephone: ao.clientTel || ''
      },
      // Domaine et Type
      domaine: ao.domaine || ao.projet?.domaine || null,
      type: ao.type || ao.projet?.type || null,
      // Délai
      delai: ao.delai || null
    };

    // Fusionner avec les données fournies (les données fournies ont la priorité)
    const finalData = {
      ...inheritedData,
      ...missionData,
      // Le montant travaux ne peut pas être modifié
      montantTravaux: inheritedData.montantTravaux
    };

    logger.info('Héritage AO → Mission', { 
      appelOffreId, 
      montantTravaux: finalData.montantTravaux,
      domaine: finalData.domaine 
    });

    return finalData;
  } catch (error) {
    logger.error('Erreur lors de l\'héritage AO → Mission', { 
      error: error.message, 
      appelOffreId 
    });
    throw error;
  }
}

/**
 * Hériter les données d'une Mission vers les Honoraires
 * @param {number} missionId - ID de la mission
 * @param {object} honoraireData - Données des honoraires (peuvent surcharger l'héritage)
 * @returns {object} - Données d'honoraires avec héritage
 */
export async function inheritFromMission(missionId, honoraireData = {}) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { 
        appelOffre: {
          include: { projet: true }
        }
      }
    });

    if (!mission) {
      throw new Error('Mission non trouvée');
    }

    // Données héritées de la Mission
    const inheritedData = {
      // Montant travaux (unique et invariant - non modifiable)
      montantTravaux: mission.montantTravaux || mission.appelOffre?.montantTravaux || null,
      // Équipe (depuis la mission)
      equipe: mission.equipe ? JSON.parse(mission.equipe) : [],
      // Missions définies (pour référence)
      missions: [{
        id: mission.id,
        designation: mission.designation,
        typeMission: mission.typeMission,
        phase: mission.phase,
        tranche: mission.tranche,
        pourcentage: mission.pourcentage,
        montantHT: mission.montantHT
      }],
      // Domaine et Type (depuis AO)
      domaine: mission.appelOffre?.domaine || mission.appelOffre?.projet?.domaine || null,
      type: mission.appelOffre?.type || mission.appelOffre?.projet?.type || null
    };

    // Fusionner avec les données fournies
    const finalData = {
      ...inheritedData,
      ...honoraireData,
      // Le montant travaux ne peut pas être modifié
      montantTravaux: inheritedData.montantTravaux
    };

    logger.info('Héritage Mission → Honoraires', { 
      missionId, 
      montantTravaux: finalData.montantTravaux,
      nbMissions: finalData.missions?.length || 0
    });

    return finalData;
  } catch (error) {
    logger.error('Erreur lors de l\'héritage Mission → Honoraires', { 
      error: error.message, 
      missionId 
    });
    throw error;
  }
}

/**
 * Créer une mission avec héritage automatique depuis un AO
 * @param {number} appelOffreId - ID de l'AO
 * @param {object} missionData - Données de la mission
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {object} - Mission créée
 */
export async function createMissionWithInheritance(appelOffreId, missionData, utilisateurId) {
  try {
    // Récupérer les données héritées
    const inheritedData = await inheritFromAO(appelOffreId, missionData);

    // Créer la mission
    const mission = await prisma.mission.create({
      data: {
        appelOffreId,
        utilisateurId,
        designation: missionData.designation || inheritedData.client?.nom || 'Mission',
        typeMission: missionData.typeMission || 'Base',
        phase: missionData.phase || null,
        tranche: missionData.tranche || null,
        description: missionData.description || null,
        montantTravaux: inheritedData.montantTravaux, // Hérité, non modifiable
        equipe: missionData.equipe ? JSON.stringify(missionData.equipe) : null,
        pourcentage: missionData.pourcentage || null,
        montantHT: missionData.montantHT || null,
        statut: missionData.statut || 'brouillon',
        notes: missionData.notes || null
      }
    });

    logger.info('Mission créée avec héritage', { 
      missionId: mission.id, 
      appelOffreId,
      montantTravaux: mission.montantTravaux
    });

    return mission;
  } catch (error) {
    logger.error('Erreur lors de la création de mission avec héritage', { 
      error: error.message, 
      appelOffreId 
    });
    throw error;
  }
}

/**
 * Créer des honoraires avec héritage automatique depuis une mission
 * @param {number} missionId - ID de la mission
 * @param {object} honoraireData - Données des honoraires
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {object} - Honoraires créés
 */
export async function createHonorairesWithInheritance(missionId, honoraireData, utilisateurId) {
  try {
    // Récupérer les données héritées
    const inheritedData = await inheritFromMission(missionId, honoraireData);

    // Calculer le montant total des honoraires
    const montantTotal = inheritedData.missions?.reduce((sum, m) => sum + (m.montantHT || 0), 0) || 0;

    // Créer les honoraires
    const honoraire = await prisma.honoraire.create({
      data: {
        missionId,
        utilisateurId,
        projetId: honoraireData.projetId || null,
        montant: honoraireData.montant || montantTotal,
        montantTravaux: inheritedData.montantTravaux, // Hérité, non modifiable
        statut: honoraireData.statut || 'previsionnel',
        dateEcheance: honoraireData.dateEcheance || null
      }
    });

    logger.info('Honoraires créés avec héritage', { 
      honoraireId: honoraire.id, 
      missionId,
      montant: honoraire.montant,
      montantTravaux: honoraire.montantTravaux
    });

    return honoraire;
  } catch (error) {
    logger.error('Erreur lors de la création d\'honoraires avec héritage', { 
      error: error.message, 
      missionId 
    });
    throw error;
  }
}

/**
 * Valider la cohérence de l'héritage
 * @param {number} appelOffreId - ID de l'AO
 * @param {number} missionId - ID de la mission (optionnel)
 * @returns {object} - Résultat de la validation
 */
export async function validateInheritance(appelOffreId, missionId = null) {
  const errors = [];
  const warnings = [];

  try {
    const ao = await prisma.appelOffre.findUnique({
      where: { id: appelOffreId },
      include: { missions: true }
    });

    if (!ao) {
      errors.push('Appel d\'offre non trouvé');
      return { valid: false, errors, warnings };
    }

    // Vérifier que le montant travaux est défini
    if (!ao.montantTravaux && !ao.montant) {
      warnings.push('Montant des travaux non défini dans l\'AO');
    }

    // Si une mission est fournie, vérifier la cohérence
    if (missionId) {
      const mission = await prisma.mission.findUnique({
        where: { id: missionId }
      });

      if (mission && mission.appelOffreId !== appelOffreId) {
        errors.push('La mission n\'appartient pas à cet AO');
      }

      if (mission && mission.montantTravaux !== ao.montantTravaux) {
        errors.push('Incohérence : le montant travaux de la mission ne correspond pas à l\'AO');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    logger.error('Erreur lors de la validation de l\'héritage', { 
      error: error.message, 
      appelOffreId, 
      missionId 
    });
    return {
      valid: false,
      errors: [error.message],
      warnings: []
    };
  }
}

