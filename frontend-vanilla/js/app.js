/**
 * Application principale - WiW AE+
 * Point d'entrée JavaScript
 */

import { router } from './router.js';
import { store } from './store.js';
import { authService } from './api/auth.js';
import { i18n, t } from './i18n/index.js';
import { $, addClass, removeClass, ready } from './utils/dom.js';
import { DashboardLayout } from './components/layout.js';
import { toast } from './components/ui/toast.js';

// Traductions
import frTranslations from './i18n/fr.js';
import enTranslations from './i18n/en.js';

// Pages
import { renderLanding } from './pages/landing.js';
import { renderLogin, LoginPage } from './pages/login.js';
import { renderDashboard, DashboardPage } from './pages/dashboard.js';
import { renderTenders, TendersPage } from './pages/tenders.js';
import { renderNotFound } from './pages/not-found.js';
import { TeamPage } from './pages/team.js';
import { HonorairesPage } from './pages/honoraires.js';
import { DevisPage } from './pages/devis.js';
import { ReferencesPage } from './pages/references.js';
import { SettingsPage } from './pages/settings.js';
import { CompanyPage } from './pages/company.js';
import { NouvelleAOPage } from './pages/nouvelle-ao.js';
import { AnalyticsPage } from './pages/analytics.js';
import { CalendarPage } from './pages/calendar.js';
import { ProspectionPage } from './pages/prospection.js';
import { PipelinePage } from './pages/pipeline.js';
import { MediaLibraryPage } from './pages/media-library.js';
import { MissionsPage } from './pages/missions.js';
import { AlertesPage } from './pages/alertes.js';
import { TemplatesPage } from './pages/templates.js';
import { BETPage } from './pages/bet.js';
import { DataManagementPage } from './pages/data-management.js';
import { CataloguePage } from './pages/catalogue.js';
import { PlansPage } from './pages/plans.js';
import { ContactPage } from './pages/contact.js';
import { LegalPage } from './pages/legal.js';
import { ForgotPasswordPage } from './pages/forgot-password.js';
import { ResetPasswordPage } from './pages/reset-password.js';

/**
 * Configuration de l'application
 */
const APP_CONFIG = {
    API_URL: 'http://localhost:4000/api'
};

// Expose la config globalement
window.APP_CONFIG = APP_CONFIG;

/**
 * Initialise l'application
 */
async function initApp() {
    console.log('🚀 Initialisation WiW AE+...');

    // 1. Initialise i18n
    await i18n.init({
        translations: {
            fr: frTranslations,
            en: enTranslations
        },
        fallbackLocale: 'fr'
    });

    // 2. Initialise le store
    store.init({
        isAuthenticated: false,
        user: null,
        theme: 'light'
    }, {
        persist: ['theme', 'locale']
    });

    // 3. Initialise l'authentification
    authService.initAuth();

    // 4. Applique le thème
    applyTheme(store.get('theme', 'light'));

    // Subscribe aux changements de thème
    store.subscribe('theme', (theme) => {
        applyTheme(theme);
    });

    // 5. Configure le router
    setupRouter();

    // 6. Cache le loader
    const loader = $('#app-loader');
    if (loader) {
        addClass(loader, 'hidden');
    }

    console.log('✅ Application initialisée');
}

/**
 * Configure le router
 */
function setupRouter() {
    // Instance du layout (sera montée une seule fois pour les routes privées)
    let dashboardLayout = null;

    router.setOutlet('#app');

    // Guard d'authentification
    router.beforeEachRoute(({ path }) => {
        const isAuthenticated = store.get('isAuthenticated');
        const publicRoutes = ['/', '/login', '/pricing', '/contact', '/legal', '/forgot-password', '/reset-password', '/landing'];

        // Redirection si non authentifié sur route privée
        if (!publicRoutes.includes(path) && !isAuthenticated) {
            return '/login';
        }

        // Redirection si authentifié sur page login
        if ((path === '/login' || path === '/') && isAuthenticated) {
            return '/dashboard';
        }

        return true;
    });

    // Routes publiques
    router.route('/', {
        render: () => renderLanding()
    });

    router.route('/landing', {
        render: () => renderLanding()
    });

    router.route('/login', {
        render: async () => {
            const page = new LoginPage();
            const html = page.render();

            // Monte après le rendu
            setTimeout(() => page.onMount(), 0);

            return html;
        }
    });

    router.route('/pricing', {
        render: async () => {
            const page = new PlansPage();
            const html = page.render();
            setTimeout(() => page.onMount(), 0);
            return html;
        }
    });

    router.route('/contact', {
        render: async () => {
            const page = new ContactPage();
            const html = page.render();
            setTimeout(() => page.onMount(), 0);
            return html;
        }
    });

    router.route('/legal', {
        render: async () => {
            const page = new LegalPage();
            const html = page.render();
            setTimeout(() => page.onMount(), 0);
            return html;
        }
    });

    router.route('/forgot-password', {
        render: async () => {
            const page = new ForgotPasswordPage();
            const html = page.render();
            setTimeout(() => page.onMount(), 0);
            return html;
        }
    });

    router.route('/reset-password', {
        render: async () => {
            const page = new ResetPasswordPage();
            const html = page.render();
            setTimeout(() => page.onMount(), 0);
            return html;
        }
    });

    // Routes privées avec layout
    const privateRoutes = [
        { path: '/dashboard', component: DashboardPage },
        { path: '/tenders', component: TendersPage },
        { path: '/nouvelle-ao', component: NouvelleAOPage },
        { path: '/honoraires', component: HonorairesPage },
        { path: '/team', component: TeamPage },
        { path: '/company', component: CompanyPage },
        { path: '/devis', component: DevisPage },
        { path: '/references', component: ReferencesPage },
        { path: '/settings', component: SettingsPage },
        { path: '/analytics', component: AnalyticsPage },
        { path: '/calendar', component: CalendarPage },
        { path: '/prospection', component: ProspectionPage },
        { path: '/medialibrary', component: MediaLibraryPage },
        { path: '/datamanagement', component: DataManagementPage },
        { path: '/missions', component: MissionsPage },
        { path: '/alertes', component: AlertesPage },
        { path: '/catalogue', component: CataloguePage },
        { path: '/plans', component: PlansPage },
        { path: '/pipeline', component: PipelinePage },
        { path: '/templates', component: TemplatesPage },
        { path: '/bet', component: BETPage },
    ];

    privateRoutes.forEach(({ path, component, render }) => {
        router.route(path, {
            render: async (ctx) => {
                // Monte le layout si pas encore fait
                if (!dashboardLayout || !dashboardLayout.isMounted) {
                    dashboardLayout = new DashboardLayout();
                    dashboardLayout.mount('#app');
                }

                // Rend la page dans le conteneur du layout
                const pageContainer = dashboardLayout.getPageContainer();

                if (component) {
                    const page = new component(ctx);
                    pageContainer.innerHTML = page.render();
                    setTimeout(() => page.onMount(), 0);
                } else if (render) {
                    pageContainer.innerHTML = render(ctx);
                }

                return null; // Ne remplace pas le layout
            }
        });
    });

    // Route 404
    router.notFound(() => renderNotFound());

    // Démarre le router
    router.start();
}

/**
 * Applique le thème
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        addClass(document.documentElement, 'dark');
    } else {
        removeClass(document.documentElement, 'dark');
    }
}

// Lance l'application au chargement du DOM
ready(() => {
    initApp().catch(console.error);
});
