import crypto from 'crypto';
import logger from '../utils/logger.js';

/**
 * Middleware de protection CSRF pour l'API
 * Implémente le pattern "Custom Header" pour les requêtes API
 *
 * Pour les API REST modernes, on utilise :
 * 1. Vérification de l'origine (CORS strict)
 * 2. SameSite cookies
 * 3. Header custom requis (X-Requested-With ou X-CSRF-Token)
 */

/**
 * Middleware pour vérifier la présence d'un header custom
 * Protège contre les attaques CSRF car les requêtes cross-origin
 * ne peuvent pas ajouter de headers personnalisés sans CORS
 */
export const csrfProtection = (req, res, next) => {
  // Exempter les requêtes GET, HEAD, OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Exempter les routes publiques (auth)
  if (req.path.startsWith('/api/auth/login') ||
      req.path.startsWith('/api/auth/register') ||
      req.path.startsWith('/api/auth/forgot-password') ||
      req.path.startsWith('/api/auth/reset-password')) {
    return next();
  }

  // Vérifier la présence d'un header custom
  // Les requêtes AJAX légitimes incluront ce header
  const customHeader = req.headers['x-requested-with'] || req.headers['x-csrf-token'];

  if (!customHeader) {
    logger.warn('CSRF: Requête bloquée - header personnalisé manquant', {
      method: req.method,
      path: req.path,
      origin: req.headers.origin,
      ip: req.ip
    });

    return res.status(403).json({
      error: 'CSRF protection: Missing custom header',
      message: 'Cette requête requiert un header de sécurité'
    });
  }

  // Vérifier également l'origine (défense en profondeur)
  const origin = req.headers.origin || req.headers.referer;
  if (origin) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    const frontendUrl = process.env.FRONTEND_URL;

    const allAllowedOrigins = [...allowedOrigins, frontendUrl].filter(Boolean);

    // Extraire l'origine de l'URL complète si c'est un referer
    const requestOrigin = new URL(origin, 'http://localhost').origin;

    if (allAllowedOrigins.length > 0 && !allAllowedOrigins.some(allowed => requestOrigin === allowed)) {
      logger.warn('CSRF: Requête bloquée - origine non autorisée', {
        origin: requestOrigin,
        allowedOrigins: allAllowedOrigins,
        path: req.path
      });

      return res.status(403).json({
        error: 'CSRF protection: Invalid origin',
        message: 'L\'origine de cette requête n\'est pas autorisée'
      });
    }
  }

  next();
};

/**
 * Génère un token CSRF pour les formulaires HTML (si nécessaire)
 * Peut être utilisé pour les pages rendues côté serveur
 */
export const generateCsrfToken = (req, res, next) => {
  if (!req.session) {
    req.session = {};
  }

  // Générer un token unique si pas déjà présent
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  // Ajouter le token aux locals pour l'utiliser dans les templates
  res.locals.csrfToken = req.session.csrfToken;

  next();
};

/**
 * Vérifie le token CSRF pour les formulaires HTML
 */
export const verifyCsrfToken = (req, res, next) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    logger.warn('CSRF: Token invalide', {
      hasToken: !!token,
      hasSessionToken: !!sessionToken,
      path: req.path
    });

    return res.status(403).json({
      error: 'CSRF token mismatch',
      message: 'Token de sécurité invalide'
    });
  }

  next();
};

export default csrfProtection;
