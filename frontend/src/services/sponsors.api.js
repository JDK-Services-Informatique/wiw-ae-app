import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL;

/**
 * API pour la gestion des Sponsors
 */
class SponsorsAPI {
  /**
   * Récupérer tous les sponsors actifs
   * @returns {Promise<Array>} - Liste des sponsors
   */
  async getSponsors() {
    try {
      const response = await axios.get(`${API_BASE_URL}/sponsors`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des sponsors:', error);
      throw error;
    }
  }

  /**
   * Récupérer un sponsor par son ID
   * @param {number} sponsorId - ID du sponsor
   * @returns {Promise<object>} - Sponsor
   */
  async getSponsor(sponsorId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/sponsors/${sponsorId}`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération du sponsor:', error);
      throw error;
    }
  }

  /**
   * Créer un nouveau sponsor (admin uniquement)
   * @param {object} sponsorData - Données du sponsor
   * @returns {Promise<object>} - Sponsor créé
   */
  async createSponsor(sponsorData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/sponsors`,
        sponsorData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création du sponsor:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un sponsor (admin uniquement)
   * @param {number} sponsorId - ID du sponsor
   * @param {object} sponsorData - Données mises à jour
   * @returns {Promise<object>} - Sponsor mis à jour
   */
  async updateSponsor(sponsorId, sponsorData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/sponsors/${sponsorId}`,
        sponsorData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du sponsor:', error);
      throw error;
    }
  }

  /**
   * Supprimer un sponsor (admin uniquement)
   * @param {number} sponsorId - ID du sponsor
   * @returns {Promise<void>}
   */
  async deleteSponsor(sponsorId) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/sponsors/${sponsorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      logger.error('Erreur lors de la suppression du sponsor:', error);
      throw error;
    }
  }
}

// Export singleton
const sponsorsAPI = new SponsorsAPI();
export default sponsorsAPI;
