import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Unlock, Plus, Trash2, Download, Save } from 'lucide-react';
import { formatCurrency } from '../utils/formatNumber';

/**
 * Composant pour l'évolution en temps réel des pourcentages d'honoraires
 * Interface type "trader" pour suivre et modifier les % en temps réel
 */
export default function HonorairesEvolutionTable({
  montantTravaux = 0,
  basePercentages = {}, // { mission1: 10, mission2: 15, ... }
  partenaires = [], // [{ nom, coutHoraire, heuresEstimees }]
  regle6040 = { base: 60, evolution: 40 }, // Règle indicative
  onEvolutionChange,
  onBloquerEvolution,
  onExporterProposition
}) {
  const [evolutions, setEvolutions] = useState([
    { id: 'base', nom: 'Base', pourcentages: { ...basePercentages }, bloque: false },
    { id: 'evolution-1', nom: 'Évolution 1', pourcentages: { ...basePercentages }, bloque: false },
    { id: 'evolution-2', nom: 'Évolution 2', pourcentages: { ...basePercentages }, bloque: false }
  ]);
  const [activeEvolutionId, setActiveEvolutionId] = useState('base');

  // Missions depuis les pourcentages de base
  const missions = useMemo(() => {
    return Object.keys(basePercentages).map(key => ({
      id: key,
      nom: key,
      pourcentageBase: basePercentages[key] || 0
    }));
  }, [basePercentages]);

  // Calcul des montants pour chaque évolution
  const calculerMontants = (evolution) => {
    const resultats = {};
    let totalMontant = 0;

    missions.forEach(mission => {
      const pourcentage = evolution.pourcentages[mission.id] || 0;
      const montant = (montantTravaux * pourcentage) / 100;
      resultats[mission.id] = {
        pourcentage,
        montant,
        heuresEstimees: 0 // À calculer selon les partenaires
      };
      totalMontant += montant;
    });

    // Calcul des heures par mission (si partenaires définis)
    if (partenaires.length > 0) {
      missions.forEach(mission => {
        const montantMission = resultats[mission.id].montant;
        // Répartition des heures selon les partenaires
        const heuresParPartenaire = partenaires.map(p => {
          const coutTotalPartenaires = partenaires.reduce((sum, part) => 
            sum + (part.coutHoraire || 0) * (part.heuresEstimees || 0), 0
          );
          const ratio = coutTotalPartenaires > 0 
            ? ((p.coutHoraire || 0) * (p.heuresEstimees || 0)) / coutTotalPartenaires
            : 1 / partenaires.length;
          return (montantMission * ratio) / (p.coutHoraire || 1);
        });
        resultats[mission.id].heuresEstimees = heuresParPartenaire.reduce((sum, h) => sum + h, 0);
      });
    }

    return { resultats, totalMontant };
  };

  // Ajouter une nouvelle évolution
  const ajouterEvolution = () => {
    const derniereEvolution = evolutions[evolutions.length - 1];
    const nouvelleEvolution = {
      id: `evolution-${Date.now()}`,
      nom: `Évolution ${evolutions.length}`,
      pourcentages: { ...derniereEvolution.pourcentages },
      bloque: false
    };
    const nouvellesEvolutions = [...evolutions, nouvelleEvolution];
    setEvolutions(nouvellesEvolutions);
    setActiveEvolutionId(nouvelleEvolution.id);
    if (onEvolutionChange) {
      onEvolutionChange(nouvellesEvolutions);
    }
  };

  // Modifier un pourcentage
  const modifierPourcentage = (evolutionId, missionId, nouveauPourcentage) => {
    const nouvellesEvolutions = evolutions.map(evol => {
      if (evol.id === evolutionId && !evol.bloque) {
        return {
          ...evol,
          pourcentages: {
            ...evol.pourcentages,
            [missionId]: parseFloat(nouveauPourcentage) || 0
          }
        };
      }
      return evol;
    });
    setEvolutions(nouvellesEvolutions);
    if (onEvolutionChange) {
      onEvolutionChange(nouvellesEvolutions);
    }
  };

  // Bloquer/Débloquer une évolution
  const toggleBloque = (evolutionId) => {
    const nouvellesEvolutions = evolutions.map(evol => {
      if (evol.id === evolutionId) {
        return { ...evol, bloque: !evol.bloque };
      }
      return evol;
    });
    setEvolutions(nouvellesEvolutions);
    if (onBloquerEvolution) {
      const evolutionBloquee = nouvellesEvolutions.find(e => e.id === evolutionId);
      onBloquerEvolution(evolutionId, evolutionBloquee.bloque);
    }
  };

  // Supprimer une évolution (sauf la base)
  const supprimerEvolution = (evolutionId) => {
    if (evolutionId === 'base') return;
    const nouvellesEvolutions = evolutions.filter(e => e.id !== evolutionId);
    setEvolutions(nouvellesEvolutions);
    if (onEvolutionChange) {
      onEvolutionChange(nouvellesEvolutions);
    }
  };

  // Exporter la proposition corrigée
  const exporterProposition = (evolutionId) => {
    const evolution = evolutions.find(e => e.id === evolutionId);
    if (!evolution) return;

    const { resultats, totalMontant } = calculerMontants(evolution);
    
    const proposition = {
      evolution: evolution.nom,
      date: new Date().toISOString(),
      montantTravaux,
      missions: missions.map(mission => ({
        nom: mission.nom,
        pourcentage: resultats[mission.id].pourcentage,
        montant: resultats[mission.id].montant,
        heuresEstimees: resultats[mission.id].heuresEstimees
      })),
      totalMontant,
      partenaires: partenaires.map(p => ({
        nom: p.nom,
        coutHoraire: p.coutHoraire,
        heuresEstimees: p.heuresEstimees
      }))
    };

    if (onExporterProposition) {
      onExporterProposition(proposition);
    } else {
      // Export par défaut (JSON)
      const blob = new Blob([JSON.stringify(proposition, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposition-${evolution.nom}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Calculer le total des pourcentages pour une évolution
  const calculerTotalPourcentages = (evolution) => {
    return Object.values(evolution.pourcentages).reduce((sum, p) => sum + (p || 0), 0);
  };

  // Vérifier la règle 60/40 (indicative)
  const verifierRegle6040 = (evolution) => {
    const total = calculerTotalPourcentages(evolution);
    // La règle est indicative, on affiche juste un indicateur
    return {
      respecte: total >= regle6040.base && total <= (regle6040.base + regle6040.evolution),
      total,
      suggestion: total < regle6040.base ? 'Augmenter' : total > (regle6040.base + regle6040.evolution) ? 'Diminuer' : 'OK'
    };
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Évolution des Pourcentages
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Modifiez les % en temps réel et suivez l'évolution des montants
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={ajouterEvolution}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
          >
            <Plus size={18} />
            <span>Nouvelle Évolution</span>
          </button>
        </div>
      </div>

      {/* Règle 60/40 indicative */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Règle indicative 60/40 :</strong> Les pourcentages totaux devraient se situer entre {regle6040.base}% et {regle6040.base + regle6040.evolution}% (indication, non bloquante)
        </p>
      </div>

      {/* Tableau des évolutions */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Mission
              </th>
              {evolutions.map(evolution => (
                <th key={evolution.id} className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase min-w-[150px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span>{evolution.nom}</span>
                      {evolution.id !== 'base' && (
                        <button
                          onClick={() => supprimerEvolution(evolution.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBloque(evolution.id)}
                        className={`p-1 rounded ${evolution.bloque ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}
                        title={evolution.bloque ? 'Débloquer' : 'Bloquer'}
                      >
                        {evolution.bloque ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      {evolution.id !== 'base' && (
                        <button
                          onClick={() => exporterProposition(evolution.id)}
                          className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                          title="Exporter"
                        >
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                    {evolution.bloque && (
                      <span className="text-xs text-red-600 font-normal">Bloqué</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {missions.map(mission => (
              <tr key={mission.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  {mission.nom}
                </td>
                {evolutions.map(evolution => {
                  const { resultats } = calculerMontants(evolution);
                  const montant = resultats[mission.id]?.montant || 0;
                  const heures = resultats[mission.id]?.heuresEstimees || 0;
                  const pourcentage = evolution.pourcentages[mission.id] || 0;

                  return (
                    <td key={evolution.id} className="px-4 py-3 text-center">
                      <div className="space-y-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={pourcentage}
                          onChange={(e) => modifierPourcentage(evolution.id, mission.id, e.target.value)}
                          disabled={evolution.bloque}
                          className={`w-full px-2 py-1 text-center border rounded ${
                            evolution.bloque
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-white dark:bg-dark-panel border-slate-300 dark:border-slate-600'
                          }`}
                        />
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          <div>{formatCurrency(montant)}</div>
                          {heures > 0 && <div className="text-slate-500">{heures.toFixed(1)} h</div>}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Ligne des totaux */}
            <tr className="bg-slate-50 dark:bg-slate-800/50 font-semibold">
              <td className="px-4 py-3 text-slate-900 dark:text-white">Total</td>
              {evolutions.map(evolution => {
                const { totalMontant } = calculerMontants(evolution);
                const totalPourcentages = calculerTotalPourcentages(evolution);
                const regle = verifierRegle6040(evolution);

                return (
                  <td key={evolution.id} className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="text-slate-900 dark:text-white">
                        {formatCurrency(totalMontant)}
                      </div>
                      <div className={`text-sm ${
                        regle.respecte ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {totalPourcentages.toFixed(1)}%
                      </div>
                      {!regle.respecte && (
                        <div className="text-xs text-orange-600">
                          {regle.suggestion}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Décomposition horaire (en second plan) */}
      {partenaires.length > 0 && (
        <details className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            Décomposition Horaire (Détails)
          </summary>
          <div className="mt-4 space-y-2">
            {evolutions.map(evolution => {
              const { resultats } = calculerMontants(evolution);
              return (
                <div key={evolution.id} className="bg-white dark:bg-dark-panel rounded p-3">
                  <h4 className="font-medium mb-2">{evolution.nom}</h4>
                  <div className="space-y-1 text-sm">
                    {missions.map(mission => (
                      <div key={mission.id} className="flex justify-between">
                        <span>{mission.nom}:</span>
                        <span>{resultats[mission.id]?.heuresEstimees.toFixed(1) || 0} h</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}

