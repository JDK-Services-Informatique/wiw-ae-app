// Gestionnaire centralisé des erreurs Prisma
import logger from './logger.js';

/**
 * Convertit les erreurs Prisma en réponses HTTP appropriées
 * @param {Error} error - L'erreur Prisma
 * @returns {Object} - Objet avec status et message
 */
export function handlePrismaError(error) {
  // Erreur de contrainte unique (P2002)
  if (error.code === 'P2002') {
    const target = error.meta?.target || [];
    const field = target[0] || 'champ';
    return {
      status: 409,
      message: `Un enregistrement avec cette valeur de ${field} existe déjà`,
      code: 'UNIQUE_CONSTRAINT_VIOLATION'
    };
  }

  // Enregistrement non trouvé (P2025)
  if (error.code === 'P2025') {
    return {
      status: 404,
      message: 'Enregistrement non trouvé',
      code: 'RECORD_NOT_FOUND'
    };
  }

  // Erreur de connexion à la base de données (P1001)
  if (error.code === 'P1001') {
    logger.error('Erreur de connexion à la base de données', { error: error.message });
    return {
      status: 503,
      message: 'Service de base de données indisponible',
      code: 'DATABASE_CONNECTION_ERROR'
    };
  }

  // Erreur de requête invalide (P2003)
  if (error.code === 'P2003') {
    return {
      status: 400,
      message: 'Référence invalide dans la requête',
      code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION'
    };
  }

  // Erreur de validation (P2009)
  if (error.code === 'P2009') {
    return {
      status: 400,
      message: 'Erreur de validation de la requête',
      code: 'VALIDATION_ERROR'
    };
  }

  // Erreur de timeout (P1008)
  if (error.code === 'P1008') {
    logger.error('Timeout de la base de données', { error: error.message });
    return {
      status: 504,
      message: 'Timeout de la requête à la base de données',
      code: 'DATABASE_TIMEOUT'
    };
  }

  // Erreur inconnue
  logger.error('Erreur Prisma non gérée', { 
    code: error.code, 
    message: error.message,
    meta: error.meta 
  });

  return {
    status: 500,
    message: 'Erreur de base de données',
    code: 'DATABASE_ERROR'
  };
}

/**
 * Middleware pour gérer les erreurs Prisma dans les controllers
 * @param {Error} error - L'erreur
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export function prismaErrorMiddleware(error, req, res, next) {
  // Vérifier si c'est une erreur Prisma
  if (error.name === 'PrismaClientKnownRequestError' || 
      error.name === 'PrismaClientUnknownRequestError' ||
      error.name === 'PrismaClientValidationError' ||
      error.code?.startsWith('P')) {
    const handled = handlePrismaError(error);
    return res.status(handled.status).json({
      error: handled.message,
      code: handled.code
    });
  }

  // Passer à l'erreur suivante si ce n'est pas une erreur Prisma
  next(error);
}

export default handlePrismaError;

