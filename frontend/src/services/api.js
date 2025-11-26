import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Augmenté à 30 secondes pour les tests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };

// ===== DEVIS =====
export const devisApi = {
  getAll: async () => {
    const response = await api.get('/devis');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/devis/${id}`);
    return response.data;
  },
  
  create: async (devisData) => {
    const response = await api.post('/devis', devisData);
    return response.data;
  },
  
  update: async (id, devisData) => {
    const response = await api.put(`/devis/${id}`, devisData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/devis/${id}`);
  }
};

// ===== REFERENCES =====
export const referencesApi = {
  getAll: async () => {
    const response = await api.get('/references');
    return response.data;
  },
  
  create: async (referenceData) => {
    const response = await api.post('/references', referenceData);
    return response.data;
  },
  
  update: async (id, referenceData) => {
    const response = await api.put(`/references/${id}`, referenceData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/references/${id}`);
  }
};

// ===== EQUIPE =====
export const equipeApi = {
  getAll: async () => {
    const response = await api.get('/equipe');
    return response.data;
  },
  
  create: async (membreData) => {
    const response = await api.post('/equipe', membreData);
    return response.data;
  },
  
  update: async (id, membreData) => {
    const response = await api.put(`/equipe/${id}`, membreData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/equipe/${id}`);
  }
};

// ===== PROJETS =====
export const projetsApi = {
  getAll: async () => {
    const response = await api.get('/projets');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/projets/${id}`);
    return response.data;
  },
  
  create: async (projetData) => {
    const response = await api.post('/projets', projetData);
    return response.data;
  },
  
  update: async (id, projetData) => {
    const response = await api.put(`/projets/${id}`, projetData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/projets/${id}`);
  }
};

// ===== APPELS D'OFFRES =====
export const appelsApi = {
  getAll: async () => {
    const response = await api.get('/appels');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/appels/${id}`);
    return response.data;
  },
  
  create: async (appelData) => {
    const response = await api.post('/appels', appelData);
    return response.data;
  },
  
  update: async (id, appelData) => {
    const response = await api.put(`/appels/${id}`, appelData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/appels/${id}`);
  }
};

// ===== HONORAIRES =====
export const honorairesApi = {
  getAll: async () => {
    const response = await api.get('/honoraires');
    return response.data;
  },
  
  calculate: async (partenaires) => {
    const response = await api.post('/honoraires', partenaires);
    return response.data;
  }
};

// ===== AUTH =====
export const authApi = {
  login: async (email, motDePasse) => {
    const response = await api.post('/auth/login', { email, motDePasse });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default api;
