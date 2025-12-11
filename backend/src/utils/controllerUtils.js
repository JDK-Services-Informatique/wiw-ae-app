/**
 * Utilitaires pour les contrôleurs
 * Standardise les réponses HTTP et la gestion d'erreurs
 */

import logger from './logger.js';

// ============================================================================
// CODES HTTP STANDARDS
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

// ============================================================================
// RÉPONSES STANDARDISÉES
// ============================================================================

/**
 * Envoie une réponse de succès
 * @param {Response} res - Objet response Express
 * @param {*} data - Données à envoyer
 * @param {number} status - Code HTTP (défaut: 200)
 */
export function sendSuccess(res, data, status = HTTP_STATUS.OK) {
  res.status(status).json(data);
}

/**
 * Envoie une réponse de création réussie
 * @param {Response} res - Objet response Express
 * @param {*} data - Données créées
 */
export function sendCreated(res, data) {
  res.status(HTTP_STATUS.CREATED).json(data);
}

/**
 * Envoie une réponse sans contenu (suppression réussie)
 * @param {Response} res - Objet response Express
 */
export function sendNoContent(res) {
  res.status(HTTP_STATUS.NO_CONTENT).send();
}

/**
 * Envoie une réponse d'erreur
 * @param {Response} res - Objet response Express
 * @param {string} message - Message d'erreur
 * @param {number} status - Code HTTP (défaut: 500)
 * @param {string} [details] - Détails supplémentaires
 */
export function sendError(res, message, status = HTTP_STATUS.INTERNAL_ERROR, details = null) {
  const response = { error: message };
  if (details) {
    response.details = details;
  }
  res.status(status).json(response);
}

/**
 * Envoie une erreur 404 Not Found
 * @param {Response} res - Objet response Express
 * @param {string} resource - Nom de la ressource non trouvée
 */
export function sendNotFound(res, resource) {
  sendError(res, `${resource} non trouvé(e)`, HTTP_STATUS.NOT_FOUND);
}

/**
 * Envoie une erreur 400 Bad Request
 * @param {Response} res - Objet response Express
 * @param {string} message - Message d'erreur
 */
export function sendBadRequest(res, message) {
  sendError(res, message, HTTP_STATUS.BAD_REQUEST);
}

// ============================================================================
// WRAPPER DE CONTRÔLEUR
// ============================================================================

/**
 * Wrapper pour gérer les erreurs async dans les contrôleurs
 * @param {Function} fn - Fonction de contrôleur async
 * @param {string} [context] - Contexte pour le logging
 * @returns {Function} Fonction wrappée avec gestion d'erreurs
 */
export function asyncHandler(fn, context = '') {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error(`Erreur ${context}`, {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method
      });
      sendError(res, 'Erreur serveur', HTTP_STATUS.INTERNAL_ERROR, error.message);
    }
  };
}

/**
 * Factory pour créer des contrôleurs CRUD standardisés
 * @param {Object} service - Service avec méthodes CRUD
 * @param {string} resourceName - Nom de la ressource (pour les messages)
 * @returns {Object} Contrôleurs CRUD
 */
export function createCRUDController(service, resourceName) {
  return {
    getAll: asyncHandler(async (req, res) => {
      const items = await service.getAll(req.user.id);
      sendSuccess(res, items);
    }, `récupération des ${resourceName}s`),

    getById: asyncHandler(async (req, res) => {
      const item = await service.getById(req.params.id, req.user.id);
      if (!item) {
        return sendNotFound(res, resourceName);
      }
      sendSuccess(res, item);
    }, `récupération ${resourceName}`),

    create: asyncHandler(async (req, res) => {
      const item = await service.create(req.body, req.user.id);
      sendCreated(res, item);
    }, `création ${resourceName}`),

    update: asyncHandler(async (req, res) => {
      const item = await service.update(req.params.id, req.body, req.user.id);
      if (!item) {
        return sendNotFound(res, resourceName);
      }
      sendSuccess(res, item);
    }, `mise à jour ${resourceName}`),

    delete: asyncHandler(async (req, res) => {
      const success = await service.delete(req.params.id, req.user.id);
      if (!success) {
        return sendNotFound(res, resourceName);
      }
      sendNoContent(res);
    }, `suppression ${resourceName}`)
  };
}

export default {
  HTTP_STATUS,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendError,
  sendNotFound,
  sendBadRequest,
  asyncHandler,
  createCRUDController
};
