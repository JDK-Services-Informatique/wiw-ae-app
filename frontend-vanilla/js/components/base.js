/**
 * Classe de base pour les composants - WiW AE+
 * Pattern de composant réutilisable
 */

import { htmlToElement, empty } from '../utils/dom.js';
import { store } from '../store.js';

/**
 * Classe de base Component
 * Tous les composants héritent de cette classe
 */
export class Component {
    /**
     * @param {Object} props - Propriétés du composant
     */
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
        this.unsubscribers = [];
        this.eventListeners = [];
        this.children = new Map();
        this.isMounted = false;
    }

    /**
     * Méthode à surcharger pour définir le template HTML
     * @returns {string}
     */
    render() {
        return '<div></div>';
    }

    /**
     * Monte le composant dans un conteneur
     * @param {HTMLElement|string} container
     */
    mount(container) {
        const target = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!target) {
            console.error('Component: Container non trouvé');
            return this;
        }

        // Crée l'élément
        this.element = htmlToElement(this.render());

        // Vide le conteneur et ajoute l'élément
        empty(target);
        target.appendChild(this.element);

        this.isMounted = true;

        // Appelle le lifecycle hook
        this.onMount();

        return this;
    }

    /**
     * Met à jour le composant
     * @param {Object} newProps
     */
    update(newProps = {}) {
        if (!this.isMounted || !this.element) return this;

        this.props = { ...this.props, ...newProps };

        const parent = this.element.parentElement;
        if (parent) {
            const newElement = htmlToElement(this.render());
            parent.replaceChild(newElement, this.element);
            this.element = newElement;
            this.onUpdate();
        }

        return this;
    }

    /**
     * Met à jour l'état local et re-rend si nécessaire
     * @param {Object} newState
     */
    setState(newState) {
        const hasChanged = Object.keys(newState).some(
            key => this.state[key] !== newState[key]
        );

        if (hasChanged) {
            this.state = { ...this.state, ...newState };
            this.update();
        }

        return this;
    }

    /**
     * Démonte le composant
     */
    unmount() {
        if (!this.isMounted) return;

        // Appelle le lifecycle hook avant
        this.onUnmount();

        // Retire les souscriptions au store
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];

        // Retire les event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // Démonte les enfants
        this.children.forEach(child => child.unmount());
        this.children.clear();

        // Supprime l'élément
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }

        this.element = null;
        this.isMounted = false;
    }

    /**
     * Lifecycle hook: appelé après le montage
     */
    onMount() {}

    /**
     * Lifecycle hook: appelé après une mise à jour
     */
    onUpdate() {}

    /**
     * Lifecycle hook: appelé avant le démontage
     */
    onUnmount() {}

    /**
     * Souscrit au store global
     * @param {string} key
     * @param {Function} callback
     */
    subscribe(key, callback) {
        const unsub = store.subscribe(key, callback);
        this.unsubscribers.push(unsub);
        return unsub;
    }

    /**
     * Ajoute un event listener (nettoyé automatiquement)
     * @param {HTMLElement} element
     * @param {string} event
     * @param {Function} handler
     */
    on(element, event, handler) {
        const boundHandler = handler.bind(this);
        element.addEventListener(event, boundHandler);
        this.eventListeners.push({ element, event, handler: boundHandler });
    }

    /**
     * Sélectionne un élément dans le composant
     * @param {string} selector
     * @returns {HTMLElement|null}
     */
    $(selector) {
        return this.element?.querySelector(selector);
    }

    /**
     * Sélectionne tous les éléments dans le composant
     * @param {string} selector
     * @returns {NodeListOf<HTMLElement>}
     */
    $$(selector) {
        return this.element?.querySelectorAll(selector) || [];
    }

    /**
     * Monte un composant enfant
     * @param {string} id
     * @param {Component} component
     * @param {string|HTMLElement} container
     */
    mountChild(id, component, container) {
        const target = typeof container === 'string'
            ? this.$(container)
            : container;

        if (target) {
            component.mount(target);
            this.children.set(id, component);
        }

        return component;
    }

    /**
     * Récupère un composant enfant
     * @param {string} id
     * @returns {Component|undefined}
     */
    getChild(id) {
        return this.children.get(id);
    }

    /**
     * Émet un événement personnalisé
     * @param {string} eventName
     * @param {*} detail
     */
    emit(eventName, detail = {}) {
        if (this.element) {
            this.element.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                detail
            }));
        }
    }
}

/**
 * Crée un composant fonctionnel simple
 * @param {Function} renderFn - Fonction de rendu (props) => html string
 * @returns {Function}
 */
export function createComponent(renderFn) {
    return class extends Component {
        render() {
            return renderFn(this.props, this.state);
        }
    };
}

/**
 * Helper pour créer des templates avec interpolation sécurisée
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
export function html(strings, ...values) {
    return strings.reduce((result, string, i) => {
        let value = values[i];

        // Échappe les valeurs pour éviter XSS
        if (typeof value === 'string') {
            value = escapeHtml(value);
        } else if (value === null || value === undefined) {
            value = '';
        } else if (Array.isArray(value)) {
            value = value.join('');
        }

        return result + string + value;
    }, '');
}

/**
 * Échappe les caractères HTML dangereux
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Marque une chaîne comme sûre (pas d'échappement)
 * @param {string} html
 * @returns {Object}
 */
export function safe(html) {
    return { __safe: true, value: html };
}

export default Component;
