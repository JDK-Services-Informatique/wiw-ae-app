import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Pour l'aspect dynamique
import { Menu, X, ChevronRight, Check, Calculator, FileText, BarChart3, Calendar, Layout, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SponsorsSection from '../components/SponsorsSection';
import sponsorsAPI from '../services/sponsors.api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sponsors, setSponsors] = useState([]);

  // Charger les sponsors depuis l'API
  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const data = await sponsorsAPI.getSponsors();
        setSponsors(data);
      } catch (error) {
        console.error('Erreur lors du chargement des sponsors:', error);
        // Fallback sur localStorage en cas d'erreur API
        const savedSponsors = localStorage.getItem('sponsors');
        if (savedSponsors) {
          try {
            setSponsors(JSON.parse(savedSponsors));
          } catch (e) {
            console.error('Erreur lors du parsing des sponsors localStorage:', e);
          }
        }
      }
    };

    loadSponsors();
  }, []);

  const features = [
    { icon: Calculator, title: 'Calcul d\'Honoraires', desc: 'Formule OPC 1993 intégrée et automatisée.' },
    { icon: FileText, title: 'Appels d\'Offres', desc: 'Centralisation et suivi des candidatures.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Tableaux de bord de rentabilité en temps réel.' },
    { icon: Calendar, title: 'Planning', desc: 'Gestion des deadlines et charrettes.' },
    { icon: Layout, title: 'Templates', desc: 'Bibliothèque de documents prête à l\'emploi.' },
    { icon: Users, title: 'Travail d\'équipe', desc: 'Collaboration fluide entre architectes.' }
  ];

  const plans = [
    { name: 'STARTER', price: '29€', features: ['5 projets actifs', 'Calcul d\'honoraires', 'Suivi des AO'] },
    { name: 'PREMIUM', price: '79€', popular: true, features: ['Projets illimités', 'Analytics avancés', 'Multi-utilisateurs'] },
    { name: 'ENTERPRISE', price: '199€', features: ['Tout illimité', 'API & Intégrations', 'Support prioritaire'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Navigation Responsive */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-dark-panel/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand/20">W</div>
              <span className="font-bold text-xl tracking-tight">WiW</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-brand transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-sm font-medium hover:text-brand transition-colors">Tarifs</a>
              <button onClick={() => { console.log('Connexion button clicked'); navigate('/login'); }} className="px-4 py-2 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all shadow-lg shadow-brand/20">
                Connexion
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute w-full bg-white dark:bg-dark-panel border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 shadow-xl"
          >
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-medium">Fonctionnalités</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-medium">Tarifs</a>
            <button onClick={() => navigate('/login')} className="w-full py-3 bg-brand text-white rounded-lg font-bold">Se connecter</button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            L'outil tout-en-un pour <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
              Architectes & BET
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10"
          >
            Arrêtez de jongler entre Excel et vos emails. Centralisez vos honoraires, vos chantiers et votre facturation sur une seule interface.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-lg shadow-xl shadow-brand/25 transition-all hover:scale-105 flex items-center justify-center gap-2">
              Essayer Gratuitement <ChevronRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Voir la démo
            </button>
          </motion.div>

          {/* Abstract UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-5xl bg-dark-panel/5"
          >
            <img src="/image001.png" alt="Interface Dashboard" className="w-full h-auto object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500">Conçu par des architectes, pour des architectes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white dark:bg-dark-panel rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-6">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-dark-panel border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Tarification transparente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-brand bg-brand/5 ring-4 ring-brand/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white px-4 py-1 rounded-full text-sm font-bold">
                    Populaire
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-500 ml-2">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, k) => (
                    <li key={k} className="flex items-center gap-3 text-sm">
                      <Check size={16} className="text-brand" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')} className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-brand text-white hover:bg-brand-hover' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}>
                  Choisir {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Sponsors */}
      <SponsorsSection sponsors={sponsors} />

      {/* Section Témoignages */}
      <section className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-slate-500">Découvrez ce que nos clients disent de WiW</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie Dubois',
                role: 'Architecte DPLG',
                company: 'Cabinet Dubois Architecture',
                content: 'WiW a transformé notre façon de gérer les appels d\'offres. Plus besoin de tableurs, tout est centralisé et automatisé.',
                rating: 5
              },
              {
                name: 'Jean Martin',
                role: 'Directeur Technique',
                company: 'BET Structure Plus',
                content: 'L\'intégration avec les architectes est fluide. Le suivi des projets et des honoraires est désormais un jeu d\'enfant.',
                rating: 5
              },
              {
                name: 'Sophie Laurent',
                role: 'Gérante',
                company: 'Atelier Laurent & Associés',
                content: 'Les analytics nous permettent de mieux comprendre notre rentabilité. Un outil indispensable pour notre croissance.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white dark:bg-dark-panel rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role} - {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-24 bg-white dark:bg-dark-panel border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-slate-500">Tout ce que vous devez savoir sur WiW</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'Puis-je essayer WiW gratuitement ?',
                a: 'Oui ! Tous nos plans incluent une période d\'essai gratuite de 14 jours, sans carte bancaire requise. Vous pourrez tester toutes les fonctionnalités avant de vous engager.'
              },
              {
                q: 'Mes données sont-elles sécurisées ?',
                a: 'Absolument. Nous utilisons un chiffrement SSL/TLS de niveau bancaire, des sauvegardes quotidiennes et nos serveurs sont hébergés en France (conformité RGPD).'
              },
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre espace. Les changements sont effectifs immédiatement.'
              },
              {
                q: 'Y a-t-il une période d\'engagement ?',
                a: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment sans frais.'
              },
              {
                q: 'Quels moyens de paiement acceptez-vous ?',
                a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), les virements SEPA et PayPal pour les paiements mensuels et annuels.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="p-6 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <summary className="font-semibold text-lg mb-2 list-none flex justify-between items-center">
                  <span>{faq.q}</span>
                  <span className="text-brand">+</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-r from-brand to-brand-light text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre pratique ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des centaines d'architectes et de BET qui font confiance à WiW
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-brand rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg"
            >
              Démarrer l'essai gratuit
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Contacter les ventes
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
                <span className="font-bold text-lg">WiW</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                L'outil tout-en-un pour architectes et bureaux d'études techniques.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">Fonctionnalités</a></li>
                <li><button onClick={() => navigate('/pricing')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">Tarifs</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/legal')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">Mentions légales</button></li>
                <li><button onClick={() => navigate('/legal')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">CGV</button></li>
                <li><button onClick={() => navigate('/legal')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">CGU</button></li>
                <li><button onClick={() => navigate('/legal')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">RGPD</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/contact')} className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">Aide & Support</button></li>
                <li><a href="mailto:contact@wiw-app.com" className="text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">contact@wiw-app.com</a></li>
                <li className="text-slate-500 dark:text-slate-400">+33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2025 WiW SAS. Tous droits réservés. | Optimisé pour l'architecture.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
