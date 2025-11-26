import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ReferencesAPI {
  async getAll() {
    try {
      const response = await axios.get(`${API_BASE_URL}/references`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des références', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async create(referenceData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/references`, referenceData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création de la référence', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async update(id, referenceData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/references/${id}`, referenceData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la référence', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_BASE_URL}/references/${id}`);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la référence', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Méthodes utilitaires pour la recherche et le filtrage
  filterByCategory(references, category) {
    if (!category) return references;
    return references.filter(ref => ref.categorie === category);
  }

  filterByDesignation(references, searchTerm) {
    if (!searchTerm) return references;
    const term = searchTerm.toLowerCase();
    return references.filter(ref =>
      ref.designation.toLowerCase().includes(term) ||
      (ref.description && ref.description.toLowerCase().includes(term))
    );
  }

  filterByTags(references, tags) {
    if (!tags || tags.length === 0) return references;
    return references.filter(ref => {
      if (!ref.tags) return false;
      const refTags = JSON.parse(ref.tags);
      return tags.some(tag => refTags.includes(tag));
    });
  }

  // Catégories disponibles
  getCategories() {
    return [
      'Études',
      'Missions',
      'Justifications',
      'Travaux',
      'Fournitures',
      'Déplacements',
      'Frais divers',
      'Autre'
    ];
  }

  // Unités disponibles
  getUnites() {
    return ['h', 'u', 'j', 'm²', 'ml', 'kg', 'l', 'ff'];
  }
}

export default new ReferencesAPI();