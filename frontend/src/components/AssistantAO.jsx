import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Save, X } from 'lucide-react';
import InheritanceHelper from './InheritanceHelper';
import ValidationAlerts from './ValidationAlerts';

/**
 * Assistant AO pas-à-pas - Workflow guidé
 * Simplifie le flux : AO → Équipe → Missions → Honoraires → Finalisation
 */
export default function AssistantAO({ 
  aoId = null, // ID de l'AO si on reprend un brouillon
  onComplete, // Callback quand l'assistant est terminé
  onCancel // Callback pour annuler
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 : Saisie AO
    ao: {
      titre: '',
      clientNom: '',
      clientEmail: '',
      clientTel: '',
      montantTravaux: null,
      domaine: '',
      type: '',
      delai: '',
      dateRendu: ''
    },
    // Étape 2 : Équipe
    equipe: [],
    // Étape 3 : Missions
    missions: [],
    // Étape 4 : Honoraires
    honoraires: {
      basePercentages: {},
      partenaires: []
    },
    // Étape 5 : Finalisation
    finalisation: {
      rabais: 0,
      rabaisType: 'pourcentage',
      notes: ''
    }
  });

  const [validation, setValidation] = useState({});
  const [saved, setSaved] = useState(false);

  const steps = [
    { id: 1, title: 'Saisie AO', description: 'Informations de base de l\'appel d\'offres' },
    { id: 2, title: 'Constitution Équipe', description: 'Sélection des partenaires' },
    { id: 3, title: 'Définition Missions', description: 'Missions Base/Complémentaires/Options' },
    { id: 4, title: 'Calcul Honoraires', description: 'Répartition % et ajustements' },
    { id: 5, title: 'Finalisation', description: 'Rabais, export, validation' }
  ];

  // Calculer le pourcentage de complétude
  const calculateProgress = () => {
    let completed = 0;
    const total = 5;

    // Étape 1 : AO
    if (formData.ao.titre && formData.ao.clientNom && formData.ao.montantTravaux) {
      completed++;
    }

    // Étape 2 : Équipe
    if (formData.equipe.length > 0) {
      completed++;
    }

    // Étape 3 : Missions
    if (formData.missions.length > 0) {
      completed++;
    }

    // Étape 4 : Honoraires
    if (Object.keys(formData.honoraires.basePercentages).length > 0) {
      completed++;
    }

    // Étape 5 : Finalisation (optionnel)
    completed++; // Toujours considéré comme complété

    return Math.round((completed / total) * 100);
  };

  // Validation par étape
  const validateStep = (step) => {
    const errors = [];

    switch (step) {
      case 1:
        if (!formData.ao.titre) errors.push('Le titre est obligatoire');
        if (!formData.ao.clientNom) errors.push('Le client est obligatoire');
        if (!formData.ao.montantTravaux) errors.push('Le montant des travaux est obligatoire');
        break;
      case 2:
        if (formData.equipe.length === 0) errors.push('Au moins un partenaire doit être sélectionné');
        break;
      case 3:
        if (formData.missions.length === 0) errors.push('Au moins une mission doit être définie');
        break;
      case 4:
        if (Object.keys(formData.honoraires.basePercentages).length === 0) {
          errors.push('Les pourcentages de rémunération doivent être définis');
        }
        break;
    }

    setValidation({ ...validation, [step]: { valid: errors.length === 0, errors } });
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    // Sauvegarder le brouillon
    try {
      localStorage.setItem('wiw-assistant-ao-brouillon', JSON.stringify({
        ...formData,
        lastSaved: new Date().toISOString()
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (window.showToast) {
        window.showToast('✅ Brouillon sauvegardé', 'success');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  // Charger un brouillon existant
  useEffect(() => {
    if (aoId) {
      // TODO: Charger depuis l'API
    } else {
      const brouillon = localStorage.getItem('wiw-assistant-ao-brouillon');
      if (brouillon) {
        try {
          const data = JSON.parse(brouillon);
          setFormData(data);
        } catch (error) {
          console.error('Erreur chargement brouillon:', error);
        }
      }
    }
  }, [aoId]);

  // Sauvegarde automatique
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 30000); // Sauvegarde toutes les 30 secondes

    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 z-50">
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête avec progression */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Assistant Appel d'Offres
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Workflow guidé pour créer votre AO et générer les Annexes AE
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

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progression : {calculateProgress()}%
              </span>
              {saved && (
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check size={14} />
                  Sauvegardé
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          {/* Étapes */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === step.id
                        ? 'bg-brand text-white scale-110'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={18} /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${
                      currentStep === step.id
                        ? 'text-brand'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 hidden md:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight
                    className={`mx-2 ${
                      currentStep > step.id
                        ? 'text-green-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                    size={20}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="flex-1 overflow-y-auto p-6">
          {validation[currentStep] && !validation[currentStep].valid && (
            <ValidationAlerts validation={validation[currentStep]} className="mb-4" />
          )}

          {/* Étape 1 : Saisie AO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informations de l'Appel d'Offres
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Titre de l'AO *
                  </label>
                  <input
                    type="text"
                    value={formData.ao.titre}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, titre: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Ex: Construction école maternelle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Client / Maître d'Ouvrage *
                  </label>
                  <input
                    type="text"
                    value={formData.ao.clientNom}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, clientNom: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Ex: Ville de Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Montant des Travaux HT (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.ao.montantTravaux || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, montantTravaux: parseFloat(e.target.value) || null }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Domaine
                  </label>
                  <select
                    value={formData.ao.domaine}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, domaine: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Logements">Logements</option>
                    <option value="Équipements publics">Équipements publics</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Bureaux">Bureaux</option>
                    <option value="Industrie">Industrie</option>
                    <option value="Santé">Santé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.ao.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, type: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Neuf">Neuf</option>
                    <option value="Réhabilitation">Réhabilitation</option>
                    <option value="Extension">Extension</option>
                    <option value="Rénovation">Rénovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date de remise
                  </label>
                  <input
                    type="date"
                    value={formData.ao.dateRendu}
                    onChange={(e) => setFormData({
                      ...formData,
                      ao: { ...formData.ao, dateRendu: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email client
                </label>
                <input
                  type="email"
                  value={formData.ao.clientEmail}
                  onChange={(e) => setFormData({
                    ...formData,
                    ao: { ...formData.ao, clientEmail: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="contact@client.fr"
                />
              </div>
            </div>
          )}

          {/* Étape 2 : Équipe */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Constitution de l'Équipe
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Sélectionnez les partenaires qui participeront à cet appel d'offres.
                Vous pourrez les retrouver depuis le menu BET & Architectes.
              </p>
              {/* TODO: Intégrer la sélection depuis Contacts/BET */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  🔗 Lien vers la sélection des partenaires (à implémenter)
                </p>
              </div>
            </div>
          )}

          {/* Étape 3 : Missions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Définition des Missions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Définissez les missions Base, Complémentaires et Optionnelles.
              </p>
              {/* TODO: Intégrer le formulaire de missions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  🔗 Lien vers la définition des missions (à implémenter)
                </p>
              </div>
            </div>
          )}

          {/* Étape 4 : Honoraires */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Calcul des Honoraires
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Ajustez les pourcentages de rémunération et visualisez les montants.
              </p>
              {/* TODO: Intégrer HonorairesEvolutionTable */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  🔗 Lien vers le calcul d'honoraires (à implémenter)
                </p>
              </div>
            </div>
          )}

          {/* Étape 5 : Finalisation */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Finalisation de l'Offre
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Appliquez un rabais éventuel et exportez les Annexes AE.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Rabais (% ou montant)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.finalisation.rabais}
                      onChange={(e) => setFormData({
                        ...formData,
                        finalisation: {
                          ...formData.finalisation,
                          rabais: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <select
                      value={formData.finalisation.rabaisType}
                      onChange={(e) => setFormData({
                        ...formData,
                        finalisation: {
                          ...formData.finalisation,
                          rabaisType: e.target.value
                        }
                      })}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="pourcentage">%</option>
                      <option value="montant">€</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes finales
                </label>
                <textarea
                  value={formData.finalisation.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalisation: {
                      ...formData.finalisation,
                      notes: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={4}
                  placeholder="Notes, conditions particulières..."
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ✅ Votre offre est prête ! Vous pouvez maintenant exporter les Annexes AE au format PDF.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                <span>Précédent</span>
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              <span>Sauvegarder</span>
            </button>
          </div>

          <div className="flex gap-2">
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
              >
                <span>Suivant</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check size={18} />
                <span>Finaliser</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


