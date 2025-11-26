import logger from '../utils/logger.js';
import {
  createReference,
  getReferences,
  updateReference,
  deleteReference
} from '../services/references.service.js';

// Créer une référence
export async function createReferenceController(req, res) {
  try {
    const referenceData = { ...req.body, utilisateurId: req.user.id };
    const reference = await createReference(referenceData);
    res.status(201).json(reference);
  } catch (error) {
    logger.error('Erreur lors de la création de la référence', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Récupérer toutes les références
export async function getReferencesController(req, res) {
  try {
    const references = await getReferences(req.user.id);
    res.json(references);
  } catch (error) {
    logger.error('Erreur lors de la récupération des références', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Mettre à jour une référence
export async function updateReferenceController(req, res) {
  try {
    const reference = await updateReference(req.params.id, req.body, req.user.id);
    if (!reference) {
      return res.status(404).json({ error: 'Référence non trouvée' });
    }
    res.json(reference);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de la référence', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Supprimer une référence
export async function deleteReferenceController(req, res) {
  try {
    const success = await deleteReference(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Référence non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression de la référence', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
