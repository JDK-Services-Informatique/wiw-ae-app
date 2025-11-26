import React from 'react';
import { formatNumber, formatHours } from '../utils/formatNumber';

// Composant Grille de Traçabilité pour Devis
// Gère les dates de Remis / Corrigé / Validé
export default function DevisTracabilite({ 
  tracabilite = {
    dateRemis: '',
    dateCorrige: '',
    dateValide: '',
    dureeEstimee: 0, // en heures
    sommeHeuresPrevues: 0
  },
  onChange 
}) {
  // Formater date pour input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  // Mettre à jour un champ
  const handleChange = (champ, valeur) => {
    onChange({
      ...tracabilite,
      [champ]: valeur
    });
  };

  // Calculer l'écart heures (durée estimée vs heures prévues)
  const ecartHeures = tracabilite.dureeEstimee - tracabilite.sommeHeuresPrevues;
  const ecartPourcentage = tracabilite.dureeEstimee > 0 
    ? (ecartHeures / tracabilite.dureeEstimee) * 100 
    : 0;

  // Déterminer le statut du devis
  const getStatut = () => {
    if (tracabilite.dateValide) return { label: 'Validé', color: 'green' };
    if (tracabilite.dateCorrige) return { label: 'Corrigé', color: 'orange' };
    if (tracabilite.dateRemis) return { label: 'Remis', color: 'blue' };
    return { label: 'Brouillon', color: 'gray' };
  };

  const statut = getStatut();

  return (
    <div className="space-y-4">
      {/* Statut visuel */}
      <div className={`bg-${statut.color}-50 border-2 border-${statut.color}-300 rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full bg-${statut.color}-500`}></div>
            <span className={`text-lg font-bold text-${statut.color}-900`}>
              Statut : {statut.label}
            </span>
          </div>
          
          {/* Indicateur d'écart heures */}
          {tracabilite.dureeEstimee > 0 && (
            <div className={`px-4 py-2 rounded-lg ${
              Math.abs(ecartPourcentage) <= 10 
                ? 'bg-green-100 text-green-800' 
                : Math.abs(ecartPourcentage) <= 25
                ? 'bg-orange-100 text-orange-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <div className="text-sm font-semibold">
                Écart : {ecartHeures > 0 ? '+' : ''}{formatHours(ecartHeures)} 
                ({ecartPourcentage > 0 ? '+' : ''}{formatNumber(ecartPourcentage, 1)}%)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grille de traçabilité */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-1/3">Étape</th>
              <th className="px-4 py-3 text-left font-semibold w-1/3">Date</th>
              <th className="px-4 py-3 text-left font-semibold w-1/3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {/* Date de remise */}
            <tr className="border-t hover:bg-blue-50">
              <td className="px-4 py-3 font-semibold">
                📤 Remis le
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  value={formatDateForInput(tracabilite.dateRemis)}
                  onChange={(e) => handleChange('dateRemis', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </td>
              <td className="px-4 py-3">
                {tracabilite.dateRemis ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ✅ Remis
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    ⏳ En attente
                  </span>
                )}
              </td>
            </tr>

            {/* Date de correction */}
            <tr className="border-t hover:bg-orange-50">
              <td className="px-4 py-3 font-semibold">
                ✏️ Corrigé le
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  value={formatDateForInput(tracabilite.dateCorrige)}
                  onChange={(e) => handleChange('dateCorrige', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!tracabilite.dateRemis}
                />
              </td>
              <td className="px-4 py-3">
                {!tracabilite.dateRemis ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm">
                    🔒 Remise requise
                  </span>
                ) : tracabilite.dateCorrige ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    ✅ Corrigé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    ⏳ Non requis
                  </span>
                )}
              </td>
            </tr>

            {/* Date de validation */}
            <tr className="border-t hover:bg-green-50">
              <td className="px-4 py-3 font-semibold">
                ✅ Validé le
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  value={formatDateForInput(tracabilite.dateValide)}
                  onChange={(e) => handleChange('dateValide', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!tracabilite.dateRemis}
                />
              </td>
              <td className="px-4 py-3">
                {!tracabilite.dateRemis ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm">
                    🔒 Remise requise
                  </span>
                ) : tracabilite.dateValide ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✅ Validé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    ⏳ En attente
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section Durée estimée vs Heures prévues */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-3">
          ⏱️ Cohérence des heures
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Durée estimée */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Durée estimée (h)
            </label>
            <input
              type="number"
              value={tracabilite.dureeEstimee}
              onChange={(e) => handleChange('dureeEstimee', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg"
              step="0.5"
              min="0"
              placeholder="0"
            />
          </div>

          {/* Somme heures prévues (calculée automatiquement) */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Heures prévues (calculé)
            </label>
            <div className="px-3 py-2 bg-white border rounded-lg font-mono font-semibold text-blue-900">
              {formatHours(tracabilite.sommeHeuresPrevues)}
            </div>
          </div>

          {/* Écart */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Écart
            </label>
            <div className={`px-3 py-2 border rounded-lg font-mono font-semibold ${
              Math.abs(ecartPourcentage) <= 10 
                ? 'bg-green-50 text-green-800 border-green-300' 
                : Math.abs(ecartPourcentage) <= 25
                ? 'bg-orange-50 text-orange-800 border-orange-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}>
              {ecartHeures > 0 ? '+' : ''}{formatHours(ecartHeures)}
              <div className="text-xs mt-1">
                ({ecartPourcentage > 0 ? '+' : ''}{formatNumber(ecartPourcentage, 1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Alertes incohérence */}
        {Math.abs(ecartPourcentage) > 25 && tracabilite.dureeEstimee > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <div className="font-semibold text-red-800 mb-1">
                  Incohérence détectée
                </div>
                <div className="text-sm text-red-700">
                  L'écart entre la durée estimée et les heures prévues est important (&gt; 25%). 
                  Vérifiez vos quantités ou ajustez la durée estimée.
                </div>
              </div>
            </div>
          </div>
        )}

        {Math.abs(ecartPourcentage) <= 10 && tracabilite.dureeEstimee > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <span>✅</span>
              <span>Les heures sont cohérentes (écart &lt; 10%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline visuelle */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-gray-800 mb-4">
          📅 Timeline
        </h3>
        
        <div className="relative">
          {/* Ligne de progression */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ 
                width: tracabilite.dateValide ? '100%' : tracabilite.dateCorrige ? '66%' : tracabilite.dateRemis ? '33%' : '0%' 
              }}
            />
          </div>

          {/* Étapes */}
          <div className="relative flex justify-between">
            {/* Remis */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                tracabilite.dateRemis ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                <span className="text-white text-xl">📤</span>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-semibold text-gray-700">Remis</div>
                {tracabilite.dateRemis && (
                  <div className="text-xs text-gray-500">
                    {new Date(tracabilite.dateRemis).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>

            {/* Corrigé */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                tracabilite.dateCorrige ? 'bg-orange-500' : 'bg-gray-300'
              }`}>
                <span className="text-white text-xl">✏️</span>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-semibold text-gray-700">Corrigé</div>
                {tracabilite.dateCorrige && (
                  <div className="text-xs text-gray-500">
                    {new Date(tracabilite.dateCorrige).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>

            {/* Validé */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                tracabilite.dateValide ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-semibold text-gray-700">Validé</div>
                {tracabilite.dateValide && (
                  <div className="text-xs text-gray-500">
                    {new Date(tracabilite.dateValide).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
