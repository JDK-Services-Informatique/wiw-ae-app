import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

/**
 * API pour la gestion des listes déroulantes
 */
class ListesDeroulantesAPI {
  /**
   * Récupérer toutes les listes déroulantes
   */
  async getAll() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/listes-deroulantes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des listes:', error);
      throw error;
    }
  }

  /**
   * Récupérer une liste par nom
   */
  async getByNom(nom) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/listes-deroulantes/${nom}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la liste:', error);
      // Retourner null si la liste n'existe pas (pas d'erreur)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Créer une nouvelle liste (admin uniquement)
   */
  async create(listeData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/listes-deroulantes`,
        listeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de la liste:', error);
      throw error;
    }
  }

  /**
   * Modifier une liste (admin uniquement)
   */
  async update(id, listeData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/listes-deroulantes/${id}`,
        listeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la modification de la liste:', error);
      throw error;
    }
  }

  /**
   * Supprimer une liste (admin uniquement)
   */
  async delete(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/listes-deroulantes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la liste:', error);
      throw error;
    }
  }

  /**
   * Initialiser les listes par défaut (admin uniquement)
   */
  async initialize() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/listes-deroulantes/initialize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation des listes:', error);
      throw error;
    }
  }
}

export default new ListesDeroulantesAPI();

