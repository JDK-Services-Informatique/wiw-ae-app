/**
 * Service de Notifications temps réel - WiW AE+
 * Gestion des notifications utilisateur avec persistence locale
 */

import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'wiw_notifications';
const MAX_NOTIFICATIONS = 50;

class NotificationService {
    constructor() {
        this.notifications = [];
        this.listeners = new Set();
        this.unreadCount = 0;
        this.init();
    }

    init() {
        // Charger les notifications depuis le stockage local
        const stored = storage.get(STORAGE_KEY);
        if (stored) {
            this.notifications = stored;
            this.updateUnreadCount();
        }

        // Simuler des notifications périodiques (en prod, ce serait WebSocket/SSE)
        this.startPolling();
    }

    /**
     * Ajoute une notification
     */
    add(notification) {
        const newNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        this.notifications.unshift(newNotification);

        // Limiter le nombre de notifications
        if (this.notifications.length > MAX_NOTIFICATIONS) {
            this.notifications = this.notifications.slice(0, MAX_NOTIFICATIONS);
        }

        this.save();
        this.updateUnreadCount();
        this.notifyListeners('add', newNotification);

        // Notification browser si autorisée
        if (notification.browser !== false) {
            this.showBrowserNotification(newNotification);
        }

        return newNotification;
    }

    /**
     * Marque une notification comme lue
     */
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.save();
            this.updateUnreadCount();
            this.notifyListeners('read', notification);
        }
    }

    /**
     * Marque toutes les notifications comme lues
     */
    markAllAsRead() {
        let changed = false;
        this.notifications.forEach(n => {
            if (!n.read) {
                n.read = true;
                changed = true;
            }
        });

        if (changed) {
            this.save();
            this.updateUnreadCount();
            this.notifyListeners('readAll');
        }
    }

    /**
     * Supprime une notification
     */
    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            const removed = this.notifications.splice(index, 1)[0];
            this.save();
            this.updateUnreadCount();
            this.notifyListeners('remove', removed);
        }
    }

    /**
     * Supprime toutes les notifications
     */
    clear() {
        this.notifications = [];
        this.save();
        this.updateUnreadCount();
        this.notifyListeners('clear');
    }

    /**
     * Récupère toutes les notifications
     */
    getAll() {
        return [...this.notifications];
    }

    /**
     * Récupère les notifications non lues
     */
    getUnread() {
        return this.notifications.filter(n => !n.read);
    }

    /**
     * Récupère le nombre de notifications non lues
     */
    getUnreadCount() {
        return this.unreadCount;
    }

    /**
     * Sauvegarde dans le stockage local
     */
    save() {
        storage.set(STORAGE_KEY, this.notifications);
    }

    /**
     * Met à jour le compteur de non lues
     */
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    /**
     * S'abonne aux changements de notifications
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Notifie les listeners
     */
    notifyListeners(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data, this.unreadCount);
            } catch (e) {
                console.error('Notification listener error:', e);
            }
        });
    }

    /**
     * Affiche une notification navigateur
     */
    async showBrowserNotification(notification) {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'granted') {
            this.createBrowserNotification(notification);
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.createBrowserNotification(notification);
            }
        }
    }

    createBrowserNotification(notification) {
        const options = {
            body: notification.message,
            icon: '/assets/images/favicon.png',
            badge: '/assets/images/badge.png',
            tag: notification.id,
            data: notification,
            requireInteraction: notification.type === 'urgent'
        };

        const browserNotif = new Notification(notification.title || 'WiW AE+', options);

        browserNotif.onclick = () => {
            window.focus();
            if (notification.link) {
                window.location.href = notification.link;
            }
            this.markAsRead(notification.id);
            browserNotif.close();
        };
    }

    /**
     * Démarre le polling pour simuler les notifications temps réel
     */
    startPolling() {
        // En production, utiliser WebSocket ou Server-Sent Events
        // Pour la démo, on simule des notifications aléatoires

        const demoNotifications = [
            { type: 'tender', title: 'Nouvel appel d\'offres', message: 'Un nouveau DCE est disponible', icon: '📋' },
            { type: 'deadline', title: 'Échéance proche', message: 'L\'AO "Centre Commercial" expire dans 3 jours', icon: '⏰' },
            { type: 'message', title: 'Nouveau message', message: 'Vous avez reçu un message du maître d\'ouvrage', icon: '💬' },
            { type: 'update', title: 'Mise à jour', message: 'Le projet "Résidence Les Pins" a été modifié', icon: '📝' },
            { type: 'success', title: 'AO Gagné !', message: 'Félicitations ! Vous avez remporté l\'appel d\'offres', icon: '🏆' },
            { type: 'alert', title: 'Action requise', message: 'Documents manquants pour le dossier en cours', icon: '⚠️' },
        ];

        // Simuler une notification toutes les 2-5 minutes (en démo)
        const addRandomNotification = () => {
            // Ne pas ajouter si trop de notifications non lues
            if (this.unreadCount < 10) {
                const randomNotif = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
                this.add({
                    ...randomNotif,
                    browser: false // Ne pas afficher en notification browser pour la démo
                });
            }
        };

        // Pour la démo, ajouter quelques notifications au démarrage
        if (this.notifications.length === 0) {
            setTimeout(() => {
                this.add({
                    type: 'welcome',
                    title: 'Bienvenue sur WiW AE+ !',
                    message: 'Découvrez toutes les fonctionnalités de votre espace',
                    icon: '👋',
                    browser: false
                });
            }, 2000);
        }

        // En prod, commenter cette ligne et utiliser WebSocket
        // setInterval(addRandomNotification, 120000 + Math.random() * 180000);
    }

    /**
     * Demande la permission pour les notifications browser
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return await Notification.requestPermission();
    }
}

// Instance singleton
export const notificationService = new NotificationService();

// Types de notifications
export const NotificationType = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    TENDER: 'tender',
    DEADLINE: 'deadline',
    MESSAGE: 'message',
    UPDATE: 'update',
    ALERT: 'alert'
};

// Helper pour créer des notifications
export function notify(type, title, message, options = {}) {
    return notificationService.add({
        type,
        title,
        message,
        ...options
    });
}

export default notificationService;
