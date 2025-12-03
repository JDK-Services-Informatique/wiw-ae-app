import express from 'express';
import {
  getSponsors,
  getSponsor,
  createSponsor,
  updateSponsor,
  deleteSponsor
} from '../controllers/sponsors.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques (pas d'authentification nécessaire)
router.get('/', getSponsors);
router.get('/:id', getSponsor);

// Routes protégées (authentification requise)
router.post('/', authenticate, createSponsor);
router.put('/:id', authenticate, updateSponsor);
router.delete('/:id', authenticate, deleteSponsor);

export default router;
