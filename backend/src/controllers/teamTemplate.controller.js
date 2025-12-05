/**
 * Contrôleur des Templates d'Équipe
 */

import {
  createTeamTemplate,
  getTeamTemplates,
  getTeamTemplate,
  updateTeamTemplate,
  deleteTeamTemplate,
  applyTeamTemplate
} from '../services/teamTemplate.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest
} from '../utils/controllerUtils.js';

export const getAll = asyncHandler(async (req, res) => {
  const templates = await getTeamTemplates(req.user.id);
  sendSuccess(res, templates);
}, 'récupération templates équipe');

export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const template = await getTeamTemplate(parseInt(id));
  sendSuccess(res, template);
}, 'récupération template équipe');

export const create = asyncHandler(async (req, res) => {
  const template = await createTeamTemplate(req.body, req.user.id);
  sendCreated(res, template);
}, 'création template équipe');

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const template = await updateTeamTemplate(parseInt(id), req.body);
  sendSuccess(res, template);
}, 'mise à jour template équipe');

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTeamTemplate(parseInt(id));
  sendSuccess(res, { message: 'Template supprimé avec succès' });
}, 'suppression template équipe');

export const apply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { projetId } = req.body;

  if (!projetId) {
    return sendBadRequest(res, 'projetId est requis');
  }

  const equipe = await applyTeamTemplate(
    parseInt(id),
    parseInt(projetId),
    req.user.id
  );
  sendSuccess(res, equipe);
}, 'application template équipe');
