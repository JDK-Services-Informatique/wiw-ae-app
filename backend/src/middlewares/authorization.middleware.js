import logger from '../utils/logger.js';

/**
 * Middleware d'autorisation basé sur les rôles
 * Rôles définis:
 * - ADMIN: Accès complet à toutes les fonctionnalités
 * - CHEF_PROJET: Accès limité aux projets dont il est responsable, vision financière limitée
 * - ASSISTANT: Accès en lecture seule, pas de vision des taux horaires et marges
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Tentative d\'accès non authentifié à une route protégée', {
        path: req.path,
        method: req.method
      });
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const userRole = req.user.role || 'USER';

    // Si ADMIN, accès à tout
    if (userRole === 'ADMIN') {
      return next();
    }

    // Vérifier si le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(userRole)) {
      logger.warn('Accès refusé - rôle insuffisant', {
        userId: req.user.id,
        userRole,
        requiredRoles: allowedRoles,
        path: req.path,
        method: req.method
      });
      return res.status(403).json({
        message: 'Accès refusé - Permissions insuffisantes',
        requiredRoles: allowedRoles,
        userRole
      });
    }

    next();
  };
};

/**
 * Middleware spécifique pour les données financières sensibles
 * Bloque l'accès aux taux horaires et marges pour les assistants
 */
export const protectFinancialData = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  const userRole = req.user.role || 'USER';

  // Les assistants n'ont pas accès aux données financières sensibles
  if (userRole === 'ASSISTANT') {
    logger.warn('Accès refusé aux données financières - rôle Assistant', {
      userId: req.user.id,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({
      message: 'Accès refusé - Données financières non autorisées pour les assistants'
    });
  }

  next();
};

/**
 * Middleware pour filtrer les données selon le rôle
 * Pour les chefs de projet: limite aux projets dont ils sont responsables
 */
export const filterByRole = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const userRole = req.user.role || 'USER';

  // Pour les chefs de projet, ajouter un filtre sur les projets
  if (userRole === 'CHEF_PROJET') {
    // Cette logique sera implémentée dans les contrôleurs spécifiques
    req.roleFilter = { chefProjetId: req.user.id };
  }

  // Pour les assistants, masquer les données sensibles
  if (userRole === 'ASSISTANT') {
    req.hideFinancialData = true;
  }

  next();
};