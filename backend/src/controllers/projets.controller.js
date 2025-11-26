import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

import {
  getAllProjets,
  getProjetById,
  createProjet,
  updateProjet,
  deleteProjet
} from '../services/projets.service.js';

export const getAll = async (req, res) => {
  try {
    const projets = await getAllProjets(req.user.id);
    res.json(projets);
  } catch (error) {
    logger.error('Erreur lors de la récupération des projets', { 
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const projet = await getProjetById(req.params.id, req.user.id);
    if (!projet) {
      logger.warn('Projet non trouvé', { projetId: req.params.id, userId: req.user.id });
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json(projet);
  } catch (error) {
    logger.error('Erreur lors de la récupération du projet', { 
      projetId: req.params.id,
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const projet = await createProjet(req.body, req.user.id);
    logger.info('Projet créé', { projetId: projet.id, userId: req.user.id });
    res.status(201).json(projet);
  } catch (error) {
    logger.error('Erreur lors de la création du projet', { 
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const projet = await updateProjet(req.params.id, req.body, req.user.id);
    if (!projet) {
      logger.warn('Projet non trouvé pour mise à jour', { 
        projetId: req.params.id, 
        userId: req.user.id 
      });
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    logger.info('Projet mis à jour', { projetId: projet.id, userId: req.user.id });
    res.json(projet);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du projet', { 
      projetId: req.params.id,
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const success = await deleteProjet(req.params.id, req.user.id);
    if (!success) {
      logger.warn('Projet non trouvé pour suppression', { 
        projetId: req.params.id, 
        userId: req.user.id 
      });
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    logger.info('Projet supprimé', { projetId: req.params.id, userId: req.user.id });
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression du projet', { 
      projetId: req.params.id,
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};