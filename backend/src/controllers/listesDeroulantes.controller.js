/**
 * Contrôleur des Listes Déroulantes
 */

import {
  getAllListes,
  getListeByNom,
  createListe,
  updateListe,
  deleteListe,
  initializeDefaultListes
} from '../services/listesDeroulantes.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendNotFound,
  sendError,
  HTTP_STATUS
} from '../utils/controllerUtils.js';

/**
 * Middleware pour vérifier les droits admin
 */
function requireAdmin(req, res) {
  if (req.user.role !== 'ADMIN') {
    sendError(res, 'Accès réservé aux administrateurs', HTTP_STATUS.FORBIDDEN);
    return false;
  }
  return true;
}

/**
 * Récupérer toutes les listes déroulantes
 * GET /api/listes-deroulantes
 */
export const getAll = asyncHandler(async (req, res) => {
  const listes = await getAllListes();
  sendSuccess(res, listes);
}, 'récupération listes déroulantes');

/**
 * Récupérer une liste par nom
 * GET /api/listes-deroulantes/:nom
 */
export const getByNom = asyncHandler(async (req, res) => {
  const { nom } = req.params;
  const liste = await getListeByNom(nom);

  if (!liste) {
    return sendNotFound(res, 'Liste');
  }

  sendSuccess(res, liste);
}, 'récupération liste déroulante');

/**
 * Créer une nouvelle liste (admin uniquement)
 * POST /api/listes-deroulantes
 */
export const create = asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const liste = await createListe(req.body, req.user.id);
  sendCreated(res, liste);
}, 'création liste déroulante');

/**
 * Modifier une liste (admin uniquement)
 * PUT /api/listes-deroulantes/:id
 */
export const update = asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { id } = req.params;
  const liste = await updateListe(parseInt(id), req.body);
  sendSuccess(res, liste);
}, 'modification liste déroulante');

/**
 * Supprimer une liste (admin uniquement)
 * DELETE /api/listes-deroulantes/:id
 */
export const remove = asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { id } = req.params;
  await deleteListe(parseInt(id));
  sendNoContent(res);
}, 'suppression liste déroulante');

/**
 * Initialiser les listes par défaut (admin uniquement)
 * POST /api/listes-deroulantes/initialize
 */
export const initialize = asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const listes = await initializeDefaultListes(req.user.id);
  sendSuccess(res, { message: 'Listes initialisées', listes });
}, 'initialisation listes déroulantes');
