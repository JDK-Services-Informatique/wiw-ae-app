import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API_BASE_URL = API_URL;

class DevisAPI {
  async getTotaux(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/devis/${id}/totaux`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des totaux du devis', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
  async getAll() {
    try {
      const response = await axios.get(`${API_BASE_URL}/devis`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des devis', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/devis/${id}`);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la récupération du devis', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async create(devisData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/devis`, devisData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la création du devis', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async update(id, devisData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/devis/${id}`, devisData);
      return response.data;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du devis', {
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
      await axios.delete(`${API_BASE_URL}/devis/${id}`);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du devis', {
        id,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Méthodes utilitaires pour le calcul des montants
  calculateLigneAmount(ligne) {
    const montantBrut = ligne.puHT * ligne.quantite;
    const montantRemise = montantBrut * (1 - ligne.remise / 100);
    return montantRemise;
  }

  calculateChapitreTotal(lignes) {
    return lignes.reduce((total, ligne) => total + this.calculateLigneAmount(ligne), 0);
  }

  calculateDevisTotal(lignes, rabais = 0, rabaisType = 'pourcentage') {
    const totalHT = lignes.reduce((total, ligne) => total + this.calculateLigneAmount(ligne), 0);

    let totalApresRabais = totalHT;
    if (rabaisType === 'pourcentage') {
      totalApresRabais = totalHT * (1 - rabais / 100);
    } else {
      totalApresRabais = totalHT - rabais;
    }

    return {
      totalHT,
      totalApresRabais,
      rabaisMontant: totalHT - totalApresRabais
    };
  }

  calculateSommeHeures(lignes) {
    return lignes
      .filter(ligne => ligne.unite === 'h')
      .reduce((total, ligne) => total + parseFloat(ligne.quantite || 0), 0);
  }
}

export default new DevisAPI();