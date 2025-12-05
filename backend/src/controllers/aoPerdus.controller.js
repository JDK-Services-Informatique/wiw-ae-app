/**
 * Contrôleur des AO Perdus (Post-mortem)
 */

import {
  marquerCommePerdu,
  getAOPerdus,
  getStatistiquesAOPerdus,
  archiverAO
} from '../services/aoPerdus.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendBadRequest
} from '../utils/controllerUtils.js';

/**
 * Marquer un AO comme perdu avec analyse post-mortem
 * POST /api/appels/:id/marquer-perdu
 */
export const marquerPerdu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ao = await marquerCommePerdu(parseInt(id), req.body, req.user.id);
  sendSuccess(res, ao);
}, 'marquage AO perdu');

/**
 * Récupérer tous les AO perdus
 * GET /api/appels/perdus
 */
export const getPerdus = asyncHandler(async (req, res) => {
  const aos = await getAOPerdus(req.user.id);
  sendSuccess(res, aos);
}, 'récupération AO perdus');

/**
 * Statistiques des AO perdus
 * GET /api/appels/perdus/statistiques
 */
export const getStatistiques = asyncHandler(async (req, res) => {
  const stats = await getStatistiquesAOPerdus(req.user.id);
  sendSuccess(res, stats);
}, 'statistiques AO perdus');

/**
 * Archiver un AO perdu
 * POST /api/appels/:id/archiver
 */
export const archiver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ao = await archiverAO(parseInt(id), req.user.id);
  sendSuccess(res, ao);
}, 'archivage AO');
