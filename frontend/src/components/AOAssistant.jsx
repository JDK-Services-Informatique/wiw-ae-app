import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Users, FileText, Calculator, Send } from 'lucide-react';
import AOAPI from '../services/ao.api.js';
import TeamAPI from '../services/equipe.api.js';
import MissionAPI from '../services/mission.api.js';
import { getHonoraires } from '../services/honoraires.api.js';
import logger from '../utils/logger';

/**
 * Composant Assistant AO - Guide pas-à-pas pour créer une offre
 * Workflow guidé avec 5 étapes pour simplifier la création d'AO
 */
export default function AOAssistant({
  onComplete,
  onCancel,
  initialData = null,
  className = ''
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aoData, setAoData] = useState({
    // Étape 1: Informations de base
    titre: initialData?.titre || '',
    client: initialData?.client || '',
    montantTravaux: initialData?.montantTravaux || '',
    domaine: initialData?.domaine || '',
    typeProjet: initialData?.typeProjet || '',
    dateDebut: initialData?.dateDebut || '',
    dateFin: initialData?.dateFin || '',

    // Étape 2: Équipe
    equipe: initialData?.equipe || [],

    // Étape 3: Missions
    missions: initialData?.missions || [],

    // Étape 4: Honoraires
    repartitionHonoraires: initialData?.repartitionHonoraires || {
      base: 100,
      complementaires: 0,
      options: 0
    },
    rabais: initialData?.rabais || 0,

    // Étape 5: Finalisation
    commentaires: initialData?.commentaires || '',
    conditions: initialData?.conditions || ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [availableContacts, setAvailableContacts] = useState([]);
  const [availableMissions, setAvailableMissions] = useState([]);

  const steps = [
    {
      id: 1,
      title: 'Informations AO',
      description: 'Détails de base du projet',
      icon: FileText,
      required: ['titre', 'client', 'montantTravaux', 'domaine', 'typeProjet']
    },
    {
      id: 2,
      title: 'Constitution équipe',
      description: 'Sélection des partenaires',
      icon: Users,
      required: ['equipe']
    },
    {
      id: 3,
      title: 'Définition missions',
      description: 'Phases et tranches',
      icon: FileText,
      required: ['missions']
    },
    {
      id: 4,
      title: 'Calcul honoraires',
      description: 'Répartition et ajustements',
      icon: Calculator,
      required: ['repartitionHonoraires']
    },
    {
      id: 5,
      title: 'Finalisation offre',
      description: 'Validation et export',
      icon: Send,
      required: []
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Charger les contacts disponibles
      const contacts = await TeamAPI.getEquipe();
      setAvailableContacts(contacts);

      // Charger les missions disponibles
      const missions = await MissionAPI.getMissions();
      setAvailableMissions(missions);

    } catch (err) {
      logger.error('Erreur chargement données initiales:', err);
      if (window.showToast) {
        window.showToast('Erreur lors du chargement des données', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return true;

    const errors = {};

    switch (stepId) {
      case 1:
        if (!aoData.titre.trim()) errors.titre = 'Le titre est requis';
        if (!aoData.client.trim()) errors.client = 'Le client est requis';
        if (!aoData.montantTravaux || aoData.montantTravaux <= 0) {
          errors.montantTravaux = 'Montant travaux valide requis';
        }
        if (!aoData.domaine) errors.domaine = 'Le domaine est requis';
        if (!aoData.typeProjet) errors.typeProjet = 'Le type de projet est requis';
        break;

      case 2:
        if (!aoData.equipe || aoData.equipe.length === 0) {
          errors.equipe = 'Au moins un membre d\'équipe requis';
        }
        break;

      case 3:
        if (!aoData.missions || aoData.missions.length === 0) {
          errors.missions = 'Au moins une mission requise';
        }
        break;

      case 4:
        const total = Object.values(aoData.repartitionHonoraires).reduce((sum, val) => sum + val, 0);
        if (total !== 100) {
          errors.repartitionHonoraires = 'La répartition doit totaliser 100%';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);

      // Sauvegarde en brouillon
      const draftData = { ...aoData, statut: 'brouillon' };

      if (initialData?.id) {
        await AOAPI.updateAO(initialData.id, draftData);
      } else {
        await AOAPI.createAO(draftData);
      }

      if (window.showToast) {
        window.showToast('Brouillon sauvegardé avec succès', 'success');
      }
    } catch (err) {
      logger.error('Erreur sauvegarde brouillon:', err);
      if (window.showToast) {
        window.showToast('Erreur lors de la sauvegarde du brouillon', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      // Validation finale
      for (let step of steps) {
        if (!validateStep(step.id)) {
          setCurrentStep(step.id);
          return;
        }
      }

      // Création/mise à jour de l'AO
      const finalData = { ...aoData, statut: 'finalise' };

      let result;
      if (initialData?.id) {
        result = await AOAPI.updateAO(initialData.id, finalData);
      } else {
        result = await AOAPI.createAO(finalData);
      }

      if (window.showToast) {
        window.showToast('Offre créée avec succès !', 'success');
      }

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      logger.error('Erreur finalisation AO:', err);
      if (window.showToast) {
        window.showToast('Erreur lors de la finalisation de l\'offre', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateAoData = (field, value) => {
    setAoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepInformationsAO data={aoData} onChange={updateAoData} errors={validationErrors} />;
      case 2:
        return (
          <StepEquipe
            data={aoData}
            onChange={updateAoData}
            availableContacts={availableContacts}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <StepMissions
            data={aoData}
            onChange={updateAoData}
            availableMissions={availableMissions}
            errors={validationErrors}
          />
        );
      case 4:
        return <StepHonoraires data={aoData} onChange={updateAoData} errors={validationErrors} />;
      case 5:
        return <StepFinalisation data={aoData} onChange={updateAoData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* En-tête avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Assistant Création AO
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getStepProgress()}%` }}
          />
        </div>

        {/* Étapes */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>

                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {step.description}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 text-gray-300" size={16} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement...</p>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="btn-secondary text-sm"
          >
            Sauvegarder brouillon
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Précédent
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="btn flex items-center gap-2"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="btn flex items-center gap-2"
            >
              <Send size={16} />
              Finaliser l'offre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Composants des étapes individuelles
function StepInformationsAO({ data, onChange, errors }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Informations de base de l'AO
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre de l'AO *
          </label>
          <input
            type="text"
            value={data.titre}
            onChange={(e) => onChange('titre', e.target.value)}
            className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.titre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ex: Réhabilitation collège Victor Hugo"
          />
          {errors.titre && (
            <p className="text-red-500 text-xs mt-1">{errors.titre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Client *
          </label>
          <input
            type="text"
            value={data.client}
            onChange={(e) => onChange('client', e.target.value)}
            className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.client ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Nom du client ou maître d'ouvrage"
          />
          {errors.client && (
            <p className="text-red-500 text-xs mt-1">{errors.client}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Montant des travaux (€) *
          </label>
          <input
            type="number"
            value={data.montantTravaux}
            onChange={(e) => onChange('montantTravaux', parseFloat(e.target.value) || '')}
            className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.montantTravaux ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="150000"
            min="0"
            step="1000"
          />
          {errors.montantTravaux && (
            <p className="text-red-500 text-xs mt-1">{errors.montantTravaux}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Domaine *
          </label>
          <select
            value={data.domaine}
            onChange={(e) => onChange('domaine', e.target.value)}
            className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.domaine ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Sélectionner un domaine</option>
            <option value="Logements">Logements</option>
            <option value="Équipements publics">Équipements publics</option>
            <option value="Commerce">Commerce</option>
            <option value="Bureaux">Bureaux</option>
            <option value="Industrie">Industrie</option>
            <option value="Santé">Santé</option>
          </select>
          {errors.domaine && (
            <p className="text-red-500 text-xs mt-1">{errors.domaine}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type de projet *
          </label>
          <select
            value={data.typeProjet}
            onChange={(e) => onChange('typeProjet', e.target.value)}
            className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.typeProjet ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Sélectionner un type</option>
            <option value="Neuf">Neuf</option>
            <option value="Rénovation">Rénovation</option>
            <option value="Réhabilitation">Réhabilitation</option>
            <option value="Extension">Extension</option>
          </select>
          {errors.typeProjet && (
            <p className="text-red-500 text-xs mt-1">{errors.typeProjet}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date de début prévisionnelle
          </label>
          <input
            type="date"
            value={data.dateDebut}
            onChange={(e) => onChange('dateDebut', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
}

function StepEquipe({ data, onChange, availableContacts, errors }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = availableContacts.filter(contact =>
    contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContact = (contact) => {
    const isSelected = data.equipe.some(c => c.id === contact.id);
    if (isSelected) {
      onChange('equipe', data.equipe.filter(c => c.id !== contact.id));
    } else {
      onChange('equipe', [...data.equipe, contact]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Constitution de l'équipe
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Sélectionnez les partenaires qui participeront à ce projet
        </p>
      </div>

      {errors.equipe && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">{errors.equipe}</p>
          </div>
        </div>
      )}

      {/* Recherche */}
      <div>
        <input
          type="text"
          placeholder="Rechercher un contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Équipe sélectionnée */}
      {data.equipe.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Équipe sélectionnée ({data.equipe.length})
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.equipe.map(contact => (
              <div
                key={contact.id}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                <span>{contact.nom} - {contact.role}</span>
                <button
                  onClick={() => toggleContact(contact)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts disponibles */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          Contacts disponibles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredContacts.map(contact => {
            const isSelected = data.equipe.some(c => c.id === contact.id);
            return (
              <div
                key={contact.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => toggleContact(contact)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {contact.nom}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.role}
                    </div>
                    {contact.email && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {contact.email}
                      </div>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepMissions({ data, onChange, availableMissions, errors }) {
  const toggleMission = (mission) => {
    const isSelected = data.missions.some(m => m.id === mission.id);
    if (isSelected) {
      onChange('missions', data.missions.filter(m => m.id !== mission.id));
    } else {
      onChange('missions', [...data.missions, { ...mission, tranches: [] }]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Définition des missions
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Sélectionnez les missions à inclure dans l'offre
        </p>
      </div>

      {errors.missions && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">{errors.missions}</p>
          </div>
        </div>
      )}

      {/* Missions sélectionnées */}
      {data.missions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Missions sélectionnées ({data.missions.length})
          </h4>
          <div className="space-y-2 mb-4">
            {data.missions.map(mission => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {mission.code} - {mission.nom}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {mission.type} • {mission.heuresEstimees}h • {mission.coutHoraireMoyen}€/h
                  </div>
                </div>
                <button
                  onClick={() => toggleMission(mission)}
                  className="text-red-600 hover:text-red-800"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missions disponibles par type */}
      {['Base', 'Additionnelle', 'Complémentaire', 'Optionnelle'].map(type => {
        const missionsOfType = availableMissions.filter(m => m.type === type);
        if (missionsOfType.length === 0) return null;

        return (
          <div key={type}>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Missions {type}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missionsOfType.map(mission => {
                const isSelected = data.missions.some(m => m.id === mission.id);
                return (
                  <div
                    key={mission.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => toggleMission(mission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {mission.code}
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {mission.nom}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {mission.heuresEstimees}h • {mission.coutHoraireMoyen}€/h
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {mission.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepHonoraires({ data, onChange, errors }) {
  const totalRepartition = Object.values(data.repartitionHonoraires).reduce((sum, val) => sum + val, 0);

  const updateRepartition = (key, value) => {
    onChange('repartitionHonoraires', {
      ...data.repartitionHonoraires,
      [key]: parseFloat(value) || 0
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Calcul des honoraires
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Répartissez les honoraires entre les différentes catégories de missions
        </p>
      </div>

      {errors.repartitionHonoraires && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">{errors.repartitionHonoraires}</p>
          </div>
        </div>
      )}

      {/* Répartition des honoraires */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Répartition des honoraires (%)
          </label>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Missions de base</span>
                <span className="text-sm font-medium">{data.repartitionHonoraires.base}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={data.repartitionHonoraires.base}
                onChange={(e) => updateRepartition('base', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Missions complémentaires</span>
                <span className="text-sm font-medium">{data.repartitionHonoraires.complementaires}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={data.repartitionHonoraires.complementaires}
                onChange={(e) => updateRepartition('complementaires', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Missions optionnelles</span>
                <span className="text-sm font-medium">{data.repartitionHonoraires.options}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={data.repartitionHonoraires.options}
                onChange={(e) => updateRepartition('options', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className={`mt-3 p-3 rounded-lg ${
            totalRepartition === 100
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de la répartition:</span>
              <span className={`text-sm font-bold ${
                totalRepartition === 100 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {totalRepartition}%
              </span>
            </div>
          </div>
        </div>

        {/* Rabais */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rabais (%)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={data.rabais}
            onChange={(e) => onChange('rabais', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Rabais appliqué sur le montant total des honoraires
          </p>
        </div>
      </div>

      {/* Résumé des honoraires */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          Résumé des honoraires
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Montant travaux:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.montantTravaux || 0)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Base honoraires (estimé):</span>
            <span className="font-medium">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((data.montantTravaux || 0) * 0.08)}
            </span>
          </div>

          {data.rabais > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Rabais ({data.rabais}%):</span>
              <span className="font-medium">
                -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((data.montantTravaux || 0) * 0.08 * data.rabais / 100)}
              </span>
            </div>
          )}

          <hr className="my-2" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total estimé:</span>
            <span>
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((data.montantTravaux || 0) * 0.08 * (1 - data.rabais / 100))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFinalisation({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Finalisation de l'offre
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Ajoutez des commentaires et conditions spécifiques avant de finaliser
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
          Récapitulatif de l'offre
        </h4>

        <div className="space-y-2 text-sm">
          <div><strong>Titre:</strong> {data.titre}</div>
          <div><strong>Client:</strong> {data.client}</div>
          <div><strong>Montant travaux:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.montantTravaux || 0)}</div>
          <div><strong>Domaine:</strong> {data.domaine}</div>
          <div><strong>Type:</strong> {data.typeProjet}</div>
          <div><strong>Équipe:</strong> {data.equipe.length} membre(s)</div>
          <div><strong>Missions:</strong> {data.missions.length} mission(s)</div>
        </div>
      </div>

      {/* Commentaires */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Commentaires
        </label>
        <textarea
          value={data.commentaires}
          onChange={(e) => onChange('commentaires', e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={4}
          placeholder="Commentaires spécifiques à cette offre..."
        />
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conditions particulières
        </label>
        <textarea
          value={data.conditions}
          onChange={(e) => onChange('conditions', e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
          placeholder="Conditions spécifiques, délais, modalités..."
        />
      </div>

      {/* Actions finales */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              Prêt pour finalisation
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              En cliquant sur "Finaliser l'offre", vous allez créer l'AO avec toutes les informations saisies.
              Vous pourrez ensuite exporter les annexes AE et envoyer l'offre au client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}