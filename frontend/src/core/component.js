/**
 * Système de composants vanilla JS
 * Classe de base pour créer des composants réutilisables
 */

/**
 * Classe de base pour les composants
 */
export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.element = null;
    this._mounted = false;
    this._eventListeners = [];
  }

  /**
   * Met à jour le state et re-render le composant
   * @param {Object} newState - Nouveau state partiel
   */
  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    if (this._mounted) {
      this.update(prevState);
    }
  }

  /**
   * Met à jour le composant
   * @param {Object} prevState - État précédent
   */
  update(prevState) {
    if (!this.element) return;

    const newElement = this.render();
    if (typeof newElement === 'string') {
      const temp = document.createElement('div');
      temp.innerHTML = newElement;
      const newNode = temp.firstElementChild;
      if (this.element.parentNode) {
        this.element.parentNode.replaceChild(newNode, this.element);
        this.element = newNode;
        this.onUpdated(prevState);
      }
    }
  }

  /**
   * Retourne le HTML du composant (à surcharger)
   * @returns {string|HTMLElement}
   */
  render() {
    return '<div></div>';
  }

  /**
   * Appelé après le premier rendu
   */
  onMounted() {}

  /**
   * Appelé après chaque mise à jour
   * @param {Object} prevState - État précédent
   */
  onUpdated(prevState) {}

  /**
   * Appelé avant la destruction du composant
   */
  onDestroy() {}

  /**
   * Monte le composant dans un élément
   * @param {HTMLElement|string} container - Conteneur ou sélecteur
   */
  mount(container) {
    const target = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!target) {
      throw new Error('Container not found');
    }

    const content = this.render();
    if (typeof content === 'string') {
      target.innerHTML = content;
      this.element = target.firstElementChild;
    } else {
      target.innerHTML = '';
      target.appendChild(content);
      this.element = content;
    }

    this._mounted = true;
    this.onMounted();

    return this;
  }

  /**
   * Détruit le composant
   */
  destroy() {
    this.onDestroy();
    this._removeEventListeners();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this._mounted = false;
  }

  /**
   * Ajoute un event listener avec tracking
   * @param {HTMLElement} element - Élément cible
   * @param {string} event - Nom de l'événement
   * @param {Function} handler - Handler
   */
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this._eventListeners.push({ element, event, handler });
  }

  /**
   * Supprime tous les event listeners
   */
  _removeEventListeners() {
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._eventListeners = [];
  }

  /**
   * Récupère un élément dans le composant
   * @param {string} selector - Sélecteur CSS
   */
  $(selector) {
    return this.element?.querySelector(selector);
  }

  /**
   * Récupère tous les éléments dans le composant
   * @param {string} selector - Sélecteur CSS
   */
  $$(selector) {
    return this.element?.querySelectorAll(selector) || [];
  }
}

/**
 * Crée un élément HTML à partir d'un template string
 * @param {string} html - HTML template
 * @returns {HTMLElement}
 */
export function html(strings, ...values) {
  const template = strings.reduce((acc, str, i) => {
    let value = values[i] ?? '';

    // Gérer les tableaux (pour les listes)
    if (Array.isArray(value)) {
      value = value.join('');
    }

    // Échapper les valeurs dangereuses
    if (typeof value === 'string' && !value.startsWith('<')) {
      value = escapeHtml(value);
    }

    return acc + str + value;
  }, '');

  const temp = document.createElement('template');
  temp.innerHTML = template.trim();
  return temp.content.firstElementChild;
}

/**
 * Échappe les caractères HTML dangereux
 * @param {string} str - Chaîne à échapper
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Crée un composant fonctionnel simple
 * @param {Function} renderFn - Fonction de rendu
 * @returns {Function}
 */
export function createComponent(renderFn) {
  return (props = {}) => {
    const element = renderFn(props);
    if (typeof element === 'string') {
      const temp = document.createElement('div');
      temp.innerHTML = element;
      return temp.firstElementChild;
    }
    return element;
  };
}

/**
 * Bind les événements après le rendu
 * @param {HTMLElement} element - Élément racine
 * @param {Object} handlers - Map sélecteur -> { event: handler }
 */
export function bindEvents(element, handlers) {
  Object.entries(handlers).forEach(([selector, events]) => {
    const targets = selector === 'self'
      ? [element]
      : element.querySelectorAll(selector);

    targets.forEach(target => {
      Object.entries(events).forEach(([event, handler]) => {
        target.addEventListener(event, handler);
      });
    });
  });
}

export default Component;
