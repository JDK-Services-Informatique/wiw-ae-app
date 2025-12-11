/**
 * Contrôleur des Honoraires
 */

import { calculerHonoraires } from '../services/honoraires.service.js';
import { asyncHandler, sendSuccess } from '../utils/controllerUtils.js';

/**
 * Calcule les honoraires basés sur les partenaires
 * Body: { partenaires: [{ nom, coutHoraire, heuresHebdo? }, ...] }
 */
export const getHonoraires = asyncHandler(async (req, res) => {
  const { plan } = req.user;
  const partenaires = Array.isArray(req.body.partenaires)
    ? req.body.partenaires
    : req.body;

  const result = calculerHonoraires(partenaires, plan);
  sendSuccess(res, { plan, result });
}, 'calcul honoraires');
