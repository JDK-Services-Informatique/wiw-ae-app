import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * API pour la gestion des templates d'équipe
 */
class TeamTemplateAPI {
  /**
   * Créer un nouveau template d'équipe
   * @param {object} templateData - Données du template
   * @returns {Promise<object>} - Template créé
   */
  async createTemplate(templateData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/team-templates`,
        templateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création du template d\'équipe:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les templates d'équipe
   * @returns {Promise<Array>} - Liste des templates
   */
  async getTemplates() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/team-templates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des templates d\'équipe:', error);
      throw error;
    }
  }

  /**
   * Récupérer un template spécifique
   * @param {number} templateId - ID du template
   * @returns {Promise<object>} - Template
   */
  async getTemplate(templateId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/team-templates/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération du template d\'équipe:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un template d'équipe
   * @param {number} templateId - ID du template
   * @param {object} updateData - Données à mettre à jour
   * @returns {Promise<object>} - Template mis à jour
   */
  async updateTemplate(templateId, updateData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/team-templates/${templateId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du template d\'équipe:', error);
      throw error;
    }
  }

  /**
   * Supprimer un template d'équipe
   * @param {number} templateId - ID du template à supprimer
   * @returns {Promise<void>}
   */
  async deleteTemplate(templateId) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/team-templates/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      logger.error('Erreur lors de la suppression du template d\'équipe:', error);
      throw error;
    }
  }

  /**
   * Appliquer un template à un projet
   * @param {number} templateId - ID du template
   * @param {number} projetId - ID du projet
   * @returns {Promise<object>} - Équipe créée
   */
  async applyTemplate(templateId, projetId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/team-templates/${templateId}/apply`,
        { projetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'application du template d\'équipe:', error);
      throw error;
    }
  }
}

export default new TeamTemplateAPI();