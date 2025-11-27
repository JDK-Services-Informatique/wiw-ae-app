import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

/**
 * API pour la gestion des Appels d'Offres (AO)
 */
class AOAPI {
  /**
   * Créer un nouvel AO
   * @param {object} aoData - Données de l'AO
   * @returns {Promise<object>} - AO créé
   */
  async createAO(aoData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/ao`,
        aoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les AO
   * @param {object} filters - Filtres optionnels
   * @returns {Promise<Array>} - Liste des AO
   */
  async getAOs(filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/ao`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des AO:', error);
      throw error;
    }
  }

  /**
   * Récupérer un AO spécifique
   * @param {string} aoId - ID de l'AO
   * @returns {Promise<object>} - AO
   */
  async getAO(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/ao/${aoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un AO
   * @param {string} aoId - ID de l'AO
   * @param {object} aoData - Données mises à jour
   * @returns {Promise<object>} - AO mis à jour
   */
  async updateAO(aoId, aoData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/ao/${aoId}`,
        aoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Supprimer un AO
   * @param {string} aoId - ID de l'AO
   * @returns {Promise<void>}
   */
  async deleteAO(aoId) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/ao/${aoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Dupliquer un AO
   * @param {string} aoId - ID de l'AO à dupliquer
   * @returns {Promise<object>} - Nouveau AO
   */
  async duplicateAO(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/ao/${aoId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la duplication de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Générer les annexes AE pour un AO
   * @param {string} aoId - ID de l'AO
   * @returns {Promise<object>} - Données des annexes
   */
  async generateAnnexesAE(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/ao/${aoId}/annexes-ae`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la génération des annexes AE:', error);
      throw error;
    }
  }

  /**
   * Exporter un AO (PDF, Excel, etc.)
   * @param {string} aoId - ID de l'AO
   * @param {string} format - Format d'export ('pdf', 'excel', 'word')
   * @returns {Promise<Blob>} - Fichier exporté
   */
  async exportAO(aoId, format = 'pdf') {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/ao/${aoId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { format },
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'export de l\'AO:', error);
      throw error;
    }
  }

  /**
   * Changer le statut d'un AO
   * @param {string} aoId - ID de l'AO
   * @param {string} statut - Nouveau statut
   * @returns {Promise<object>} - AO mis à jour
   */
  async changeStatut(aoId, statut) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/ao/${aoId}/statut`,
        { statut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors du changement de statut:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des AO
   * @param {object} filters - Filtres pour les statistiques
   * @returns {Promise<object>} - Statistiques
   */
  async getAOStats(filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/ao/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques AO:', error);
      throw error;
    }
  }
}

export default new AOAPI();