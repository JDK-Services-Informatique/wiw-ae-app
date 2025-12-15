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
        render: () => renderPricingPage()
    });

    router.route('/contact', {
        render: () => renderContactPage()
    });

    router.route('/legal', {
        render: () => renderLegalPage()
    });

    router.route('/forgot-password', {
        render: () => renderForgotPasswordPage()
    });

    router.route('/reset-password', {
        render: () => renderResetPasswordPage()
    });

    // Routes privées avec layout
    const privateRoutes = [
        { path: '/dashboard', component: DashboardPage },
        { path: '/tenders', component: TendersPage },
        { path: '/nouvelle-ao', render: renderNewTenderPage },
        { path: '/honoraires', render: renderFeesPage },
        { path: '/team', render: renderTeamPage },
        { path: '/company', render: renderCompanyPage },
        { path: '/devis', render: renderQuotesPage },
        { path: '/analytics', render: renderAnalyticsPage },
        { path: '/calendar', render: renderCalendarPage },
        { path: '/prospection', render: renderProspectionPage },
        { path: '/references', render: renderReferencesPage },
        { path: '/medialibrary', render: renderMediaLibraryPage },
        { path: '/datamanagement', render: renderDataManagementPage },
        { path: '/missions', render: renderMissionsPage },
        { path: '/alertes', render: renderAlertesPage },
        { path: '/catalogue', render: renderCataloguePage },
        { path: '/plans', render: renderPlansPage },
        { path: '/pipeline', render: renderPipelinePage },
        { path: '/templates', render: renderTemplatesPage },
        { path: '/settings', render: renderSettingsPage },
        { path: '/bet', render: renderBETPage },
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

// ===============================
// PAGES PLACEHOLDER
// À remplacer par de vraies pages
// ===============================

function renderPricingPage() {
    return `
        <div class="landing-page">
            <section class="py-3xl px-xl">
                <div class="text-center mb-2xl">
                    <h1 class="text-3xl font-bold mb-md">Nos tarifs</h1>
                    <p class="text-secondary">Choisissez le plan adapté à vos besoins</p>
                </div>

                <div class="pricing-grid">
                    <div class="pricing-card">
                        <h3 class="pricing-card-title">Starter</h3>
                        <div class="pricing-card-price">Gratuit</div>
                        <div class="pricing-card-features">
                            <div class="pricing-card-feature">✓ 3 projets</div>
                            <div class="pricing-card-feature">✓ 1 utilisateur</div>
                            <div class="pricing-card-feature">✓ Fonctionnalités de base</div>
                        </div>
                        <a href="/login" class="btn btn-secondary w-full">Commencer</a>
                    </div>

                    <div class="pricing-card featured">
                        <span class="pricing-card-badge">Populaire</span>
                        <h3 class="pricing-card-title">Premium</h3>
                        <div class="pricing-card-price">49€<span>/mois</span></div>
                        <div class="pricing-card-features">
                            <div class="pricing-card-feature">✓ Projets illimités</div>
                            <div class="pricing-card-feature">✓ 5 utilisateurs</div>
                            <div class="pricing-card-feature">✓ Analytique avancée</div>
                            <div class="pricing-card-feature">✓ Support prioritaire</div>
                        </div>
                        <a href="/login" class="btn btn-primary w-full">Essayer gratuit</a>
                    </div>

                    <div class="pricing-card">
                        <h3 class="pricing-card-title">Enterprise</h3>
                        <div class="pricing-card-price">Sur devis</div>
                        <div class="pricing-card-features">
                            <div class="pricing-card-feature">✓ Tout illimité</div>
                            <div class="pricing-card-feature">✓ SSO / SAML</div>
                            <div class="pricing-card-feature">✓ API dédiée</div>
                            <div class="pricing-card-feature">✓ Support dédié</div>
                        </div>
                        <a href="/contact" class="btn btn-secondary w-full">Nous contacter</a>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function renderContactPage() {
    return `<div class="page"><h1 class="page-title">Contact</h1><p>Page en construction...</p></div>`;
}

function renderLegalPage() {
    return `<div class="page"><h1 class="page-title">Mentions légales</h1><p>Page en construction...</p></div>`;
}

function renderForgotPasswordPage() {
    return `<div class="login-page"><div class="login-container"><h1>Mot de passe oublié</h1><p>Page en construction...</p></div></div>`;
}

function renderResetPasswordPage() {
    return `<div class="login-page"><div class="login-container"><h1>Réinitialiser le mot de passe</h1><p>Page en construction...</p></div></div>`;
}

function renderNewTenderPage() {
    return `<h1 class="page-title">Nouvel appel d'offres</h1><p>Page en construction...</p>`;
}

function renderFeesPage() {
    return `<h1 class="page-title">Calcul des honoraires</h1><p>Page en construction...</p>`;
}

function renderTeamPage() {
    return `<h1 class="page-title">Équipe</h1><p>Page en construction...</p>`;
}

function renderCompanyPage() {
    return `<h1 class="page-title">Entreprise</h1><p>Page en construction...</p>`;
}

function renderQuotesPage() {
    return `<h1 class="page-title">Devis</h1><p>Page en construction...</p>`;
}

function renderAnalyticsPage() {
    return `<h1 class="page-title">Analytique</h1><p>Page en construction...</p>`;
}

function renderCalendarPage() {
    return `<h1 class="page-title">Calendrier</h1><p>Page en construction...</p>`;
}

function renderProspectionPage() {
    return `<h1 class="page-title">Prospection</h1><p>Page en construction...</p>`;
}

function renderReferencesPage() {
    return `<h1 class="page-title">Références</h1><p>Page en construction...</p>`;
}

function renderMediaLibraryPage() {
    return `<h1 class="page-title">Médiathèque</h1><p>Page en construction...</p>`;
}

function renderDataManagementPage() {
    return `<h1 class="page-title">Gestion des données</h1><p>Page en construction...</p>`;
}

function renderMissionsPage() {
    return `<h1 class="page-title">Missions</h1><p>Page en construction...</p>`;
}

function renderAlertesPage() {
    return `<h1 class="page-title">Alertes</h1><p>Page en construction...</p>`;
}

function renderCataloguePage() {
    return `<h1 class="page-title">Catalogue</h1><p>Page en construction...</p>`;
}

function renderPlansPage() {
    return `<h1 class="page-title">Plans</h1><p>Page en construction...</p>`;
}

function renderPipelinePage() {
    return `<h1 class="page-title">Pipeline</h1><p>Page en construction...</p>`;
}

function renderTemplatesPage() {
    return `<h1 class="page-title">Modèles</h1><p>Page en construction...</p>`;
}

function renderSettingsPage() {
    return `<h1 class="page-title">Paramètres</h1><p>Page en construction...</p>`;
}

function renderBETPage() {
    return `<h1 class="page-title">Partenaires BET</h1><p>Page en construction...</p>`;
}

// Lance l'application au chargement du DOM
ready(() => {
    initApp().catch(console.error);
});
