/**
 * Client API vanilla JS basé sur fetch
 * Remplace axios pour une solution sans dépendances
 */

import { API_URL } from '../config';
import storage, { STORAGE_KEYS } from '../utils/storage';

// ============================================================================
// CLIENT HTTP
// ============================================================================

class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = 30000;
  }

  /**
   * Exécute une requête HTTP
   */
  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = storage.get(STORAGE_KEYS.TOKEN);

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    // Timeout avec AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Gestion 401 - Redirection login
      if (response.status === 401) {
        storage.clearSession();
        window.location.href = '/login';
        throw new Error('Non authentifié');
      }

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Réponse vide (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Requête timeout');
      }

      throw error;
    }
  }

  get(endpoint, options) {
    return this.request('GET', endpoint, null, options);
  }

  post(endpoint, data, options) {
    return this.request('POST', endpoint, data, options);
  }

  put(endpoint, data, options) {
    return this.request('PUT', endpoint, data, options);
  }

  delete(endpoint, options) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Upload de fichier
   */
  async upload(endpoint, file, type = 'document') {
    const url = `${this.baseURL}${endpoint}`;
    const token = storage.get(STORAGE_KEYS.TOKEN);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload échoué: ${response.status}`);
    }

    return response.json();
  }
}

// Instance principale
export const http = new HttpClient(API_URL);

// ============================================================================
// FACTORY CRUD
// ============================================================================

/**
 * Crée un ensemble d'opérations CRUD pour une ressource
 */
export function createCRUDApi(endpoint) {
  return {
    getAll: () => http.get(`/${endpoint}`),
    getById: (id) => http.get(`/${endpoint}/${id}`),
    create: (data) => http.post(`/${endpoint}`, data),
    update: (id, data) => http.put(`/${endpoint}/${id}`, data),
    delete: (id) => http.delete(`/${endpoint}/${id}`)
  };
}

// ============================================================================
// APIs MÉTIER
// ============================================================================

export const devisApi = createCRUDApi('devis');
export const referencesApi = createCRUDApi('references');
export const equipeApi = createCRUDApi('equipe');
export const projetsApi = createCRUDApi('projets');
export const appelsApi = createCRUDApi('appels');
export const teamTemplatesApi = createCRUDApi('team-templates');

// ============================================================================
// APIs SPÉCIALISÉES
// ============================================================================

export const honorairesApi = {
  getAll: () => http.get('/honoraires'),
  calculate: (partenaires) => http.post('/honoraires', partenaires)
};

export const authApi = {
  login: (email, motDePasse) => http.post('/auth/login', { email, motDePasse }),
  register: (userData) => http.post('/auth/register', userData),
  me: () => http.get('/auth/me'),
  resetPassword: (email) => http.post('/auth/reset-password', { email }),
  updatePassword: (token, newPassword) => http.post('/auth/update-password', { token, newPassword })
};

export const listesDeroulantesApi = {
  getAll: () => http.get('/listes-deroulantes'),
  update: (listeName, items) => http.put(`/listes-deroulantes/${listeName}`, { items })
};

export const aoPerdusApi = {
  ...createCRUDApi('ao-perdus'),
  getByAOId: (aoId) => http.get(`/ao-perdus/ao/${aoId}`)
};

export const uploadApi = {
  uploadFile: (file, type = 'document') => http.upload('/upload', file, type),
  uploadImage: (file) => http.upload('/upload', file, 'image')
};

export default http;
