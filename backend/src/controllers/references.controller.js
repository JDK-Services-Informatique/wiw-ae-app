/**
 * Contrôleur des Références
 */

import {
  createReference,
  getReferences,
  updateReference,
  deleteReference
} from '../services/references.service.js';
import {
  asyncHandler,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendNotFound
} from '../utils/controllerUtils.js';

export const getAll = asyncHandler(async (req, res) => {
  const references = await getReferences(req.user.id);
  sendSuccess(res, references);
}, 'récupération des références');

export const create = asyncHandler(async (req, res) => {
  const referenceData = { ...req.body, utilisateurId: req.user.id };
  const reference = await createReference(referenceData);
  sendCreated(res, reference);
}, 'création référence');

export const update = asyncHandler(async (req, res) => {
  const reference = await updateReference(req.params.id, req.body, req.user.id);
  if (!reference) {
    return sendNotFound(res, 'Référence');
  }
  sendSuccess(res, reference);
}, 'mise à jour référence');

export const remove = asyncHandler(async (req, res) => {
  const success = await deleteReference(req.params.id, req.user.id);
  if (!success) {
    return sendNotFound(res, 'Référence');
  }
  sendNoContent(res);
}, 'suppression référence');

// Alias pour rétrocompatibilité
export const createReferenceController = create;
export const getReferencesController = getAll;
export const updateReferenceController = update;
export const deleteReferenceController = remove;
