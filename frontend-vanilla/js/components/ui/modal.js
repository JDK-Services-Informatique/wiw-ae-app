/**
 * Composant Modal - WiW AE+
 * Fenêtres modales
 */

import { $, htmlToElement, addClass, removeClass, trapFocus } from '../../utils/dom.js';
import { icons } from '../icons.js';

class ModalManager {
    constructor() {
        this.container = null;
        this.activeModals = [];
        this.releaseFocus = null;
    }

    /**
     * Initialise le conteneur de modals
     */
    init() {
        this.container = $('#modal-container');
        if (!this.container) {
            this.container = htmlToElement('<div id="modal-container" class="modal-container"></div>');
            document.body.appendChild(this.container);
        }

        // Ferme avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                const lastModal = this.activeModals[this.activeModals.length - 1];
                if (lastModal.closable) {
                    this.close(lastModal.id);
                }
            }
        });
    }

    /**
     * Ouvre une modal
     * @param {Object} options
     * @returns {string} ID de la modal
     */
    open(options) {
        if (!this.container) this.init();

        const {
            title = '',
            content = '',
            footer = '',
            size = 'md', // sm, md, lg, xl, full
            closable = true,
            onClose = null,
            className = ''
        } = options;

        const id = 'modal-' + Date.now();

        const sizeClasses = {
            sm: 'max-width: 400px;',
            md: 'max-width: 500px;',
            lg: 'max-width: 700px;',
            xl: 'max-width: 900px;',
            full: 'max-width: 95vw; max-height: 95vh;'
        };

        const modalHtml = `
            <div class="modal-backdrop" data-modal-backdrop="${id}"></div>
            <div class="modal ${className}" data-modal-id="${id}" style="${sizeClasses[size] || sizeClasses.md}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
                ${title ? `
                    <div class="modal-header">
                        <h3 class="modal-title" id="${id}-title">${title}</h3>
                        ${closable ? `<button class="modal-close" data-modal-close="${id}" aria-label="Fermer">${icons.x}</button>` : ''}
                    </div>
                ` : ''}
                <div class="modal-body">
                    ${content}
                </div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        `;

        this.container.innerHTML = modalHtml;
        addClass(this.container, 'open');

        // Empêche le scroll du body
        document.body.style.overflow = 'hidden';

        const modalElement = this.container.querySelector(`[data-modal-id="${id}"]`);
        const backdrop = this.container.querySelector(`[data-modal-backdrop="${id}"]`);

        // Trap focus
        this.releaseFocus = trapFocus(modalElement);

        // Event listeners
        if (closable) {
            backdrop.addEventListener('click', () => this.close(id));

            const closeBtn = modalElement.querySelector(`[data-modal-close="${id}"]`);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(id));
            }
        }

        this.activeModals.push({ id, closable, onClose, element: modalElement });

        return id;
    }

    /**
     * Ferme une modal
     * @param {string} id
     */
    close(id) {
        const index = this.activeModals.findIndex(m => m.id === id);
        if (index === -1) return;

        const modal = this.activeModals[index];

        // Callback onClose
        if (modal.onClose) {
            modal.onClose();
        }

        // Libère le focus trap
        if (this.releaseFocus) {
            this.releaseFocus();
            this.releaseFocus = null;
        }

        // Animation de fermeture
        modal.element.style.animation = 'modalOut 0.2s ease-in forwards';

        setTimeout(() => {
            removeClass(this.container, 'open');
            this.container.innerHTML = '';
            document.body.style.overflow = '';
        }, 200);

        this.activeModals.splice(index, 1);
    }

    /**
     * Ferme toutes les modals
     */
    closeAll() {
        [...this.activeModals].forEach(modal => this.close(modal.id));
    }

    /**
     * Modal de confirmation
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    confirm(options) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmation',
                message = 'Êtes-vous sûr ?',
                confirmText = 'Confirmer',
                cancelText = 'Annuler',
                confirmClass = 'btn-primary',
                danger = false
            } = typeof options === 'string' ? { message: options } : options;

            const id = this.open({
                title,
                content: `<p>${message}</p>`,
                footer: `
                    <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
                    <button class="btn ${danger ? 'btn-danger' : confirmClass}" data-action="confirm">${confirmText}</button>
                `,
                closable: true,
                onClose: () => resolve(false)
            });

            const modalElement = this.container.querySelector(`[data-modal-id="${id}"]`);

            modalElement.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                this.close(id);
                resolve(false);
            });

            modalElement.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                this.close(id);
                resolve(true);
            });
        });
    }

    /**
     * Modal d'alerte simple
     * @param {Object} options
     * @returns {Promise<void>}
     */
    alert(options) {
        return new Promise((resolve) => {
            const {
                title = 'Information',
                message = '',
                buttonText = 'OK'
            } = typeof options === 'string' ? { message: options } : options;

            const id = this.open({
                title,
                content: `<p>${message}</p>`,
                footer: `<button class="btn btn-primary" data-action="ok">${buttonText}</button>`,
                closable: true,
                onClose: () => resolve()
            });

            const modalElement = this.container.querySelector(`[data-modal-id="${id}"]`);
            modalElement.querySelector('[data-action="ok"]').addEventListener('click', () => {
                this.close(id);
                resolve();
            });
        });
    }

    /**
     * Modal de prompt (input)
     * @param {Object} options
     * @returns {Promise<string|null>}
     */
    prompt(options) {
        return new Promise((resolve) => {
            const {
                title = 'Saisie',
                message = '',
                placeholder = '',
                defaultValue = '',
                confirmText = 'Valider',
                cancelText = 'Annuler'
            } = typeof options === 'string' ? { message: options } : options;

            const inputId = 'prompt-input-' + Date.now();

            const id = this.open({
                title,
                content: `
                    ${message ? `<p class="mb-md">${message}</p>` : ''}
                    <input type="text" id="${inputId}" class="form-input" placeholder="${placeholder}" value="${defaultValue}">
                `,
                footer: `
                    <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
                    <button class="btn btn-primary" data-action="confirm">${confirmText}</button>
                `,
                closable: true,
                onClose: () => resolve(null)
            });

            const modalElement = this.container.querySelector(`[data-modal-id="${id}"]`);
            const input = modalElement.querySelector(`#${inputId}`);

            input.focus();
            input.select();

            const submit = () => {
                this.close(id);
                resolve(input.value);
            };

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submit();
            });

            modalElement.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                this.close(id);
                resolve(null);
            });

            modalElement.querySelector('[data-action="confirm"]').addEventListener('click', submit);
        });
    }
}

// Instance singleton
export const modal = new ModalManager();

export default modal;
