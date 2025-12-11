/**
 * Contrôleur des Projets
 */

import {
  getAllProjets,
  getProjetById,
  createProjet,
  updateProjet,
  deleteProjet
} from '../services/projets.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendNotFound
} from '../utils/controllerUtils.js';

export const getAll = asyncHandler(async (req, res) => {
  const projets = await getAllProjets(req.user.id);
  sendSuccess(res, projets);
}, 'récupération des projets');

export const getById = asyncHandler(async (req, res) => {
  const projet = await getProjetById(req.params.id, req.user.id);
  if (!projet) {
    return sendNotFound(res, 'Projet');
  }
  sendSuccess(res, projet);
}, 'récupération projet');

export const create = asyncHandler(async (req, res) => {
  const projet = await createProjet(req.body, req.user.id);
  sendCreated(res, projet);
}, 'création projet');

export const update = asyncHandler(async (req, res) => {
  const projet = await updateProjet(req.params.id, req.body, req.user.id);
  if (!projet) {
    return sendNotFound(res, 'Projet');
  }
  sendSuccess(res, projet);
}, 'mise à jour projet');

export const remove = asyncHandler(async (req, res) => {
  const success = await deleteProjet(req.params.id, req.user.id);
  if (!success) {
    return sendNotFound(res, 'Projet');
  }
  sendNoContent(res);
}, 'suppression projet');
