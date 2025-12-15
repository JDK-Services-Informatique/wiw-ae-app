/**
 * Système d'internationalisation - WiW AE+
 * i18n simple et léger
 */

import storage from '../utils/storage.js';

class I18n {
    constructor() {
        this.locale = 'fr';
        this.fallbackLocale = 'fr';
        this.translations = {};
        this.listeners = new Set();
    }

    /**
     * Initialise i18n avec les traductions
     * @param {Object} options
     */
    async init(options = {}) {
        const {
            locale = storage.get('locale', 'fr'),
            fallbackLocale = 'fr',
            translations = {}
        } = options;

        this.fallbackLocale = fallbackLocale;
        this.translations = translations;

        // Détecte la langue du navigateur si pas de locale stockée
        if (!storage.has('locale')) {
            const browserLocale = navigator.language.split('-')[0];
            if (this.translations[browserLocale]) {
                this.locale = browserLocale;
            } else {
                this.locale = fallbackLocale;
            }
        } else {
            this.locale = locale;
        }

        storage.set('locale', this.locale);
        document.documentElement.lang = this.locale;

        return this;
    }

    /**
     * Charge les traductions pour une locale
     * @param {string} locale
     * @param {Object} translations
     */
    addTranslations(locale, translations) {
        this.translations[locale] = {
            ...(this.translations[locale] || {}),
            ...translations
        };
    }

    /**
     * Change la locale
     * @param {string} locale
     */
    setLocale(locale) {
        if (!this.translations[locale]) {
            console.warn(`Locale '${locale}' non disponible`);
            return;
        }

        this.locale = locale;
        storage.set('locale', locale);
        document.documentElement.lang = locale;

        // Notifie les listeners
        this.listeners.forEach(callback => callback(locale));
    }

    /**
     * Récupère la locale actuelle
     * @returns {string}
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Récupère les locales disponibles
     * @returns {string[]}
     */
    getAvailableLocales() {
        return Object.keys(this.translations);
    }

    /**
     * Traduit une clé
     * @param {string} key - Clé de traduction (ex: 'common.save')
     * @param {Object} params - Paramètres de substitution
     * @returns {string}
     */
    t(key, params = {}) {
        // Cherche dans la locale actuelle
        let value = this.getNestedValue(this.translations[this.locale], key);

        // Fallback vers la locale par défaut
        if (value === undefined && this.locale !== this.fallbackLocale) {
            value = this.getNestedValue(this.translations[this.fallbackLocale], key);
        }

        // Si toujours pas trouvé, retourne la clé
        if (value === undefined) {
            console.warn(`Traduction manquante: ${key}`);
            return key;
        }

        // Substitution des paramètres
        return this.interpolate(value, params);
    }

    /**
     * Alias pour t()
     */
    translate(key, params) {
        return this.t(key, params);
    }

    /**
     * Récupère une valeur imbriquée d'un objet
     * @param {Object} obj
     * @param {string} path
     * @returns {*}
     */
    getNestedValue(obj, path) {
        if (!obj) return undefined;

        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value === null || value === undefined || typeof value !== 'object') {
                return undefined;
            }
            value = value[key];
        }

        return value;
    }

    /**
     * Interpole les paramètres dans une chaîne
     * @param {string} str
     * @param {Object} params
     * @returns {string}
     */
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Pluralisation simple
     * @param {string} key
     * @param {number} count
     * @param {Object} params
     * @returns {string}
     */
    plural(key, count, params = {}) {
        const pluralKey = count <= 1 ? `${key}_one` : `${key}_other`;
        return this.t(pluralKey, { ...params, count });
    }

    /**
     * Souscrit aux changements de locale
     * @param {Function} callback
     * @returns {Function} Fonction pour se désabonner
     */
    onLocaleChange(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Vérifie si une clé existe
     * @param {string} key
     * @returns {boolean}
     */
    exists(key) {
        return this.getNestedValue(this.translations[this.locale], key) !== undefined;
    }
}

// Instance singleton
export const i18n = new I18n();

// Fonction helper globale
export function t(key, params) {
    return i18n.t(key, params);
}

export default i18n;
