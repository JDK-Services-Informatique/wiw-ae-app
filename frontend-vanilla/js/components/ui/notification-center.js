/**
 * Centre de Notifications - WiW AE+
 * Composant UI pour afficher et gérer les notifications
 */

import { notificationService } from '../../services/notifications.js';
import { icons } from '../icons.js';

class NotificationCenter {
    constructor() {
        this.isOpen = false;
        this.container = null;
        this.bellButton = null;
        this.unsubscribe = null;
    }

    /**
     * Initialise le centre de notifications
     */
    init() {
        // S'abonner aux changements
        this.unsubscribe = notificationService.subscribe((event, data, count) => {
            this.updateBadge(count);
            if (this.isOpen) {
                this.renderNotifications();
            }
        });

        // Fermer le panel au clic extérieur
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.container && !this.container.contains(e.target) && !this.bellButton?.contains(e.target)) {
                this.close();
            }
        });

        // Échap pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Rend le bouton cloche avec badge
     */
    renderBell() {
        const count = notificationService.getUnreadCount();

        return `
            <button class="notification-bell" id="notification-bell" aria-label="Notifications" title="Notifications">
                <span class="bell-icon">${icons.bell || '🔔'}</span>
                ${count > 0 ? `<span class="notification-badge">${count > 99 ? '99+' : count}</span>` : ''}
            </button>
        `;
    }

    /**
     * Rend le panneau de notifications
     */
    renderPanel() {
        const notifications = notificationService.getAll();
        const unreadCount = notificationService.getUnreadCount();

        return `
            <div class="notification-panel ${this.isOpen ? 'open' : ''}" id="notification-panel">
                <div class="notification-panel-header">
                    <h3 class="notification-panel-title">
                        Notifications
                        ${unreadCount > 0 ? `<span class="unread-count">${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}</span>` : ''}
                    </h3>
                    <div class="notification-panel-actions">
                        ${unreadCount > 0 ? `
                            <button class="btn btn-sm btn-ghost" data-action="mark-all-read">
                                Tout marquer lu
                            </button>
                        ` : ''}
                        <button class="btn btn-icon btn-ghost" data-action="close-panel" aria-label="Fermer">
                            ×
                        </button>
                    </div>
                </div>

                <div class="notification-panel-body">
                    ${notifications.length === 0 ? `
                        <div class="notification-empty">
                            <span class="notification-empty-icon">🔔</span>
                            <p>Aucune notification</p>
                        </div>
                    ` : `
                        <div class="notification-list">
                            ${notifications.map(notif => this.renderNotificationItem(notif)).join('')}
                        </div>
                    `}
                </div>

                ${notifications.length > 0 ? `
                    <div class="notification-panel-footer">
                        <button class="btn btn-sm btn-ghost text-error" data-action="clear-all">
                            Effacer tout
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Rend un élément de notification
     */
    renderNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.timestamp);
        const typeClass = `notification-${notification.type || 'info'}`;

        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${typeClass}"
                 data-notification-id="${notification.id}">
                <div class="notification-icon">
                    ${notification.icon || this.getTypeIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <span class="notification-title">${notification.title}</span>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    ${notification.link ? `
                        <a href="${notification.link}" class="notification-link" data-link>
                            Voir détails →
                        </a>
                    ` : ''}
                </div>
                <button class="notification-dismiss" data-action="dismiss" data-id="${notification.id}"
                        aria-label="Supprimer">
                    ×
                </button>
            </div>
        `;
    }

    /**
     * Obtient l'icône selon le type
     */
    getTypeIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            tender: '📋',
            deadline: '⏰',
            message: '💬',
            update: '📝',
            alert: '🔔',
            welcome: '👋'
        };
        return icons[type] || '📣';
    }

    /**
     * Calcule le temps écoulé
     */
    getTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'À l\'instant';
        if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
        return date.toLocaleDateString('fr-FR');
    }

    /**
     * Met à jour le badge du compteur
     */
    updateBadge(count) {
        const badge = document.querySelector('.notification-badge');
        const bell = document.querySelector('.notification-bell');

        if (count > 0) {
            if (badge) {
                badge.textContent = count > 99 ? '99+' : count;
            } else if (bell) {
                const badgeEl = document.createElement('span');
                badgeEl.className = 'notification-badge';
                badgeEl.textContent = count > 99 ? '99+' : count;
                bell.appendChild(badgeEl);
            }
            bell?.classList.add('has-notifications');
        } else {
            badge?.remove();
            bell?.classList.remove('has-notifications');
        }
    }

    /**
     * Ouvre le panneau
     */
    open() {
        this.isOpen = true;
        const panel = document.querySelector('#notification-panel');

        if (panel) {
            panel.classList.add('open');
        } else {
            this.renderAndInsertPanel();
        }

        this.bindPanelEvents();
    }

    /**
     * Ferme le panneau
     */
    close() {
        this.isOpen = false;
        const panel = document.querySelector('#notification-panel');
        if (panel) {
            panel.classList.remove('open');
            setTimeout(() => panel.remove(), 200);
        }
    }

    /**
     * Toggle le panneau
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Rend et insère le panneau dans le DOM
     */
    renderAndInsertPanel() {
        // Supprimer l'ancien panel s'il existe
        document.querySelector('#notification-panel')?.remove();

        const panelHtml = this.renderPanel();
        const bellButton = document.querySelector('#notification-bell');

        if (bellButton) {
            bellButton.insertAdjacentHTML('afterend', panelHtml);
            this.container = document.querySelector('#notification-panel');

            // Animation d'ouverture
            requestAnimationFrame(() => {
                this.container?.classList.add('open');
            });
        }
    }

    /**
     * Re-rend les notifications
     */
    renderNotifications() {
        const list = document.querySelector('.notification-list');
        const body = document.querySelector('.notification-panel-body');

        if (body) {
            const notifications = notificationService.getAll();

            if (notifications.length === 0) {
                body.innerHTML = `
                    <div class="notification-empty">
                        <span class="notification-empty-icon">🔔</span>
                        <p>Aucune notification</p>
                    </div>
                `;
            } else {
                body.innerHTML = `
                    <div class="notification-list">
                        ${notifications.map(notif => this.renderNotificationItem(notif)).join('')}
                    </div>
                `;
            }

            this.bindPanelEvents();
        }

        // Mettre à jour le header
        const unreadCount = notificationService.getUnreadCount();
        const countEl = document.querySelector('.unread-count');
        if (countEl) {
            countEl.textContent = unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : '';
        }
    }

    /**
     * Lie les événements du panneau
     */
    bindPanelEvents() {
        // Marquer tout comme lu
        document.querySelector('[data-action="mark-all-read"]')?.addEventListener('click', () => {
            notificationService.markAllAsRead();
        });

        // Fermer le panneau
        document.querySelector('[data-action="close-panel"]')?.addEventListener('click', () => {
            this.close();
        });

        // Effacer tout
        document.querySelector('[data-action="clear-all"]')?.addEventListener('click', () => {
            notificationService.clear();
        });

        // Supprimer une notification
        document.querySelectorAll('[data-action="dismiss"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                notificationService.remove(id);
            });
        });

        // Clic sur une notification = marquer comme lue
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.notificationId;
                notificationService.markAsRead(id);
                item.classList.add('read');
                item.classList.remove('unread');
            });
        });
    }

    /**
     * Monte le composant dans un élément
     */
    mount(selector) {
        const target = document.querySelector(selector);
        if (!target) return;

        target.innerHTML = this.renderBell();
        this.bellButton = target.querySelector('#notification-bell');

        if (this.bellButton) {
            this.bellButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        this.init();
    }

    /**
     * Détruit le composant
     */
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.close();
    }
}

// Instance singleton
export const notificationCenter = new NotificationCenter();

export default notificationCenter;
