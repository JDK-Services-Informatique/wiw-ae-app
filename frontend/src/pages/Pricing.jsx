import React from 'react';
import { usePlan } from '../context/PlanContext';
import { Star, Crown, Euro, BarChart3, ClipboardList, Target } from 'lucide-react';

export default function Pricing() {
  const { currentPlan, handleChoosePlan } = usePlan();
  const [billingCycle, setBillingCycle] = React.useState('monthly'); // monthly or yearly
  const [faqExpanded, setFaqExpanded] = React.useState(null);

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      icon: '🚀',
      monthlyPrice: 29,
      yearlyPrice: 290, // 2 mois offerts
      description: 'Parfait pour démarrer',
      features: [
        { text: 'Gestion des honoraires', included: true },
        { text: 'Suivi des appels d\'offres', included: true },
        { text: 'Tableau de bord analytics', included: true },
        { text: 'Calendrier de projets', included: true },
        { text: '5 projets actifs', included: true },
        { text: '1 utilisateur', included: true },
        { text: 'Support email', included: true },
        { text: 'Templates de base', included: true },
        { text: 'Export PDF', included: false },
        { text: 'Gestion d\'équipe', included: false },
        { text: 'API access', included: false },
        { text: 'Support prioritaire', included: false }
      ],
      cta: 'Démarrer gratuitement',
      popular: false,
      limits: {
        projects: 5,
        users: 1,
        storage: '2 GB'
      }
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      icon: <Star size={24} />,
      monthlyPrice: 79,
      yearlyPrice: 790, // 2 mois offerts
      description: 'Pour les professionnels exigeants',
      features: [
        { text: 'Toutes les fonctionnalités Starter', included: true },
        { text: 'Export PDF personnalisé', included: true },
        { text: 'Gestion d\'équipe complète', included: true },
        { text: 'Projets illimités', included: true },
        { text: 'Jusqu\'à 5 utilisateurs', included: true },
        { text: 'Support prioritaire (24h)', included: true },
        { text: 'Templates avancés', included: true },
        { text: 'Médiathèque 10 GB', included: true },
        { text: 'Module BET & Références', included: true },
        { text: 'Rapports avancés', included: true },
        { text: 'API access', included: false },
        { text: 'Support dédié', included: false }
      ],
      cta: 'Essayer 14 jours',
      popular: true,
      limits: {
        projects: 'Illimité',
        users: 5,
        storage: '10 GB'
      }
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      icon: <Crown size={24} />,
      monthlyPrice: 199,
      yearlyPrice: 1990, // 2 mois offerts
      description: 'Solution complète sur mesure',
      features: [
        { text: 'Toutes les fonctionnalités Premium', included: true },
        { text: 'Utilisateurs illimités', included: true },
        { text: 'Stockage illimité', included: true },
        { text: 'API complète & webhooks', included: true },
        { text: 'Support dédié 24/7', included: true },
        { text: 'Onboarding personnalisé', included: true },
        { text: 'Formation sur site', included: true },
        { text: 'Personnalisation UI', included: true },
        { text: 'Intégrations sur mesure', included: true },
        { text: 'SLA garanti 99.9%', included: true },
        { text: 'Audit de sécurité', included: true },
        { text: 'Hébergement dédié (option)', included: true }
      ],
      cta: 'Demander un devis',
      popular: false,
      limits: {
        projects: 'Illimité',
        users: 'Illimité',
        storage: 'Illimité'
      }
    }
  ];

  const faqItems = [
    {
      question: 'Quelle est la différence entre les plans ?',
      answer: 'Le plan STARTER convient aux petites structures démarrant leur activité. Le plan PREMIUM offre des fonctionnalités avancées (export PDF, gestion d\'équipe, projets illimités) pour les professionnels établis. Le plan ENTERPRISE propose une solution complète sur mesure avec support dédié, formations et intégrations personnalisées.'
    },
    {
      question: 'Puis-je essayer gratuitement ?',
      answer: 'Oui ! Tous les plans incluent une période d\'essai gratuite de 14 jours sans engagement et sans carte bancaire requise. Vous pourrez tester toutes les fonctionnalités de la formule choisie avant de vous engager.'
    },
    {
      question: 'Comment se passe la facturation annuelle ?',
      answer: 'La facturation annuelle vous offre 2 mois gratuits par rapport au paiement mensuel. Le montant est facturé en une seule fois au début de la période annuelle. Vous pouvez changer de cycle de facturation à tout moment depuis votre espace compte.'
    },
    {
      question: 'Puis-je changer de plan en cours d\'abonnement ?',
      answer: 'Absolument ! Vous pouvez upgrader ou downgrader votre plan à tout moment. En cas d\'upgrade, la différence de prix sera calculée au prorata. En cas de downgrade, le crédit sera appliqué sur la période suivante.'
    },
    {
      question: 'Les données sont-elles sécurisées ?',
      answer: 'Oui, la sécurité est notre priorité. Vos données sont chiffrées en transit (SSL/TLS) et au repos. Nous effectuons des sauvegardes quotidiennes et nos serveurs sont hébergés dans des datacenters certifiés ISO 27001 en Europe. Conformité RGPD garantie.'
    },
    {
      question: 'Quelle est votre politique de remboursement ?',
      answer: 'Nous offrons une garantie satisfait ou remboursé de 30 jours sur tous nos plans. Si vous n\'êtes pas satisfait dans les 30 premiers jours, contactez-nous pour un remboursement intégral, sans justification.'
    },
    {
      question: 'Y a-t-il des frais cachés ?',
      answer: 'Non, absolument aucun frais caché. Le prix affiché est le prix final TTC (TVA 20% incluse pour la France). Aucun frais d\'installation, aucun engagement de durée (hors abonnement annuel choisi volontairement).'
    },
    {
      question: 'Puis-je obtenir une démo personnalisée ?',
      answer: 'Oui, pour le plan ENTERPRISE, nous proposons des démos personnalisées d\'une heure avec nos experts pour comprendre vos besoins spécifiques. Contactez-nous via le formulaire de contact ou à contact@wiw-app.com.'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyTotal = plan.yearlyPrice;
    return monthlyTotal - yearlyTotal;
  };

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: '50px'
      }}>
        <h1 style={{
          margin: '0 0 15px 0',
          fontSize: 'clamp(28px, 6vw, 42px)',
          background: 'linear-gradient(135deg, var(--brand), var(--brand-hover))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💎 Tarifs Transparents
        </h1>
        <p style={{
          margin: '0 0 30px 0',
          fontSize: 'clamp(15px, 3vw, 18px)',
          opacity: 0.8,
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Choisissez la formule qui correspond à vos besoins.<br />
          14 jours d'essai gratuit · Sans engagement · Sans carte bancaire
        </p>

        {/* Billing Cycle Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--card-bg)',
          borderRadius: '50px',
          padding: '5px',
          gap: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button
            className={billingCycle === 'monthly' ? 'btn' : 'btn-secondary'}
            onClick={() => setBillingCycle('monthly')}
            style={{
              borderRadius: '50px',
              padding: '12px 30px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Mensuel
          </button>
          <button
            className={billingCycle === 'yearly' ? 'btn' : 'btn-secondary'}
            onClick={() => setBillingCycle('yearly')}
            style={{
              borderRadius: '50px',
              padding: '12px 30px',
              fontSize: '14px',
              fontWeight: '600',
              position: 'relative'
            }}
          >
            Annuel
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}>
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '60px'
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card"
            style={{
              position: 'relative',
              border: plan.popular ? '2px solid var(--brand)' : 'none',
              boxShadow: plan.popular ? '0 8px 25px rgba(124, 58, 237, 0.25)' : undefined,
              transform: plan.popular ? 'scale(1.05)' : undefined,
              transition: 'transform 0.3s ease'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--brand), var(--brand-hover))',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
              }}>
                <Star size={16} /> PLUS POPULAIRE
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{plan.icon}</div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{plan.name}</h2>
              <p style={{ margin: '0 0 20px 0', opacity: 0.7, fontSize: '14px' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  {getPrice(plan)}€
                  <span style={{ fontSize: '16px', opacity: 0.7, fontWeight: '400' }}>
                    /{billingCycle === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div style={{
                    fontSize: '13px',
                    color: '#10b981',
                    marginTop: '8px',
                    fontWeight: '600'
                  }}>
                    <Euro size={16} /> Économisez {getSavings(plan)}€/an
                  </div>
                )}
              </div>

              <button
                className={plan.popular ? 'btn' : 'btn-secondary'}
                onClick={() => handleChoosePlan(plan.id)}
                disabled={currentPlan === plan.id}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  opacity: currentPlan === plan.id ? 0.6 : 1
                }}
              >
                {currentPlan === plan.id ? '✓ Plan actuel' : plan.cta}
              </button>
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '20px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                opacity: 0.6,
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                Fonctionnalités incluses
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      opacity: feature.included ? 1 : 0.4
                    }}
                  >
                    <span style={{
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      {feature.included ? '✅' : '❌'}
                    </span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(124, 58, 237, 0.1)',
                borderRadius: '12px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}><BarChart3 size={16} /> Limites</div>
                <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  • Projets : {plan.limits.projects}<br />
                  • Utilisateurs : {plan.limits.users}<br />
                  • Stockage : {plan.limits.storage}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card" style={{ marginBottom: '60px', overflowX: 'auto' }}>
        <h2 style={{ marginBottom: '25px', textAlign: 'center' }}><ClipboardList size={16} /> Tableau comparatif détaillé</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--brand)' }}>
              <th style={{ textAlign: 'left', padding: '15px', fontWeight: '700' }}>Fonctionnalité</th>
              <th style={{ textAlign: 'center', padding: '15px', fontWeight: '700' }}>🚀 Starter</th>
              <th style={{ textAlign: 'center', padding: '15px', fontWeight: '700', background: 'rgba(124, 58, 237, 0.1)' }}><Star size={16} /> Premium</th>
              <th style={{ textAlign: 'center', padding: '15px', fontWeight: '700' }}><Crown size={16} /> Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Projets actifs', starter: '5', premium: 'Illimité', enterprise: 'Illimité' },
              { feature: 'Utilisateurs', starter: '1', premium: '5', enterprise: 'Illimité' },
              { feature: 'Stockage', starter: '2 GB', premium: '10 GB', enterprise: 'Illimité' },
              { feature: 'Gestion des honoraires', starter: '✅', premium: '✅', enterprise: '✅' },
              { feature: 'Appels d\'offres', starter: '✅', premium: '✅', enterprise: '✅' },
              { feature: 'Analytics & Rapports', starter: 'Basique', premium: 'Avancé', enterprise: 'Personnalisé' },
              { feature: 'Export PDF', starter: '❌', premium: '✅', enterprise: '✅' },
              { feature: 'Module BET', starter: '❌', premium: '✅', enterprise: '✅' },
              { feature: 'API Access', starter: '❌', premium: '❌', enterprise: '✅' },
              { feature: 'Support', starter: 'Email', premium: '24h', enterprise: 'Dédié 24/7' },
              { feature: 'Formation', starter: 'Vidéos', premium: 'Webinars', enterprise: 'Sur site' },
              { feature: 'SLA', starter: '-', premium: '-', enterprise: '99.9%' }
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '15px', fontWeight: '500' }}>{row.feature}</td>
                <td style={{ textAlign: 'center', padding: '15px', opacity: 0.8 }}>{row.starter}</td>
                <td style={{ textAlign: 'center', padding: '15px', opacity: 0.8, background: 'rgba(124, 58, 237, 0.05)' }}>{row.premium}</td>
                <td style={{ textAlign: 'center', padding: '15px', opacity: 0.8 }}>{row.enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ Section */}
      <div className="card" style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>❓ Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              open={faqExpanded === idx}
              onToggle={(e) => setFaqExpanded(e.target.open ? idx : null)}
              style={{
                background: 'rgba(124, 58, 237, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                cursor: 'pointer'
              }}
            >
              <summary style={{
                fontWeight: '600',
                fontSize: '16px',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {item.question}
                <span style={{ fontSize: '20px', opacity: 0.6 }}>
                  {faqExpanded === idx ? '−' : '+'}
                </span>
              </summary>
              <div style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                opacity: 0.8,
                lineHeight: '1.7'
              }}>
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card" style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(147, 51, 234, 0.2))',
        border: '2px solid var(--brand)',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '15px' }}><Target size={16} /> Prêt à transformer votre pratique ?</h2>
        <p style={{ marginBottom: '25px', opacity: 0.8, fontSize: '16px' }}>
          Démarrez dès maintenant avec 14 jours d'essai gratuit · Sans engagement · Sans carte bancaire
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={() => handleChoosePlan('PREMIUM')}
            style={{ padding: '14px 30px', fontSize: '16px', fontWeight: '600' }}
          >
            🚀 Essayer Premium gratuitement
          </button>
          <button
            className="btn-secondary"
            onClick={() => window.location.href = 'mailto:contact@wiw-app.com'}
            style={{ padding: '14px 30px', fontSize: '16px', fontWeight: '600' }}
          >
            💬 Contacter les ventes
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '13px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
          <div style={{ fontWeight: '600' }}>Paiement sécurisé</div>
          <div>Stripe & PayPal</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
          <div style={{ fontWeight: '600' }}>Conformité RGPD</div>
          <div>Données hébergées en France</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}><Euro size={24} /></div>
          <div style={{ fontWeight: '600' }}>Garantie 30 jours</div>
          <div>Satisfait ou remboursé</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📞</div>
          <div style={{ fontWeight: '600' }}>Support réactif</div>
          <div>Réponse sous 24h</div>
        </div>
      </div>
    </div>
  );
}
