import express from 'express';
import {
  validatePourcentages,
  validateRatio,
  validateMontantsHeuresRoute,
  validateTranchesRoute,
  validateEquipeRoute,
  validateAO
} from '../controllers/validation.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Validations spécifiques
router.post('/pourcentages-montants', validatePourcentages);
router.post('/ratio-euros-m2', validateRatio);
router.post('/montants-heures', validateMontantsHeuresRoute);
router.post('/tranches', validateTranchesRoute);
router.post('/equipe', validateEquipeRoute);

// Validation globale
router.get('/ao/:id', validateAO);

export default router;

