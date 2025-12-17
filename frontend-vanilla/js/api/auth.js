/**
 * Service d'authentification - WiW AE+
 */

import { api } from './client.js';
import storage from '../utils/storage.js';
import { store } from '../store.js';

class AuthService {
    /**
     * Connexion utilisateur
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async login(email, password) {
        const response = await api.post('/auth/login', {
            email,
            motDePasse: password
        });

        if (response.token) {
            storage.set('token', response.token);
            storage.set('user', response.user);
            store.set('isAuthenticated', true);
            store.set('user', response.user);
        }

        return response;
    }

    /**
     * Inscription utilisateur
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    async register(userData) {
        const response = await api.post('/auth/register', userData);

        if (response.token) {
            storage.set('token', response.token);
            storage.set('user', response.user);
            store.set('isAuthenticated', true);
            store.set('user', response.user);
        }

        return response;
    }

    /**
     * Déconnexion
     */
    logout() {
        storage.remove('token');
        storage.remove('user');
        store.set('isAuthenticated', false);
        store.set('user', null);
        window.location.href = '/login';
    }

    /**
     * Récupère l'utilisateur actuel depuis l'API
     * @returns {Promise<Object>}
     */
    async getCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            storage.set('user', response);
            store.set('user', response);
            return response;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!storage.get('token');
    }

    /**
     * Récupère l'utilisateur stocké localement
     * @returns {Object|null}
     */
    getUser() {
        return storage.get('user');
    }

    /**
     * Récupère le token
     * @returns {string|null}
     */
    getToken() {
        return storage.get('token');
    }

    /**
     * Demande de réinitialisation de mot de passe
     * @param {string} email
     * @returns {Promise<Object>}
     */
    async forgotPassword(email) {
        return api.post('/auth/forgot-password', { email });
    }

    /**
     * Réinitialise le mot de passe
     * @param {string} token
     * @param {string} newPassword
     * @returns {Promise<Object>}
     */
    async resetPassword(token, newPassword) {
        return api.post('/auth/reset-password', {
            token,
            motDePasse: newPassword
        });
    }

    /**
     * Met à jour le profil utilisateur
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    async updateProfile(userData) {
        const response = await api.put('/auth/profile', userData);
        storage.set('user', response);
        store.set('user', response);
        return response;
    }

    /**
     * Change le mot de passe
     * @param {string} currentPassword
     * @param {string} newPassword
     * @returns {Promise<Object>}
     */
    async changePassword(currentPassword, newPassword) {
        return api.put('/auth/password', {
            currentPassword,
            newPassword
        });
    }

    /**
     * Initialise l'état d'authentification au démarrage
     */
    initAuth() {
        const token = this.getToken();
        const user = this.getUser();

        if (token && user) {
            store.set('isAuthenticated', true);
            store.set('user', user);
            return true;
        }

        store.set('isAuthenticated', false);
        store.set('user', null);
        return false;
    }
}

// Instance singleton
export const authService = new AuthService();

export default authService;
