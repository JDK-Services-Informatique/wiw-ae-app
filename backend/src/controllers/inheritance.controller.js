import {
  inheritFromAO,
  inheritFromMission,
  createMissionWithInheritance,
  createHonorairesWithInheritance,
  validateInheritance
} from '../services/inheritance.service.js';
import logger from '../utils/logger.js';

/**
 * GET /api/inheritance/ao/:id
 * Récupérer les données héritables d'un AO
 */
export const getAOInheritance = async (req, res) => {
  try {
    const { id } = req.params;
    const inheritedData = await inheritFromAO(parseInt(id));
    res.json(inheritedData);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'héritage AO', { 
      error: error.message, 
      aoId: req.params.id 
    });
    res.status(404).json({ message: error.message });
  }
};

/**
 * GET /api/inheritance/mission/:id
 * Récupérer les données héritables d'une mission
 */
export const getMissionInheritance = async (req, res) => {
  try {
    const { id } = req.params;
    const inheritedData = await inheritFromMission(parseInt(id));
    res.json(inheritedData);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'héritage Mission', { 
      error: error.message, 
      missionId: req.params.id 
    });
    res.status(404).json({ message: error.message });
  }
};

/**
 * POST /api/inheritance/mission
 * Créer une mission avec héritage depuis un AO
 */
export const createMissionInherited = async (req, res) => {
  try {
    const { appelOffreId, ...missionData } = req.body;
    
    if (!appelOffreId) {
      return res.status(400).json({ message: 'appelOffreId est requis' });
    }

    const mission = await createMissionWithInheritance(
      parseInt(appelOffreId),
      missionData,
      req.user.id
    );

    res.status(201).json(mission);
  } catch (error) {
    logger.error('Erreur lors de la création de mission avec héritage', { 
      error: error.message 
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/inheritance/honoraires
 * Créer des honoraires avec héritage depuis une mission
 */
export const createHonorairesInherited = async (req, res) => {
  try {
    const { missionId, ...honoraireData } = req.body;
    
    if (!missionId) {
      return res.status(400).json({ message: 'missionId est requis' });
    }

    const honoraire = await createHonorairesWithInheritance(
      parseInt(missionId),
      honoraireData,
      req.user.id
    );

    res.status(201).json(honoraire);
  } catch (error) {
    logger.error('Erreur lors de la création d\'honoraires avec héritage', { 
      error: error.message 
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/inheritance/validate/:aoId/:missionId?
 * Valider la cohérence de l'héritage
 */
export const validateInheritanceRoute = async (req, res) => {
  try {
    const { aoId, missionId } = req.params;
    const result = await validateInheritance(
      parseInt(aoId),
      missionId ? parseInt(missionId) : null
    );
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation de l\'héritage', { 
      error: error.message 
    });
    res.status(500).json({ message: error.message });
  }
};

