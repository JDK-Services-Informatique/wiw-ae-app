import React, { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PipelineProspection from '../components/PipelineProspection';
import Charts, { BarChartComponent, PieChartComponent, AreaChartComponent } from '../components/Charts';
import { formatMontant } from '../utils/formatNumber';

export default function Pipeline() {
  const [tenders] = useLocalStorage('wiw-tenders', []);

  // Données pour les graphiques
  const pipelineStats = useMemo(() => {
    const stats = {
      nouveau: 0,
      contacte: 0,
      analyse: 0,
      proposition: 0,
      negociation: 0,
      gagne: 0,
      perdu: 0,
      archive: 0
    };

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

    tenders.forEach(ao => {
      const etape = mapStatutToEtape(ao.statut);
      stats[etape] = (stats[etape] || 0) + 1;
    });

    return stats;
  }, [tenders]);

  const chartData = useMemo(() => {
    return [
      { label: 'Nouveau', value: pipelineStats.nouveau },
      { label: 'Contacté', value: pipelineStats.contacte },
      { label: 'En analyse', value: pipelineStats.analyse },
      { label: 'Proposition', value: pipelineStats.proposition },
      { label: 'Négociation', value: pipelineStats.negociation },
      { label: 'Gagné', value: pipelineStats.gagne },
      { label: 'Perdu', value: pipelineStats.perdu },
      { label: 'Archivé', value: pipelineStats.archive }
    ].filter(item => item.value > 0);
  }, [pipelineStats]);

  const montantParStatut = useMemo(() => {
    const montants = {};
    tenders.forEach(ao => {
      const statut = ao.statut || 'Nouveau';
      montants[statut] = (montants[statut] || 0) + (ao.montant || 0);
    });
    return Object.entries(montants).map(([label, value]) => ({ label, value }));
  }, [tenders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pipeline de Prospection
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualisez et gérez vos opportunités commerciales dans un pipeline interactif
        </p>
      </div>

      {/* Graphiques de visualisation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Charts
          title="Répartition par étape"
          type="pie"
          data={chartData}
          dataKey="value"
          xKey="label"
          height={300}
        />
        <Charts
          title="Nombre d'AO par étape"
          type="bar"
          data={chartData}
          dataKey="value"
          xKey="label"
          height={300}
        />
      </div>

      <Charts
        title="Montant par statut"
        type="area"
        data={montantParStatut}
        dataKey="value"
        xKey="label"
        height={300}
      />

      <PipelineProspection appelsOffre={tenders} />
    </div>
  );
}