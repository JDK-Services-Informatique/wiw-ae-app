import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, AlertCircle, User, Building } from 'lucide-react';
import { authService } from '../services/auth.api.js';

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const selectedPlan = searchParams.get('plan') || 'STARTER';

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmPassword: '',
    plan: selectedPlan
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.motDePasse !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Inscription
      await authService.register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.motDePasse,
        plan: formData.plan
      });

      // Afficher message de succès
      setSuccess(true);

      // Connexion automatique après inscription
      setTimeout(async () => {
        try {
          const { user } = await authService.login(formData.email, formData.motDePasse);
          onLogin(user);
          navigate('/dashboard');
        } catch (loginError) {
          // Si la connexion auto échoue, rediriger vers login
          navigate('/login');
        }
      }, 1500);

    } catch (error) {
      setError(error.message || error.error || 'Erreur lors de l\'inscription');
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
            <h1 className="text-5xl font-bold mb-6">Rejoignez WiW</h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              Rejoignez les 150+ agences d'architecture qui ont déjà simplifié leur gestion de projets avec WiW.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Building size={20} />
                </div>
                <div>
                  <div className="font-semibold">Configuration en 5 minutes</div>
                  <div className="text-sm opacity-80">Démarrez immédiatement</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <div className="font-semibold">Sécurisé et conforme RGPD</div>
                  <div className="text-sm opacity-80">Vos données sont protégées</div>
                </div>
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Créer votre compte</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {selectedPlan && selectedPlan !== 'STARTER'
                ? `Plan sélectionné : ${selectedPlan}`
                : 'Commencez gratuitement, sans carte bancaire'}
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 p-6 rounded-xl text-center"
            >
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-xl font-bold mb-2">Compte créé avec succès !</div>
              <div className="text-sm">Connexion en cours...</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 rounded-lg flex items-center gap-2 text-sm"
                >
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                    placeholder="Jean"
                  />
                </div>
              </div>

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
                    value={formData.motDePasse}
                    onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
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
                  <>Créer mon compte <ArrowRight size={20} /></>
                )}
              </button>

              <div className="text-xs text-slate-500 text-center">
                En créant un compte, vous acceptez nos{' '}
                <Link to="/legal" className="text-brand hover:underline">Conditions d'utilisation</Link>
                {' '}et notre{' '}
                <Link to="/legal" className="text-brand hover:underline">Politique de confidentialité</Link>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-slate-500">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
