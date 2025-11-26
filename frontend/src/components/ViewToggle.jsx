import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Composant Toggle pour basculer entre vue synthétique et vue détaillée
 * Selon le plan d'amélioration - Mode lecture générale vs détaillée
 */
export default function ViewToggle({ 
  isDetailed, 
  onToggle,
  labelSynthetique = 'Vue synthétique',
  labelDetaillee = 'Vue détaillée'
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-panel hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
      title={isDetailed ? labelSynthetique : labelDetaillee}
    >
      {isDetailed ? (
        <>
          <EyeOff size={18} />
          <span className="hidden sm:inline">Masquer les détails</span>
        </>
      ) : (
        <>
          <Eye size={18} />
          <span className="hidden sm:inline">Voir les détails</span>
        </>
      )}
    </button>
  );
}

