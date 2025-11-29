import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// Rate limiter général pour les endpoints d'authentification
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes par défaut
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 tentatives par défaut pour l'auth
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.',
    retryAfter: 'Voir l\'en-tête Retry-After'
  },
  standardHeaders: true, // Retourne les informations de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Compte toutes les requêtes
  skipFailedRequests: false,
  handler: (req, res) => {
    logger.warn('Rate limit atteint pour authentification', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
      retryAfter: req.rateLimit?.resetTime || 'quelques minutes'
    });
  },
  // Utiliser l'IP comme clé pour le rate limiting
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Rate limiter plus strict pour les tentatives de login échouées
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  skipSuccessfulRequests: true, // Ne compte que les échecs
  message: {
    error: 'Trop de tentatives de connexion échouées. Compte temporairement bloqué.',
    retryAfter: 'Voir l\'en-tête Retry-After'
  },
  handler: (req, res) => {
    logger.warn('Tentatives de login échouées répétées - possible attaque', {
      ip: req.ip,
      email: req.body?.email,
      userAgent: req.headers['user-agent']
    });
    res.status(429).json({
      error: 'Trop de tentatives de connexion échouées. Votre compte est temporairement bloqué pour des raisons de sécurité.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiter pour la réinitialisation de mot de passe
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 tentatives par heure
  message: {
    error: 'Trop de demandes de réinitialisation de mot de passe. Veuillez réessayer plus tard.'
  },
  handler: (req, res) => {
    logger.warn('Tentatives répétées de réinitialisation de mot de passe', {
      ip: req.ip,
      email: req.body?.email
    });
    res.status(429).json({
      error: 'Trop de demandes de réinitialisation de mot de passe. Veuillez réessayer dans une heure.'
    });
  }
});

// Rate limiter général pour l'API (plus permissif)
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requêtes par défaut
  message: {
    error: 'Trop de requêtes. Veuillez ralentir.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit API atteint', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Trop de requêtes. Veuillez ralentir.'
    });
  }
});
