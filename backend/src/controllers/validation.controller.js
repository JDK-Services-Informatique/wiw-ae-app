import {
  validatePourcentagesMontants,
  validateRatioEurosM2,
  validateMontantsHeures,
  validateTranches,
  validateEquipe,
  validateAOComplet
} from '../services/validation.service.js';
import logger from '../utils/logger.js';

/**
 * POST /api/validation/pourcentages-montants
 * Valider la cohérence des pourcentages et montants
 */
export const validatePourcentages = async (req, res) => {
  try {
    const { missions, montantTravaux } = req.body;
    const result = validatePourcentagesMontants(missions, montantTravaux);
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation des pourcentages', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/validation/ratio-euros-m2
 * Valider le ratio €/m²
 */
export const validateRatio = async (req, res) => {
  try {
    const { montantTravaux, surface, domaine } = req.body;
    const result = await validateRatioEurosM2(montantTravaux, surface, domaine);
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation du ratio', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/validation/montants-heures
 * Valider la cohérence montants vs heures
 */
export const validateMontantsHeuresRoute = async (req, res) => {
  try {
    const { partenaires, montantTotal } = req.body;
    const result = validateMontantsHeures(partenaires, montantTotal);
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation montants/heures', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/validation/tranches
 * Valider la complétude des tranches
 */
export const validateTranchesRoute = async (req, res) => {
  try {
    const { missions } = req.body;
    const result = validateTranches(missions);
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation des tranches', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/validation/equipe
 * Valider la complétude de l'équipe
 */
export const validateEquipeRoute = async (req, res) => {
  try {
    const { equipe } = req.body;
    const result = validateEquipe(equipe);
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation de l\'équipe', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/validation/ao/:id
 * Validation globale d'un AO
 */
export const validateAO = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await validateAOComplet(parseInt(id));
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la validation globale de l\'AO', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

