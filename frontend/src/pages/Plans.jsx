import React, { useState } from 'react';
import { usePlan, planFeatures } from '../context/PlanContext';
import { Ruler, Crown, Lightbulb } from 'lucide-react';

export default function Plans() {
  const { currentPlan, changePlan, getPlanInfo } = usePlan();
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [devisForm, setDevisForm] = useState({
    entreprise: '',
    nom: '',
    email: '',
    telephone: '',
    nombreUtilisateurs: '',
    besoinsSpecifiques: '',
    budget: ''
  });

  const handleChoosePlan = (planName) => {
    if (currentPlan === planName) return;
    
    // Si c'est ENTERPRISE, ouvrir le modal de devis
    if (planName === 'ENTERPRISE') {
      setShowDevisModal(true);
      return;
    }
    
    // Ouvrir le modal de paiement pour STARTER et PREMIUM
    setSelectedPlanForPayment(planName);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!paymentForm.cardNumber || !paymentForm.cardName || !paymentForm.expiryDate || !paymentForm.cvv) {
      if (window.showToast) {
        window.showToast('⚠️ Veuillez remplir toutes les informations de paiement', 'warning');
      } else {
        alert('⚠️ Veuillez remplir toutes les informations de paiement');
      }
      return;
    }

    // Validation numéro de carte (simple)
    const cardNumberClean = paymentForm.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
      if (window.showToast) {
        window.showToast('⚠️ Numéro de carte invalide (16 chiffres requis)', 'warning');
      } else {
        alert('⚠️ Numéro de carte invalide');
      }
      return;
    }

    // Simulation paiement (en production, appeler Stripe/PayPal API)

    // Simuler un délai de traitement
    if (window.showToast) {
      window.showToast('⏳ Traitement du paiement en cours...', 'info');
    }

    setTimeout(() => {
      // Activer le plan
      if (changePlan(selectedPlanForPayment)) {
        if (window.showToast) {
          window.showToast(`✅ Paiement validé ! Plan ${selectedPlanForPayment} activé avec succès`, 'success');
        } else {
          alert(`✅ Paiement validé ! Plan ${selectedPlanForPayment} activé avec succès`);
        }
        
        // Réinitialiser le formulaire
        setPaymentForm({
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: '',
          billingAddress: '',
          city: '',
          postalCode: '',
          country: 'France'
        });
        setShowPaymentModal(false);
        setSelectedPlanForPayment(null);
      }
    }, 1500);
  };

  const handleSubmitDevis = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!devisForm.entreprise || !devisForm.nom || !devisForm.email || !devisForm.telephone) {
      if (window.showToast) {
        window.showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'warning');
      } else {
        alert('⚠️ Veuillez remplir tous les champs obligatoires');
      }
      return;
    }

    // Simulation envoi (en production, appeler une API)
    
    if (window.showToast) {
      window.showToast('✅ Demande de devis envoyée ! Notre équipe vous contactera sous 24h.', 'success');
    } else {
      alert('✅ Demande de devis envoyée ! Notre équipe vous contactera sous 24h.');
    }
    
    // Réinitialiser et fermer
    setDevisForm({
      entreprise: '',
      nom: '',
      email: '',
      telephone: '',
      nombreUtilisateurs: '',
      besoinsSpecifiques: '',
      budget: ''
    });
    setShowDevisModal(false);
  };

  const plans = [
    {
      nom: 'STARTER',
      prix: '29€',
      periode: '/mois',
      description: 'Pour démarrer votre activité',
      features: planFeatures.STARTER.features,
      color: 'var(--info-color)'
    },
    {
      nom: 'PREMIUM',
      prix: '79€',
      periode: '/mois',
      description: 'Le plus populaire',
      features: planFeatures.PREMIUM.features,
      color: 'var(--primary-color)',
      badge: 'Populaire'
    },
    {
      nom: 'ENTERPRISE',
      prix: '199€',
      periode: '/mois',
      description: 'Pour les grandes agences',
      features: planFeatures.ENTERPRISE.features,
      color: 'var(--accent-color)'
    }
  ];

  return (
    <div>
      <h2 style={{fontSize: '24px', marginBottom: '10px'}}><Ruler size={20} /> Plans & Tarifs</h2>
      <p style={{opacity: 0.7, marginBottom: '30px'}}>
        Choisissez l'offre qui correspond à vos besoins
      </p>

      <div className="alert alert-info" style={{marginBottom: '30px'}}>
        🎉 Votre plan actuel : <strong>{currentPlan}</strong>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px'}}>
        {plans.map(plan => (
          <div 
            key={plan.nom} 
            className="card" 
            style={{
              border: currentPlan === plan.nom ? `2px solid ${plan.color}` : undefined,
              position: 'relative',
              padding: '30px 20px'
            }}
          >
            {plan.badge && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                background: plan.color,
                color: 'white',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {plan.badge}
              </div>
            )}

            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <h3 style={{fontSize: '20px', marginBottom: '10px', color: plan.color}}>
                {plan.nom}
              </h3>
              <div style={{fontSize: '14px', opacity: 0.7, marginBottom: '15px'}}>
                {plan.description}
              </div>
              <div style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '5px'}}>
                {plan.prix}
              </div>
              <div style={{fontSize: '14px', opacity: 0.6}}>
                {plan.periode}
              </div>
            </div>

            <div className="divider"></div>

            <div style={{marginBottom: '20px'}}>
              {plan.features.map((feature, index) => {
                const isIncluded = !feature.startsWith('❌');
                return (
                  <div key={index} style={{
                    padding: '8px 0', 
                    fontSize: '14px',
                    color: isIncluded ? 'inherit' : 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{isIncluded ? '✅' : '❌'}</span>
                    <span>{feature.replace(/^(✅|❌)\s*/, '')}</span>
                  </div>
                );
              })}
            </div>

            <button 
              className="btn" 
              onClick={() => handleChoosePlan(plan.nom)}
              style={{
                width: '100%',
                background: currentPlan === plan.nom ? 'var(--success-color)' : plan.nom === 'ENTERPRISE' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined,
                cursor: currentPlan === plan.nom ? 'default' : 'pointer'
              }}
              disabled={currentPlan === plan.nom}
            >
              {currentPlan === plan.nom ? '✓ Plan actuel' : plan.nom === 'ENTERPRISE' ? '📧 Demander un devis' : 'Choisir ce plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal Paiement pour STARTER et PREMIUM */}
      {showPaymentModal && selectedPlanForPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <div>
                <h2 style={{margin: 0, marginBottom: '5px'}}>💳 Paiement sécurisé</h2>
                <p style={{opacity: 0.7, fontSize: '14px', margin: 0}}>
                  Activation du plan <strong>{selectedPlanForPayment}</strong> - {planFeatures[selectedPlanForPayment]?.prix}/mois
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              {/* Récapitulatif plan */}
              <div style={{
                padding: '15px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                marginBottom: '20px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <span style={{fontWeight: 'bold'}}>Plan {selectedPlanForPayment}</span>
                  <span style={{fontSize: '20px', fontWeight: 'bold', color: '#3b82f6'}}>
                    {planFeatures[selectedPlanForPayment]?.prix}/mois
                  </span>
                </div>
                <div style={{fontSize: '13px', opacity: 0.8}}>
                  Facturation mensuelle • Annulation à tout moment • 14 jours d'essai gratuit
                </div>
              </div>

              <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
                {/* Numéro de carte */}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Numéro de carte *
                  </label>
                  <input 
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => {
                      // Formater le numéro avec espaces tous les 4 chiffres
                      let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      value = value.match(/.{1,4}/g)?.join(' ') || value;
                      setPaymentForm({...paymentForm, cardNumber: value});
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '16px'}}
                    required
                  />
                  <div style={{fontSize: '11px', opacity: 0.6, marginTop: '4px', display: 'flex', gap: '5px'}}>
                    <span>💳 Visa</span>
                    <span>💳 Mastercard</span>
                    <span>💳 Amex</span>
                  </div>
                </div>

                {/* Nom sur la carte */}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Nom sur la carte *
                  </label>
                  <input 
                    type="text"
                    value={paymentForm.cardName}
                    onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value.toUpperCase()})}
                    placeholder="JEAN DUPONT"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', textTransform: 'uppercase'}}
                    required
                  />
                </div>

                {/* Date expiration et CVV */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Date d'expiration *
                    </label>
                    <input 
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setPaymentForm({...paymentForm, expiryDate: value});
                      }}
                      placeholder="MM/AA"
                      maxLength="5"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'monospace'}}
                      required
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      CVV *
                    </label>
                    <input 
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setPaymentForm({...paymentForm, cvv: value});
                      }}
                      placeholder="123"
                      maxLength="3"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'monospace'}}
                      required
                    />
                  </div>
                </div>

                <div className="divider"></div>

                {/* Adresse de facturation */}
                <h4 style={{margin: 0, fontSize: '14px', fontWeight: 600}}>Adresse de facturation</h4>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Adresse
                  </label>
                  <input 
                    type="text"
                    value={paymentForm.billingAddress}
                    onChange={(e) => setPaymentForm({...paymentForm, billingAddress: e.target.value})}
                    placeholder="15 rue de la République"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', boxSizing: 'border-box'}}
                  />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Ville
                    </label>
                    <input 
                      type="text"
                      value={paymentForm.city}
                      onChange={(e) => setPaymentForm({...paymentForm, city: e.target.value})}
                      placeholder="Paris"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Code postal
                    </label>
                    <input 
                      type="text"
                      value={paymentForm.postalCode}
                      onChange={(e) => setPaymentForm({...paymentForm, postalCode: e.target.value})}
                      placeholder="75001"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                    />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Pays
                  </label>
                  <select 
                    value={paymentForm.country}
                    onChange={(e) => setPaymentForm({...paymentForm, country: e.target.value})}
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              {/* Info sécurité */}
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{fontSize: '20px'}}>🔒</span>
                <div style={{opacity: 0.9}}>
                  <strong>Paiement 100% sécurisé</strong><br />
                  Vos informations sont cryptées et protégées par SSL
                </div>
              </div>

              {/* Boutons */}
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
                >
                  💳 Valider le paiement
                </button>
                <button 
                  type="button"
                  className="btn-secondary" 
                  onClick={() => setShowPaymentModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Demande de Devis ENTERPRISE */}
      {showDevisModal && (
        <div className="modal-overlay" onClick={() => setShowDevisModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <div>
                <h2 style={{margin: 0, marginBottom: '5px'}}><Crown size={20} /> Demande de devis ENTERPRISE</h2>
                <p style={{opacity: 0.7, fontSize: '14px', margin: 0}}>
                  Notre équipe vous contactera sous 24h pour une offre sur mesure
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setShowDevisModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitDevis}>
              <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
                {/* Entreprise */}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Nom de l'entreprise *
                  </label>
                  <input 
                    type="text"
                    value={devisForm.entreprise}
                    onChange={(e) => setDevisForm({...devisForm, entreprise: e.target.value})}
                    placeholder="Ex: Cabinet d'Architecture DUPONT"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                    required
                  />
                </div>

                {/* Nom contact */}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Nom du contact *
                  </label>
                  <input 
                    type="text"
                    value={devisForm.nom}
                    onChange={(e) => setDevisForm({...devisForm, nom: e.target.value})}
                    placeholder="Ex: Jean Dupont"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                    required
                  />
                </div>

                {/* Email et téléphone */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Email professionnel *
                    </label>
                    <input 
                      type="email"
                      value={devisForm.email}
                      onChange={(e) => setDevisForm({...devisForm, email: e.target.value})}
                      placeholder="contact@entreprise.fr"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', boxSizing: 'border-box'}}
                      required
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Téléphone *
                    </label>
                    <input 
                      type="tel"
                      value={devisForm.telephone}
                      onChange={(e) => setDevisForm({...devisForm, telephone: e.target.value})}
                      placeholder="01 23 45 67 89"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                      required
                    />
                  </div>
                </div>

                {/* Nombre d'utilisateurs et budget */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Nombre d'utilisateurs
                    </label>
                    <input 
                      type="number"
                      value={devisForm.nombreUtilisateurs}
                      onChange={(e) => setDevisForm({...devisForm, nombreUtilisateurs: e.target.value})}
                      placeholder="Ex: 20"
                      min="1"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                      Budget mensuel estimé
                    </label>
                    <input 
                      type="text"
                      value={devisForm.budget}
                      onChange={(e) => setDevisForm({...devisForm, budget: e.target.value})}
                      placeholder="Ex: 500-1000€"
                      style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px'}}
                    />
                  </div>
                </div>

                {/* Besoins spécifiques */}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>
                    Besoins spécifiques
                  </label>
                  <textarea 
                    value={devisForm.besoinsSpecifiques}
                    onChange={(e) => setDevisForm({...devisForm, besoinsSpecifiques: e.target.value})}
                    placeholder="Décrivez vos besoins particuliers, intégrations souhaitées, volume de projets, etc."
                    rows="4"
                    style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', resize: 'vertical'}}
                  />
                </div>
              </div>

              {/* Info box */}
              <div style={{
                padding: '15px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '20px'
              }}>
                <div style={{display: 'flex', alignItems: 'start', gap: '10px'}}>
                  <span style={{fontSize: '20px'}}><Lightbulb size={20} /></span>
                  <div style={{fontSize: '13px', opacity: 0.9}}>
                    <strong>Ce que vous obtiendrez :</strong>
                    <ul style={{margin: '8px 0 0 0', paddingLeft: '20px'}}>
                      <li>Devis personnalisé sous 24h</li>
                      <li>Présentation en visio avec un expert</li>
                      <li>Configuration sur mesure</li>
                      <li>Chargé de compte dédié</li>
                      <li>Formation de votre équipe incluse</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{flex: 1, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}
                >
                  📧 Envoyer la demande
                </button>
                <button 
                  type="button"
                  className="btn-secondary" 
                  onClick={() => setShowDevisModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{marginBottom: '15px'}}>❓ Questions fréquentes</h3>
        
        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', padding: '10px 0'}}>
            Puis-je changer de plan à tout moment ?
          </summary>
          <p style={{paddingLeft: '20px', opacity: 0.8}}>
            Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement.
          </p>
        </details>

        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', padding: '10px 0'}}>
            Y a-t-il une période d'engagement ?
          </summary>
          <p style={{paddingLeft: '20px', opacity: 0.8}}>
            Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.
          </p>
        </details>

        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', padding: '10px 0'}}>
            Proposez-vous une période d'essai gratuite ?
          </summary>
          <p style={{paddingLeft: '20px', opacity: 0.8}}>
            Oui, nous offrons 14 jours d'essai gratuit sur tous les plans, sans carte bancaire requise.
          </p>
        </details>

        <details style={{marginBottom: '15px'}}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', padding: '10px 0'}}>
            Comment se passe la facturation ?
          </summary>
          <p style={{paddingLeft: '20px', opacity: 0.8}}>
            La facturation est mensuelle et automatique. Vous recevez une facture par email à chaque paiement.
          </p>
        </details>

        <details>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', padding: '10px 0'}}>
            <Crown size={16} /> Comment fonctionne le plan ENTERPRISE ?
          </summary>
          <p style={{paddingLeft: '20px', opacity: 0.8, marginBottom: '10px'}}>
            Le plan ENTERPRISE est entièrement personnalisé selon vos besoins. Après avoir demandé un devis :
          </p>
          <ul style={{paddingLeft: '40px', opacity: 0.8}}>
            <li>Notre équipe vous contacte sous 24h</li>
            <li>Nous analysons vos besoins spécifiques</li>
            <li>Vous recevez une offre sur mesure avec tarif dégressif</li>
            <li>Démo personnalisée et formation incluses</li>
            <li>Chargé de compte dédié pour votre entreprise</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
