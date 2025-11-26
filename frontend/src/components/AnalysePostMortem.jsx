import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

/**
 * Composant pour l'analyse post-mortem d'un AO perdu
 * Formulaire structuré pour saisir les raisons et leçons apprises
 */
export default function AnalysePostMortem({
  ao,
  onSave,
  onCancel
}) {
  const [formData, setFormData] = useState({
    raison: '',
    concurrentGagnant: '',
    montantGagnant: '',
    leconsApprises: '',
    pointsForts: '',
    pointsFaibles: ''
  });

  const raisonsPossibles = [
    'Prix trop élevé',
    'Délai trop long',
    'Manque d\'expérience sur le type de projet',
    'Concurrent mieux positionné',
    'Problème de communication',
    'Offre incomplète',
    'Autre'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.raison) {
      if (window.showToast) {
        window.showToast('⚠️ Veuillez indiquer la raison principale', 'warning');
      }
      return;
    }

    const analyseData = {
      ...formData,
      montantGagnant: formData.montantGagnant ? parseFloat(formData.montantGagnant) : null
    };

    if (onSave) {
      onSave(analyseData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Analyse Post-Mortem
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              AO : {ao?.titre || 'Sans titre'}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Raison principale */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Raison principale de l'échec *
            </label>
            <select
              value={formData.raison}
              onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">Sélectionner une raison...</option>
              {raisonsPossibles.map(raison => (
                <option key={raison} value={raison}>{raison}</option>
              ))}
            </select>
          </div>

          {/* Concurrent gagnant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Concurrent gagnant (si connu)
              </label>
              <input
                type="text"
                value={formData.concurrentGagnant}
                onChange={(e) => setFormData({ ...formData, concurrentGagnant: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Nom du concurrent..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Montant proposé par le gagnant (€)
              </label>
              <input
                type="number"
                value={formData.montantGagnant}
                onChange={(e) => setFormData({ ...formData, montantGagnant: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Points forts */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Points forts de notre offre
            </label>
            <textarea
              value={formData.pointsForts}
              onChange={(e) => setFormData({ ...formData, pointsForts: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={3}
              placeholder="Quels étaient les points forts de notre offre ?"
            />
          </div>

          {/* Points faibles */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Points faibles de notre offre
            </label>
            <textarea
              value={formData.pointsFaibles}
              onChange={(e) => setFormData({ ...formData, pointsFaibles: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={3}
              placeholder="Quels étaient les points faibles de notre offre ?"
            />
          </div>

          {/* Leçons apprises */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Leçons apprises
            </label>
            <textarea
              value={formData.leconsApprises}
              onChange={(e) => setFormData({ ...formData, leconsApprises: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={4}
              placeholder="Quelles leçons pouvons-nous tirer de cet échec ? Comment améliorer pour les prochaines fois ?"
            />
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Pourquoi cette analyse ?</strong>
                <p className="mt-1">
                  L'analyse post-mortem permet d'apprendre de nos échecs et d'améliorer nos stratégies futures.
                  Ces données alimenteront les statistiques et aideront à identifier les patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              <span>Enregistrer l'analyse</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

