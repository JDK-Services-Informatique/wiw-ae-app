/**
 * Layout Dashboard - WiW AE+
 * Layout principal avec sidebar et navigation
 */

import { Component, html } from './base.js';
import { icons } from './icons.js';
import { store } from '../store.js';
import { router } from '../router.js';
import { authService } from '../api/auth.js';
import { i18n, t } from '../i18n/index.js';
import { $, addClass, removeClass, toggleClass } from '../utils/dom.js';

export class DashboardLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarOpen: false,
            isDark: store.get('theme') === 'dark',
            currentPath: window.location.pathname
        };
    }

    render() {
        const user = store.get('user') || {};
        const { isDark, isSidebarOpen } = this.state;

        return `
            <div class="layout">
                <!-- Mobile Header -->
                <header class="mobile-header">
                    <div class="mobile-header-logo">
                        <div class="sidebar-logo">W</div>
                        <span class="mobile-header-title">WiW</span>
                    </div>
                    <button class="btn btn-icon btn-ghost" id="mobile-menu-btn" aria-label="Menu">
                        ${icons.menu}
                    </button>
                </header>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay ${isSidebarOpen ? 'visible' : ''}" id="sidebar-overlay"></div>

                <!-- Sidebar -->
                <aside class="layout-sidebar ${isSidebarOpen ? 'open' : ''}" id="sidebar">
                    <div class="sidebar">
                        <div class="sidebar-header">
                            <div class="sidebar-logo">W</div>
                            <span class="sidebar-title">WiW AE+</span>
                        </div>

                        <nav class="sidebar-nav" id="nav-menu">
                            ${this.renderNavigation()}
                        </nav>

                        <div class="sidebar-footer">
                            <!-- Language Switcher -->
                            <div class="nav-item" id="lang-switcher" data-tooltip="${t('settings.language')}">
                                ${icons.globe}
                                <span class="nav-item-text">${i18n.getLocale().toUpperCase()}</span>
                            </div>

                            <!-- Theme Toggle -->
                            <button class="nav-item" id="theme-toggle">
                                ${isDark ? icons.sun : icons.moon}
                                <span class="nav-item-text">${isDark ? t('settings.lightMode') : t('settings.darkMode')}</span>
                            </button>

                            <!-- Settings -->
                            <a href="/settings" class="nav-item">
                                ${icons.settings}
                                <span class="nav-item-text">${t('nav.settings')}</span>
                            </a>

                            <!-- Logout -->
                            <button class="nav-item text-error" id="logout-btn">
                                ${icons.logOut}
                                <span class="nav-item-text">${t('auth.logout')}</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="layout-main">
                    <div class="layout-content page" id="page-content">
                        <!-- Le contenu des pages sera injecté ici -->
                    </div>
                </main>
            </div>
        `;
    }

    renderNavigation() {
        const currentPath = this.state.currentPath;

        const navGroups = [
            {
                title: 'Principal',
                items: [
                    { path: '/dashboard', icon: 'layoutDashboard', label: t('nav.dashboard') },
                    { path: '/tenders', icon: 'briefcase', label: t('nav.tenders') },
                    { path: '/nouvelle-ao', icon: 'plus', label: t('nav.newTender') },
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
                    { path: '/alertes', icon: 'bell', label: t('nav.alerts') },
                ]
            }
        ];

        return navGroups.map(group => `
            <div class="nav-group">
                <div class="nav-group-title">${group.title}</div>
                ${group.items.map(item => `
                    <a href="${item.path}" class="nav-item ${currentPath === item.path ? 'active' : ''}">
                        <span class="nav-item-icon">${icons[item.icon] || ''}</span>
                        <span class="nav-item-text">${item.label}</span>
                    </a>
                `).join('')}
            </div>
        `).join('');
    }

    onMount() {
        // Event listeners
        this.on($('#mobile-menu-btn'), 'click', this.toggleSidebar);
        this.on($('#sidebar-overlay'), 'click', this.closeSidebar);
        this.on($('#theme-toggle'), 'click', this.toggleTheme);
        this.on($('#logout-btn'), 'click', this.handleLogout);
        this.on($('#lang-switcher'), 'click', this.toggleLanguage);

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
            themeToggle.innerHTML = `
                ${this.state.isDark ? icons.sun : icons.moon}
                <span class="nav-item-text">${this.state.isDark ? t('settings.lightMode') : t('settings.darkMode')}</span>
            `;
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
     * Retourne le conteneur pour les pages
     * @returns {HTMLElement}
     */
    getPageContainer() {
        return $('#page-content');
    }
}

export default DashboardLayout;
