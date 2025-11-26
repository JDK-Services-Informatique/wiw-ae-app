import express from 'express';
import { getAll, getById, create, update, remove } from '../controllers/projets.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.use(authenticate);

// GET /api/projets - Liste tous les projets
router.get('/', getAll);

// GET /api/projets/:id - Détail d'un projet
router.get('/:id', getById);

// POST /api/projets - Créer un projet
router.post('/', create);

// PUT /api/projets/:id - Modifier un projet
router.put('/:id', update);

// DELETE /api/projets/:id - Supprimer un projet
router.delete('/:id', remove);

export default router;