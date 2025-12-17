/**
 * Client API - WiW AE+
 * Client HTTP basé sur fetch avec intercepteurs
 */

import storage from '../utils/storage.js';
import { store } from '../store.js';

// Configuration
const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:4000/api';
const TIMEOUT = 30000;

/**
 * Classe ApiClient
 * Gestion des requêtes HTTP avec intercepteurs
 */
class ApiClient {
    constructor(baseURL = API_URL) {
        this.baseURL = baseURL;
        this.requestInterceptors = [];
        this.responseInterceptors = [];

        // Intercepteur par défaut pour le token JWT
        this.useRequestInterceptor((config) => {
            const token = storage.get('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });

        // Intercepteur par défaut pour les erreurs 401
        this.useResponseInterceptor(
            (response) => response,
            (error) => {
                if (error.status === 401) {
                    storage.remove('token');
                    storage.remove('user');
                    store.set('isAuthenticated', false);
                    store.set('user', null);
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Ajoute un intercepteur de requête
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    useRequestInterceptor(onFulfilled, onRejected) {
        this.requestInterceptors.push({ onFulfilled, onRejected });
    }

    /**
     * Ajoute un intercepteur de réponse
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    useResponseInterceptor(onFulfilled, onRejected) {
        this.responseInterceptors.push({ onFulfilled, onRejected });
    }

    /**
     * Exécute les intercepteurs de requête
     * @param {Object} config
     * @returns {Promise<Object>}
     */
    async runRequestInterceptors(config) {
        let currentConfig = config;

        for (const interceptor of this.requestInterceptors) {
            try {
                if (interceptor.onFulfilled) {
                    currentConfig = await interceptor.onFulfilled(currentConfig);
                }
            } catch (error) {
                if (interceptor.onRejected) {
                    currentConfig = await interceptor.onRejected(error);
                } else {
                    throw error;
                }
            }
        }

        return currentConfig;
    }

    /**
     * Exécute les intercepteurs de réponse
     * @param {Response} response
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    async runResponseInterceptors(response, data) {
        let currentData = { response, data };

        for (const interceptor of this.responseInterceptors) {
            try {
                if (interceptor.onFulfilled) {
                    currentData = await interceptor.onFulfilled(currentData);
                }
            } catch (error) {
                if (interceptor.onRejected) {
                    currentData = await interceptor.onRejected(error);
                } else {
                    throw error;
                }
            }
        }

        return currentData;
    }

    /**
     * Effectue une requête HTTP
     * @param {string} endpoint
     * @param {Object} options
     * @returns {Promise<*>}
     */
    async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${this.baseURL}${endpoint}`;

        // Configuration par défaut
        let config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };

        // Exécute les intercepteurs de requête
        config = await this.runRequestInterceptors(config);

        // Convertit le body en JSON si nécessaire
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        // Si c'est un FormData, retire le Content-Type pour laisser le navigateur le définir
        if (config.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        // Crée un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout || TIMEOUT);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Parse la réponse
            let data;
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else if (contentType?.includes('text/')) {
                data = await response.text();
            } else {
                data = await response.blob();
            }

            // Vérifie si la réponse est OK
            if (!response.ok) {
                const error = new Error(data.message || data.error || 'Une erreur est survenue');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            // Exécute les intercepteurs de réponse
            const result = await this.runResponseInterceptors(response, data);
            return result.data;

        } catch (error) {
            clearTimeout(timeoutId);

            // Gestion des erreurs réseau et timeout
            if (error.name === 'AbortError') {
                error.message = 'La requête a expiré';
                error.status = 408;
            } else if (!error.status) {
                error.message = 'Erreur de connexion au serveur';
                error.status = 0;
            }

            // Exécute les intercepteurs d'erreur
            for (const interceptor of this.responseInterceptors) {
                if (interceptor.onRejected) {
                    try {
                        await interceptor.onRejected(error);
                    } catch (e) {
                        // Continue avec l'erreur originale
                    }
                }
            }

            throw error;
        }
    }

    /**
     * Requête GET
     * @param {string} endpoint
     * @param {Object} params
     * @param {Object} options
     */
    async get(endpoint, params = {}, options = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { ...options, method: 'GET' });
    }

    /**
     * Requête POST
     * @param {string} endpoint
     * @param {Object} body
     * @param {Object} options
     */
    async post(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * Requête PUT
     * @param {string} endpoint
     * @param {Object} body
     * @param {Object} options
     */
    async put(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * Requête PATCH
     * @param {string} endpoint
     * @param {Object} body
     * @param {Object} options
     */
    async patch(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    }

    /**
     * Requête DELETE
     * @param {string} endpoint
     * @param {Object} options
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Upload de fichier
     * @param {string} endpoint
     * @param {File|FileList} files
     * @param {Object} additionalData
     * @param {Object} options
     */
    async upload(endpoint, files, additionalData = {}, options = {}) {
        const formData = new FormData();

        // Ajoute les fichiers
        if (files instanceof FileList) {
            Array.from(files).forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
        } else if (files instanceof File) {
            formData.append('file', files);
        }

        // Ajoute les données supplémentaires
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });

        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: formData
        });
    }
}

// Instance singleton
export const api = new ApiClient();

// Export la classe pour créer d'autres instances
export default ApiClient;
