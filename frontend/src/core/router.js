/**
 * Système de routing vanilla JS
 * Gère la navigation SPA sans framework
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.rootElement = null;
    this.beforeEach = null;
    this.afterEach = null;

    // Écouter les changements d'URL
    window.addEventListener('popstate', () => this.handleRoute());

    // Intercepter les clics sur les liens
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  }

  /**
   * Initialise le router avec l'élément racine
   * @param {string} selector - Sélecteur de l'élément racine
   */
  init(selector) {
    this.rootElement = document.querySelector(selector);
    if (!this.rootElement) {
      throw new Error(`Element "${selector}" not found`);
    }
    this.handleRoute();
    return this;
  }

  /**
   * Enregistre une route
   * @param {string} path - Chemin de la route
   * @param {Function} handler - Fonction qui retourne le HTML ou un composant
   * @param {Object} options - Options (title, guard, etc.)
   */
  route(path, handler, options = {}) {
    this.routes.set(path, { handler, options });
    return this;
  }

  /**
   * Enregistre plusieurs routes
   * @param {Array} routes - Tableau de routes
   */
  addRoutes(routes) {
    routes.forEach(({ path, handler, ...options }) => {
      this.route(path, handler, options);
    });
    return this;
  }

  /**
   * Navigue vers une URL
   * @param {string} path - Chemin de destination
   * @param {Object} state - État à passer
   */
  navigate(path, state = {}) {
    if (path === this.currentRoute) return;

    history.pushState(state, '', path);
    this.handleRoute();
  }

  /**
   * Remplace l'URL actuelle sans ajouter à l'historique
   * @param {string} path - Chemin de destination
   */
  replace(path, state = {}) {
    history.replaceState(state, '', path);
    this.handleRoute();
  }

  /**
   * Retourne en arrière
   */
  back() {
    history.back();
  }

  /**
   * Gère le changement de route
   */
  async handleRoute() {
    const path = window.location.pathname;
    const route = this.matchRoute(path);

    if (!route) {
      // Chercher la route wildcard '*' pour 404
      const wildcardRoute = this.routes.get('*');
      if (wildcardRoute) {
        await wildcardRoute.handler({});
        return;
      }
      this.render404();
      return;
    }

    // Guard de navigation
    if (this.beforeEach) {
      const canProceed = await this.beforeEach(path, this.currentRoute);
      if (!canProceed) return;
    }

    const previousRoute = this.currentRoute;
    this.currentRoute = path;

    // Mettre à jour le titre
    if (route.options.title) {
      document.title = `${route.options.title} - WIW`;
    }

    try {
      // Exécuter le handler (le handler gère lui-même le rendu)
      const content = await route.handler(route.params);

      // Si le handler retourne du contenu, le rendre (optionnel)
      if (content && this.rootElement) {
        if (typeof content === 'string') {
          this.rootElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          this.rootElement.innerHTML = '';
          this.rootElement.appendChild(content);
        }
      }

      // Callback après navigation
      if (this.afterEach) {
        this.afterEach(path, previousRoute);
      }

      // Scroll en haut
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Erreur de routing:', error);
      this.renderError(error);
    }
  }

  /**
   * Démarre le router sans élément racine (mode manuel)
   */
  start() {
    this.handleRoute();
    return this;
  }

  /**
   * Trouve la route correspondante au chemin
   * @param {string} path - Chemin à matcher
   */
  matchRoute(path) {
    // Chercher une correspondance exacte d'abord
    if (this.routes.has(path)) {
      return { ...this.routes.get(path), params: {} };
    }

    // Chercher avec des paramètres dynamiques
    for (const [routePath, routeData] of this.routes) {
      const params = this.extractParams(routePath, path);
      if (params) {
        return { ...routeData, params };
      }
    }

    return null;
  }

  /**
   * Extrait les paramètres d'une route dynamique
   * @param {string} routePath - Pattern de route (ex: /user/:id)
   * @param {string} actualPath - Chemin actuel
   */
  extractParams(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) return null;

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  }

  /**
   * Affiche un loader
   */
  showLoader() {
    // Le loader est géré par CSS
  }

  /**
   * Affiche une page 404
   */
  render404() {
    const target = this.rootElement || document.getElementById('root');
    if (target) {
      target.innerHTML = `
        <div class="error-page">
          <h1>404</h1>
          <p>Page non trouvée</p>
          <a href="/" class="btn">Retour à l'accueil</a>
        </div>
      `;
    }
  }

  /**
   * Affiche une page d'erreur
   * @param {Error} error - L'erreur
   */
  renderError(error) {
    const target = this.rootElement || document.getElementById('root');
    if (target) {
      target.innerHTML = `
        <div class="error-page">
          <h1>Erreur</h1>
          <p>${error.message}</p>
          <a href="/" class="btn">Retour à l'accueil</a>
        </div>
      `;
    }
  }

  /**
   * Définit un guard global
   * @param {Function} callback - Fonction appelée avant chaque navigation
   */
  setBeforeEach(callback) {
    this.beforeEach = callback;
    return this;
  }

  /**
   * Définit un callback après navigation
   * @param {Function} callback - Fonction appelée après chaque navigation
   */
  setAfterEach(callback) {
    this.afterEach = callback;
    return this;
  }

  /**
   * Récupère les query params
   */
  getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  /**
   * Récupère le chemin actuel
   */
  getCurrentPath() {
    return window.location.pathname;
  }
}

// Instance singleton
export const router = new Router();
export default router;
