import React, { useState, useEffect } from 'react';
import DevisTable from '../components/DevisTable';
import HonorairesEvolutionTable from '../components/HonorairesEvolutionTable';
import HonorairesVentilation from '../components/HonorairesVentilation';
import ScenariosHonoraires from '../components/ScenariosHonoraires';
import InheritanceHelper from '../components/InheritanceHelper';
import ValidationAlerts from '../components/ValidationAlerts';
import { Download, Save, FileText, TrendingUp, Users } from 'lucide-react';
import { formatMontant } from '../utils/formatNumber';
import InheritanceAPI from '../services/inheritance.api';
import ValidationAPI from '../services/validation.api';
import { exportHonorairesExcel, exportHonorairesPDF } from '../utils/exportHonoraires';

export default function Honoraires() {
  // État pour le montant des travaux (unique, pré-rempli)
  const [montantTravaux, setMontantTravaux] = useState(500000);
  
  // État pour les pourcentages de base par mission
  const [basePercentages, setBasePercentages] = useState({
    'Esquisse (ESQ)': 3,
    'Avant-Projet Sommaire (APS)': 5,
    'Avant-Projet Détaillé (APD)': 7,
    'Projet (PRO)': 10,
    'Dossier de Consultation (DC)': 3,
    'Direction des Travaux (DET)': 8
  });

  // État pour les partenaires avec pourcentages et montants
  const [partenaires, setPartenaires] = useState([
    { 
      id: 1,
      nom: 'Architecte Principal', 
      coutHoraire: 85, 
      heuresEstimees: 200,
      pourcentage: 0,
      montantPrevisionnel: 0
    },
    { 
      id: 2,
      nom: 'Architecte Associé', 
      coutHoraire: 70, 
      heuresEstimees: 150,
      pourcentage: 0,
      montantPrevisionnel: 0
    }
  ]);

  // État pour les évolutions
  const [evolutions, setEvolutions] = useState([]);

  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('scenarios');

  // États pour héritage et validation
  const [missionId, setMissionId] = useState(null);
  const [inheritedData, setInheritedData] = useState(null);
  const [validation, setValidation] = useState(null);

  // Handlers
  const handleEvolutionChange = (nouvellesEvolutions) => {
    setEvolutions(nouvellesEvolutions);
  };

  const handleBloquerEvolution = (evolutionId, bloque) => {
    if (window.showToast) {
      window.showToast(
        bloque ? '🔒 Évolution bloquée' : '🔓 Évolution débloquée',
        bloque ? 'info' : 'success'
      );
    }
  };

  const handleExporterProposition = (proposition) => {
    // Export de la proposition corrigée
    const blob = new Blob([JSON.stringify(proposition, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposition-${proposition.evolution}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (window.showToast) {
      window.showToast('✅ Proposition exportée', 'success');
    }
  };

  // Validation automatique des pourcentages et montants
  useEffect(() => {
    const validateHonoraires = async () => {
      if (!basePercentages || Object.keys(basePercentages).length === 0) return;

      try {
        const missions = Object.entries(basePercentages).map(([designation, pourcentage]) => ({
          designation,
          pourcentage,
          montantHT: (montantTravaux * pourcentage) / 100
        }));

        const validationResult = await ValidationAPI.validatePourcentagesMontants(missions, montantTravaux);
        setValidation(validationResult);
      } catch (error) {
        console.error('Erreur validation honoraires:', error);
      }
    };

    validateHonoraires();
  }, [basePercentages, montantTravaux]);

  // Validation montants vs heures
  useEffect(() => {
    const validateMontantsHeures = async () => {
      if (!partenaires || partenaires.length === 0) return;

      try {
        const montantTotal = Object.values(basePercentages).reduce((sum, pct) => {
          return sum + (montantTravaux * pct) / 100;
        }, 0);

        const validationResult = await ValidationAPI.validateMontantsHeures(partenaires, montantTotal);
        if (validationResult.errors.length > 0 || validationResult.warnings.length > 0) {
          // Fusionner avec la validation existante
          setValidation(prev => ({
            ...prev,
            errors: [...(prev?.errors || []), ...validationResult.errors],
            warnings: [...(prev?.warnings || []), ...validationResult.warnings],
            valid: prev?.valid && validationResult.valid
          }));
        }
      } catch (error) {
        console.error('Erreur validation montants/heures:', error);
      }
    };

    validateMontantsHeures();
  }, [partenaires, basePercentages, montantTravaux]);

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-brand" /> Calcul d'Honoraires
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Évolution en temps réel des pourcentages et ventilation par mission/partenaire
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Save size={18} />
            <span>Sauvegarder</span>
          </button>
          <button 
            onClick={() => {
              const missions = Object.keys(basePercentages).map(key => ({ id: key, nom: key }));
              exportHonorairesExcel({
                montantTravaux,
                evolutions: evolutions.length > 0 ? evolutions : [{ id: 'base', nom: 'Base', pourcentages: basePercentages }],
                missions,
                partenaires
              });
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download size={18} />
            <span>Exporter Excel</span>
          </button>
          <button 
            onClick={() => {
              const missions = Object.keys(basePercentages).map(key => ({ id: key, nom: key }));
              exportHonorairesPDF({
                montantTravaux,
                evolutions: evolutions.length > 0 ? evolutions : [{ id: 'base', nom: 'Base', pourcentages: basePercentages }],
                missions,
                partenaires
              });
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover shadow-lg shadow-brand/20 transition-colors"
          >
            <Download size={18} />
            <span>Exporter PDF</span>
          </button>
        </div>
      </div>

      {/* Sélection Mission pour héritage */}
      {missionId && (
        <InheritanceHelper
          type="mission"
          sourceId={missionId}
          onInherit={(data) => {
            setInheritedData(data);
            // Pré-remplir le montant travaux (invariant)
            if (data.montantTravaux) {
              setMontantTravaux(data.montantTravaux);
            }
            // Pré-remplir les partenaires si disponibles
            if (data.equipe && data.equipe.length > 0) {
              setPartenaires(data.equipe);
            }
          }}
          showValidation={true}
        />
      )}

      {/* Champ pour sélectionner une mission */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Lier à une Mission (optionnel - pour héritage automatique)
        </label>
        <input
          type="number"
          value={missionId || ''}
          onChange={(e) => setMissionId(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full md:w-64 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          placeholder="ID de la mission"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Si une mission est sélectionnée, le montant des travaux et l'équipe seront hérités automatiquement
        </p>
      </div>

      {/* Alertes de validation */}
      {validation && (
        <ValidationAlerts validation={validation} className="mb-4" />
      )}

      {/* Montant des travaux (pré-rempli, unique) */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Montant des Travaux (€) {inheritedData?.montantTravaux && '(hérité, non modifiable)'}
        </label>
        <input
          type="number"
          value={montantTravaux}
          onChange={(e) => {
            // Ne pas permettre la modification si hérité
            if (!inheritedData?.montantTravaux) {
              setMontantTravaux(parseFloat(e.target.value) || 0);
            }
          }}
          disabled={!!inheritedData?.montantTravaux}
          className={`w-full md:w-64 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
            inheritedData?.montantTravaux ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          placeholder="Montant des travaux"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {inheritedData?.montantTravaux 
            ? 'Ce montant est hérité de la mission et ne peut pas être modifié'
            : 'Ce montant est unique et sera utilisé pour tous les calculs d\'honoraires'}
        </p>
      </div>

      {/* Tableau équipe avec pourcentages et montants */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-brand" />
          Équipe constituée - Répartition des honoraires
        </h2>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Poste</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">Coût horaire moyen HT / Minimum (€/h)</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Pourcentage (%)</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Montant prévisionnel (€ HT)</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">Heures estimées</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">Total heures (€)</th>
              </tr>
            </thead>
            <tbody>
              {partenaires.map((partenaire, index) => {
                // Calcul automatique du montant si pourcentage modifié
                const montantCalc = partenaire.pourcentage > 0 
                  ? (montantTravaux * partenaire.pourcentage) / 100
                  : partenaire.montantPrevisionnel;
                
                // Calcul automatique des heures si montant modifié
                const heuresCalc = partenaire.coutHoraire > 0 && montantCalc > 0
                  ? montantCalc / partenaire.coutHoraire
                  : partenaire.heuresEstimees;
                
                // Total heures en €
                const totalHeures = partenaire.coutHoraire * partenaire.heuresEstimees;

                return (
                  <tr 
                    key={partenaire.id || index}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-2 sm:px-4 py-3 text-slate-900 dark:text-white font-medium text-xs sm:text-sm">
                      {partenaire.nom}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-slate-700 dark:text-slate-300 hidden md:table-cell">
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Moyen HT (€/h)</label>
                          <input
                            type="number"
                            value={partenaire.coutHoraire || partenaire.coutHoraireMoyen || 0}
                            onChange={(e) => {
                              const newCout = parseFloat(e.target.value) || 0;
                              const newPartenaires = [...partenaires];
                              newPartenaires[index] = {
                                ...partenaire,
                                coutHoraire: newCout,
                                coutHoraireMoyen: newCout,
                                // Recalculer les heures si montant existe
                                heuresEstimees: newCout > 0 && partenaire.montantPrevisionnel > 0
                                  ? partenaire.montantPrevisionnel / newCout
                                  : partenaire.heuresEstimees
                              };
                              setPartenaires(newPartenaires);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Minimum (€/h)</label>
                          <input
                            type="number"
                            value={partenaire.coutHoraireMinimum || 0}
                            onChange={(e) => {
                              const newCoutMin = parseFloat(e.target.value) || 0;
                              const newPartenaires = [...partenaires];
                              newPartenaires[index] = {
                                ...partenaire,
                                coutHoraireMinimum: newCoutMin
                              };
                              setPartenaires(newPartenaires);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="number"
                        value={partenaire.pourcentage}
                        onChange={(e) => {
                          const newPourcentage = parseFloat(e.target.value) || 0;
                          const newMontant = (montantTravaux * newPourcentage) / 100;
                          const newPartenaires = [...partenaires];
                          newPartenaires[index] = {
                            ...partenaire,
                            pourcentage: newPourcentage,
                            montantPrevisionnel: newMontant,
                            // Recalculer les heures automatiquement
                            heuresEstimees: partenaire.coutHoraire > 0 && newMontant > 0
                              ? newMontant / partenaire.coutHoraire
                              : partenaire.heuresEstimees
                          };
                          setPartenaires(newPartenaires);
                        }}
                        className="w-20 sm:w-24 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm text-center"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="number"
                        value={montantCalc.toFixed(2)}
                        onChange={(e) => {
                          const newMontant = parseFloat(e.target.value) || 0;
                          const newPourcentage = montantTravaux > 0 
                            ? (newMontant / montantTravaux) * 100
                            : 0;
                          const newPartenaires = [...partenaires];
                          newPartenaires[index] = {
                            ...partenaire,
                            montantPrevisionnel: newMontant,
                            pourcentage: newPourcentage,
                            // Recalculer les heures automatiquement
                            heuresEstimees: partenaire.coutHoraire > 0 && newMontant > 0
                              ? newMontant / partenaire.coutHoraire
                              : partenaire.heuresEstimees
                          };
                          setPartenaires(newPartenaires);
                        }}
                        className="w-28 sm:w-32 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm text-center"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">
                      <input
                        type="number"
                        value={heuresCalc.toFixed(1)}
                        onChange={(e) => {
                          const newHeures = parseFloat(e.target.value) || 0;
                          const newMontant = partenaire.coutHoraire * newHeures;
                          const newPourcentage = montantTravaux > 0
                            ? (newMontant / montantTravaux) * 100
                            : 0;
                          const newPartenaires = [...partenaires];
                          newPartenaires[index] = {
                            ...partenaire,
                            heuresEstimees: newHeures,
                            montantPrevisionnel: newMontant,
                            pourcentage: newPourcentage
                          };
                          setPartenaires(newPartenaires);
                        }}
                        className="w-20 sm:w-24 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm text-center"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm hidden lg:table-cell">
                      {totalHeures.toFixed(2)} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-600 font-bold">
                <td className="px-2 sm:px-4 py-3 text-slate-900 dark:text-white text-xs sm:text-sm">TOTAL</td>
                <td className="px-2 sm:px-4 py-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">
                  {partenaires.length > 0 
                    ? (partenaires.reduce((sum, p) => sum + (p.coutHoraire || p.coutHoraireMoyen || 0), 0) / partenaires.length).toFixed(2)
                    : '0.00'
                  } €/h (moy.) / {partenaires.length > 0 
                    ? Math.min(...partenaires.map(p => p.coutHoraireMinimum || p.coutHoraire || p.coutHoraireMoyen || 0)).toFixed(2)
                    : '0.00'
                  } €/h (min.)
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-slate-900 dark:text-white text-xs sm:text-sm">
                  {partenaires.reduce((sum, p) => sum + p.pourcentage, 0).toFixed(2)}%
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-slate-900 dark:text-white text-xs sm:text-sm">
                  {formatMontant(partenaires.reduce((sum, p) => sum + (p.montantPrevisionnel || (montantTravaux * p.pourcentage / 100)), 0), 2)}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                  {partenaires.reduce((sum, p) => sum + p.heuresEstimees, 0).toFixed(1)} h
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-slate-900 dark:text-white text-xs sm:text-sm hidden lg:table-cell">
                  {partenaires.reduce((sum, p) => sum + (p.coutHoraire * p.heuresEstimees), 0).toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Résumé honoraires prévisionnels */}
        <div className="mt-6 p-4 bg-brand/10 dark:bg-brand/20 rounded-lg border border-brand/30">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Honoraires prévisionnels</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total honoraires équipe</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {partenaires.reduce((sum, p) => sum + (p.montantPrevisionnel || (montantTravaux * p.pourcentage / 100)), 0).toFixed(2)} € HT
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total heures</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {partenaires.reduce((sum, p) => sum + p.heuresEstimees, 0).toFixed(1)} h
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Coût horaire moyen</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {partenaires.length > 0 && partenaires.reduce((sum, p) => sum + p.heuresEstimees, 0) > 0
                  ? (partenaires.reduce((sum, p) => sum + (p.montantPrevisionnel || (montantTravaux * p.pourcentage / 100)), 0) / partenaires.reduce((sum, p) => sum + p.heuresEstimees, 0)).toFixed(2)
                  : '0.00'
                } €/h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'scenarios'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Scénarios (Base, Évolution 1, Évolution 2)
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'evolution'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp size={18} className="inline mr-2" />
            Évolution des %
          </button>
          <button
            onClick={() => setActiveTab('ventilation')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ventilation'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Ventilation Mission/Partenaire
          </button>
        </nav>
      </div>

      {/* Contenu selon l'onglet */}
      {activeTab === 'scenarios' && (
        <ScenariosHonoraires
          montantTravaux={montantTravaux}
          basePercentages={basePercentages}
          partenaires={partenaires}
          onSave={(data) => {
            console.log('Scénario sauvegardé:', data);
            if (window.showToast) {
              window.showToast('✅ Scénario sauvegardé avec succès', 'success');
            }
          }}
          onExport={(data) => {
            console.log('Scénario exporté:', data);
          }}
        />
      )}

      {activeTab === 'evolution' && (
        <HonorairesEvolutionTable
          montantTravaux={montantTravaux}
          basePercentages={basePercentages}
          partenaires={partenaires}
          regle6040={{ base: 60, evolution: 40 }}
          onEvolutionChange={handleEvolutionChange}
          onBloquerEvolution={handleBloquerEvolution}
          onExporterProposition={handleExporterProposition}
        />
      )}

      {activeTab === 'ventilation' && (
        <HonorairesVentilation
          montantTravaux={montantTravaux}
          basePercentages={basePercentages}
          partenaires={partenaires}
        />
      )}
    </div>
  );
}