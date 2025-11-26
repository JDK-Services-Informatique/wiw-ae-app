import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateDevisData, checkPlanLimits } from '../middlewares/validation.middleware.js';
import { createDevis, getDevis, updateDevis, deleteDevis, getAllDevis } from '../services/devis.service.js';
import { calculateTVA, calculateChapitreSousTotal, calculateSommeHeures } from '../utils/devis.utils.js';
import logger from '../utils/logger.js';
const router = express.Router();
// GET /api/devis/:id/totaux - Renvoyer les totaux calculés pour un devis
router.get('/:id/totaux', async (req, res) => {
  try {
    const devis = await getDevis(req.params.id, req.user.id);
    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    // Supposons que devis.lignes contient toutes les lignes du devis
    const lignes = devis.lignes || [];
    const tauxTVA = devis.tauxTVA || 20;
    const rabais = devis.rabais || 0;
    const rabaisType = devis.rabaisType || 'pourcentage';
    const totaux = calculateTVA(lignes, tauxTVA, rabais, rabaisType);
    const sousTotal = calculateChapitreSousTotal(lignes);
    const totalHeures = calculateSommeHeures(lignes);
    res.json({
      ...totaux,
      sousTotal,
      totalHeures
    });
  } catch (error) {
    logger.error('Erreur lors du calcul des totaux du devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Toutes les routes devis nécessitent une authentification
router.use(authenticate);

// GET /api/devis - Récupérer tous les devis de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const devis = await getAllDevis(req.user.id);
    res.json(devis);
  } catch (error) {
    logger.error('Erreur lors de la récupération des devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/devis/:id - Récupérer un devis spécifique
router.get('/:id', async (req, res) => {
  try {
    const devis = await getDevis(req.params.id, req.user.id);
    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    res.json(devis);
  } catch (error) {
    logger.error('Erreur lors de la récupération du devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/devis - Créer un nouveau devis
router.post('/', checkPlanLimits, validateDevisData, async (req, res) => {
  try {
    const devisData = { ...req.body, utilisateurId: req.user.id };
    const devis = await createDevis(devisData);
    res.status(201).json(devis);
  } catch (error) {
    logger.error('Erreur lors de la création du devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/devis/:id - Mettre à jour un devis
router.put('/:id', validateDevisData, async (req, res) => {
  try {
    const devis = await updateDevis(req.params.id, req.body, req.user.id);
    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    res.json(devis);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/devis/:id - Supprimer un devis
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteDevis(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression du devis', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;