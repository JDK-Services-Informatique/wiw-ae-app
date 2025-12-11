/**
 * Service API centralisé avec factory CRUD
 * Gère toutes les communications HTTP avec le backend
 */

import axios from 'axios';
import { API_URL } from '../config';
import storage, { STORAGE_KEYS } from '../utils/storage';

// ============================================================================
// CONFIGURATION AXIOS
// ============================================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête - Ajout du token JWT
api.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse - Gestion des erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };

// ============================================================================
// FACTORY CRUD
// ============================================================================

/**
 * Crée un ensemble d'opérations CRUD pour une ressource
 * @param {string} endpoint - Chemin de l'API (ex: 'devis', 'references')
 * @returns {Object} Objet avec méthodes CRUD
 */
function createCRUDApi(endpoint) {
  return {
    getAll: async () => {
      const { data } = await api.get(`/${endpoint}`);
      return data;
    },

    getById: async (id) => {
      const { data } = await api.get(`/${endpoint}/${id}`);
      return data;
    },

    create: async (payload) => {
      const { data } = await api.post(`/${endpoint}`, payload);
      return data;
    },

    update: async (id, payload) => {
      const { data } = await api.put(`/${endpoint}/${id}`, payload);
      return data;
    },

    delete: async (id) => {
      await api.delete(`/${endpoint}/${id}`);
    }
  };
}

// ============================================================================
// APIs MÉTIER
// ============================================================================

// Devis
export const devisApi = createCRUDApi('devis');

// Références
export const referencesApi = createCRUDApi('references');

// Équipe
export const equipeApi = createCRUDApi('equipe');

// Projets
export const projetsApi = createCRUDApi('projets');

// Appels d'offres
export const appelsApi = createCRUDApi('appels');

// ============================================================================
// APIs SPÉCIALISÉES
// ============================================================================

// Honoraires (calculs spécifiques)
export const honorairesApi = {
  getAll: async () => {
    const { data } = await api.get('/honoraires');
    return data;
  },

  calculate: async (partenaires) => {
    const { data } = await api.post('/honoraires', partenaires);
    return data;
  }
};

// Authentification
export const authApi = {
  login: async (email, motDePasse) => {
    const { data } = await api.post('/auth/login', { email, motDePasse });
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  resetPassword: async (email) => {
    const { data } = await api.post('/auth/reset-password', { email });
    return data;
  },

  updatePassword: async (token, newPassword) => {
    const { data } = await api.post('/auth/update-password', { token, newPassword });
    return data;
  }
};

// Listes déroulantes
export const listesDeroulantesApi = {
  getAll: async () => {
    const { data } = await api.get('/listes-deroulantes');
    return data;
  },

  update: async (listeName, items) => {
    const { data } = await api.put(`/listes-deroulantes/${listeName}`, { items });
    return data;
  }
};

// Templates d'équipe
export const teamTemplatesApi = createCRUDApi('team-templates');

// AO Perdus (post-mortem)
export const aoPerdusApi = {
  ...createCRUDApi('ao-perdus'),

  getByAOId: async (aoId) => {
    const { data } = await api.get(`/ao-perdus/ao/${aoId}`);
    return data;
  }
};

// Validation de données
export const validationApi = {
  validateReference: async (referenceData) => {
    const { data } = await api.post('/validation/reference', referenceData);
    return data;
  },

  validateDevis: async (devisData) => {
    const { data } = await api.post('/validation/devis', devisData);
    return data;
  }
};

// Upload de fichiers
export const uploadApi = {
  uploadFile: async (file, type = 'document') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  uploadImage: async (file) => {
    return uploadApi.uploadFile(file, 'image');
  }
};

export default api;
