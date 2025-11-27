import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

// Utiliser API_URL depuis config.js qui gère déjà le fallback
const API = API_URL;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token manquant. Veuillez utiliser le lien reçu par email.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token manquant');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API}/auth/reset-password`, {
        token,
        newPassword: formData.newPassword
      });

      setIsSuccess(true);

      if (window.showToast) {
        window.showToast('✅ Mot de passe réinitialisé avec succès !', 'success');
      }

      // Rediriger vers la connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      logger.error('Erreur réinitialisation:', err);
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
      
      if (window.showToast) {
        window.showToast(`⚠️ ${error}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-dark-panel rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Mot de passe réinitialisé !
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-dark-panel rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-brand" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Réinitialiser le mot de passe
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Entrez votre nouveau mot de passe
          </p>
        </div>

        {!token && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
              <div className="text-sm text-red-700 dark:text-red-300">
                Token manquant. Veuillez utiliser le lien reçu par email.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Minimum 8 caractères"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

