/**
 * Composant Toast - WiW AE+
 * Notifications toast
 */

import { $, htmlToElement, addClass, removeClass } from '../../utils/dom.js';
import { icons } from '../icons.js';

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.defaultDuration = 5000;
    }

    /**
     * Initialise le conteneur de toasts
     */
    init() {
        this.container = $('#toast-container');
        if (!this.container) {
            this.container = htmlToElement('<div id="toast-container" class="toast-container"></div>');
            document.body.appendChild(this.container);
        }
    }

    /**
     * Affiche un toast
     * @param {Object} options
     */
    show(options) {
        if (!this.container) this.init();

        const {
            message,
            type = 'info',
            duration = this.defaultDuration,
            closable = true
        } = typeof options === 'string' ? { message: options } : options;

        const id = Date.now();
        const iconMap = {
            success: icons.checkCircle,
            error: icons.xCircle,
            warning: icons.alertTriangle,
            info: icons.info
        };

        const toast = htmlToElement(`
            <div class="toast toast-${type}" data-toast-id="${id}">
                <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
                <span class="toast-message">${message}</span>
                ${closable ? `<button class="toast-close" aria-label="Fermer">${icons.x}</button>` : ''}
            </div>
        `);

        // Gestion du clic pour fermer
        if (closable) {
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.remove(id);
            });
        }

        this.container.appendChild(toast);
        this.toasts.push({ id, element: toast });

        // Auto-suppression après la durée
        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    /**
     * Supprime un toast
     * @param {number} id
     */
    remove(id) {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index === -1) return;

        const { element } = this.toasts[index];
        addClass(element, 'removing');

        element.addEventListener('animationend', () => {
            element.remove();
        }, { once: true });

        this.toasts.splice(index, 1);
    }

    /**
     * Supprime tous les toasts
     */
    clear() {
        this.toasts.forEach(({ id }) => this.remove(id));
    }

    // Raccourcis
    success(message, options = {}) {
        return this.show({ ...options, message, type: 'success' });
    }

    error(message, options = {}) {
        return this.show({ ...options, message, type: 'error' });
    }

    warning(message, options = {}) {
        return this.show({ ...options, message, type: 'warning' });
    }

    info(message, options = {}) {
        return this.show({ ...options, message, type: 'info' });
    }
}

// Instance singleton
export const toast = new ToastManager();

export default toast;
