import { calculerHonoraires } from '../services/honoraires.service.js';
import logger from '../utils/logger.js';

/**
 * Expects req.user.plan to exist
 * Body: { partenaires: [{ nom, coutHoraire, heuresHebdo? }, ...] }
 */
export const getHonoraires = async (req, res) => {
  try {
    const plan = req.user.plan;
    const partenaires = Array.isArray(req.body.partenaires) ? req.body.partenaires : req.body;
    const result = calculerHonoraires(partenaires, plan);
    res.json({ plan, result });
  } catch (err) {
    logger.error('Erreur lors du calcul des honoraires', { error: err.message });
    res.status(500).json({ message: 'Erreur de calcul', error: err.message });
  }
};
