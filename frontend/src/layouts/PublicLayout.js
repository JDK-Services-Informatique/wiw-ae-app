/**
 * Layout Public vanilla JS (pages non-authentifiées)
 */

import { Component } from '../core/component';
import { appStore, actions } from '../core/store';

export class PublicLayout extends Component {
  render() {
    return `
      <div class="public-layout">
        <!-- Header -->
        <header class="public-header">
          <div class="container">
            <a href="/" class="logo" data-link>
              <span class="logo-icon">🏗️</span>
              <span class="logo-text">WIW</span>
            </a>

            <nav class="public-nav">
              <a href="/pricing" class="nav-link" data-link>Tarifs</a>
              <a href="/contact" class="nav-link" data-link>Contact</a>
              <a href="/login" class="btn" data-link>Connexion</a>
            </nav>
          </div>
        </header>

        <!-- Content -->
        <main class="public-content" id="content-container">
          <!-- Le contenu de la page sera injecté ici -->
        </main>

        <!-- Footer -->
        <footer class="public-footer">
          <div class="container">
            <div class="footer-content">
              <div class="footer-brand">
                <span class="logo-icon">🏗️</span>
                <span>WIW - Work in Web</span>
              </div>
              <div class="footer-links">
                <a href="/legal" data-link>Mentions légales</a>
                <a href="/contact" data-link>Contact</a>
              </div>
              <div class="footer-copyright">
                © ${new Date().getFullYear()} WIW. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  onMounted() {
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const themeToggle = e.target.closest('[data-action="toggle-theme"]');
    if (themeToggle) {
      const newTheme = appStore.getState().theme === 'dark' ? 'light' : 'dark';
      actions.setTheme(newTheme);
    }
  }

  getContentContainer() {
    return this.$('#content-container');
  }
}

export default PublicLayout;
