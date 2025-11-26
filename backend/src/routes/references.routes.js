import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateReferenceData, checkPlanLimits } from '../middlewares/validation.middleware.js';
import {
  createReferenceController,
  getReferencesController,
  updateReferenceController,
  deleteReferenceController
} from '../controllers/references.controller.js';

const router = express.Router();

// Toutes les routes références nécessitent une authentification
router.use(authenticate);

// GET /api/references - Récupérer toutes les références de l'utilisateur
router.get('/', getReferencesController);

// POST /api/references - Créer une nouvelle référence
router.post('/', checkPlanLimits, validateReferenceData, createReferenceController);

// PUT /api/references/:id - Mettre à jour une référence
router.put('/:id', validateReferenceData, updateReferenceController);

// DELETE /api/references/:id - Supprimer une référence
router.delete('/:id', deleteReferenceController);

export default router;