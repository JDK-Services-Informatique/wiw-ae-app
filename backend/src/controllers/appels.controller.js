/**
 * Contrôleur des Appels d'Offres
 */

import {
  getAllAppels,
  getAppelById,
  createAppel,
  updateAppel,
  deleteAppel
} from '../services/appels.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendNotFound
} from '../utils/controllerUtils.js';

export const getAll = asyncHandler(async (req, res) => {
  const appels = await getAllAppels(req.user.id);
  sendSuccess(res, appels);
}, 'récupération des appels d\'offres');

export const getById = asyncHandler(async (req, res) => {
  const appel = await getAppelById(req.params.id, req.user.id);
  if (!appel) {
    return sendNotFound(res, 'Appel d\'offre');
  }
  sendSuccess(res, appel);
}, 'récupération appel d\'offre');

export const create = asyncHandler(async (req, res) => {
  const appel = await createAppel(req.body, req.user.id);
  sendCreated(res, appel);
}, 'création appel d\'offre');

export const update = asyncHandler(async (req, res) => {
  const appel = await updateAppel(req.params.id, req.body, req.user.id);
  if (!appel) {
    return sendNotFound(res, 'Appel d\'offre');
  }
  sendSuccess(res, appel);
}, 'mise à jour appel d\'offre');

export const remove = asyncHandler(async (req, res) => {
  const success = await deleteAppel(req.params.id, req.user.id);
  if (!success) {
    return sendNotFound(res, 'Appel d\'offre');
  }
  sendNoContent(res);
}, 'suppression appel d\'offre');
