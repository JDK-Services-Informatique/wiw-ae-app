/**
 * Page d'accueil (Landing) vanilla JS
 */

import { Component } from '../core/component';
import { router } from '../core/router';

export class LandingPage extends Component {
  render() {
    return `
      <div class="landing-page">
        <!-- Hero Section -->
        <section class="hero">
          <div class="container">
            <h1 class="hero-title">
              Gérez vos appels d'offres<br/>
              <span class="text-gradient">simplement et efficacement</span>
            </h1>
            <p class="hero-subtitle">
              WIW est la solution complète pour les architectes et ingénieurs
              qui souhaitent optimiser leur gestion de projets.
            </p>
            <div class="hero-actions">
              <a href="/login" class="btn btn-lg" data-link>
                Commencer gratuitement
              </a>
              <a href="/pricing" class="btn btn-secondary btn-lg" data-link>
                Voir les tarifs
              </a>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features">
          <div class="container">
            <h2 class="section-title">Fonctionnalités principales</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">📋</div>
                <h3>Gestion des AO</h3>
                <p>Suivez vos appels d'offres de A à Z avec un tableau de bord intuitif.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h3>Calcul d'honoraires</h3>
                <p>Calculez automatiquement vos honoraires selon les barèmes officiels.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📚</div>
                <h3>Références</h3>
                <p>Gérez votre portfolio de références et générez des fiches professionnelles.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">👥</div>
                <h3>Gestion d'équipe</h3>
                <p>Organisez votre équipe et attribuez les compétences par projet.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta">
          <div class="container">
            <h2>Prêt à commencer ?</h2>
            <p>Rejoignez des centaines de professionnels qui utilisent WIW au quotidien.</p>
            <a href="/login" class="btn btn-lg" data-link>
              Créer un compte gratuit
            </a>
          </div>
        </section>
      </div>
    `;
  }
}

export default LandingPage;
