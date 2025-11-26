import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Pour l'aspect dynamique
import { Menu, X, ChevronRight, Check, Calculator, FileText, BarChart3, Calendar, Layout, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SponsorsSection from '../components/SponsorsSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sponsors, setSponsors] = useState([]);

  // Charger les sponsors depuis localStorage ou API
  useEffect(() => {
    const savedSponsors = localStorage.getItem('sponsors');
    if (savedSponsors) {
      try {
        setSponsors(JSON.parse(savedSponsors));
      } catch (e) {
        console.error('Erreur lors du chargement des sponsors:', e);
      }
    }
    // TODO: Charger depuis l'API quand elle sera disponible
    // fetch('/api/sponsors')
    //   .then(res => res.json())
    //   .then(data => setSponsors(data))
    //   .catch(err => console.error('Erreur API sponsors:', err));
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
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-lg shadow-xl shadow-brand/25 transition-all hover:scale-105 flex items-center justify-center gap-2">
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

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        © 2025 WiW App. Optimisé pour l'architecture.
      </footer>
    </div>
  );
}
