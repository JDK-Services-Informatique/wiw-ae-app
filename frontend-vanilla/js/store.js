/**
 * Store de gestion d'état - WiW AE+
 * Gestionnaire d'état global réactif
 */

import storage from './utils/storage.js';

class Store {
    constructor() {
        this.state = {};
        this.listeners = new Map();
        this.persistKeys = new Set();
    }

    /**
     * Initialise le store avec un état initial
     * @param {Object} initialState
     * @param {Object} options
     */
    init(initialState = {}, options = {}) {
        const { persist = [] } = options;

        // Charge les clés persistées
        persist.forEach(key => {
            this.persistKeys.add(key);
            const saved = storage.get(key);
            if (saved !== null) {
                initialState[key] = saved;
            }
        });

        this.state = this.createReactiveState(initialState);
        return this;
    }

    /**
     * Crée un état réactif avec Proxy
     * @param {Object} target
     * @returns {Proxy}
     */
    createReactiveState(target) {
        const self = this;

        return new Proxy(target, {
            get(obj, prop) {
                return obj[prop];
            },

            set(obj, prop, value) {
                const oldValue = obj[prop];

                // Ne notifie que si la valeur change vraiment
                if (oldValue === value) return true;

                obj[prop] = value;

                // Persiste si nécessaire
                if (self.persistKeys.has(prop)) {
                    storage.set(prop, value);
                }

                // Notifie les listeners
                self.notify(prop, value, oldValue);

                return true;
            },

            deleteProperty(obj, prop) {
                if (prop in obj) {
                    const oldValue = obj[prop];
                    delete obj[prop];

                    if (self.persistKeys.has(prop)) {
                        storage.remove(prop);
                    }

                    self.notify(prop, undefined, oldValue);
                }
                return true;
            }
        });
    }

    /**
     * Récupère une valeur de l'état
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    get(key, defaultValue = null) {
        const keys = key.split('.');
        let value = this.state;

        for (const k of keys) {
            if (value === null || value === undefined) {
                return defaultValue;
            }
            value = value[k];
        }

        return value !== undefined ? value : defaultValue;
    }

    /**
     * Définit une valeur dans l'état
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        const keys = key.split('.');

        if (keys.length === 1) {
            this.state[key] = value;
        } else {
            // Gestion des clés imbriquées
            let obj = this.state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;

            // Notifie pour la clé racine
            this.notify(keys[0], this.state[keys[0]]);
        }
    }

    /**
     * Met à jour partiellement l'état
     * @param {Object} updates
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Supprime une clé de l'état
     * @param {string} key
     */
    remove(key) {
        delete this.state[key];
    }

    /**
     * Souscrit aux changements d'une clé
     * @param {string} key - Clé à observer ('*' pour tout)
     * @param {Function} callback
     * @returns {Function} Fonction pour se désabonner
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // Appelle immédiatement avec la valeur actuelle
        if (key !== '*') {
            callback(this.get(key), undefined);
        }

        // Retourne une fonction pour se désabonner
        return () => {
            this.listeners.get(key)?.delete(callback);
        };
    }

    /**
     * Alias pour subscribe
     */
    watch(key, callback) {
        return this.subscribe(key, callback);
    }

    /**
     * Notifie les listeners d'un changement
     * @param {string} key
     * @param {*} newValue
     * @param {*} oldValue
     */
    notify(key, newValue, oldValue) {
        // Notifie les listeners spécifiques
        this.listeners.get(key)?.forEach(callback => {
            callback(newValue, oldValue);
        });

        // Notifie les listeners globaux
        this.listeners.get('*')?.forEach(callback => {
            callback({ key, newValue, oldValue });
        });
    }

    /**
     * Remet à zéro l'état
     * @param {Object} initialState
     */
    reset(initialState = {}) {
        // Supprime les données persistées
        this.persistKeys.forEach(key => storage.remove(key));

        // Réinitialise l'état
        Object.keys(this.state).forEach(key => {
            delete this.state[key];
        });

        Object.entries(initialState).forEach(([key, value]) => {
            this.state[key] = value;
        });
    }

    /**
     * Crée un store dérivé (computed)
     * @param {string[]} dependencies
     * @param {Function} compute
     * @returns {Function}
     */
    computed(dependencies, compute) {
        let cachedValue;
        let isInitialized = false;

        const update = () => {
            const values = dependencies.map(dep => this.get(dep));
            cachedValue = compute(...values);
            return cachedValue;
        };

        // Souscrit aux dépendances
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                update();
            });
        });

        return () => {
            if (!isInitialized) {
                isInitialized = true;
                return update();
            }
            return cachedValue;
        };
    }

    /**
     * Exécute une action qui modifie l'état de manière atomique
     * @param {Function} action
     */
    batch(action) {
        const updates = [];
        const originalSet = this.set.bind(this);

        // Intercepte les modifications
        this.set = (key, value) => {
            updates.push({ key, value });
        };

        action();

        // Restaure la méthode set
        this.set = originalSet;

        // Applique toutes les modifications
        updates.forEach(({ key, value }) => {
            originalSet(key, value);
        });
    }
}

// Instance singleton du store
export const store = new Store();

// Export la classe pour tests ou usage multiple
export default Store;
