import express from 'express';
import {
  getAOInheritance,
  getMissionInheritance,
  createMissionInherited,
  createHonorairesInherited,
  validateInheritanceRoute
} from '../controllers/inheritance.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Récupérer l'héritage d'un AO
router.get('/ao/:id', getAOInheritance);

// Récupérer l'héritage d'une mission
router.get('/mission/:id', getMissionInheritance);

// Créer une mission avec héritage
router.post('/mission', createMissionInherited);

// Créer des honoraires avec héritage
router.post('/honoraires', createHonorairesInherited);

// Valider la cohérence de l'héritage
router.get('/validate/:aoId/:missionId?', validateInheritanceRoute);

export default router;

