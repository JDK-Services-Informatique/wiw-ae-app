/**
 * Gestionnaire de stockage centralisé
 * Gère le localStorage avec sérialisation JSON et gestion d'erreurs
 */

// Clés de stockage standardisées
export const STORAGE_KEYS = {
  // Authentification
  TOKEN: 'token',
  USER: 'user',

  // Données métier
  DEVIS: 'wiw-devis',
  DEVIS_PREFILL: 'wiw-devis-prefill',
  TENDERS: 'wiw-tenders',
  REFERENCES: 'wiw-references',
  EQUIPE: 'wiw-equipe',
  BET: 'wiw-bet',
  COMPANY: 'wiw-company',
  PROJETS: 'wiw-projets',
  HONORAIRES: 'wiw-honoraires',
  MISSIONS: 'wiw-missions',
  TEMPLATES: 'wiw-templates',
  MEDIAS: 'wiw-medias',
  ARTICLES: 'wiw-articles',

  // Paramètres
  THEME: 'wiw-theme',
  SETTINGS: 'wiw-settings',
  PLAN: 'wiw-plan',
  LISTES_DEROULANTES: 'wiw-listes-deroulantes',

  // Temporaires
  AO_PERDUS: 'wiw-ao-perdus',
  DRAFT: 'wiw-draft'
};

/**
 * Récupère une valeur du localStorage avec désérialisation JSON
 * @param {string} key - Clé de stockage
 * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {*} Valeur stockée ou valeur par défaut
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`[Storage] Erreur lecture "${key}":`, error.message);
    return defaultValue;
  }
}

/**
 * Stocke une valeur dans le localStorage avec sérialisation JSON
 * @param {string} key - Clé de stockage
 * @param {*} value - Valeur à stocker
 * @returns {boolean} Succès de l'opération
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Erreur écriture "${key}":`, error.message);

    // Gestion du quota dépassé
    if (error.name === 'QuotaExceededError') {
      console.warn('[Storage] Quota localStorage dépassé');
    }
    return false;
  }
}

/**
 * Supprime une valeur du localStorage
 * @param {string} key - Clé de stockage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage] Erreur suppression "${key}":`, error.message);
  }
}

/**
 * Vérifie si une clé existe dans le localStorage
 * @param {string} key - Clé de stockage
 * @returns {boolean}
 */
export function hasItem(key) {
  return localStorage.getItem(key) !== null;
}

/**
 * Efface toutes les données de l'application
 * Conserve les données non-liées à l'application
 */
export function clearAppData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeItem(key);
  });
}

/**
 * Efface les données de session (token, user)
 */
export function clearSession() {
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.USER);
}

/**
 * Récupère toutes les données de l'application pour export/backup
 * @returns {Object} Objet contenant toutes les données
 */
export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = getItem(key);
    if (value !== null) {
      data[name] = value;
    }
  });
  return data;
}

/**
 * Importe des données dans le localStorage
 * @param {Object} data - Données à importer
 * @param {boolean} merge - Fusionner avec les données existantes
 */
export function importData(data, merge = false) {
  Object.entries(data).forEach(([name, value]) => {
    const key = STORAGE_KEYS[name];
    if (key) {
      if (merge && Array.isArray(value)) {
        const existing = getItem(key, []);
        setItem(key, [...existing, ...value]);
      } else {
        setItem(key, value);
      }
    }
  });
}

// Export par défaut pour compatibilité
const storage = {
  KEYS: STORAGE_KEYS,
  get: getItem,
  set: setItem,
  remove: removeItem,
  has: hasItem,
  clearApp: clearAppData,
  clearSession,
  export: exportAllData,
  import: importData
};

export default storage;
