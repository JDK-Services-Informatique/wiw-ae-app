import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import logger from '../utils/logger.js';
import { createMateriel, getMateriels, updateMateriel, deleteMateriel } from '../services/materiel.service.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const list = await getMateriels(req.user.id);
    res.json(list);
  } catch (error) {
    logger.error('Erreur récupération matériels', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, utilisateurId: req.user.id };
    const created = await createMateriel(data);
    res.status(201).json(created);
  } catch (error) {
    logger.error('Erreur création matériel', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await updateMateriel(req.params.id, req.body, req.user.id);
    if (!updated) return res.status(404).json({ error: 'Matériel non trouvé' });
    res.json(updated);
  } catch (error) {
    logger.error('Erreur mise à jour matériel', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ok = await deleteMateriel(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Matériel non trouvé' });
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur suppression matériel', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
