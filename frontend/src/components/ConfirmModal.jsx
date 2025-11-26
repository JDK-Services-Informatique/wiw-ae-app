import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Composant Modal de confirmation pour les actions critiques
 * 
 * @param {boolean} isOpen - État d'ouverture du modal
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onConfirm - Fonction de confirmation
 * @param {string} title - Titre du modal
 * @param {string} message - Message de confirmation
 * @param {string} confirmText - Texte du bouton de confirmation (défaut: "Confirmer")
 * @param {string} cancelText - Texte du bouton d'annulation (défaut: "Annuler")
 * @param {string} variant - Variante du modal ('danger', 'warning', 'info') (défaut: 'warning')
 * @param {React.ReactNode} children - Contenu additionnel à afficher
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning',
  children
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-200 dark:border-red-800'
    },
    warning: {
      icon: 'text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    info: {
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-200 dark:border-blue-800'
    }
  };

  const styles = variantStyles[variant] || variantStyles.warning;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${styles.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className={styles.icon} />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {message}
          </p>
          {children && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              {children}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

