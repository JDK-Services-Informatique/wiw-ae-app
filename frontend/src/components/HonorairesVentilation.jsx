import React, { useMemo } from 'react';
import { formatCurrency, formatHours } from '../utils/formatNumber';

/**
 * Composant pour la ventilation des honoraires par mission et par partenaire
 * Tableau croisé : Missions × Partenaires
 */
export default function HonorairesVentilation({
  montantTravaux = 0,
  basePercentages = {},
  partenaires = []
}) {
  // Calcul de la ventilation
  const ventilation = useMemo(() => {
    const missions = Object.keys(basePercentages);
    const resultats = {
      missions: [],
      partenaires: partenaires.map(p => ({ ...p, total: 0 })),
      totalGlobal: 0
    };

    missions.forEach(mission => {
      const pourcentage = basePercentages[mission] || 0;
      const montantMission = (montantTravaux * pourcentage) / 100;
      
      // Répartition par partenaire (proportionnelle au coût horaire × heures)
      const coutTotalPartenaires = partenaires.reduce((sum, p) => {
        return sum + (p.coutHoraire || 0) * (p.heuresEstimees || 0);
      }, 0);

      const repartitionPartenaires = partenaires.map(p => {
        const coutPartenaire = (p.coutHoraire || 0) * (p.heuresEstimees || 0);
        const ratio = coutTotalPartenaires > 0 ? coutPartenaire / coutTotalPartenaires : 1 / partenaires.length;
        const montantPartenaire = montantMission * ratio;
        const heuresPartenaire = (montantPartenaire / (p.coutHoraire || 1));

        return {
          partenaireId: p.nom,
          montant: montantPartenaire,
          heures: heuresPartenaire
        };
      });

      const heuresTotal = repartitionPartenaires.reduce((sum, r) => sum + r.heures, 0);

      resultats.missions.push({
        nom: mission,
        pourcentage,
        montant: montantMission,
        heuresTotal,
        repartitionPartenaires
      });

      // Mise à jour des totaux par partenaire
      repartitionPartenaires.forEach((rep, index) => {
        if (resultats.partenaires[index]) {
          resultats.partenaires[index].total += rep.montant;
        }
      });

      resultats.totalGlobal += montantMission;
    });

    return resultats;
  }, [montantTravaux, basePercentages, partenaires]);

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Ventilation Mission par Mission et par Partenaire
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Répartition détaillée des honoraires par mission et par partenaire
        </p>
      </div>

      {/* Tableau de ventilation */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase sticky left-0 bg-slate-50 dark:bg-slate-800/50 z-10">
                Mission
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                % Base
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Montant Mission
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Heures Total
              </th>
              {partenaires.map(partenaire => (
                <th key={partenaire.nom} className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase min-w-[180px]">
                  <div className="flex flex-col">
                    <span>{partenaire.nom}</span>
                    <span className="text-xs font-normal text-slate-400">
                      {formatCurrency(partenaire.coutHoraire)}/h
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {ventilation.missions.map((mission, missionIndex) => (
              <tr key={missionIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-dark-panel z-10">
                  {mission.nom}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                  {mission.pourcentage.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
                  {formatCurrency(mission.montant)}
                </td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                  {formatHours(mission.heuresTotal)}
                </td>
                {mission.repartitionPartenaires.map((rep, partIndex) => (
                  <td key={partIndex} className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(rep.montant)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatHours(rep.heures)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {((rep.montant / mission.montant) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {/* Ligne des totaux */}
            <tr className="bg-slate-50 dark:bg-slate-800/50 font-semibold">
              <td className="px-4 py-3 text-slate-900 dark:text-white sticky left-0 bg-slate-50 dark:bg-slate-800/50 z-10">
                Total
              </td>
              <td className="px-4 py-3 text-center text-slate-900 dark:text-white">
                {Object.values(basePercentages).reduce((sum, p) => sum + (p || 0), 0).toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-right text-slate-900 dark:text-white">
                {formatCurrency(ventilation.totalGlobal)}
              </td>
              <td className="px-4 py-3 text-right text-slate-900 dark:text-white">
                {formatHours(
                  ventilation.missions.reduce((sum, m) => sum + m.heuresTotal, 0)
                )}
              </td>
              {ventilation.partenaires.map((partenaire, index) => {
                const totalHeures = ventilation.missions.reduce((sum, m) => {
                  return sum + (m.repartitionPartenaires[index]?.heures || 0);
                }, 0);
                return (
                  <td key={index} className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="text-slate-900 dark:text-white">
                        {formatCurrency(partenaire.total)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatHours(totalHeures)}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Montant Total</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(ventilation.totalGlobal)}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="text-sm text-green-700 dark:text-green-300 font-medium">Heures Total</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatHours(
              ventilation.missions.reduce((sum, m) => sum + m.heuresTotal, 0)
            )}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Nombre de Missions</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {ventilation.missions.length}
          </div>
        </div>
      </div>
    </div>
  );
}

