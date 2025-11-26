import React from 'react';
import { ClipboardList, BarChart3, Target } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = React.useState('mentions');

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
            ⚖️ Mentions Légales & CGV
          </h2>
          <p style={{margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px'}}>
            Informations légales et conditions générales
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
        <button
          className={`btn ${activeTab === 'mentions' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('mentions')}
        >
          📄 Mentions légales
        </button>
        <button
          className={`btn ${activeTab === 'cgv' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cgv')}
        >
          <ClipboardList size={16} /> CGV
        </button>
        <button
          className={`btn ${activeTab === 'cgu' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cgu')}
        >
          📜 CGU
        </button>
        <button
          className={`btn ${activeTab === 'rgpd' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rgpd')}
        >
          🔒 RGPD
        </button>
        <button
          className={`btn ${activeTab === 'cookies' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cookies')}
        >
          🍪 Cookies
        </button>
      </div>

      {/* Content */}
      <div className="card">
        {activeTab === 'mentions' && (
          <div>
            <h2 style={{marginBottom: '20px'}}>Mentions Légales</h2>
            
            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>1. Éditeur du site</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              <strong>WIW SAS</strong><br />
              Société par Actions Simplifiée au capital de 50 000 €<br />
              Siège social : 123 Avenue de l'Architecture, 75016 Paris, France<br />
              RCS Paris B 123 456 789<br />
              SIRET : 123 456 789 00010<br />
              TVA intracommunautaire : FR 12 123456789
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>2. Directeur de publication</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              M. Jean DUPONT, Président<br />
              Contact : contact@wiw-app.com<br />
              Téléphone : +33 1 23 45 67 89
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>3. Hébergement</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand)'}}>vercel.com</a>
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>4. Propriété intellectuelle</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              L'ensemble du contenu de ce site (textes, images, vidéos, code source) est la propriété exclusive de WIW SAS ou de ses partenaires. 
              Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, 
              par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de WIW SAS.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>5. Contact</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Pour toute question relative aux mentions légales :<br />
              Email : legal@wiw-app.com<br />
              Courrier : WIW SAS - Service Juridique - 123 Avenue de l'Architecture, 75016 Paris
            </p>
          </div>
        )}

        {activeTab === 'cgv' && (
          <div>
            <h2 style={{marginBottom: '20px'}}>Conditions Générales de Vente (CGV)</h2>
            <p style={{opacity: 0.6, fontSize: '13px', marginBottom: '20px'}}>
              Dernière mise à jour : Novembre 2025
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>1. Objet</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Les présentes Conditions Générales de Vente (CGV) régissent la vente de services d'abonnement à la plateforme WIW 
              entre WIW SAS et toute personne physique ou morale (ci-après "le Client") souhaitant souscrire à nos services.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>2. Services proposés</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW propose trois formules d'abonnement :<br />
              • <strong>STARTER</strong> : 29€/mois - Fonctionnalités de base<br />
              • <strong>PREMIUM</strong> : 79€/mois - Fonctionnalités avancées<br />
              • <strong>ENTERPRISE</strong> : Sur devis - Solution complète personnalisée
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>3. Tarifs et paiement</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Les prix sont indiqués en euros HT. La TVA française (20%) s'applique pour les clients français. 
              Les paiements sont effectués par carte bancaire ou virement SEPA. L'abonnement est renouvelé automatiquement 
              chaque mois sauf résiliation avant la date d'échéance.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>4. Période d'essai</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Tout nouvel abonné bénéficie d'une période d'essai gratuite de 14 jours. Aucune carte bancaire n'est requise 
              pendant cette période. À l'issue de l'essai, l'abonnement payant démarre automatiquement sauf annulation.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>5. Résiliation</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Le Client peut résilier son abonnement à tout moment depuis son espace personnel. La résiliation prend effet 
              à la fin de la période d'abonnement en cours. Aucun remboursement n'est effectué pour la période déjà payée.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>6. Droit de rétractation</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Conformément à l'article L221-28 du Code de la consommation, le Client dispose d'un délai de 14 jours 
              pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>7. Garanties et responsabilité</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW s'engage à fournir un service de qualité avec un taux de disponibilité de 99,9%. La société ne peut être 
              tenue responsable des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>8. Loi applicable et juridiction</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Les présentes CGV sont régies par le droit français. En cas de litige, les tribunaux de Paris sont seuls compétents.
            </p>
          </div>
        )}

        {activeTab === 'cgu' && (
          <div>
            <h2 style={{marginBottom: '20px'}}>Conditions Générales d'Utilisation (CGU)</h2>
            <p style={{opacity: 0.6, fontSize: '13px', marginBottom: '20px'}}>
              Dernière mise à jour : Novembre 2025
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>1. Acceptation des conditions</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              L'accès et l'utilisation de la plateforme WIW impliquent l'acceptation pleine et entière des présentes 
              Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>2. Inscription et compte utilisateur</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Pour accéder aux services, l'utilisateur doit créer un compte avec des informations exactes et à jour. 
              L'utilisateur est responsable de la confidentialité de ses identifiants et de toutes les activités effectuées 
              sous son compte.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>3. Usage autorisé</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              La plateforme est destinée à un usage professionnel pour la gestion de projets architecturaux et de bureaux d'études. 
              L'utilisateur s'engage à ne pas :<br />
              • Utiliser le service à des fins illégales ou frauduleuses<br />
              • Tenter d'accéder de manière non autorisée au système<br />
              • Partager son compte avec des tiers non autorisés<br />
              • Extraire ou copier massivement des données<br />
              • Porter atteinte à la sécurité ou à l'intégrité du service
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>4. Propriété des données</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              L'utilisateur conserve l'intégralité des droits sur les données qu'il saisit dans la plateforme. 
              WIW s'engage à ne pas utiliser, divulguer ou commercialiser ces données sans autorisation expresse.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>5. Disponibilité du service</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW met tout en œuvre pour assurer une disponibilité maximale du service (objectif 99,9%). 
              Des interruptions programmées pour maintenance seront notifiées à l'avance. WIW ne peut être tenu 
              responsable des interruptions dues à des cas de force majeure.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>6. Modifications des CGU</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés 
              par email des modifications importantes. La poursuite de l'utilisation après modification vaut acceptation.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>7. Suspension et résiliation</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW se réserve le droit de suspendre ou résilier un compte en cas de violation des CGU, 
              de non-paiement ou de comportement abusif. L'utilisateur sera notifié et pourra récupérer ses données.
            </p>
          </div>
        )}

        {activeTab === 'rgpd' && (
          <div>
            <h2 style={{marginBottom: '20px'}}>Politique de Confidentialité (RGPD)</h2>
            <p style={{opacity: 0.6, fontSize: '13px', marginBottom: '20px'}}>
              Conformité au Règlement Général sur la Protection des Données (RGPD)<br />
              Dernière mise à jour : Novembre 2025
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>1. Responsable du traitement</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              WIW SAS, société au capital de 50 000 €, immatriculée au RCS de Paris sous le numéro B 123 456 789, 
              dont le siège social est situé 123 Avenue de l'Architecture, 75016 Paris.<br />
              Délégué à la Protection des Données (DPO) : dpo@wiw-app.com
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>2. Données collectées</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Nous collectons les données suivantes :<br />
              <strong>Données d'identification</strong> : nom, prénom, email, téléphone, adresse professionnelle<br />
              <strong>Données de facturation</strong> : coordonnées bancaires (via prestataire sécurisé Stripe)<br />
              <strong>Données d'utilisation</strong> : logs de connexion, actions effectuées, préférences<br />
              <strong>Données techniques</strong> : adresse IP, navigateur, système d'exploitation<br />
              <strong>Données métier</strong> : projets, appels d'offres, documents (propriété du client)
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>3. Finalités du traitement</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              • Gestion des comptes utilisateurs et authentification<br />
              • Fourniture et amélioration des services<br />
              • Facturation et gestion comptable<br />
              • Support client et assistance technique<br />
              • Communication marketing (avec consentement)<br />
              • Analyses statistiques anonymisées<br />
              • Respect des obligations légales
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>4. Base légale du traitement</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              • <strong>Exécution du contrat</strong> : gestion de l'abonnement et fourniture du service<br />
              • <strong>Obligation légale</strong> : facturation, comptabilité<br />
              • <strong>Consentement</strong> : communications marketing<br />
              • <strong>Intérêt légitime</strong> : sécurité, prévention de la fraude, amélioration du service
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>5. Durée de conservation</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              • Données de compte : pendant toute la durée de l'abonnement + 3 ans après résiliation<br />
              • Données de facturation : 10 ans (obligation légale)<br />
              • Logs de connexion : 12 mois<br />
              • Données marketing : 3 ans après dernier contact ou retrait du consentement
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>6. Destinataires des données</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Vos données peuvent être transmises à :<br />
              • Personnel autorisé de WIW (accès restreint)<br />
              • Prestataires techniques : hébergement (Vercel), paiement (Stripe), emailing (SendGrid)<br />
              • Autorités administratives et judiciaires (sur réquisition légale)<br />
              Les sous-traitants sont contractuellement tenus au respect du RGPD.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>7. Vos droits</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Conformément au RGPD, vous disposez des droits suivants :<br />
              • <strong>Droit d'accès</strong> : obtenir une copie de vos données<br />
              • <strong>Droit de rectification</strong> : corriger vos données inexactes<br />
              • <strong>Droit à l'effacement</strong> : supprimer vos données (sous conditions)<br />
              • <strong>Droit à la limitation</strong> : restreindre certains traitements<br />
              • <strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré<br />
              • <strong>Droit d'opposition</strong> : refuser certains traitements (marketing, profilage)<br />
              • <strong>Droit de retrait du consentement</strong> : retirer votre consentement à tout moment<br />
              <br />
              Pour exercer vos droits : dpo@wiw-app.com ou courrier postal avec justificatif d'identité
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>8. Sécurité des données</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Nous mettons en œuvre des mesures de sécurité appropriées :<br />
              • Chiffrement SSL/TLS pour toutes les communications<br />
              • Chiffrement des données sensibles en base de données<br />
              • Authentification sécurisée (hash bcrypt)<br />
              • Sauvegardes quotidiennes chiffrées<br />
              • Accès restreint aux données (principe du moindre privilège)<br />
              • Audits de sécurité réguliers<br />
              • Plan de réponse aux incidents de sécurité
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>9. Transferts internationaux</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Vos données sont hébergées dans des datacenters situés en France et dans l'Union Européenne. 
              Certains sous-traitants (Vercel) peuvent être situés hors UE (USA) mais respectent les clauses 
              contractuelles types validées par la Commission Européenne.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>10. Réclamation</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :<br />
              Commission Nationale de l'Informatique et des Libertés<br />
              3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07<br />
              Tél : 01 53 73 22 22 - Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand)'}}>cnil.fr</a>
            </p>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div>
            <h2 style={{marginBottom: '20px'}}>Politique des Cookies</h2>
            <p style={{opacity: 0.6, fontSize: '13px', marginBottom: '20px'}}>
              Dernière mise à jour : Novembre 2025
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>1. Qu'est-ce qu'un cookie ?</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) lors de la 
              visite d'un site web. Il permet de mémoriser des informations sur votre navigation et vos préférences.
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>2. Types de cookies utilisés</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              <strong>🔒 Cookies strictement nécessaires</strong> (pas de consentement requis)<br />
              • Cookie de session (authentification)<br />
              • Cookie de sécurité CSRF<br />
              • Cookie de préférence de langue<br />
              • Cookie de choix des cookies<br />
              Durée : session ou 12 mois maximum<br />
              <br />
              <strong><BarChart3 size={16} /> Cookies analytiques</strong> (consentement requis)<br />
              • Google Analytics : analyse d'audience, statistiques de visite<br />
              • Hotjar : analyse du comportement utilisateur (cartes de chaleur)<br />
              Durée : 13 mois<br />
              <br />
              <strong><Target size={16} /> Cookies marketing</strong> (consentement requis)<br />
              • Google Ads : publicités ciblées<br />
              • LinkedIn Insight : remarketing professionnel<br />
              Durée : 13 mois
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>3. Gestion de vos préférences</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Vous pouvez à tout moment modifier vos préférences en matière de cookies :<br />
              • Via le bandeau cookies lors de votre première visite<br />
              • Via les paramètres de votre navigateur<br />
              • En nous contactant : privacy@wiw-app.com
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>4. Paramétrage du navigateur</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Vous pouvez configurer votre navigateur pour refuser les cookies :<br />
              • <strong>Chrome</strong> : Paramètres &gt; Confidentialité et sécurité &gt; Cookies<br />
              • <strong>Firefox</strong> : Paramètres &gt; Vie privée et sécurité &gt; Cookies<br />
              • <strong>Safari</strong> : Préférences &gt; Confidentialité &gt; Cookies<br />
              • <strong>Edge</strong> : Paramètres &gt; Confidentialité, recherche et services &gt; Cookies
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>5. Impact du refus des cookies</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              Le refus de certains cookies peut limiter votre expérience :<br />
              • Cookies nécessaires : connexion impossible, perte de session<br />
              • Cookies analytiques : statistiques moins précises (aucun impact utilisateur)<br />
              • Cookies marketing : publicités moins pertinentes
            </p>

            <h3 style={{marginTop: '25px', marginBottom: '15px', fontSize: '18px'}}>6. Pour en savoir plus</h3>
            <p style={{opacity: 0.8, lineHeight: '1.8', marginBottom: '10px'}}>
              • CNIL : <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand)'}}>Guide des cookies</a><br />
              • AllAboutCookies : <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand)'}}>Informations complètes</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
