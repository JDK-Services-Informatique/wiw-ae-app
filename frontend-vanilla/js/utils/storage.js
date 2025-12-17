/**
 * Utilitaires de stockage - WiW AE+
 * Gestion du localStorage avec sérialisation JSON
 */

const PREFIX = 'wiw_';

/**
 * Récupère une valeur du localStorage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function get(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(PREFIX + key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error(`Erreur lecture localStorage [${key}]:`, error);
        return defaultValue;
    }
}

/**
 * Stocke une valeur dans le localStorage
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */
export function set(key, value) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Erreur écriture localStorage [${key}]:`, error);
        return false;
    }
}

/**
 * Supprime une valeur du localStorage
 * @param {string} key
 */
export function remove(key) {
    localStorage.removeItem(PREFIX + key);
}

/**
 * Vérifie si une clé existe
 * @param {string} key
 * @returns {boolean}
 */
export function has(key) {
    return localStorage.getItem(PREFIX + key) !== null;
}

/**
 * Récupère toutes les clés de l'application
 * @returns {string[]}
 */
export function keys() {
    return Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .map(key => key.slice(PREFIX.length));
}

/**
 * Vide toutes les données de l'application
 */
export function clear() {
    keys().forEach(key => remove(key));
}

/**
 * Stockage avec expiration
 */
export const expirable = {
    /**
     * Stocke avec une durée de vie
     * @param {string} key
     * @param {*} value
     * @param {number} ttlMs - Durée de vie en millisecondes
     */
    set(key, value, ttlMs) {
        const item = {
            value,
            expiry: Date.now() + ttlMs
        };
        set(key, item);
    },

    /**
     * Récupère si non expiré
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    get(key, defaultValue = null) {
        const item = get(key);
        if (!item) return defaultValue;

        if (Date.now() > item.expiry) {
            remove(key);
            return defaultValue;
        }

        return item.value;
    }
};

/**
 * Stockage de session (sessionStorage)
 */
export const session = {
    get(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(PREFIX + key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    remove(key) {
        sessionStorage.removeItem(PREFIX + key);
    },

    clear() {
        Object.keys(sessionStorage)
            .filter(key => key.startsWith(PREFIX))
            .forEach(key => sessionStorage.removeItem(key));
    }
};

// Export par défaut pour usage simple
export default {
    get,
    set,
    remove,
    has,
    keys,
    clear,
    expirable,
    session
};
