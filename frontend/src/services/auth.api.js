import { api } from './api.js';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, motDePasse: password });
      const { token, user } = response.data;

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  },

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  hasAnyRole: (...roles) => {
    const user = authService.getCurrentUser();
    return user && roles.includes(user.role);
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    return authService.hasRole('ADMIN');
  },

  // Vérifier si l'utilisateur est chef de projet
  isChefProjet: () => {
    return authService.hasRole('CHEF_PROJET');
  },

  // Vérifier si l'utilisateur est assistant
  isAssistant: () => {
    return authService.hasRole('ASSISTANT');
  }
};