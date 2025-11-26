import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, FileText, MessageSquare, Handshake, CheckCircle, XCircle, Archive } from 'lucide-react';

/**
 * Composant Pipeline de Prospection
 * Visualise et gère l'évolution des appels d'offre à travers différentes étapes
 */
export default function PipelineProspection({
  appelsOffre = [],
  onUpdateStatut,
  onCreateMission,
  className = ''
}) {
  const [selectedAO, setSelectedAO] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Étapes du pipeline de prospection
  const etapes = [
    {
      id: 'nouveau',
      label: 'Nouveau',
      icon: FileText,
      color: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      description: 'Appels d\'offre récemment découverts'
    },
    {
      id: 'contacte',
      label: 'Contacté',
      icon: MessageSquare,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
      description: 'Premier contact établi avec le client'
    },
    {
      id: 'analyse',
      label: 'En analyse',
      icon: Users,
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      description: 'Analyse technique et préparation de l\'offre'
    },
    {
      id: 'proposition',
      label: 'Proposition',
      icon: FileText,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
      description: 'Offre soumise au client'
    },
    {
      id: 'negociation',
      label: 'Négociation',
      icon: Handshake,
      color: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-300',
      description: 'Discussion des termes et conditions'
    },
    {
      id: 'gagne',
      label: 'Gagné',
      icon: CheckCircle,
      color: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
      description: 'Appel d\'offre remporté'
    },
    {
      id: 'perdu',
      label: 'Perdu',
      icon: XCircle,
      color: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-300',
      description: 'Appel d\'offre non remporté'
    },
    {
      id: 'archive',
      label: 'Archivé',
      icon: Archive,
      color: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-500 dark:text-gray-400',
      description: 'Appels d\'offre archivés'
    }
  ];

  // Mapper les statuts existants aux étapes du pipeline
  const mapStatutToEtape = (statut) => {
    const mapping = {
      'Nouveau': 'nouveau',
      'En cours': 'analyse',
      'Gagné': 'gagne',
      'Perdu': 'perdu',
      'Archivé': 'archive'
    };
    return mapping[statut] || 'nouveau';
  };

  // Grouper les AO par étape
  const groupedAO = etapes.reduce((acc, etape) => {
    acc[etape.id] = appelsOffre.filter(ao => mapStatutToEtape(ao.statut) === etape.id);
    return acc;
  }, {});

  const handleDragStart = (e, ao) => {
    setDraggedItem(ao);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetEtape) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Mapper l'étape vers le statut
    const statutMapping = {
      'nouveau': 'Nouveau',
      'contacte': 'En cours',
      'analyse': 'En cours',
      'proposition': 'En cours',
      'negociation': 'En cours',
      'gagne': 'Gagné',
      'perdu': 'Perdu',
      'archive': 'Archivé'
    };

    const newStatut = statutMapping[targetEtape];
    if (newStatut && newStatut !== draggedItem.statut) {
      onUpdateStatut(draggedItem.id, newStatut);
    }

    setDraggedItem(null);
  };

  const getMontantFormatted = (montant) => {
    if (!montant) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const getProbabiliteBadge = (statut) => {
    const badges = {
      'Nouveau': { color: 'bg-gray-100 text-gray-800', label: '0%' },
      'En cours': { color: 'bg-blue-100 text-blue-800', label: '30%' },
      'Gagné': { color: 'bg-green-100 text-green-800', label: '100%' },
      'Perdu': { color: 'bg-red-100 text-red-800', label: '0%' },
      'Archivé': { color: 'bg-gray-100 text-gray-600', label: '-' }
    };
    return badges[statut] || badges['Nouveau'];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Pipeline de Prospection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Suivez l'évolution de vos appels d'offre à travers les différentes étapes
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {appelsOffre.length} appels d'offre • {groupedAO.gagne.length} gagnés
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {etapes.map((etape) => {
          const IconComponent = etape.icon;
          const aos = groupedAO[etape.id] || [];

          return (
            <div
              key={etape.id}
              className={`${etape.color} rounded-lg p-4 min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, etape.id)}
            >
              {/* En-tête de l'étape */}
              <div className="flex items-center gap-2 mb-3">
                <IconComponent size={18} className={etape.textColor} />
                <div>
                  <h3 className={`font-semibold ${etape.textColor}`}>
                    {etape.label}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {aos.length}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {etape.description}
              </p>

              {/* Liste des AO dans cette étape */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {aos.map((ao) => (
                  <div
                    key={ao.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ao)}
                    className="bg-white dark:bg-gray-700 rounded border p-3 cursor-move hover:shadow-md transition-shadow"
                    onClick={() => setSelectedAO(ao)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {ao.titre}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProbabiliteBadge(ao.statut).color}`}>
                        {getProbabiliteBadge(ao.statut).label}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>{ao.clientNom || 'Client non spécifié'}</div>
                      <div className="font-medium text-green-600 dark:text-green-400">
                        {getMontantFormatted(ao.montant)}
                      </div>
                    </div>

                    {ao.domaine && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {ao.domaine}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {aos.length === 0 && (
                  <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">
                    Aucun AO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de détails AO */}
      {selectedAO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {selectedAO.titre}
              </h3>
              <button
                onClick={() => setSelectedAO(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client
                </label>
                <div className="text-gray-900 dark:text-gray-100">
                  {selectedAO.clientNom || 'Non spécifié'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Montant
                </label>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  {getMontantFormatted(selectedAO.montant)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domaine
                </label>
                <div className="text-gray-900 dark:text-gray-100">
                  {selectedAO.domaine || 'Non spécifié'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProbabiliteBadge(selectedAO.statut).color}`}>
                  {selectedAO.statut}
                </span>
              </div>
            </div>

            {selectedAO.description && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <div className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {selectedAO.description}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedAO.statut === 'Gagné' && onCreateMission && (
                <button
                  onClick={() => {
                    onCreateMission(selectedAO);
                    setSelectedAO(null);
                  }}
                  className="btn flex items-center gap-2"
                >
                  <ChevronRight size={16} />
                  Créer une mission
                </button>
              )}

              <button
                onClick={() => setSelectedAO(null)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}