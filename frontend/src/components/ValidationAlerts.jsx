import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * Composant pour afficher les alertes de validation
 * Affiche les erreurs et avertissements de cohérence
 */
export default function ValidationAlerts({ 
  validation, 
  onDismiss,
  className = '' 
}) {
  if (!validation) return null;

  const { valid, errors, warnings } = validation;

  // Si tout est valide et pas d'avertissements, ne rien afficher
  if (valid && (!warnings || warnings.length === 0)) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Erreurs */}
      {errors && errors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-red-800 dark:text-red-300 mb-2">
                Incohérences détectées
              </div>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-400">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Avertissements */}
      {warnings && warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Avertissements
              </div>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-yellow-400 hover:text-yellow-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Succès (si valide et pas d'erreurs) */}
      {valid && errors.length === 0 && warnings.length === 0 && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600 dark:text-green-400" size={18} />
            <span className="text-sm font-medium text-green-800 dark:text-green-300">
              Toutes les validations sont passées
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

