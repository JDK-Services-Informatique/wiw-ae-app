import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth.api.js';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const selectedPlan = searchParams.get('plan');

  useEffect(() => {
    // Si un plan est sélectionné, afficher un message
    if (selectedPlan) {
      const planNames = {
        'STARTER': 'Starter',
        'PREMIUM': 'Premium',
        'ENTERPRISE': 'Enterprise'
      };
      // Optionnel : afficher un toast ou un message
      console.log(`Plan sélectionné : ${planNames[selectedPlan] || selectedPlan}`);
    }
  }, [selectedPlan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user } = await authService.login(formData.email, formData.password);
      onLogin(user); // Passer les données utilisateur à App.jsx
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-bg">
      {/* Partie Gauche - Image/Branding (Masqué sur mobile) */}
      <div className="hidden lg:flex w-1/2 bg-brand relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-purple-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold mb-6">WiW App</h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              Gérez vos projets d'architecture avec la précision d'un plan d'exécution et la fluidité d'une esquisse.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold mb-1">150+</div>
                <div className="text-sm opacity-80">Agences</div>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold mb-1">12k</div>
                <div className="text-sm opacity-80">Projets</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partie Droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bienvenue</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Entrez vos identifiants pour accéder à votre espace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 rounded-lg flex items-center gap-2 text-sm"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                    placeholder="architecte@agence.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm text-brand hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl font-semibold shadow-lg shadow-brand/20 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Pas encore de compte ? <button onClick={() => { console.log('Créer une agence button clicked'); navigate('/pricing'); }} className="text-brand font-semibold hover:underline">Créer une agence</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}