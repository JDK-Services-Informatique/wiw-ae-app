import {
  marquerCommePerdu,
  getAOPerdus,
  getStatistiquesAOPerdus,
  archiverAO
} from '../services/aoPerdus.service.js';
import logger from '../utils/logger.js';

/**
 * POST /api/appels/:id/marquer-perdu
 * Marquer un AO comme perdu avec analyse post-mortem
 */
export const marquerPerdu = async (req, res) => {
  try {
    const { id } = req.params;
    const ao = await marquerCommePerdu(parseInt(id), req.body, req.user.id);
    res.json(ao);
  } catch (error) {
    logger.error('Erreur lors du marquage comme perdu', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET /api/appels/perdus
 * Récupérer tous les AO perdus
 */
export const getPerdus = async (req, res) => {
  try {
    const aos = await getAOPerdus(req.user.id);
    res.json(aos);
  } catch (error) {
    logger.error('Erreur lors de la récupération des AO perdus', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/appels/perdus/statistiques
 * Statistiques des AO perdus
 */
export const getStatistiques = async (req, res) => {
  try {
    const stats = await getStatistiquesAOPerdus(req.user.id);
    res.json(stats);
  } catch (error) {
    logger.error('Erreur lors du calcul des statistiques', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/appels/:id/archiver
 * Archiver un AO perdu
 */
export const archiver = async (req, res) => {
  try {
    const { id } = req.params;
    const ao = await archiverAO(parseInt(id), req.user.id);
    res.json(ao);
  } catch (error) {
    logger.error('Erreur lors de l\'archivage', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

