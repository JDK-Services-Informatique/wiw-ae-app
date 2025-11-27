import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

/**
 * API pour le versioning des scénarios
 */
class ScenarioVersioningAPI {
  /**
   * Créer une nouvelle version de scénario
   * @param {number} projetId - ID du projet
   * @param {object} scenarioData - Données du scénario
   * @param {string} commentaire - Commentaire optionnel
   * @returns {Promise<object>} - Version créée
   */
  async createVersion(projetId, scenarioData, commentaire = '') {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/scenario-versions`,
        { projetId, scenarioData, commentaire },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de version de scénario:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les versions d'un projet
   * @param {number} projetId - ID du projet
   * @returns {Promise<Array>} - Liste des versions
   */
  async getVersions(projetId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/scenario-versions/project/${projetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des versions de scénario:', error);
      throw error;
    }
  }

  /**
   * Récupérer une version spécifique
   * @param {number} versionId - ID de la version
   * @returns {Promise<object>} - Version avec données
   */
  async getVersion(versionId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/scenario-versions/${versionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la version de scénario:', error);
      throw error;
    }
  }

  /**
   * Restaurer une version précédente
   * @param {number} versionId - ID de la version à restaurer
   * @returns {Promise<object>} - Nouvelle version créée
   */
  async restoreVersion(versionId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/scenario-versions/${versionId}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la restauration de version de scénario:', error);
      throw error;
    }
  }

  /**
   * Comparer deux versions
   * @param {number} versionId1 - ID de la première version
   * @param {number} versionId2 - ID de la deuxième version
   * @returns {Promise<object>} - Comparaison des versions
   */
  async compareVersions(versionId1, versionId2) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/scenario-versions/compare/${versionId1}/${versionId2}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la comparaison des versions de scénario:', error);
      throw error;
    }
  }
}

export default new ScenarioVersioningAPI();