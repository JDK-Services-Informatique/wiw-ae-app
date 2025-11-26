import React from 'react';
import { Inbox, Search, FileX, AlertCircle } from 'lucide-react';

/**
 * Composant EmptyState pour afficher des états vides
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Aucun élément',
  description = 'Il n\'y a pas encore d\'éléments à afficher.',
  action,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
        <Icon size={48} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Variantes prédéfinies
 */
export function EmptySearch({ onClear }) {
  return (
    <EmptyState
      icon={Search}
      title="Aucun résultat"
      description="Aucun élément ne correspond à votre recherche. Essayez avec d'autres mots-clés."
      action={
        onClear && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
          >
            Réinitialiser la recherche
          </button>
        )
      }
    />
  );
}

export function EmptyList({ onCreate }) {
  return (
    <EmptyState
      icon={Inbox}
      title="Liste vide"
      description="Commencez par ajouter votre premier élément."
      action={
        onCreate && (
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
          >
            Créer un élément
          </button>
        )
      }
    />
  );
}

export function EmptyError({ onRetry }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Erreur de chargement"
      description="Une erreur s'est produite lors du chargement des données."
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
          >
            Réessayer
          </button>
        )
      }
    />
  );
}

