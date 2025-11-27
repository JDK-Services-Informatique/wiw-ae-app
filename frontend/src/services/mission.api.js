import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

/**
 * API pour la gestion des missions
 */
class MissionAPI {
  /**
   * Récupérer toutes les missions
   * @param {object} filters - Filtres optionnels
   * @returns {Promise<Array>} - Liste des missions
   */
  async getMissions(filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/missions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des missions:', error);
      throw error;
    }
  }

  /**
   * Récupérer une mission spécifique
   * @param {string} missionId - ID de la mission
   * @returns {Promise<object>} - Mission
   */
  async getMission(missionId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/missions/${missionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la mission:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle mission
   * @param {object} missionData - Données de la mission
   * @returns {Promise<object>} - Mission créée
   */
  async createMission(missionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/missions`,
        missionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de la mission:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une mission
   * @param {string} missionId - ID de la mission
   * @param {object} missionData - Données mises à jour
   * @returns {Promise<object>} - Mission mise à jour
   */
  async updateMission(missionId, missionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/missions/${missionId}`,
        missionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la mission:', error);
      throw error;
    }
  }

  /**
   * Supprimer une mission
   * @param {string} missionId - ID de la mission
   * @returns {Promise<void>}
   */
  async deleteMission(missionId) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/missions/${missionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      logger.error('Erreur lors de la suppression de la mission:', error);
      throw error;
    }
  }

  /**
   * Récupérer les missions par type
   * @param {string} type - Type de mission ('Base', 'Additionnelle', 'Complémentaire', 'Optionnelle')
   * @returns {Promise<Array>} - Missions du type spécifié
   */
  async getMissionsByType(type) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/missions/type/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des missions par type:', error);
      throw error;
    }
  }

  /**
   * Dupliquer une mission
   * @param {string} missionId - ID de la mission à dupliquer
   * @returns {Promise<object>} - Nouvelle mission
   */
  async duplicateMission(missionId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/missions/${missionId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la duplication de la mission:', error);
      throw error;
    }
  }

  /**
   * Calculer les honoraires pour une mission
   * @param {string} missionId - ID de la mission
   * @param {object} params - Paramètres de calcul
   * @returns {Promise<object>} - Résultat du calcul
   */
  async calculateHonoraires(missionId, params = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/missions/${missionId}/calculate-honoraires`,
        params,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors du calcul des honoraires:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des missions
   * @param {object} filters - Filtres pour les statistiques
   * @returns {Promise<object>} - Statistiques
   */
  async getMissionStats(filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/missions/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques missions:', error);
      throw error;
    }
  }

  /**
   * Importer des missions depuis un fichier
   * @param {FormData} formData - Données du fichier
   * @returns {Promise<object>} - Résultat de l'import
   */
  async importMissions(formData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/missions/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'import des missions:', error);
      throw error;
    }
  }

  /**
   * Exporter les missions
   * @param {string} format - Format d'export ('csv', 'excel', 'json')
   * @param {object} filters - Filtres d'export
   * @returns {Promise<Blob>} - Fichier exporté
   */
  async exportMissions(format = 'csv', filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/missions/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { format, ...filters },
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'export des missions:', error);
      throw error;
    }
  }
}

export default new MissionAPI();