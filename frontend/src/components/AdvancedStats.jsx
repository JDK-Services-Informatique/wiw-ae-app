import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatNumber';

/**
 * Composant de statistiques avancées
 * Affiche des graphiques et analyses détaillées des données
 * 
 * @param {Array} data - Données à analyser
 * @param {string} type - Type de statistiques ('projects', 'tenders', 'team', 'revenue')
 * @param {Object} options - Options de configuration
 */
export default function AdvancedStats({ data = [], type = 'projects', options = {} }) {
  const { period = 'year', showComparison = true, groupBy = 'month' } = options;

  // Calculer les statistiques selon le type
  const stats = useMemo(() => {
    switch (type) {
      case 'projects':
        return calculateProjectStats(data, period, groupBy);
      case 'tenders':
        return calculateTenderStats(data, period, groupBy);
      case 'team':
        return calculateTeamStats(data);
      case 'revenue':
        return calculateRevenueStats(data, period, groupBy);
      default:
        return { chartData: [], summary: {} };
    }
  }, [data, type, period, groupBy]);

  const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.summary && Object.entries(stats.summary).map(([key, value], index) => (
          <div key={key} className="bg-white dark:bg-dark-panel p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{key}</span>
              {value.trend && (
                value.trend > 0 ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {typeof value.value === 'number' && key.toLowerCase().includes('montant')
                ? formatCurrency(value.value, 0)
                : value.value}
            </div>
            {value.change && (
              <div className={`text-xs mt-1 ${value.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {value.change > 0 ? '+' : ''}{value.change}% vs période précédente
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Graphiques */}
      {stats.chartData && stats.chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres */}
          <div className="bg-white dark:bg-dark-panel p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Évolution {groupBy === 'month' ? 'mensuelle' : groupBy === 'year' ? 'annuelle' : 'hebdomadaire'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                    return value.toString();
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number' && value > 1000) {
                      return formatCurrency(value, 0);
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                {showComparison && stats.chartData[0]?.previousValue && (
                  <Bar dataKey="previousValue" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique en ligne */}
          <div className="bg-white dark:bg-dark-panel p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Tendance {groupBy === 'month' ? 'mensuelle' : groupBy === 'year' ? 'annuelle' : 'hebdomadaire'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                    return value.toString();
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number' && value > 1000) {
                      return formatCurrency(value, 0);
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7c3aed" 
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {showComparison && stats.chartData[0]?.previousValue && (
                  <Line 
                    type="monotone" 
                    dataKey="previousValue" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#94a3b8', r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Graphique en camembert pour répartition */}
      {stats.distribution && stats.distribution.length > 0 && (
        <div className="bg-white dark:bg-dark-panel p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Répartition
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  if (typeof value === 'number' && value > 1000) {
                    return formatCurrency(value, 0);
                  }
                  return value;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/**
 * Calculer les statistiques pour les projets
 */
function calculateProjectStats(data, period, groupBy) {
  const now = new Date();
  const chartData = [];
  const summary = {
    'Total projets': { value: data.length },
    'Montant total': { value: data.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0) },
    'Montant moyen': { value: data.length > 0 ? data.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0) / data.length : 0 }
  };

  // Grouper par période
  if (groupBy === 'month') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthData = data.filter(p => {
        const pDate = new Date(p.dateCreation || p.annee || now);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
      });
      chartData.push({
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        value: monthData.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0),
        count: monthData.length
      });
    }
  }

  // Distribution par domaine
  const distribution = {};
  data.forEach(p => {
    const domaine = p.domaine || 'Non renseigné';
    distribution[domaine] = (distribution[domaine] || 0) + (p.montantTravauxHT || 0);
  });

  return {
    chartData,
    summary,
    distribution: Object.entries(distribution).map(([name, value]) => ({ name, value }))
  };
}

/**
 * Calculer les statistiques pour les appels d'offres
 */
function calculateTenderStats(data, period, groupBy) {
  const now = new Date();
  const chartData = [];
  const summary = {
    'Total AO': { value: data.length },
    'Montant total': { value: data.reduce((sum, t) => sum + (t.montant || 0), 0) },
    'Taux de réussite': { value: data.length > 0 ? ((data.filter(t => t.statut === 'Gagné').length / data.length) * 100).toFixed(1) + '%' : '0%' }
  };

  // Grouper par période
  if (groupBy === 'month') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthData = data.filter(t => {
        const tDate = new Date(t.createdAt || t.dateCreation || now);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
      });
      chartData.push({
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        value: monthData.reduce((sum, t) => sum + (t.montant || 0), 0),
        count: monthData.length
      });
    }
  }

  // Distribution par statut
  const distribution = {};
  data.forEach(t => {
    const statut = t.statut || 'Non renseigné';
    distribution[statut] = (distribution[statut] || 0) + 1;
  });

  return {
    chartData,
    summary,
    distribution: Object.entries(distribution).map(([name, value]) => ({ name, value }))
  };
}

/**
 * Calculer les statistiques pour l'équipe
 */
function calculateTeamStats(data) {
  const summary = {
    'Membres actifs': { value: data.filter(m => m.statut === 'actif').length },
    'Total membres': { value: data.length },
    'Taux horaire moyen': { value: data.length > 0 ? data.reduce((sum, m) => sum + (m.tauxHoraire || 0), 0) / data.length : 0 }
  };

  // Distribution par métier
  const distribution = {};
  data.forEach(m => {
    const metier = m.metier || 'Non renseigné';
    distribution[metier] = (distribution[metier] || 0) + 1;
  });

  return {
    chartData: [],
    summary,
    distribution: Object.entries(distribution).map(([name, value]) => ({ name, value }))
  };
}

/**
 * Calculer les statistiques de revenus
 */
function calculateRevenueStats(data, period, groupBy) {
  const now = new Date();
  const chartData = [];
  const totalRevenue = data.reduce((sum, d) => sum + (d.montant || d.montantTravauxHT || 0), 0);

  const summary = {
    'Revenus totaux': { value: totalRevenue },
    'Nombre de projets': { value: data.length },
    'Revenu moyen': { value: data.length > 0 ? totalRevenue / data.length : 0 }
  };

  // Grouper par période
  if (groupBy === 'month') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthData = data.filter(d => {
        const dDate = new Date(d.dateCreation || d.date || now);
        return dDate.getMonth() === date.getMonth() && dDate.getFullYear() === date.getFullYear();
      });
      chartData.push({
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        value: monthData.reduce((sum, d) => sum + (d.montant || d.montantTravauxHT || 0), 0),
        count: monthData.length
      });
    }
  }

  return {
    chartData,
    summary,
    distribution: []
  };
}

