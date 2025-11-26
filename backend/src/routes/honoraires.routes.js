import express from 'express';
import { getHonoraires } from '../controllers/honoraires.controller.js';
import { verifierAccesPlan } from '../middlewares/plan.middleware.js';

const router = express.Router();

// Demo route: POST /api/honoraires with body { partenaires: [...] }
// Protected: requires at least PREMIUM plan
router.post('/', verifierAccesPlan('PREMIUM'), getHonoraires);

export default router;
