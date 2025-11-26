import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * API pour l'héritage automatique AO → Mission → Honoraires
 */
class InheritanceAPI {
  /**
   * Récupérer les données héritables d'un AO
   * @param {number} aoId - ID de l'appel d'offre
   * @returns {Promise<object>} - Données héritables
   */
  async getAOInheritance(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/inheritance/ao/${aoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'héritage AO:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données héritables d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object>} - Données héritables
   */
  async getMissionInheritance(missionId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/inheritance/mission/${missionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'héritage Mission:', error);
      throw error;
    }
  }

  /**
   * Créer une mission avec héritage depuis un AO
   * @param {number} appelOffreId - ID de l'AO
   * @param {object} missionData - Données de la mission
   * @returns {Promise<object>} - Mission créée
   */
  async createMissionWithInheritance(appelOffreId, missionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/inheritance/mission`,
        { appelOffreId, ...missionData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de mission avec héritage:', error);
      throw error;
    }
  }

  /**
   * Créer des honoraires avec héritage depuis une mission
   * @param {number} missionId - ID de la mission
   * @param {object} honoraireData - Données des honoraires
   * @returns {Promise<object>} - Honoraires créés
   */
  async createHonorairesWithInheritance(missionId, honoraireData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/inheritance/honoraires`,
        { missionId, ...honoraireData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création d\'honoraires avec héritage:', error);
      throw error;
    }
  }

  /**
   * Valider la cohérence de l'héritage
   * @param {number} aoId - ID de l'AO
   * @param {number} missionId - ID de la mission (optionnel)
   * @returns {Promise<object>} - Résultat de la validation
   */
  async validateInheritance(aoId, missionId = null) {
    try {
      const token = localStorage.getItem('token');
      const url = missionId 
        ? `${API_BASE_URL}/inheritance/validate/${aoId}/${missionId}`
        : `${API_BASE_URL}/inheritance/validate/${aoId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la validation de l\'héritage:', error);
      throw error;
    }
  }
}

export default new InheritanceAPI();

