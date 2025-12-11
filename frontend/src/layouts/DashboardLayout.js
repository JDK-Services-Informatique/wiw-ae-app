/**
 * Layout Dashboard vanilla JS
 */

import { Component, html } from '../core/component';
import { router } from '../core/router';
import { appStore, actions } from '../core/store';
import { authService } from '../core/auth';

const MENU_ITEMS = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tenders', icon: '📋', label: 'Appels d\'offres' },
  { path: '/honoraires', icon: '💰', label: 'Honoraires' },
  { path: '/references', icon: '📚', label: 'Références' },
  { path: '/team', icon: '👥', label: 'Équipe' },
  { path: '/settings', icon: '⚙️', label: 'Paramètres' }
];

export class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      currentPath: window.location.pathname
    };

    // Écouter les changements de route
    this.unsubscribeRouter = null;
  }

  render() {
    const { user } = this.props;
    const { sidebarOpen, currentPath } = this.state;

    return `
      <div class="dashboard-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo">
              <span class="logo-icon">🏗️</span>
              <span class="logo-text">WIW</span>
            </div>
            <button class="btn-icon sidebar-toggle" data-action="toggle-sidebar">
              ${sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav class="sidebar-nav">
            ${MENU_ITEMS.map(item => `
              <a href="${item.path}"
                 class="nav-item ${currentPath === item.path ? 'active' : ''}"
                 data-link>
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
              </a>
            `).join('')}
          </nav>

          <div class="sidebar-footer">
            <div class="user-info">
              <div class="user-avatar">
                ${user?.nom?.charAt(0) || 'U'}
              </div>
              <div class="user-details">
                <div class="user-name">${user?.nom || 'Utilisateur'}</div>
                <div class="user-email">${user?.email || ''}</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" data-action="logout">
              Déconnexion
            </button>
          </div>
        </aside>

        <!-- Main content -->
        <main class="main-content">
          <header class="main-header">
            <div class="header-left">
              <h1 class="page-title" id="page-title">Dashboard</h1>
            </div>
            <div class="header-right">
              <button class="btn-icon" data-action="toggle-theme" title="Changer le thème">
                🌓
              </button>
            </div>
          </header>

          <div class="content-container" id="content-container">
            <!-- Le contenu de la page sera injecté ici -->
          </div>
        </main>
      </div>
    `;
  }

  onMounted() {
    // Bind des événements
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));

    // Écouter les changements d'URL
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
  }

  onDestroy() {
    window.removeEventListener('popstate', this.handleRouteChange.bind(this));
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;

    if (action === 'toggle-sidebar') {
      this.setState({ sidebarOpen: !this.state.sidebarOpen });
    } else if (action === 'logout') {
      authService.logout();
      router.navigate('/');
    } else if (action === 'toggle-theme') {
      const newTheme = appStore.getState().theme === 'dark' ? 'light' : 'dark';
      actions.setTheme(newTheme);
    }
  }

  handleRouteChange() {
    this.setState({ currentPath: window.location.pathname });
    this.updatePageTitle();
  }

  updatePageTitle() {
    const currentItem = MENU_ITEMS.find(item => item.path === window.location.pathname);
    const titleEl = this.$('#page-title');
    if (titleEl && currentItem) {
      titleEl.textContent = currentItem.label;
    }
  }

  getContentContainer() {
    return this.$('#content-container');
  }
}

export default DashboardLayout;
