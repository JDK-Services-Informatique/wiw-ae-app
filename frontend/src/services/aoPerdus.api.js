import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * API pour la gestion des AO perdus et analyses post-mortem
 */
class AOPerdusAPI {
  /**
   * Marquer un AO comme perdu avec analyse post-mortem
   */
  async marquerPerdu(aoId, analyseData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/appels/${aoId}/marquer-perdu`,
        analyseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur marquage AO perdu:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les AO perdus
   */
  async getAOPerdus() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/appels/perdus`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur récupération AO perdus:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des AO perdus
   */
  async getStatistiques() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/appels/perdus/statistiques`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }

  /**
   * Archiver un AO perdu
   */
  async archiver(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/appels/${aoId}/archiver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur archivage AO:', error);
      throw error;
    }
  }
}

export default new AOPerdusAPI();

