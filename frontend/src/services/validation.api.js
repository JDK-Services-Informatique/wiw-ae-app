import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * API pour les contrôles automatiques de cohérence
 */
class ValidationAPI {
  /**
   * Valider la cohérence des pourcentages et montants
   */
  async validatePourcentagesMontants(missions, montantTravaux) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/validation/pourcentages-montants`,
        { missions, montantTravaux },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation pourcentages:', error);
      throw error;
    }
  }

  /**
   * Valider le ratio €/m²
   */
  async validateRatioEurosM2(montantTravaux, surface, domaine = null) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/validation/ratio-euros-m2`,
        { montantTravaux, surface, domaine },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation ratio:', error);
      throw error;
    }
  }

  /**
   * Valider la cohérence montants vs heures
   */
  async validateMontantsHeures(partenaires, montantTotal) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/validation/montants-heures`,
        { partenaires, montantTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation montants/heures:', error);
      throw error;
    }
  }

  /**
   * Valider la complétude des tranches
   */
  async validateTranches(missions) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/validation/tranches`,
        { missions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation tranches:', error);
      throw error;
    }
  }

  /**
   * Valider la complétude de l'équipe
   */
  async validateEquipe(equipe) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/validation/equipe`,
        { equipe },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation équipe:', error);
      throw error;
    }
  }

  /**
   * Validation globale d'un AO
   */
  async validateAO(aoId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/validation/ao/${aoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur validation AO:', error);
      throw error;
    }
  }
}

export default new ValidationAPI();

