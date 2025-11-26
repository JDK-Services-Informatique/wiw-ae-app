/**
 * Service d'analytics pour intégrer Plausible et Mixpanel
 */

// Configuration
const ANALYTICS_CONFIG = {
  plausible: {
    enabled: import.meta.env.VITE_PLAUSIBLE_ENABLED === 'true',
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'wiw.app'
  },
  mixpanel: {
    enabled: import.meta.env.VITE_MIXPANEL_ENABLED === 'true',
    token: import.meta.env.VITE_MIXPANEL_TOKEN || ''
  }
};

/**
 * Initialise Plausible Analytics
 */
function initPlausible() {
  if (!ANALYTICS_CONFIG.plausible.enabled) {
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = ANALYTICS_CONFIG.plausible.domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

/**
 * Initialise Mixpanel
 */
function initMixpanel() {
  if (!ANALYTICS_CONFIG.mixpanel.enabled || !ANALYTICS_CONFIG.mixpanel.token) {
    return;
  }

  // Charger Mixpanel dynamiquement
  const script = document.createElement('script');
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
  script.onload = () => {
    if (window.mixpanel) {
      window.mixpanel.init(ANALYTICS_CONFIG.mixpanel.token, {
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: 'localStorage'
      });
    }
  };
  document.head.appendChild(script);
}

/**
 * Track un événement avec Plausible
 */
export function trackPlausible(eventName, props = {}) {
  if (!ANALYTICS_CONFIG.plausible.enabled || !window.plausible) {
    return;
  }

  window.plausible(eventName, { props });
}

/**
 * Track un événement avec Mixpanel
 */
export function trackMixpanel(eventName, properties = {}) {
  if (!ANALYTICS_CONFIG.mixpanel.enabled || !window.mixpanel) {
    return;
  }

  window.mixpanel.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track un événement avec tous les providers activés
 */
export function track(eventName, properties = {}) {
  trackPlausible(eventName, properties);
  trackMixpanel(eventName, properties);
}

/**
 * Identifie un utilisateur (Mixpanel uniquement)
 */
export function identify(userId, traits = {}) {
  if (!ANALYTICS_CONFIG.mixpanel.enabled || !window.mixpanel) {
    return;
  }

  window.mixpanel.identify(userId);
  if (Object.keys(traits).length > 0) {
    window.mixpanel.people.set(traits);
  }
}

/**
 * Réinitialise l'identification (Mixpanel uniquement)
 */
export function reset() {
  if (!ANALYTICS_CONFIG.mixpanel.enabled || !window.mixpanel) {
    return;
  }

  window.mixpanel.reset();
}

/**
 * Initialise tous les services d'analytics
 */
export function initAnalytics() {
  initPlausible();
  initMixpanel();
}

// Événements prédéfinis
export const AnalyticsEvents = {
  // Authentification
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',
  
  // Actions utilisateur
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  CREATE_ITEM: 'create_item',
  UPDATE_ITEM: 'update_item',
  DELETE_ITEM: 'delete_item',
  
  // Fonctionnalités spécifiques
  EXPORT_EXCEL: 'export_excel',
  EXPORT_PDF: 'export_pdf',
  SCENARIO_CREATED: 'scenario_created',
  SCENARIO_EXPORTED: 'scenario_exported',
  
  // Erreurs
  ERROR: 'error',
  API_ERROR: 'api_error'
};

