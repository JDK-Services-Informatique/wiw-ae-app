import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import logger from '../utils/logger';

const API = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API}/auth/forgot-password`, { email });
      
      setIsSuccess(true);
      
      // En développement, afficher le lien
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      }

      if (window.showToast) {
        window.showToast('✅ Email envoyé ! Vérifiez votre boîte mail.', 'success');
      }
    } catch (err) {
      logger.error('Erreur demande réinitialisation:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
      
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
          className="max-w-md w-full bg-white dark:bg-dark-panel rounded-2xl shadow-xl p-8"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Email envoyé !
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.
              Vérifiez votre boîte mail (et les spams).
            </p>

            {/* En développement, afficher le lien */}
            {resetLink && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  <strong>Mode développement :</strong>
                </p>
                <a
                  href={resetLink}
                  className="text-sm text-blue-600 dark:text-blue-400 underline break-all"
                >
                  {resetLink}
                </a>
              </div>
            )}

            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
            >
              Retour à la connexion
            </button>
          </div>
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
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-brand" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Mot de passe oublié ?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

