/**
 * Page Tarifs vanilla JS
 */

import { Component } from '../core/component';

const PLANS = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    features: [
      '5 appels d\'offres',
      '10 références',
      'Calcul d\'honoraires basique',
      'Support email'
    ],
    cta: 'Commencer',
    popular: false
  },
  {
    name: 'Pro',
    price: '29€',
    period: '/mois',
    features: [
      'Appels d\'offres illimités',
      'Références illimitées',
      'Calcul d\'honoraires avancé',
      'Export PDF/Excel',
      'Gestion d\'équipe',
      'Support prioritaire'
    ],
    cta: 'Essai gratuit 14 jours',
    popular: true
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    period: '',
    features: [
      'Tout Pro inclus',
      'Multi-utilisateurs',
      'API personnalisée',
      'Formation dédiée',
      'Support 24/7',
      'Hébergement dédié'
    ],
    cta: 'Nous contacter',
    popular: false
  }
];

export class PricingPage extends Component {
  render() {
    return `
      <div class="pricing-page">
        <div class="container">
          <div class="pricing-header">
            <h1>Tarifs simples et transparents</h1>
            <p>Choisissez le plan adapté à vos besoins</p>
          </div>

          <div class="pricing-grid">
            ${PLANS.map(plan => `
              <div class="pricing-card card ${plan.popular ? 'popular' : ''}">
                ${plan.popular ? '<div class="popular-badge">Populaire</div>' : ''}
                <div class="pricing-card-header">
                  <h3>${plan.name}</h3>
                  <div class="price">
                    <span class="amount">${plan.price}</span>
                    <span class="period">${plan.period}</span>
                  </div>
                </div>
                <ul class="features-list">
                  ${plan.features.map(f => `
                    <li>✓ ${f}</li>
                  `).join('')}
                </ul>
                <a href="/login" class="btn ${plan.popular ? '' : 'btn-secondary'} btn-block" data-link>
                  ${plan.cta}
                </a>
              </div>
            `).join('')}
          </div>

          <div class="pricing-faq">
            <h2>Questions fréquentes</h2>
            <div class="faq-grid">
              <div class="faq-item">
                <h4>Puis-je changer de plan à tout moment ?</h4>
                <p>Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. La facturation sera ajustée au prorata.</p>
              </div>
              <div class="faq-item">
                <h4>Y a-t-il un engagement ?</h4>
                <p>Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.</p>
              </div>
              <div class="faq-item">
                <h4>Mes données sont-elles sécurisées ?</h4>
                <p>Oui, vos données sont chiffrées et stockées sur des serveurs sécurisés en France.</p>
              </div>
              <div class="faq-item">
                <h4>Proposez-vous des réductions ?</h4>
                <p>Oui, nous offrons -20% sur les abonnements annuels et des tarifs préférentiels pour les associations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default PricingPage;
