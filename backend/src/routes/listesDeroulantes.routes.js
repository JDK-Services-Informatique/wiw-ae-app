import express from 'express';
import {
  getAll,
  getByNom,
  create,
  update,
  remove,
  initialize
} from '../controllers/listesDeroulantes.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes publiques (lecture)
router.get('/', getAll);
router.get('/:nom', getByNom);

// Routes admin (écriture)
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/initialize', initialize);

export default router;

