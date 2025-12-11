/**
 * Application principale vanilla JS
 */

import { router } from './core/router';
import { appStore } from './core/store';
import { authService } from './core/auth';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';

// Pages publiques
import { LandingPage } from './pages-vanilla/LandingPage';
import { LoginPage } from './pages-vanilla/LoginPage';
import { PricingPage } from './pages-vanilla/PricingPage';
import { ContactPage } from './pages-vanilla/ContactPage';
import { NotFoundPage } from './pages-vanilla/NotFoundPage';

// Pages privées
import { DashboardPage } from './pages-vanilla/DashboardPage';
import { TendersPage } from './pages-vanilla/TendersPage';
import { HonorairesPage } from './pages-vanilla/HonorairesPage';
import { ReferencesPage } from './pages-vanilla/ReferencesPage';
import { TeamPage } from './pages-vanilla/TeamPage';
import { SettingsPage } from './pages-vanilla/SettingsPage';

// ============================================================================
// CONFIGURATION DES ROUTES
// ============================================================================

/**
 * Middleware d'authentification
 */
function requireAuth(renderFn) {
  return (params) => {
    if (!authService.isAuthenticated()) {
      router.navigate('/login');
      return;
    }
    renderFn(params);
  };
}

/**
 * Middleware pour rediriger si déjà connecté
 */
function redirectIfAuth(renderFn) {
  return (params) => {
    if (authService.isAuthenticated()) {
      router.navigate('/dashboard');
      return;
    }
    renderFn(params);
  };
}

/**
 * Rend une page dans le layout public
 */
function renderPublic(PageComponent) {
  return (params) => {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const layout = new PublicLayout();
    layout.mount(root);

    const page = new PageComponent(params);
    page.mount(layout.getContentContainer());
  };
}

/**
 * Rend une page dans le layout dashboard
 */
function renderDashboard(PageComponent) {
  return requireAuth((params) => {
    const root = document.getElementById('root');
    const user = authService.getCurrentUser();

    // Vérifier si le layout existe déjà
    let layout = window.__dashboardLayout;
    if (!layout) {
      root.innerHTML = '';
      layout = new DashboardLayout({ user });
      layout.mount(root);
      window.__dashboardLayout = layout;
    }

    const page = new PageComponent(params);
    page.mount(layout.getContentContainer());
  });
}

/**
 * Initialise l'application
 */
export function initApp() {
  // Routes publiques
  router.route('/', redirectIfAuth(renderPublic(LandingPage)));
  router.route('/login', redirectIfAuth(renderPublic(LoginPage)));
  router.route('/pricing', renderPublic(PricingPage));
  router.route('/contact', renderPublic(ContactPage));
  router.route('/landing', renderPublic(LandingPage));

  // Routes privées (dashboard)
  router.route('/dashboard', renderDashboard(DashboardPage));
  router.route('/tenders', renderDashboard(TendersPage));
  router.route('/honoraires', renderDashboard(HonorairesPage));
  router.route('/references', renderDashboard(ReferencesPage));
  router.route('/team', renderDashboard(TeamPage));
  router.route('/settings', renderDashboard(SettingsPage));

  // Route 404
  router.route('*', renderPublic(NotFoundPage));

  // Démarrer le router
  router.start();

  // Écouter les changements d'état d'authentification
  appStore.subscribe((state, prevState) => {
    if (state.isAuthenticated !== prevState.isAuthenticated) {
      // Réinitialiser le layout si déconnexion
      if (!state.isAuthenticated) {
        window.__dashboardLayout = null;
        router.navigate('/');
      }
    }
  });
}
