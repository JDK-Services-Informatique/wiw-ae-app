/**
 * Service d'authentification vanilla JS
 */

import storage, { STORAGE_KEYS } from '../utils/storage';
import { authApi } from './api';
import { appStore, actions } from './store';

export const authService = {
  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!storage.get(STORAGE_KEYS.TOKEN);
  },

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser() {
    return storage.get(STORAGE_KEYS.USER);
  },

  /**
   * Connexion
   */
  async login(email, password) {
    const response = await authApi.login(email, password);

    if (response.token) {
      storage.set(STORAGE_KEYS.TOKEN, response.token);
      storage.set(STORAGE_KEYS.USER, response.user);
      actions.login(response.user);
    }

    return response;
  },

  /**
   * Inscription
   */
  async register(userData) {
    const response = await authApi.register(userData);

    if (response.token) {
      storage.set(STORAGE_KEYS.TOKEN, response.token);
      storage.set(STORAGE_KEYS.USER, response.user);
      actions.login(response.user);
    }

    return response;
  },

  /**
   * Déconnexion
   */
  logout() {
    storage.clearSession();
    actions.logout();
  },

  /**
   * Récupère les infos utilisateur depuis le serveur
   */
  async fetchMe() {
    try {
      const user = await authApi.me();
      storage.set(STORAGE_KEYS.USER, user);
      actions.login(user);
      return user;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  /**
   * Demande de réinitialisation de mot de passe
   */
  async requestPasswordReset(email) {
    return authApi.resetPassword(email);
  },

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(token, newPassword) {
    return authApi.updatePassword(token, newPassword);
  },

  /**
   * Initialise l'état d'authentification
   */
  init() {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    const user = storage.get(STORAGE_KEYS.USER);

    if (token && user) {
      actions.login(user);
      return true;
    }

    return false;
  }
};

export default authService;
