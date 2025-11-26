import React, { useState, useEffect } from 'react';
import { History, Save, RotateCcw, Eye, GitBranch } from 'lucide-react';
import ScenarioVersioningAPI from '../services/scenarioVersioning.api.js';
import logger from '../utils/logger';

/**
 * Composant pour gérer le versioning des scénarios
 * Permet de créer des versions, voir l'historique et restaurer des versions précédentes
 */
export default function ScenarioVersioning({
  projetId,
  currentScenarioData,
  onVersionRestored,
  className = ''
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projetId) {
      loadVersions();
    }
  }, [projetId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await ScenarioVersioningAPI.getVersions(projetId);
      setVersions(data);
    } catch (err) {
      logger.error('Erreur chargement versions:', err);
      setError('Erreur lors du chargement des versions');
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async () => {
    if (!currentScenarioData) {
      setError('Aucune donnée de scénario à sauvegarder');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      await ScenarioVersioningAPI.createVersion(
        projetId,
        currentScenarioData,
        commentaire.trim() || undefined
      );

      setCommentaire('');
      await loadVersions(); // Recharger la liste

      // Notification de succès
      if (window.showToast) {
        window.showToast('✅ Version créée avec succès', 'success');
      }
    } catch (err) {
      logger.error('Erreur création version:', err);
      setError('Erreur lors de la création de la version');
    } finally {
      setCreating(false);
    }
  };

  const restoreVersion = async (versionId) => {
    try {
      setRestoring(versionId);
      setError(null);

      const restoredVersion = await ScenarioVersioningAPI.restoreVersion(versionId);

      // Appeler le callback avec les données restaurées
      if (onVersionRestored) {
        onVersionRestored(restoredVersion.data);
      }

      await loadVersions(); // Recharger la liste

      if (window.showToast) {
        window.showToast('✅ Version restaurée avec succès', 'success');
      }
    } catch (err) {
      logger.error('Erreur restauration version:', err);
      setError('Erreur lors de la restauration de la version');
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bouton principal pour créer une version */}
      <div className="flex items-center gap-3">
        <button
          onClick={createVersion}
          disabled={creating || !currentScenarioData}
          className="btn flex items-center gap-2"
        >
          <Save size={16} />
          {creating ? 'Création...' : 'Créer une version'}
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn-secondary flex items-center gap-2"
        >
          <History size={16} />
          Historique ({versions.length})
        </button>
      </div>

      {/* Champ commentaire pour la nouvelle version */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Commentaire (optionnel)
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Décrivez les changements apportés..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={2}
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Historique des versions */}
      {showHistory && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Historique des versions
              </h3>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Chargement...
              </div>
            ) : versions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Aucune version sauvegardée
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {versions.map((version) => (
                  <div key={version.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            v{version.versionNumber}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(version.createdAt)}
                          </span>
                        </div>

                        {version.commentaire && (
                          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {version.commentaire}
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Par {version.utilisateur.nom}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => restoreVersion(version.id)}
                          disabled={restoring === version.id}
                          className="btn-secondary flex items-center gap-1 text-xs px-2 py-1"
                          title="Restaurer cette version"
                        >
                          <RotateCcw size={12} />
                          {restoring === version.id ? '...' : 'Restaurer'}
                        </button>

                        <button
                          onClick={() => {
                            // TODO: Ouvrir un modal pour voir les détails
                            console.log('Voir détails version:', version);
                          }}
                          className="btn-secondary flex items-center gap-1 text-xs px-2 py-1"
                          title="Voir les détails"
                        >
                          <Eye size={12} />
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}