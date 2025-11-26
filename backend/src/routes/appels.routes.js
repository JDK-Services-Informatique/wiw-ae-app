import express from 'express';
import { getAll, getById, create, update, remove } from '../controllers/appels.controller.js';
import { 
  marquerPerdu, 
  getPerdus, 
  getStatistiques, 
  archiver 
} from '../controllers/aoPerdus.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// GET /api/appels - Liste tous les appels d'offres
router.get('/', getAll);

// GET /api/appels/perdus - Liste des AO perdus
router.get('/perdus', getPerdus);

// GET /api/appels/perdus/statistiques - Statistiques des AO perdus
router.get('/perdus/statistiques', getStatistiques);

// GET /api/appels/:id - Détail d'un appel d'offre
router.get('/:id', getById);

// POST /api/appels - Créer un appel d'offre
router.post('/', create);

// PUT /api/appels/:id - Modifier un appel d'offre
router.put('/:id', update);

// POST /api/appels/:id/marquer-perdu - Marquer un AO comme perdu avec analyse
router.post('/:id/marquer-perdu', marquerPerdu);

// POST /api/appels/:id/archiver - Archiver un AO perdu
router.post('/:id/archiver', archiver);

// DELETE /api/appels/:id - Supprimer un appel d'offre
router.delete('/:id', remove);

export default router;