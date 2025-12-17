/**
 * Layout Dashboard - WiW AE+
 * Layout principal avec sidebar améliorée, notifications et animations
 */

import { Component } from './base.js';
import { icons } from './icons.js';
import { store } from '../store.js';
import { router } from '../router.js';
import { authService } from '../api/auth.js';
import { i18n, t } from '../i18n/index.js';
import { $, addClass, removeClass, toggleClass } from '../utils/dom.js';
import { notificationCenter } from './ui/notification-center.js';
import { notificationService } from '../services/notifications.js';

export class DashboardLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarOpen: false,
            isSidebarCollapsed: store.get('sidebarCollapsed') || false,
            isDark: store.get('theme') === 'dark',
            currentPath: window.location.pathname,
            badges: {
                tenders: 3,
                alerts: 2,
                messages: 5
            }
        };
    }

    render() {
        const user = store.get('user') || {};
        const { isDark, isSidebarOpen, isSidebarCollapsed, badges } = this.state;

        return `
            <div class="layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}">
                <!-- Mobile Header -->
                <header class="mobile-header">
                    <div class="mobile-header-logo">
                        <div class="sidebar-logo">W</div>
                        <span class="mobile-header-title">WiW AE+</span>
                    </div>
                    <div class="mobile-header-actions">
                        <div class="notification-wrapper" id="mobile-notifications"></div>
                        <button class="btn btn-icon btn-ghost" id="mobile-menu-btn" aria-label="Menu">
                            ${icons.menu}
                        </button>
                    </div>
                </header>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay ${isSidebarOpen ? 'visible' : ''}" id="sidebar-overlay"></div>

                <!-- Sidebar -->
                <aside class="layout-sidebar ${isSidebarOpen ? 'open' : ''}" id="sidebar">
                    <div class="sidebar">
                        <!-- Header -->
                        <div class="sidebar-header">
                            <a href="/dashboard" class="sidebar-brand">
                                <div class="sidebar-logo animate-pulse-slow">W</div>
                                <span class="sidebar-title">WiW AE+</span>
                            </a>
                            <button class="sidebar-collapse-btn" id="collapse-sidebar" title="Réduire">
                                ${icons.chevronLeft || '◀'}
                            </button>
                        </div>

                        <!-- Search -->
                        <div class="sidebar-search">
                            <div class="sidebar-search-input">
                                <span class="search-icon">${icons.search}</span>
                                <input type="text" placeholder="Rechercher..." id="sidebar-search" />
                                <kbd class="search-shortcut">⌘K</kbd>
                            </div>
                        </div>

                        <!-- Navigation -->
                        <nav class="sidebar-nav" id="nav-menu">
                            ${this.renderNavigation()}
                        </nav>

                        <!-- User Section -->
                        <div class="sidebar-user">
                            <div class="user-avatar">
                                ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}" />` : this.getInitials(user.name)}
                            </div>
                            <div class="user-info">
                                <span class="user-name">${user.name || 'Utilisateur'}</span>
                                <span class="user-role">${user.role || 'Architecte'}</span>
                            </div>
                            <button class="btn btn-icon btn-ghost" id="user-menu-btn" aria-label="Menu utilisateur">
                                ${icons.moreVertical || '⋮'}
                            </button>
                        </div>

                        <!-- Footer Actions -->
                        <div class="sidebar-footer">
                            <button class="sidebar-footer-btn" id="theme-toggle" title="${isDark ? 'Mode clair' : 'Mode sombre'}">
                                ${isDark ? icons.sun : icons.moon}
                            </button>
                            <button class="sidebar-footer-btn" id="lang-switcher" title="Changer la langue">
                                ${icons.globe}
                            </button>
                            <a href="/settings" class="sidebar-footer-btn" title="Paramètres">
                                ${icons.settings}
                            </a>
                            <button class="sidebar-footer-btn text-error" id="logout-btn" title="Déconnexion">
                                ${icons.logOut}
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="layout-main">
                    <!-- Top Bar -->
                    <header class="topbar">
                        <div class="topbar-left">
                            <h1 class="topbar-title" id="page-title"></h1>
                        </div>
                        <div class="topbar-right">
                            <div class="notification-wrapper" id="desktop-notifications"></div>
                            <div class="topbar-user">
                                <span class="topbar-user-name">${user.name || 'Utilisateur'}</span>
                                <div class="topbar-avatar">
                                    ${user.avatar ? `<img src="${user.avatar}" alt="" />` : this.getInitials(user.name)}
                                </div>
                            </div>
                        </div>
                    </header>

                    <!-- Page Content -->
                    <div class="layout-content page" id="page-content">
                        <!-- Le contenu des pages sera injecté ici -->
                    </div>
                </main>
            </div>
        `;
    }

    renderNavigation() {
        const currentPath = this.state.currentPath;
        const { badges } = this.state;

        const navGroups = [
            {
                title: 'Principal',
                items: [
                    { path: '/dashboard', icon: 'layoutDashboard', label: t('nav.dashboard') },
                    { path: '/tenders', icon: 'briefcase', label: t('nav.tenders'), badge: badges.tenders },
                    { path: '/nouvelle-ao', icon: 'plus', label: t('nav.newTender'), highlight: true },
                    { path: '/honoraires', icon: 'calculator', label: t('nav.fees') },
                ]
            },
            {
                title: 'Gestion',
                items: [
                    { path: '/devis', icon: 'fileText', label: t('nav.quotes') },
                    { path: '/team', icon: 'users', label: t('nav.team') },
                    { path: '/company', icon: 'building', label: t('nav.company') },
                    { path: '/references', icon: 'award', label: t('nav.references') },
                ]
            },
            {
                title: 'Outils',
                items: [
                    { path: '/missions', icon: 'clipboardList', label: t('nav.missions') },
                    { path: '/templates', icon: 'template', label: t('nav.templates') },
                    { path: '/calendar', icon: 'calendar', label: t('nav.calendar') },
                    { path: '/analytics', icon: 'barChart', label: t('nav.analytics') },
                ]
            },
            {
                title: 'Développement',
                items: [
                    { path: '/prospection', icon: 'target', label: t('nav.prospection') },
                    { path: '/pipeline', icon: 'pieChart', label: t('nav.pipeline') },
                    { path: '/bet', icon: 'handshake', label: t('nav.bet') },
                ]
            },
            {
                title: 'Ressources',
                items: [
                    { path: '/medialibrary', icon: 'image', label: t('nav.mediaLibrary') },
                    { path: '/datamanagement', icon: 'database', label: t('nav.dataManagement') },
                    { path: '/alertes', icon: 'bell', label: t('nav.alerts'), badge: badges.alerts },
                ]
            }
        ];

        return navGroups.map(group => `
            <div class="nav-group">
                <div class="nav-group-title">
                    <span>${group.title}</span>
                </div>
                ${group.items.map(item => `
                    <a href="${item.path}"
                       class="nav-item ${currentPath === item.path ? 'active' : ''} ${item.highlight ? 'nav-item-highlight' : ''}"
                       data-nav-item>
                        <span class="nav-item-icon">${icons[item.icon] || ''}</span>
                        <span class="nav-item-text">${item.label}</span>
                        ${item.badge ? `<span class="nav-item-badge">${item.badge}</span>` : ''}
                        ${item.highlight ? '<span class="nav-item-new">NEW</span>' : ''}
                    </a>
                `).join('')}
            </div>
        `).join('');
    }

    getInitials(name) {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    onMount() {
        // Event listeners
        this.on($('#mobile-menu-btn'), 'click', this.toggleSidebar);
        this.on($('#sidebar-overlay'), 'click', this.closeSidebar);
        this.on($('#theme-toggle'), 'click', this.toggleTheme);
        this.on($('#logout-btn'), 'click', this.handleLogout);
        this.on($('#lang-switcher'), 'click', this.toggleLanguage);
        this.on($('#collapse-sidebar'), 'click', this.toggleCollapse);

        // Search shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                $('#sidebar-search')?.focus();
            }
        });

        // Navigation avec animations
        this.$$('[data-nav-item]').forEach(item => {
            this.on(item, 'click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');

                // Animation de clic
                item.classList.add('nav-item-clicked');
                setTimeout(() => item.classList.remove('nav-item-clicked'), 200);

                // Navigation
                setTimeout(() => router.navigate(href), 100);
            });
        });

        // Ferme le sidebar sur navigation mobile
        window.addEventListener('routechange', () => {
            this.closeSidebar();
            this.state.currentPath = window.location.pathname;
            this.updateActiveNav();
        });

        // Subscribe aux changements de thème
        this.subscribe('theme', (theme) => {
            this.state.isDark = theme === 'dark';
            this.applyTheme();
        });

        // Initialiser les notifications
        this.initNotifications();

        // Appliquer le thème initial
        this.applyTheme();

        // Appliquer l'état collapsed initial
        if (this.state.isSidebarCollapsed) {
            addClass($('.layout'), 'sidebar-collapsed');
        }
    }

    initNotifications() {
        // Desktop notifications
        const desktopWrapper = $('#desktop-notifications');
        if (desktopWrapper) {
            notificationCenter.mount('#desktop-notifications');
        }

        // Mobile notifications (clone simple)
        const mobileWrapper = $('#mobile-notifications');
        if (mobileWrapper) {
            const count = notificationService.getUnreadCount();
            mobileWrapper.innerHTML = `
                <button class="notification-bell" id="mobile-notification-bell">
                    <span class="bell-icon">🔔</span>
                    ${count > 0 ? `<span class="notification-badge">${count}</span>` : ''}
                </button>
            `;

            mobileWrapper.querySelector('#mobile-notification-bell')?.addEventListener('click', () => {
                notificationCenter.toggle();
            });
        }

        // Mettre à jour le badge mobile quand les notifications changent
        notificationService.subscribe((event, data, count) => {
            const mobileBadge = mobileWrapper?.querySelector('.notification-badge');
            if (count > 0) {
                if (mobileBadge) {
                    mobileBadge.textContent = count > 99 ? '99+' : count;
                } else {
                    const bell = mobileWrapper?.querySelector('.notification-bell');
                    if (bell) {
                        bell.insertAdjacentHTML('beforeend', `<span class="notification-badge">${count}</span>`);
                    }
                }
            } else {
                mobileBadge?.remove();
            }
        });
    }

    toggleSidebar = () => {
        this.state.isSidebarOpen = !this.state.isSidebarOpen;
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');

        toggleClass(sidebar, 'open', this.state.isSidebarOpen);
        toggleClass(overlay, 'visible', this.state.isSidebarOpen);
    }

    closeSidebar = () => {
        this.state.isSidebarOpen = false;
        removeClass($('#sidebar'), 'open');
        removeClass($('#sidebar-overlay'), 'visible');
    }

    toggleCollapse = () => {
        this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
        store.set('sidebarCollapsed', this.state.isSidebarCollapsed);

        const layout = $('.layout');
        toggleClass(layout, 'sidebar-collapsed', this.state.isSidebarCollapsed);

        // Animer le bouton
        const btn = $('#collapse-sidebar');
        if (btn) {
            btn.style.transform = this.state.isSidebarCollapsed ? 'rotate(180deg)' : '';
        }
    }

    toggleTheme = () => {
        const newTheme = this.state.isDark ? 'light' : 'dark';
        store.set('theme', newTheme);
    }

    applyTheme() {
        if (this.state.isDark) {
            addClass(document.documentElement, 'dark');
        } else {
            removeClass(document.documentElement, 'dark');
        }

        // Met à jour l'icône
        const themeToggle = $('#theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.state.isDark ? icons.sun : icons.moon;
            themeToggle.title = this.state.isDark ? 'Mode clair' : 'Mode sombre';
        }
    }

    toggleLanguage = () => {
        const currentLocale = i18n.getLocale();
        const newLocale = currentLocale === 'fr' ? 'en' : 'fr';
        i18n.setLocale(newLocale);

        // Recharge la page pour appliquer les traductions
        window.location.reload();
    }

    handleLogout = async () => {
        const { modal } = await import('./ui/modal.js');

        const confirmed = await modal.confirm({
            title: t('auth.logout'),
            message: t('confirm.logout'),
            confirmText: t('auth.logout'),
            danger: true
        });

        if (confirmed) {
            authService.logout();
        }
    }

    updateActiveNav() {
        const navItems = this.$$('.nav-item[href]');
        navItems.forEach(item => {
            const isActive = item.getAttribute('href') === this.state.currentPath;
            toggleClass(item, 'active', isActive);
        });
    }

    /**
     * Met à jour les badges de navigation
     */
    updateBadges(badges) {
        this.state.badges = { ...this.state.badges, ...badges };

        // Mettre à jour visuellement
        Object.entries(badges).forEach(([key, value]) => {
            // Trouver le nav-item correspondant et mettre à jour le badge
        });
    }

    /**
     * Retourne le conteneur pour les pages
     * @returns {HTMLElement}
     */
    getPageContainer() {
        return $('#page-content');
    }
}

export default DashboardLayout;
