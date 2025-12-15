/**
 * Page Landing - WiW AE+
 */

import { icons } from '../components/icons.js';

export function renderLanding() {
    return `
        <div class="landing-page">
            <!-- Hero Section -->
            <section class="landing-hero">
                <div class="landing-hero-content">
                    <h1 class="landing-hero-title">
                        WiW AE+
                    </h1>
                    <p class="landing-hero-description">
                        La solution complète pour les architectes et économistes de la construction.
                        Gérez vos appels d'offres, honoraires, équipes et projets en toute simplicité.
                    </p>
                    <div class="flex gap-md justify-center flex-wrap">
                        <a href="/login" class="btn btn-primary btn-lg">
                            Commencer gratuitement
                            ${icons.arrowRight}
                        </a>
                        <a href="/pricing" class="btn btn-outline btn-lg">
                            Voir les tarifs
                        </a>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="landing-features">
                <div class="text-center mb-2xl">
                    <h2 class="text-3xl font-bold mb-md">Tout ce dont vous avez besoin</h2>
                    <p class="text-secondary max-w-2xl mx-auto">
                        Des outils puissants et intuitifs pour optimiser votre activité
                    </p>
                </div>

                <div class="landing-features-grid">
                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.briefcase}</div>
                        <h3 class="landing-feature-title">Appels d'offres</h3>
                        <p class="landing-feature-description">
                            Suivez vos AO de A à Z avec un pipeline visuel et des alertes automatiques
                        </p>
                    </div>

                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.calculator}</div>
                        <h3 class="landing-feature-title">Calcul d'honoraires</h3>
                        <p class="landing-feature-description">
                            Calculez vos honoraires avec précision grâce à nos scénarios personnalisables
                        </p>
                    </div>

                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.users}</div>
                        <h3 class="landing-feature-title">Gestion d'équipe</h3>
                        <p class="landing-feature-description">
                            Gérez vos collaborateurs, compétences et disponibilités
                        </p>
                    </div>

                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.fileText}</div>
                        <h3 class="landing-feature-title">Devis professionnels</h3>
                        <p class="landing-feature-description">
                            Créez et envoyez des devis professionnels en quelques clics
                        </p>
                    </div>

                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.barChart}</div>
                        <h3 class="landing-feature-title">Analytique</h3>
                        <p class="landing-feature-description">
                            Visualisez vos performances avec des tableaux de bord détaillés
                        </p>
                    </div>

                    <div class="landing-feature-card card card-hover">
                        <div class="landing-feature-icon">${icons.award}</div>
                        <h3 class="landing-feature-title">Références</h3>
                        <p class="landing-feature-description">
                            Constituez et valorisez votre portfolio de références projets
                        </p>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="py-3xl px-xl text-center">
                <h2 class="text-2xl font-bold mb-md">Prêt à optimiser votre activité ?</h2>
                <p class="text-secondary mb-xl">
                    Rejoignez des centaines d'architectes et économistes qui utilisent WiW AE+
                </p>
                <a href="/login" class="btn btn-primary btn-lg">
                    Démarrer maintenant
                </a>
            </section>

            <!-- Footer -->
            <footer class="py-xl px-xl bg-secondary border-t">
                <div class="max-w-screen mx-auto flex flex-wrap justify-between gap-lg">
                    <div>
                        <div class="flex items-center gap-sm mb-md">
                            <div class="sidebar-logo" style="width: 2rem; height: 2rem; font-size: 1rem;">W</div>
                            <span class="font-bold">WiW AE+</span>
                        </div>
                        <p class="text-muted text-sm">
                            Solution de gestion pour architectes et économistes
                        </p>
                    </div>

                    <div class="flex gap-xl">
                        <div>
                            <h4 class="font-semibold mb-sm">Produit</h4>
                            <ul class="text-sm text-muted flex flex-col gap-xs">
                                <li><a href="/pricing">Tarifs</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-sm">Légal</h4>
                            <ul class="text-sm text-muted flex flex-col gap-xs">
                                <li><a href="/legal">Mentions légales</a></li>
                                <li><a href="/legal">CGU</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="text-center text-muted text-sm mt-xl pt-xl border-t">
                    © ${new Date().getFullYear()} WiW AE+. Tous droits réservés.
                </div>
            </footer>
        </div>
    `;
}

export default renderLanding;
