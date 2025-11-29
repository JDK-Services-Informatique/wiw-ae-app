
import {
  getAllAppels,
  getAppelById,
  createAppel,
  updateAppel,
  deleteAppel
} from '../services/appels.service.js';

export const getAll = async (req, res) => {
  try {
    const appels = await getAllAppels(req.user.id);
    res.json(appels);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const appel = await getAppelById(req.params.id, req.user.id);
    if (!appel) return res.status(404).json({ error: 'Appel d\'offre non trouvé' });
    res.json(appel);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const appel = await createAppel(req.body, req.user.id);
    res.status(201).json(appel);
  } catch (error) {
    // Gérer spécifiquement les erreurs de validation
    if (error.statusCode === 400 && error.validationErrors) {
      return res.status(400).json({
        error: 'Validation échouée',
        validationErrors: error.validationErrors,
        validationWarnings: error.validationWarnings || []
      });
    }
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const appel = await updateAppel(req.params.id, req.body, req.user.id);
    if (!appel) return res.status(404).json({ error: 'Appel d\'offre non trouvé' });
    res.json(appel);
  } catch (error) {
    // Gérer spécifiquement les erreurs de validation
    if (error.statusCode === 400 && error.validationErrors) {
      return res.status(400).json({
        error: 'Validation échouée',
        validationErrors: error.validationErrors,
        validationWarnings: error.validationWarnings || []
      });
    }
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const success = await deleteAppel(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Appel d\'offre non trouvé' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};