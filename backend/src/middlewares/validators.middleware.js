import { body, param, query, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Middleware pour gérer les erreurs de validation
 * À utiliser après les règles de validation
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    logger.warn('Erreurs de validation', {
      path: req.path,
      method: req.method,
      errors: errorMessages
    });

    return res.status(400).json({
      message: 'Erreurs de validation',
      errors: errorMessages
    });
  }

  next();
};

/**
 * Validateurs pour l'authentification
 */
export const validateRegister = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Le nom contient des caractères invalides'),

  body('prenom')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Le prénom contient des caractères invalides'),

  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Format d\'email invalide')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('L\'email est trop long'),

  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 8, max: 128 }).withMessage('Le mot de passe doit contenir entre 8 et 128 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),

  body('role')
    .optional()
    .isIn(['USER', 'ADMIN', 'CHEF_PROJET', 'ASSISTANT']).withMessage('Rôle invalide'),

  body('plan')
    .optional()
    .isIn(['GRATUIT', 'STARTER', 'PREMIUM', 'ENTERPRISE']).withMessage('Plan invalide'),

  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Format d\'email invalide')
    .normalizeEmail(),

  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isString().withMessage('Le mot de passe doit être une chaîne de caractères'),

  handleValidationErrors
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Format d\'email invalide')
    .normalizeEmail(),

  handleValidationErrors
];

export const validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Le token est obligatoire')
    .isString().withMessage('Le token doit être une chaîne de caractères')
    .isLength({ min: 32, max: 128 }).withMessage('Token invalide'),

  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est obligatoire')
    .isLength({ min: 8, max: 128 }).withMessage('Le mot de passe doit contenir entre 8 et 128 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),

  handleValidationErrors
];

/**
 * Validateurs pour les projets
 */
export const validateCreateProjet = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom du projet est obligatoire')
    .isLength({ min: 3, max: 200 }).withMessage('Le nom doit contenir entre 3 et 200 caractères'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description est trop longue (max 2000 caractères)'),

  body('client')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le nom du client est trop long'),

  body('budget')
    .optional()
    .isFloat({ min: 0 }).withMessage('Le budget doit être un nombre positif')
    .toFloat(),

  body('dateDebut')
    .optional()
    .isISO8601().withMessage('Date de début invalide')
    .toDate(),

  body('dateFin')
    .optional()
    .isISO8601().withMessage('Date de fin invalide')
    .toDate(),

  handleValidationErrors
];

export const validateUpdateProjet = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de projet invalide')
    .toInt(),

  body('nom')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Le nom doit contenir entre 3 et 200 caractères'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description est trop longue'),

  body('budget')
    .optional()
    .isFloat({ min: 0 }).withMessage('Le budget doit être un nombre positif')
    .toFloat(),

  handleValidationErrors
];

/**
 * Validateurs pour les devis
 */
export const validateCreateDevis = [
  body('projetId')
    .notEmpty().withMessage('L\'ID du projet est obligatoire')
    .isInt({ min: 1 }).withMessage('ID de projet invalide')
    .toInt(),

  body('montant')
    .notEmpty().withMessage('Le montant est obligatoire')
    .isFloat({ min: 0 }).withMessage('Le montant doit être un nombre positif')
    .toFloat(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description est trop longue'),

  body('validiteJours')
    .optional()
    .isInt({ min: 1, max: 365 }).withMessage('La validité doit être entre 1 et 365 jours')
    .toInt(),

  handleValidationErrors
];

/**
 * Validateurs génériques
 */
export const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID invalide')
    .toInt(),

  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Le numéro de page doit être un entier positif')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100')
    .toInt(),

  handleValidationErrors
];

/**
 * Sanitizer personnalisé pour les champs HTML (si nécessaire)
 * Utilise une whitelist de tags HTML autorisés
 */
export const sanitizeHTML = (allowedTags = []) => {
  return body('*')
    .customSanitizer((value) => {
      if (typeof value !== 'string') return value;

      // Supprimer tous les scripts
      value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // Supprimer les event handlers (onclick, onload, etc.)
      value = value.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

      // Si aucun tag autorisé, supprimer tout le HTML
      if (allowedTags.length === 0) {
        value = value.replace(/<[^>]*>/g, '');
      }

      return value;
    });
};
