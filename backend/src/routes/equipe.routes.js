import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateEquipeData, checkPlanLimits } from '../middlewares/validation.middleware.js';
import { createEquipe, getEquipe, updateEquipe, deleteEquipe } from '../services/equipe.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Toutes les routes équipe nécessitent une authentification
router.use(authenticate);

// GET /api/equipe - Récupérer toute l'équipe de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const equipe = await getEquipe(req.user.id);
    res.json(equipe);
  } catch (error) {
    logger.error("Erreur lors de la récupération de l'équipe", { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/equipe - Ajouter un membre à l'équipe
router.post('/', checkPlanLimits, validateEquipeData, async (req, res) => {
  try {
    const membreData = { ...req.body, utilisateurId: req.user.id };
    const membre = await createEquipe(membreData);
    res.status(201).json(membre);
  } catch (error) {
    logger.error("Erreur lors de l'ajout du membre", { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/equipe/:id - Mettre à jour un membre
router.put('/:id', validateEquipeData, async (req, res) => {
  try {
    const membre = await updateEquipe(req.params.id, req.body, req.user.id);
    if (!membre) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.json(membre);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du membre', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/equipe/:id - Supprimer un membre
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteEquipe(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression du membre', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;