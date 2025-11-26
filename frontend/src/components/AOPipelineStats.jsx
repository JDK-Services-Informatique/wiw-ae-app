import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatNumber';

/**
 * Composant Pipeline AO (KPI-01)
 * Affiche les statistiques des appels d'offres par statut : Nouveaux, En cours, Gagnés, Perdus
 */
export default function AOPipelineStats({ aos = [] }) {
  // Calcul des statistiques
  const stats = React.useMemo(() => {
    const nouveaux = aos.filter(ao => ao.statut === 'Nouveau');
    const enCours = aos.filter(ao => ao.statut === 'En cours');
    const gagnes = aos.filter(ao => ao.statut === 'Gagné');
    const perdus = aos.filter(ao => ao.statut === 'Perdu');

    const montantNouveaux = nouveaux.reduce((sum, ao) => sum + (ao.montant || 0), 0);
    const montantEnCours = enCours.reduce((sum, ao) => sum + (ao.montant || 0), 0);
    const montantGagnes = gagnes.reduce((sum, ao) => sum + (ao.montant || 0), 0);
    const montantPerdus = perdus.reduce((sum, ao) => sum + (ao.montant || 0), 0);

    const totalAOs = aos.length;
    const totalMontant = aos.reduce((sum, ao) => sum + (ao.montant || 0), 0);
    const tauxReussite = totalAOs > 0 ? ((gagnes.length / (gagnes.length + perdus.length)) * 100) || 0 : 0;

    return {
      nouveaux: { count: nouveaux.length, montant: montantNouveaux },
      enCours: { count: enCours.length, montant: montantEnCours },
      gagnes: { count: gagnes.length, montant: montantGagnes },
      perdus: { count: perdus.length, montant: montantPerdus },
      total: { count: totalAOs, montant: totalMontant },
      tauxReussite
    };
  }, [aos]);

  const statCards = [
    {
      id: 'nouveaux',
      label: 'Nouveaux',
      icon: Plus,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      ...stats.nouveaux
    },
    {
      id: 'enCours',
      label: 'En cours',
      icon: Clock,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      ...stats.enCours
    },
    {
      id: 'gagnes',
      label: 'Gagnés',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      ...stats.gagnes
    },
    {
      id: 'perdus',
      label: 'Perdus',
      icon: XCircle,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      ...stats.perdus
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={24} className="text-brand" />
            Pipeline AO - Statistiques
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Vue d'ensemble des appels d'offres par statut
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total.count}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total AO
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: card.bgColor }}
                >
                  <Icon size={24} style={{ color: card.color }} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {card.count}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    AO
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {card.label}
                </div>
                <div className="text-lg font-bold" style={{ color: card.color }}>
                  {formatCurrency(card.montant, 0)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Taux de réussite */}
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Target size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Taux de réussite</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.tauxReussite.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(stats.tauxReussite, 100)}%` }}
            />
          </div>
        </div>

        {/* Montant total */}
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Montant total</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.total.montant, 0)}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tous statuts confondus
          </div>
        </div>

        {/* Montant gagné */}
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Montant gagné</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.gagnes.montant, 0)}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {stats.gagnes.count > 0 ? `${formatCurrency(stats.gagnes.montant / stats.gagnes.count, 0)} en moyenne` : 'Aucun AO gagné'}
          </div>
        </div>
      </div>

      {/* Graphique de répartition */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Répartition par statut
        </h4>
        <div className="space-y-3">
          {statCards.map(card => {
            const pourcentage = stats.total.count > 0 ? (card.count / stats.total.count) * 100 : 0;
            return (
              <div key={card.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: card.color }}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {card.label}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {card.count} ({pourcentage.toFixed(1)}%)
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${pourcentage}%`,
                      background: card.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


