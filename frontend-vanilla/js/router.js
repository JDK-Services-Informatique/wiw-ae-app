/**
 * Système de Routing SPA - WiW AE+
 * Router vanilla JS basé sur l'History API
 */

import { $, empty } from './utils/dom.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.middlewares = [];
        this.currentRoute = null;
        this.params = {};
        this.query = {};
        this.outlet = null;
        this.notFoundHandler = null;
        this.beforeEach = null;
        this.afterEach = null;

        // Bind les événements
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    /**
     * Configure le conteneur de rendu
     * @param {string|HTMLElement} selector
     */
    setOutlet(selector) {
        this.outlet = typeof selector === 'string' ? $(selector) : selector;
        return this;
    }

    /**
     * Enregistre une route
     * @param {string} path
     * @param {Function|Object} handler
     */
    route(path, handler) {
        const route = {
            path,
            pattern: this.pathToRegex(path),
            handler: typeof handler === 'function' ? { render: handler } : handler,
            params: this.extractParamNames(path)
        };
        this.routes.set(path, route);
        return this;
    }

    /**
     * Enregistre plusieurs routes
     * @param {Object} routes
     */
    routes(routes) {
        Object.entries(routes).forEach(([path, handler]) => {
            this.route(path, handler);
        });
        return this;
    }

    /**
     * Définit le handler 404
     * @param {Function} handler
     */
    notFound(handler) {
        this.notFoundHandler = handler;
        return this;
    }

    /**
     * Ajoute un middleware global
     * @param {Function} middleware
     */
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * Définit un guard avant chaque navigation
     * @param {Function} guard
     */
    beforeEachRoute(guard) {
        this.beforeEach = guard;
        return this;
    }

    /**
     * Définit un callback après chaque navigation
     * @param {Function} callback
     */
    afterEachRoute(callback) {
        this.afterEach = callback;
        return this;
    }

    /**
     * Convertit un path en regex
     * @param {string} path
     * @returns {RegExp}
     */
    pathToRegex(path) {
        const pattern = path
            .replace(/\//g, '\\/')
            .replace(/:([^/]+)/g, '(?<$1>[^/]+)')
            .replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`);
    }

    /**
     * Extrait les noms de paramètres d'un path
     * @param {string} path
     * @returns {string[]}
     */
    extractParamNames(path) {
        const matches = path.match(/:([^/]+)/g);
        return matches ? matches.map(m => m.slice(1)) : [];
    }

    /**
     * Parse les query params
     * @param {string} search
     * @returns {Object}
     */
    parseQuery(search) {
        const params = new URLSearchParams(search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    /**
     * Trouve la route correspondante
     * @param {string} path
     * @returns {Object|null}
     */
    findRoute(path) {
        for (const [, route] of this.routes) {
            const match = path.match(route.pattern);
            if (match) {
                return { route, match };
            }
        }
        return null;
    }

    /**
     * Navigue vers une URL
     * @param {string} url
     * @param {Object} options
     */
    navigate(url, options = {}) {
        const { replace = false, data = null } = options;

        if (replace) {
            history.replaceState(data, '', url);
        } else {
            history.pushState(data, '', url);
        }

        this.handleRoute();
    }

    /**
     * Alias pour navigate
     * @param {string} url
     */
    push(url) {
        this.navigate(url);
    }

    /**
     * Replace l'URL actuelle
     * @param {string} url
     */
    replace(url) {
        this.navigate(url, { replace: true });
    }

    /**
     * Retourne en arrière
     */
    back() {
        history.back();
    }

    /**
     * Avance dans l'historique
     */
    forward() {
        history.forward();
    }

    /**
     * Gère un clic sur un lien
     * @param {Event} e
     */
    handleClick(e) {
        // Trouve le lien le plus proche
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');

        // Ignore les liens externes, les ancres et les téléchargements
        if (
            !href ||
            href.startsWith('http') ||
            href.startsWith('//') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.hasAttribute('download') ||
            link.hasAttribute('target') ||
            link.dataset.external !== undefined
        ) {
            return;
        }

        e.preventDefault();
        this.navigate(href);
    }

    /**
     * Gère le changement de route
     */
    async handleRoute() {
        const path = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        this.query = this.parseQuery(search);

        const found = this.findRoute(path);

        if (!found) {
            if (this.notFoundHandler) {
                await this.renderRoute({ handler: { render: this.notFoundHandler } });
            }
            return;
        }

        const { route, match } = found;

        // Extrait les paramètres
        this.params = {};
        if (match.groups) {
            this.params = { ...match.groups };
        }

        // Exécute le guard beforeEach
        if (this.beforeEach) {
            const canProceed = await this.beforeEach({
                path,
                params: this.params,
                query: this.query,
                route
            });

            if (canProceed === false) {
                return;
            }

            if (typeof canProceed === 'string') {
                this.navigate(canProceed, { replace: true });
                return;
            }
        }

        // Exécute les middlewares de la route
        if (route.handler.middleware) {
            const middlewares = Array.isArray(route.handler.middleware)
                ? route.handler.middleware
                : [route.handler.middleware];

            for (const middleware of middlewares) {
                const result = await middleware({
                    path,
                    params: this.params,
                    query: this.query
                });

                if (result === false) return;
                if (typeof result === 'string') {
                    this.navigate(result, { replace: true });
                    return;
                }
            }
        }

        this.currentRoute = route;
        await this.renderRoute(route);

        // Callback afterEach
        if (this.afterEach) {
            this.afterEach({
                path,
                params: this.params,
                query: this.query,
                route
            });
        }

        // Scroll to top ou to hash
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }

    /**
     * Rend une route
     * @param {Object} route
     */
    async renderRoute(route) {
        if (!this.outlet) {
            console.error('Router: Aucun outlet défini');
            return;
        }

        try {
            // Charge le composant si c'est une fonction async
            let content;
            if (route.handler.render) {
                content = await route.handler.render({
                    params: this.params,
                    query: this.query
                });
            }

            // Si le contenu est une string HTML
            if (typeof content === 'string') {
                this.outlet.innerHTML = content;
            }
            // Si c'est un élément DOM
            else if (content instanceof HTMLElement) {
                empty(this.outlet);
                this.outlet.appendChild(content);
            }
            // Si c'est un composant avec une méthode mount
            else if (content && typeof content.mount === 'function') {
                empty(this.outlet);
                content.mount(this.outlet);
            }

            // Dispatch un événement personnalisé
            window.dispatchEvent(new CustomEvent('routechange', {
                detail: {
                    path: window.location.pathname,
                    params: this.params,
                    query: this.query
                }
            }));

        } catch (error) {
            console.error('Router: Erreur lors du rendu', error);
            if (this.notFoundHandler) {
                this.outlet.innerHTML = await this.notFoundHandler({ error });
            }
        }
    }

    /**
     * Démarre le router
     */
    start() {
        this.handleRoute();
        return this;
    }

    /**
     * Génère une URL avec des paramètres
     * @param {string} path
     * @param {Object} params
     * @param {Object} query
     * @returns {string}
     */
    generateUrl(path, params = {}, query = {}) {
        let url = path;

        // Remplace les paramètres
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        });

        // Ajoute les query params
        const queryString = new URLSearchParams(query).toString();
        if (queryString) {
            url += '?' + queryString;
        }

        return url;
    }
}

// Export une instance singleton
export const router = new Router();

// Export la classe pour tests ou usage multiple
export default Router;
