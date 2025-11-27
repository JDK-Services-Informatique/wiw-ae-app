import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

class EquipeAPI {
  async getAll() {
    try {
      const response = await axios.get(`${API_BASE_URL}/equipe`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'équipe', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async create(membreData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/equipe`, membreData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du membre', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async update(id, membreData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/equipe/${id}`, membreData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du membre', {
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
      await axios.delete(`${API_BASE_URL}/equipe/${id}`);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du membre', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Rôles disponibles
  getRoles() {
    return [
      'Architecte Senior',
      'Architecte Junior',
      'Ingénieur',
      'Designer',
      'BET',
      'Assistant',
      'Administratif',
      'Autre'
    ];
  }

  // Statistiques de l'équipe
  getStats(equipe) {
    const stats = {
      total: equipe.length,
      parRole: {},
      avecEmail: equipe.filter(m => m.email).length,
      avecTelephone: equipe.filter(m => m.telephone).length
    };

    equipe.forEach(membre => {
      stats.parRole[membre.role] = (stats.parRole[membre.role] || 0) + 1;
    });

    return stats;
  }
}

export default new EquipeAPI();