import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Loader } from 'lucide-react';
import InheritanceAPI from '../services/inheritance.api';
import logger from '../utils/logger';

/**
 * Composant helper pour afficher et gérer l'héritage automatique
 * Utilisé dans les formulaires Mission et Honoraires
 */
export default function InheritanceHelper({
  type, // 'ao' ou 'mission'
  sourceId, // ID de l'AO ou de la Mission
  onInherit, // Callback avec les données héritées
  showValidation = true
}) {
  const [inheritedData, setInheritedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    if (sourceId) {
      loadInheritance();
    }
  }, [sourceId, type]);

  const loadInheritance = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (type === 'ao') {
        data = await InheritanceAPI.getAOInheritance(sourceId);
      } else if (type === 'mission') {
        data = await InheritanceAPI.getMissionInheritance(sourceId);
      }

      setInheritedData(data);
      
      // Appeler le callback avec les données héritées
      if (onInherit) {
        onInherit(data);
      }

      // Valider si demandé
      if (showValidation && type === 'ao') {
        const validationResult = await InheritanceAPI.validateInheritance(sourceId);
        setValidation(validationResult);
      }
    } catch (err) {
      logger.error('Erreur chargement héritage:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'héritage');
    } finally {
      setLoading(false);
    }
  };

  if (!sourceId) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {loading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Loader className="animate-spin text-blue-600 dark:text-blue-400" size={18} />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Chargement des données héritées...
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="text-sm font-medium text-red-700 dark:text-red-300">
              Erreur de chargement
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {inheritedData && !loading && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={18} />
            <div className="flex-1">
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Données héritées automatiquement
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                {inheritedData.montantTravaux && (
                  <div>
                    <strong>Montant travaux :</strong> {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(inheritedData.montantTravaux)} (non modifiable)
                  </div>
                )}
                {inheritedData.client?.nom && (
                  <div>
                    <strong>Client :</strong> {inheritedData.client.nom}
                  </div>
                )}
                {inheritedData.domaine && (
                  <div>
                    <strong>Domaine :</strong> {inheritedData.domaine}
                  </div>
                )}
                {inheritedData.type && (
                  <div>
                    <strong>Type :</strong> {inheritedData.type}
                  </div>
                )}
                {inheritedData.equipe && inheritedData.equipe.length > 0 && (
                  <div>
                    <strong>Équipe :</strong> {inheritedData.equipe.length} partenaire(s)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {validation && showValidation && (
        <div className={`p-3 border rounded-lg ${
          validation.valid
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start gap-2">
            {validation.valid ? (
              <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={18} />
            )}
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                validation.valid
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {validation.valid ? 'Cohérence validée' : 'Incohérences détectées'}
              </div>
              {validation.errors.length > 0 && (
                <ul className="text-xs text-red-600 dark:text-red-400 mt-1 list-disc list-inside">
                  {validation.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
              {validation.warnings.length > 0 && (
                <ul className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 list-disc list-inside">
                  {validation.warnings.map((warn, idx) => (
                    <li key={idx}>{warn}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {inheritedData && !loading && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <Info className="text-slate-500 dark:text-slate-400" size={16} />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Les données héritées sont pré-remplies. Vous pouvez les modifier si nécessaire, sauf le montant des travaux.
          </span>
        </div>
      )}
    </div>
  );
}

