/**
 * Services API - WiW AE+
 * Export centralisé de tous les services API
 */

import { api } from './client.js';

// ===== DEVIS =====
export const devisApi = {
    getAll: () => api.get('/devis'),
    getById: (id) => api.get(`/devis/${id}`),
    create: (data) => api.post('/devis', data),
    update: (id, data) => api.put(`/devis/${id}`, data),
    delete: (id) => api.delete(`/devis/${id}`)
};

// ===== RÉFÉRENCES =====
export const referencesApi = {
    getAll: () => api.get('/references'),
    getById: (id) => api.get(`/references/${id}`),
    create: (data) => api.post('/references', data),
    update: (id, data) => api.put(`/references/${id}`, data),
    delete: (id) => api.delete(`/references/${id}`)
};

// ===== ÉQUIPE =====
export const equipeApi = {
    getAll: () => api.get('/equipe'),
    getById: (id) => api.get(`/equipe/${id}`),
    create: (data) => api.post('/equipe', data),
    update: (id, data) => api.put(`/equipe/${id}`, data),
    delete: (id) => api.delete(`/equipe/${id}`)
};

// ===== PROJETS =====
export const projetsApi = {
    getAll: () => api.get('/projets'),
    getById: (id) => api.get(`/projets/${id}`),
    create: (data) => api.post('/projets', data),
    update: (id, data) => api.put(`/projets/${id}`, data),
    delete: (id) => api.delete(`/projets/${id}`)
};

// ===== APPELS D'OFFRES =====
export const appelsApi = {
    getAll: () => api.get('/appels'),
    getById: (id) => api.get(`/appels/${id}`),
    create: (data) => api.post('/appels', data),
    update: (id, data) => api.put(`/appels/${id}`, data),
    delete: (id) => api.delete(`/appels/${id}`)
};

// ===== HONORAIRES =====
export const honorairesApi = {
    getAll: () => api.get('/honoraires'),
    calculate: (partenaires) => api.post('/honoraires', partenaires)
};

// ===== MISSIONS =====
export const missionsApi = {
    getAll: () => api.get('/missions'),
    getById: (id) => api.get(`/missions/${id}`),
    create: (data) => api.post('/missions', data),
    update: (id, data) => api.put(`/missions/${id}`, data),
    delete: (id) => api.delete(`/missions/${id}`)
};

// ===== TEAM TEMPLATES =====
export const teamTemplateApi = {
    getAll: () => api.get('/teamTemplate'),
    getById: (id) => api.get(`/teamTemplate/${id}`),
    create: (data) => api.post('/teamTemplate', data),
    update: (id, data) => api.put(`/teamTemplate/${id}`, data),
    delete: (id) => api.delete(`/teamTemplate/${id}`)
};

// ===== LISTES DÉROULANTES =====
export const listesApi = {
    getAll: () => api.get('/listes-deroulantes'),
    getByCategorie: (categorie) => api.get(`/listes-deroulantes/${categorie}`),
    create: (data) => api.post('/listes-deroulantes', data),
    update: (id, data) => api.put(`/listes-deroulantes/${id}`, data),
    delete: (id) => api.delete(`/listes-deroulantes/${id}`)
};

// ===== MATÉRIEL =====
export const materielApi = {
    getAll: () => api.get('/materiel'),
    getById: (id) => api.get(`/materiel/${id}`),
    create: (data) => api.post('/materiel', data),
    update: (id, data) => api.put(`/materiel/${id}`, data),
    delete: (id) => api.delete(`/materiel/${id}`)
};

// ===== VALIDATION =====
export const validationApi = {
    validate: (data) => api.post('/validation', data)
};

// ===== SCENARIO VERSIONING =====
export const scenarioApi = {
    getAll: () => api.get('/scenarioVersioning'),
    getById: (id) => api.get(`/scenarioVersioning/${id}`),
    create: (data) => api.post('/scenarioVersioning', data),
    update: (id, data) => api.put(`/scenarioVersioning/${id}`, data),
    delete: (id) => api.delete(`/scenarioVersioning/${id}`)
};

// ===== AO PERDUS =====
export const aoPerdusApi = {
    getAll: () => api.get('/aoPerdus'),
    getById: (id) => api.get(`/aoPerdus/${id}`),
    create: (data) => api.post('/aoPerdus', data)
};

// ===== INHERITANCE =====
export const inheritanceApi = {
    getAll: () => api.get('/inheritance'),
    apply: (data) => api.post('/inheritance/apply', data)
};

// Export par défaut
export { api } from './client.js';
export { authService } from './auth.js';
