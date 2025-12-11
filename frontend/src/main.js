/**
 * Point d'entrée principal - Application vanilla JS
 */

import { router } from './core/router';
import { authService } from './core/auth';
import { appStore, actions } from './core/store';
import { initApp } from './app';
import './styles/index.css';

// ============================================================================
// INITIALISATION
// ============================================================================

// Initialiser le thème au démarrage
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
actions.setTheme(savedTheme);

// Initialiser l'authentification
authService.init();

// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

// ============================================================================
// DÉMARRAGE
// ============================================================================

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
