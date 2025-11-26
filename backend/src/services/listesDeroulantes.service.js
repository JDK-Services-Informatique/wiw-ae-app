import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service de gestion des listes déroulantes
 * Permet aux admins de créer et gérer les listes personnalisées
 */

/**
 * Récupérer toutes les listes déroulantes actives
 * @returns {Promise<Array>} - Liste des listes déroulantes
 */
export async function getAllListes() {
  try {
    const listes = await prisma.listeDeroulante.findMany({
      where: { actif: true },
      orderBy: { ordre: 'asc' },
      include: {
        utilisateur: {
          select: { id: true, nom: true, prenom: true, email: true }
        }
      }
    });

    // Parser les valeurs JSON
    return listes.map(liste => ({
      ...liste,
      valeurs: JSON.parse(liste.valeurs || '[]')
    }));
  } catch (error) {
    logger.error('Erreur lors de la récupération des listes déroulantes', { error: error.message });
    throw error;
  }
}

/**
 * Récupérer une liste déroulante par nom
 * @param {string} nom - Nom de la liste (ex: "domaines")
 * @returns {Promise<object>} - Liste déroulante
 */
export async function getListeByNom(nom) {
  try {
    const liste = await prisma.listeDeroulante.findUnique({
      where: { nom }
    });

    if (!liste || !liste.actif) {
      return null;
    }

    return {
      ...liste,
      valeurs: JSON.parse(liste.valeurs || '[]')
    };
  } catch (error) {
    logger.error('Erreur lors de la récupération de la liste', { error: error.message, nom });
    throw error;
  }
}

/**
 * Créer une nouvelle liste déroulante
 * @param {object} listeData - Données de la liste
 * @param {number} utilisateurId - ID de l'utilisateur (admin)
 * @returns {Promise<object>} - Liste créée
 */
export async function createListe(listeData, utilisateurId) {
  try {
    // Valider les données
    if (!listeData.nom || !listeData.label) {
      throw new Error('Nom et label sont obligatoires');
    }

    if (!listeData.valeurs || !Array.isArray(listeData.valeurs)) {
      throw new Error('Les valeurs doivent être un tableau');
    }

    // Vérifier que le nom n'existe pas déjà
    const existing = await prisma.listeDeroulante.findUnique({
      where: { nom: listeData.nom }
    });

    if (existing) {
      throw new Error('Une liste avec ce nom existe déjà');
    }

    // Créer la liste
    const liste = await prisma.listeDeroulante.create({
      data: {
        nom: listeData.nom,
        label: listeData.label,
        description: listeData.description || null,
        type: listeData.type || 'simple',
        valeurs: JSON.stringify(listeData.valeurs),
        ordre: listeData.ordre || 0,
        actif: listeData.actif !== undefined ? listeData.actif : true,
        utilisateurId
      }
    });

    logger.info('Liste déroulante créée', { listeId: liste.id, nom: liste.nom });

    return {
      ...liste,
      valeurs: JSON.parse(liste.valeurs)
    };
  } catch (error) {
    logger.error('Erreur lors de la création de la liste', { error: error.message });
    throw error;
  }
}

/**
 * Modifier une liste déroulante
 * @param {number} id - ID de la liste
 * @param {object} listeData - Données à modifier
 * @returns {Promise<object>} - Liste modifiée
 */
export async function updateListe(id, listeData) {
  try {
    // Vérifier que la liste existe
    const existing = await prisma.listeDeroulante.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new Error('Liste non trouvée');
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (listeData.label !== undefined) updateData.label = listeData.label;
    if (listeData.description !== undefined) updateData.description = listeData.description;
    if (listeData.type !== undefined) updateData.type = listeData.type;
    if (listeData.valeurs !== undefined) {
      if (!Array.isArray(listeData.valeurs)) {
        throw new Error('Les valeurs doivent être un tableau');
      }
      updateData.valeurs = JSON.stringify(listeData.valeurs);
    }
    if (listeData.ordre !== undefined) updateData.ordre = listeData.ordre;
    if (listeData.actif !== undefined) updateData.actif = listeData.actif;

    // Mettre à jour
    const liste = await prisma.listeDeroulante.update({
      where: { id },
      data: updateData
    });

    logger.info('Liste déroulante modifiée', { listeId: liste.id, nom: liste.nom });

    return {
      ...liste,
      valeurs: JSON.parse(liste.valeurs)
    };
  } catch (error) {
    logger.error('Erreur lors de la modification de la liste', { error: error.message, id });
    throw error;
  }
}

/**
 * Supprimer une liste déroulante
 * @param {number} id - ID de la liste
 * @returns {Promise<boolean>} - Succès
 */
export async function deleteListe(id) {
  try {
    await prisma.listeDeroulante.delete({
      where: { id }
    });

    logger.info('Liste déroulante supprimée', { id });
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression de la liste', { error: error.message, id });
    throw error;
  }
}

/**
 * Initialiser les listes déroulantes par défaut
 * @param {number} utilisateurId - ID de l'admin
 * @returns {Promise<Array>} - Listes créées
 */
export async function initializeDefaultListes(utilisateurId) {
  const listesParDefaut = [
    {
      nom: 'domaines',
      label: 'Domaines',
      description: 'Domaines de projets (Habitation, Équipements publics, etc.)',
      type: 'simple',
      valeurs: ['Logements', 'Équipements publics', 'Commerce', 'Bureaux', 'Industrie', 'Santé', 'Autre'],
      ordre: 1
    },
    {
      nom: 'types',
      label: 'Types de projet',
      description: 'Types de projets (Neuf, Réhabilitation, Extension, etc.)',
      type: 'simple',
      valeurs: ['Neuf', 'Réhabilitation', 'Extension', 'Rénovation', 'Autre'],
      ordre: 2
    },
    {
      nom: 'metiers',
      label: 'Métiers',
      description: 'Métiers et compétences (Architecte, BET Structure, etc.)',
      type: 'simple',
      valeurs: [
        'Architecte DPLG',
        'BET Structure',
        'BET Fluides',
        'BET Thermique',
        'Économiste TCE',
        'Bureau de contrôle',
        'Autre'
      ],
      ordre: 3
    },
    {
      nom: 'statuts_ao',
      label: 'Statuts AO',
      description: 'Statuts des appels d\'offres',
      type: 'simple',
      valeurs: ['Nouveau', 'En cours', 'Gagné', 'Perdu', 'Archivé'],
      ordre: 4
    },
    {
      nom: 'types_mission',
      label: 'Types de mission',
      description: 'Types de missions (Base, Complémentaire, Optionnelle)',
      type: 'simple',
      valeurs: ['Base', 'Complémentaire', 'Optionnelle'],
      ordre: 5
    },
    {
      nom: 'phases',
      label: 'Phases',
      description: 'Phases de projet (Conception, Réalisation)',
      type: 'simple',
      valeurs: ['CONCEPTION', 'RÉALISATION'],
      ordre: 6
    },
    {
      nom: 'tranches',
      label: 'Tranches',
      description: 'Tranches de projet (Ferme, Conditionnelle, Optionnelle)',
      type: 'simple',
      valeurs: ['FERME', 'CONDITIONNELLE', 'OPTIONNELLE'],
      ordre: 7
    }
  ];

  const listesCreees = [];

  for (const listeData of listesParDefaut) {
    try {
      // Vérifier si la liste existe déjà
      const existing = await prisma.listeDeroulante.findUnique({
        where: { nom: listeData.nom }
      });

      if (!existing) {
        const liste = await createListe(listeData, utilisateurId);
        listesCreees.push(liste);
      }
    } catch (error) {
      logger.warn('Erreur lors de l\'initialisation d\'une liste par défaut', { 
        error: error.message, 
        nom: listeData.nom 
      });
    }
  }

  logger.info('Initialisation des listes déroulantes par défaut', { 
    nbListes: listesCreees.length 
  });

  return listesCreees;
}

