import React, { useState } from 'react';
import { Save, Download, Plus, Trash2, Copy, CheckCircle } from 'lucide-react';
import HonorairesEvolutionTable from './HonorairesEvolutionTable';
import { exportHonorairesExcel, exportHonorairesPDF } from '../utils/export';

/**
 * Composant ScenariosHonoraires
 * Gestion complète des scénarios d'honoraires avec Base, Evolution 1, Evolution 2
 */
export default function ScenariosHonoraires({
  montantTravaux = 0,
  basePercentages = {},
  partenaires = [],
  onSave,
  onExport
}) {
  const [scenarios, setScenarios] = useState([
    {
      id: 'base',
      nom: 'Base',
      description: 'Scénario de base avec pourcentages standards',
      pourcentages: { ...basePercentages },
      bloque: false,
      actif: true
    },
    {
      id: 'evolution-1',
      nom: 'Évolution 1',
      description: 'Première variante du scénario',
      pourcentages: { ...basePercentages },
      bloque: false,
      actif: false
    },
    {
      id: 'evolution-2',
      nom: 'Évolution 2',
      description: 'Deuxième variante du scénario',
      pourcentages: { ...basePercentages },
      bloque: false,
      actif: false
    }
  ]);

  const [activeScenarioId, setActiveScenarioId] = useState('base');

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const handleScenarioChange = (evolutionId, nouvellesEvolutions) => {
    // Mettre à jour le scénario actif avec les nouvelles évolutions
    const updatedScenarios = scenarios.map(scenario => {
      if (scenario.id === activeScenarioId) {
        return {
          ...scenario,
          pourcentages: nouvellesEvolutions.find(e => e.id === 'base')?.pourcentages || scenario.pourcentages
        };
      }
      return scenario;
    });
    setScenarios(updatedScenarios);
  };

  const handleSaveScenario = () => {
    if (onSave) {
      onSave({
        scenario: activeScenario,
        montantTravaux,
        partenaires
      });
    }
    if (window.showToast) {
      window.showToast('✅ Scénario sauvegardé', 'success');
    }
  };

  const handleExportScenario = (format = 'pdf') => {
    const missions = Object.keys(activeScenario.pourcentages).map(key => ({ id: key, nom: key }));
    const evolutions = [
      { id: 'base', nom: activeScenario.nom, pourcentages: activeScenario.pourcentages }
    ];

    if (format === 'excel') {
      exportHonorairesExcel({
        montantTravaux,
        evolutions,
        missions,
        partenaires
      }, `Scenario_${activeScenario.nom}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      exportHonorairesPDF({
        montantTravaux,
        evolutions,
        missions,
        partenaires
      }, `Scenario_${activeScenario.nom}_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    if (onExport) {
      onExport({ scenario: activeScenario, format });
    }
  };

  const handleDuplicateScenario = (scenarioId) => {
    const scenarioToDuplicate = scenarios.find(s => s.id === scenarioId);
    if (!scenarioToDuplicate) return;

    const newScenario = {
      id: `scenario-${Date.now()}`,
      nom: `${scenarioToDuplicate.nom} (Copie)`,
      description: `Copie de ${scenarioToDuplicate.nom}`,
      pourcentages: { ...scenarioToDuplicate.pourcentages },
      bloque: false,
      actif: false
    };

    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newScenario.id);

    if (window.showToast) {
      window.showToast('✅ Scénario dupliqué', 'success');
    }
  };

  const handleDeleteScenario = (scenarioId) => {
    if (scenarioId === 'base') {
      if (window.showToast) {
        window.showToast('⚠️ Le scénario de base ne peut pas être supprimé', 'warning');
      }
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer le scénario "${scenarios.find(s => s.id === scenarioId)?.nom}" ?`)) {
      const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
      setScenarios(updatedScenarios);
      
      if (activeScenarioId === scenarioId) {
        setActiveScenarioId('base');
      }

      if (window.showToast) {
        window.showToast('🗑️ Scénario supprimé', 'info');
      }
    }
  };

  const handleAddScenario = () => {
    const newScenario = {
      id: `scenario-${Date.now()}`,
      nom: `Scénario ${scenarios.length}`,
      description: 'Nouveau scénario',
      pourcentages: { ...basePercentages },
      bloque: false,
      actif: false
    };

    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newScenario.id);

    if (window.showToast) {
      window.showToast('✅ Nouveau scénario créé', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection de scénario */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Scénarios d'Honoraires
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gérez plusieurs scénarios d'honoraires (Base, Évolution 1, Évolution 2)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddScenario}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
            >
              <Plus size={18} />
              <span>Nouveau scénario</span>
            </button>
          </div>
        </div>

        {/* Liste des scénarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              onClick={() => setActiveScenarioId(scenario.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                activeScenarioId === scenario.id
                  ? 'border-brand bg-brand/10 dark:bg-brand/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {scenario.nom}
                    </h4>
                    {scenario.id === 'base' && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        Base
                      </span>
                    )}
                    {activeScenarioId === scenario.id && (
                      <CheckCircle size={16} className="text-brand" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {scenario.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {scenario.id !== 'base' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateScenario(scenario.id);
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                      title="Dupliquer"
                    >
                      <Copy size={12} />
                      Dupliquer
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScenario(scenario.id);
                      }}
                      className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions sur le scénario actif */}
        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSaveScenario}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Save size={18} />
            <span>Sauvegarder</span>
          </button>
          <button
            onClick={() => handleExportScenario('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={18} />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExportScenario('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
          >
            <Download size={18} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Tableau d'évolution pour le scénario actif */}
      <HonorairesEvolutionTable
        montantTravaux={montantTravaux}
        basePercentages={activeScenario.pourcentages}
        partenaires={partenaires}
        regle6040={{ base: 60, evolution: 40 }}
        onEvolutionChange={(evolutions) => {
          // Convertir les évolutions en format scénario
          const baseEvolution = evolutions.find(e => e.id === 'base');
          if (baseEvolution) {
            handleScenarioChange(activeScenarioId, evolutions);
          }
        }}
        onBloquerEvolution={(evolutionId, bloque) => {
          const updatedScenarios = scenarios.map(s => {
            if (s.id === activeScenarioId) {
              return { ...s, bloque };
            }
            return s;
          });
          setScenarios(updatedScenarios);
        }}
        onExporterProposition={(proposition) => {
          handleExportScenario('pdf');
        }}
      />
    </div>
  );
}

