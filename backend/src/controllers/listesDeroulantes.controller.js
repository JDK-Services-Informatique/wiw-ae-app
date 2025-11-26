import {
  getAllListes,
  getListeByNom,
  createListe,
  updateListe,
  deleteListe,
  initializeDefaultListes
} from '../services/listesDeroulantes.service.js';
import logger from '../utils/logger.js';

/**
 * GET /api/listes-deroulantes
 * Récupérer toutes les listes déroulantes
 */
export const getAll = async (req, res) => {
  try {
    const listes = await getAllListes();
    res.json(listes);
  } catch (error) {
    logger.error('Erreur lors de la récupération des listes', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/listes-deroulantes/:nom
 * Récupérer une liste par nom
 */
export const getByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const liste = await getListeByNom(nom);
    
    if (!liste) {
      return res.status(404).json({ message: 'Liste non trouvée' });
    }
    
    res.json(liste);
  } catch (error) {
    logger.error('Erreur lors de la récupération de la liste', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/listes-deroulantes
 * Créer une nouvelle liste (admin uniquement)
 */
export const create = async (req, res) => {
  try {
    // Vérifier les droits admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    const liste = await createListe(req.body, req.user.id);
    res.status(201).json(liste);
  } catch (error) {
    logger.error('Erreur lors de la création de la liste', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /api/listes-deroulantes/:id
 * Modifier une liste (admin uniquement)
 */
export const update = async (req, res) => {
  try {
    // Vérifier les droits admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const liste = await updateListe(parseInt(id), req.body);
    res.json(liste);
  } catch (error) {
    logger.error('Erreur lors de la modification de la liste', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /api/listes-deroulantes/:id
 * Supprimer une liste (admin uniquement)
 */
export const remove = async (req, res) => {
  try {
    // Vérifier les droits admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    await deleteListe(parseInt(id));
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression de la liste', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/listes-deroulantes/initialize
 * Initialiser les listes par défaut (admin uniquement)
 */
export const initialize = async (req, res) => {
  try {
    // Vérifier les droits admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    const listes = await initializeDefaultListes(req.user.id);
    res.json({ message: 'Listes initialisées', listes });
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation des listes', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

