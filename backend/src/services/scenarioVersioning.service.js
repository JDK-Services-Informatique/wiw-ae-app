import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service de versioning des scénarios
 * Permet de créer et gérer des versions des scénarios de projet
 */

/**
 * Créer une nouvelle version d'un scénario
 * @param {number} projetId - ID du projet
 * @param {object} scenarioData - Données du scénario
 * @param {number} utilisateurId - ID de l'utilisateur qui crée la version
 * @param {string} commentaire - Commentaire optionnel pour la version
 * @returns {object} - Version créée
 */
export async function createScenarioVersion(projetId, scenarioData, utilisateurId, commentaire = '') {
  try {
    // Récupérer la dernière version pour incrémenter le numéro
    const lastVersion = await prisma.scenarioVersion.findFirst({
      where: { projetId },
      orderBy: { versionNumber: 'desc' }
    });

    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // Créer la nouvelle version
    const version = await prisma.scenarioVersion.create({
      data: {
        projetId,
        versionNumber,
        data: JSON.stringify(scenarioData),
        commentaire,
        utilisateurId,
        createdAt: new Date()
      }
    });

    logger.info('Nouvelle version de scénario créée', {
      projetId,
      versionNumber,
      utilisateurId
    });

    return version;
  } catch (error) {
    logger.error('Erreur lors de la création de version de scénario', {
      error: error.message,
      projetId,
      utilisateurId
    });
    throw error;
  }
}

/**
 * Récupérer toutes les versions d'un scénario
 * @param {number} projetId - ID du projet
 * @returns {Array} - Liste des versions
 */
export async function getScenarioVersions(projetId) {
  try {
    const versions = await prisma.scenarioVersion.findMany({
      where: { projetId },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true }
        }
      },
      orderBy: { versionNumber: 'desc' }
    });

    // Désérialiser les données JSON
    return versions.map(version => ({
      ...version,
      data: JSON.parse(version.data)
    }));
  } catch (error) {
    logger.error('Erreur lors de la récupération des versions de scénario', {
      error: error.message,
      projetId
    });
    throw error;
  }
}

/**
 * Récupérer une version spécifique
 * @param {number} versionId - ID de la version
 * @returns {object} - Version avec données désérialisées
 */
export async function getScenarioVersion(versionId) {
  try {
    const version = await prisma.scenarioVersion.findUnique({
      where: { id: versionId },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true }
        }
      }
    });

    if (!version) {
      throw new Error('Version non trouvée');
    }

    return {
      ...version,
      data: JSON.parse(version.data)
    };
  } catch (error) {
    logger.error('Erreur lors de la récupération de la version de scénario', {
      error: error.message,
      versionId
    });
    throw error;
  }
}

/**
 * Restaurer une version précédente
 * @param {number} versionId - ID de la version à restaurer
 * @param {number} utilisateurId - ID de l'utilisateur qui restaure
 * @returns {object} - Nouvelle version créée
 */
export async function restoreScenarioVersion(versionId, utilisateurId) {
  try {
    // Récupérer la version à restaurer
    const versionToRestore = await getScenarioVersion(versionId);

    // Créer une nouvelle version avec les données restaurées
    const newVersion = await createScenarioVersion(
      versionToRestore.projetId,
      versionToRestore.data,
      utilisateurId,
      `Restauration de la version ${versionToRestore.versionNumber}`
    );

    logger.info('Version de scénario restaurée', {
      originalVersionId: versionId,
      newVersionId: newVersion.id,
      projetId: versionToRestore.projetId
    });

    return newVersion;
  } catch (error) {
    logger.error('Erreur lors de la restauration de version de scénario', {
      error: error.message,
      versionId,
      utilisateurId
    });
    throw error;
  }
}

/**
 * Comparer deux versions
 * @param {number} versionId1 - ID de la première version
 * @param {number} versionId2 - ID de la deuxième version
 * @returns {object} - Comparaison des versions
 */
export async function compareScenarioVersions(versionId1, versionId2) {
  try {
    const version1 = await getScenarioVersion(versionId1);
    const version2 = await getScenarioVersion(versionId2);

    if (version1.projetId !== version2.projetId) {
      throw new Error('Les versions ne appartiennent pas au même projet');
    }

    // Comparaison simple (peut être étendue)
    const differences = {
      version1: {
        number: version1.versionNumber,
        createdAt: version1.createdAt,
        createdBy: version1.utilisateur
      },
      version2: {
        number: version2.versionNumber,
        createdAt: version2.createdAt,
        createdBy: version2.utilisateur
      },
      changes: {
        // Logique de comparaison à implémenter selon les besoins
        hasChanges: JSON.stringify(version1.data) !== JSON.stringify(version2.data)
      }
    };

    return differences;
  } catch (error) {
    logger.error('Erreur lors de la comparaison de versions de scénario', {
      error: error.message,
      versionId1,
      versionId2
    });
    throw error;
  }
}