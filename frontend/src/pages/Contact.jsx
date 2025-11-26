import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    entreprise: '',
    telephone: '',
    sujet: 'question',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.email || !formData.message) {
      if (window.showToast) {
        window.showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'warning');
      } else {
        alert('⚠️ Veuillez remplir tous les champs obligatoires');
      }
      return;
    }

    // Simulation envoi (en production: API backend)
    console.log('Contact form submitted:', formData);
    
    setSubmitted(true);
    if (window.showToast) {
      window.showToast('✅ Message envoyé ! Nous vous répondrons sous 24h', 'success');
    }

    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nom: '',
        email: '',
        entreprise: '',
        telephone: '',
        sujet: 'question',
        message: ''
      });
    }, 3000);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{margin: '0', fontSize: 'clamp(20px, 5vw, 28px)'}}>
            📞 Contact & Support
          </h2>
          <p style={{margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px'}}>
            Une question ? Contactez notre équipe
          </p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        {/* Email */}
        <div className="card">
          <div style={{fontSize: '32px', marginBottom: '10px'}}>✉️</div>
          <h3 style={{fontSize: '18px', marginBottom: '8px'}}>Email</h3>
          <p style={{opacity: 0.7, fontSize: '14px', marginBottom: '10px'}}>
            support@wiw-app.com
          </p>
          <p style={{opacity: 0.5, fontSize: '12px'}}>
            Réponse sous 24h
          </p>
        </div>

        {/* Téléphone */}
        <div className="card">
          <div style={{fontSize: '32px', marginBottom: '10px'}}>📱</div>
          <h3 style={{fontSize: '18px', marginBottom: '8px'}}>Téléphone</h3>
          <p style={{opacity: 0.7, fontSize: '14px', marginBottom: '10px'}}>
            +33 1 23 45 67 89
          </p>
          <p style={{opacity: 0.5, fontSize: '12px'}}>
            Lun-Ven 9h-18h
          </p>
        </div>

        {/* Documentation */}
        <div className="card">
          <div style={{fontSize: '32px', marginBottom: '10px'}}>📚</div>
          <h3 style={{fontSize: '18px', marginBottom: '8px'}}>Documentation</h3>
          <p style={{opacity: 0.7, fontSize: '14px', marginBottom: '10px'}}>
            Centre d'aide
          </p>
          <button 
            className="btn" 
            style={{fontSize: '12px', padding: '6px 12px'}}
            onClick={() => {
              if (window.showToast) {
                window.showToast('📚 Documentation en cours de développement', 'info');
              }
            }}
          >
            Consulter
          </button>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="card">
        <h3 style={{marginBottom: '20px'}}>Envoyez-nous un message</h3>
        
        {submitted ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            border: '2px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{fontSize: '64px', marginBottom: '20px'}}>✅</div>
            <h3 style={{marginBottom: '10px', color: '#10b981'}}>Message envoyé !</h3>
            <p style={{opacity: 0.8}}>Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px'}}>
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="Jean Dupont"
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="jean.dupont@exemple.fr"
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Entreprise</label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                  placeholder="Cabinet Architecture"
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  placeholder="06 12 34 56 78"
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '15px'}}>
              <label>Sujet</label>
              <select
                value={formData.sujet}
                onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
              >
                <option value="question">Question générale</option>
                <option value="demo">Demande de démo</option>
                <option value="technique">Support technique</option>
                <option value="commercial">Question commerciale</option>
                <option value="partenariat">Partenariat</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-group" style={{marginBottom: '20px'}}>
              <label>Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Décrivez votre besoin ou votre question..."
                rows="6"
                required
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)', resize: 'vertical'}}
              />
            </div>

            <button type="submit" className="btn" style={{padding: '12px 30px'}}>
              📤 Envoyer le message
            </button>
          </form>
        )}
      </div>

      {/* FAQ Section */}
      <div className="card" style={{marginTop: '30px'}}>
        <h3 style={{marginBottom: '20px'}}>❓ Questions fréquentes</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <details className="card" style={{padding: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', fontSize: '15px', marginBottom: '10px'}}>
              Comment démarrer avec WIW ?
            </summary>
            <p style={{opacity: 0.8, fontSize: '14px', marginTop: '10px', lineHeight: '1.6'}}>
              Créez votre compte, choisissez votre plan (essai gratuit 14 jours), puis accédez au tableau de bord. Notre équipe peut vous accompagner pour une démo personnalisée.
            </p>
          </details>

          <details className="card" style={{padding: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', fontSize: '15px', marginBottom: '10px'}}>
              Puis-je changer de plan à tout moment ?
            </summary>
            <p style={{opacity: 0.8, fontSize: '14px', marginTop: '10px', lineHeight: '1.6'}}>
              Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements sont effectifs immédiatement.
            </p>
          </details>

          <details className="card" style={{padding: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', fontSize: '15px', marginBottom: '10px'}}>
              Mes données sont-elles sécurisées ?
            </summary>
            <p style={{opacity: 0.8, fontSize: '14px', marginTop: '10px', lineHeight: '1.6'}}>
              Absolument. Nous utilisons un chiffrement de niveau bancaire (SSL/TLS), des sauvegardes quotidiennes et nos serveurs sont hébergés en France (conformité RGPD).
            </p>
          </details>

          <details className="card" style={{padding: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', fontSize: '15px', marginBottom: '10px'}}>
              Proposez-vous une formation ?
            </summary>
            <p style={{opacity: 0.8, fontSize: '14px', marginTop: '10px', lineHeight: '1.6'}}>
              Oui, nous proposons des webinaires gratuits chaque semaine et des formations personnalisées pour les plans PREMIUM et ENTERPRISE.
            </p>
          </details>

          <details className="card" style={{padding: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', fontSize: '15px', marginBottom: '10px'}}>
              Quels sont les moyens de paiement acceptés ?
            </summary>
            <p style={{opacity: 0.8, fontSize: '14px', marginTop: '10px', lineHeight: '1.6'}}>
              Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les virements bancaires et les prélèvements SEPA pour les abonnements annuels.
            </p>
          </details>
        </div>
      </div>

      {/* Horaires support */}
      <div className="card" style={{marginTop: '30px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
        <h3 style={{marginBottom: '15px', color: '#3b82f6'}}>🕐 Horaires du support</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px'}}>
          <div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Lundi - Vendredi</div>
            <div style={{opacity: 0.7}}>9h00 - 18h00</div>
          </div>
          <div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Samedi</div>
            <div style={{opacity: 0.7}}>10h00 - 16h00</div>
          </div>
          <div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Dimanche</div>
            <div style={{opacity: 0.7}}>Fermé</div>
          </div>
          <div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Jours fériés</div>
            <div style={{opacity: 0.7}}>Fermé</div>
          </div>
        </div>
        <p style={{marginTop: '15px', fontSize: '13px', opacity: 0.7}}>
          <Lightbulb size={16} /> Pour les urgences (plan ENTERPRISE), contactez le +33 6 00 00 00 00 (24/7)
        </p>
      </div>
    </div>
  );
}
