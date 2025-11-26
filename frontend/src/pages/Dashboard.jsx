import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, FileCheck, Clock, ArrowUpRight, MoreHorizontal, AlertCircle, Edit } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatMontant } from '../utils/formatNumber';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useListesDeroulantes } from '../hooks/useListesDeroulantes';
import AdvancedStats from '../components/AdvancedStats';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projets] = useLocalStorage('wiw-projets', []);
  const [tenders] = useLocalStorage('wiw-tenders', []);
  const [devis] = useLocalStorage('wiw-devis', []);
  const [team] = useLocalStorage('wiw-team-members', []);
  const { listes } = useListesDeroulantes();

  // Filtres
  const [filterDomaine, setFilterDomaine] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterPeriode, setFilterPeriode] = useState('3ans'); // 'mois', 'annee', '3ans'
  const [filterAnnee, setFilterAnnee] = useState(new Date().getFullYear().toString());
  const [filterMois, setFilterMois] = useState((new Date().getMonth() + 1).toString());
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [showTableauRecap, setShowTableauRecap] = useState(false);

  // Domaines et types depuis les listes déroulantes
  const domaines = listes.domainesProjet || listes.domaines || [];
  const typesProjet = listes.typesProjet || {};
  const domaineTypes = domaines.length > 0 && Object.keys(typesProjet).length > 0 ? 
    domaines.reduce((acc, domaine) => {
      acc[domaine] = typesProjet[domaine] || [];
      return acc;
    }, {}) :
    {
      'Logements': ['Logements collectifs', 'Maisons individuelles', 'Résidence étudiante', 'Logements sociaux'],
      'Équipements publics': ['Équipement culturel', 'Équipement sportif', 'Équipement scolaire', 'Mairie/Administration'],
      'Commerce': ['Centre commercial', 'Commerce de proximité', 'Hôtel/Restaurant'],
      'Bureaux': ['Bureaux neufs', 'Réhabilitation bureaux', 'Co-working'],
      'Industrie': ['Bâtiment industriel', 'Entrepôt/Logistique'],
      'Santé': ['Hôpital', 'Clinique', 'EHPAD'],
      'Autre': ['Mixte', 'Spécifique']
    };

  // Générer les années (3 dernières années)
  const annees = Array.from({ length: 3 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  const mois = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  // Filtrer les projets selon les critères
  const filteredProjets = useMemo(() => {
    let filtered = [...projets];

    // Filtre domaine
    if (filterDomaine !== 'tous') {
      filtered = filtered.filter(p => p.domaine === filterDomaine);
    }

    // Filtre type
    if (filterType !== 'tous') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    // Filtre période
    if (filterPeriode === 'mois') {
      filtered = filtered.filter(p => {
        const projetDate = new Date(p.dateCreation || p.annee || `${filterAnnee}-01-01`);
        return projetDate.getFullYear() === parseInt(filterAnnee) && 
               projetDate.getMonth() + 1 === parseInt(filterMois);
      });
    } else if (filterPeriode === 'annee') {
      filtered = filtered.filter(p => {
        const projetDate = new Date(p.dateCreation || p.annee || `${filterAnnee}-01-01`);
        return projetDate.getFullYear() === parseInt(filterAnnee);
      });
    } else if (filterPeriode === '3ans') {
      const currentYear = new Date().getFullYear();
      filtered = filtered.filter(p => {
        const projetDate = new Date(p.dateCreation || p.annee || `${currentYear}-01-01`);
        return projetDate.getFullYear() >= currentYear - 2 && projetDate.getFullYear() <= currentYear;
      });
    }

    return filtered;
  }, [projets, filterDomaine, filterType, filterPeriode, filterAnnee, filterMois]);

  // Alertes pour les appels d'offres (rendu à venir)
  const alertesRenduAO = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tenders.filter(ao => {
      if (!ao.dateLimiteRemise) return false;
      const dateLimite = new Date(ao.dateLimiteRemise);
      dateLimite.setHours(0, 0, 0, 0);
      const joursRestants = Math.ceil((dateLimite - today) / (1000 * 60 * 60 * 24));
      return joursRestants >= 0 && joursRestants <= 7; // 7 jours avant la date limite
    });
  }, [tenders]);

  // Calcul dynamique des statistiques
  const calculateStats = () => {
    const currentYear = new Date().getFullYear();
    const projetsAnnee = filteredProjets.filter(p => {
      const annee = new Date(p.dateCreation || p.annee || `${currentYear}-01-01`).getFullYear();
      return annee === currentYear;
    });
    
    const projetsAnneePrecedente = projets.filter(p => {
      const annee = new Date(p.dateCreation || p.annee || `${currentYear}-01-01`).getFullYear();
      return annee === currentYear - 1;
    });

    const commandesValidees = filteredProjets.filter(p => p.statut === 'Contrat signé' || p.statut === 'En cours');
    const montantTotal = commandesValidees.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
    const montantAnneePrecedente = projetsAnneePrecedente
      .filter(p => p.statut === 'Contrat signé' || p.statut === 'En cours')
      .reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
    
    const evolution = montantAnneePrecedente > 0 
      ? ((montantTotal - montantAnneePrecedente) / montantAnneePrecedente * 100).toFixed(1)
      : 0;

    // Calcul heures facturables (estimation : 1h pour 1000€ de travaux)
    const heuresEstimees = projetsAnnee.reduce((sum, p) => {
      const montant = p.montantTravauxHT || 0;
      return sum + Math.round(montant / 1000);
    }, 0);

    const heuresAnneePrecedente = projetsAnneePrecedente.reduce((sum, p) => {
      const montant = p.montantTravauxHT || 0;
      return sum + Math.round(montant / 1000);
    }, 0);

    const evolutionHeures = heuresAnneePrecedente > 0
      ? ((heuresEstimees - heuresAnneePrecedente) / heuresAnneePrecedente * 100).toFixed(1)
      : 0;

    return [
      { 
        label: 'Commandes validées', 
        value: formatMontant(montantTotal, 0), 
        change: parseFloat(evolution) >= 0 ? `+${evolution}%` : `${evolution}%`, 
        icon: TrendingUp, 
        color: parseFloat(evolution) >= 0 ? 'text-emerald-500' : 'text-red-500',
        bg: parseFloat(evolution) >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
      },
      { 
        label: 'Projets Actifs', 
        value: filteredProjets.length.toString(), 
        change: projetsAnnee.length > projetsAnneePrecedente.length 
          ? `+${projetsAnnee.length - projetsAnneePrecedente.length}`
          : projetsAnnee.length === projetsAnneePrecedente.length 
            ? '0'
            : `${projetsAnnee.length - projetsAnneePrecedente.length}`, 
        icon: FileCheck, 
        color: 'text-blue-500', 
        bg: 'bg-blue-500/10' 
      },
      { 
        label: 'Heures Facturables', 
        value: heuresEstimees.toLocaleString('fr-FR') + ' h', 
        change: parseFloat(evolutionHeures) >= 0 ? `+${evolutionHeures}%` : `${evolutionHeures}%`, 
        icon: Clock, 
        color: parseFloat(evolutionHeures) >= 0 ? 'text-orange-500' : 'text-red-500',
        bg: parseFloat(evolutionHeures) >= 0 ? 'bg-orange-500/10' : 'bg-red-500/10'
      },
      { 
        label: 'Collaborateurs', 
        value: team.length.toString(), 
        change: '0', 
        icon: Users, 
        color: 'text-brand', 
        bg: 'bg-brand/10' 
      },
    ];
  };

  const stats = calculateStats();

  // Fonctions helper pour les graphiques
  const generateMonthlyData = (projets) => {
    const now = new Date();
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthProjets = projets.filter(p => {
        const pDate = new Date(p.dateCreation || p.annee || now);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
      });
      data.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        montant: monthProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0),
        count: monthProjets.length
      });
    }
    return data;
  };

  const generateDomainDistribution = (projets) => {
    const distribution = {};
    projets.forEach(p => {
      const domaine = p.domaine || 'Non renseigné';
      distribution[domaine] = (distribution[domaine] || 0) + (p.montantTravauxHT || 0);
    });
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      projets: filteredProjets,
      appelsOffres: tenders,
      devis: devis,
      stats: stats,
      filtres: {
        domaine: filterDomaine,
        type: filterType,
        periode: filterPeriode,
        annee: filterAnnee,
        mois: filterMois
      }
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    if (window.showToast) {
      window.showToast('✅ Export du tableau de bord réussi', 'success');
    }
  };

  const handleNewProject = () => {
    navigate('/references');
    setTimeout(() => {
      const event = new CustomEvent('openNewProjectForm');
      window.dispatchEvent(event);
    }, 100);
  };

  const handleViewAllProjects = () => {
    navigate('/references');
  };

  const handleViewDetail = (projet, type = 'reference') => {
    if (type === 'reference') {
      navigate('/references');
      setTimeout(() => {
        const event = new CustomEvent('viewProject', { detail: { projetId: projet.id } });
        window.dispatchEvent(event);
      }, 100);
    } else if (type === 'ao') {
      navigate('/tenders');
      setTimeout(() => {
        const event = new CustomEvent('viewAO', { detail: { aoId: projet.id } });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const handleEditProjet = (projet) => {
    navigate('/references');
    setTimeout(() => {
      const event = new CustomEvent('editProject', { detail: { projetId: projet.id } });
      window.dispatchEvent(event);
    }, 100);
  };

  // Tableau récapitulatif
  const tableauRecap = useMemo(() => {
    const recap = {
      parDomaine: {},
      parType: {},
      parAnnee: {},
      totalMontant: 0,
      nbProjets: filteredProjets.length
    };

    filteredProjets.forEach(projet => {
      // Par domaine
      const domaine = projet.domaine || 'Non renseigné';
      if (!recap.parDomaine[domaine]) {
        recap.parDomaine[domaine] = { count: 0, montant: 0 };
      }
      recap.parDomaine[domaine].count++;
      recap.parDomaine[domaine].montant += projet.montantTravauxHT || 0;

      // Par type
      const type = projet.type || 'Non renseigné';
      if (!recap.parType[type]) {
        recap.parType[type] = { count: 0, montant: 0 };
      }
      recap.parType[type].count++;
      recap.parType[type].montant += projet.montantTravauxHT || 0;

      // Par année
      const annee = new Date(projet.dateCreation || projet.annee || new Date()).getFullYear();
      if (!recap.parAnnee[annee]) {
        recap.parAnnee[annee] = { count: 0, montant: 0 };
      }
      recap.parAnnee[annee].count++;
      recap.parAnnee[annee].montant += projet.montantTravauxHT || 0;

      recap.totalMontant += projet.montantTravauxHT || 0;
    });

    return recap;
  }, [filteredProjets]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-slate-500 dark:text-slate-400">Aperçu de l'activité de l'agence</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Exporter
          </button>
          <button 
            onClick={handleNewProject}
            className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover shadow-lg shadow-brand/20 transition-colors cursor-pointer"
          >
            + Nouveau Projet
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
        <h3 className="font-bold text-lg mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Domaine</label>
            <select
              value={filterDomaine}
              onChange={(e) => {
                setFilterDomaine(e.target.value);
                setFilterType('tous'); // Reset type when domain changes
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
            >
              <option value="tous">Tous les domaines</option>
              {Object.keys(domaineTypes).map(domaine => (
                <option key={domaine} value={domaine}>{domaine}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
              disabled={filterDomaine === 'tous'}
            >
              <option value="tous">Tous les types</option>
              {filterDomaine !== 'tous' && domaineTypes[filterDomaine]?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Période</label>
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
            >
              <option value="3ans">3 dernières années</option>
              <option value="annee">Par année</option>
              <option value="mois">Par mois</option>
            </select>
          </div>

          {filterPeriode === 'annee' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Année</label>
              <select
                value={filterAnnee}
                onChange={(e) => setFilterAnnee(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
              >
                {annees.map(annee => (
                  <option key={annee} value={annee}>{annee}</option>
                ))}
              </select>
            </div>
          )}

          {filterPeriode === 'mois' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Année</label>
                <select
                  value={filterAnnee}
                  onChange={(e) => setFilterAnnee(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
                >
                  {annees.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mois</label>
                <select
                  value={filterMois}
                  onChange={(e) => setFilterMois(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-dark-panel text-sm"
                >
                  {mois.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowTableauRecap(!showTableauRecap)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {showTableauRecap ? 'Masquer' : 'Afficher'} tableau récapitulatif
          </button>
        </div>
      </div>

      {/* Alertes rendu AO */}
      {alertesRenduAO.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <h3 className="font-bold text-red-900 dark:text-red-100">Alertes : Rendu appels d'offres</h3>
          </div>
          <div className="space-y-2">
            {alertesRenduAO.map(ao => {
              const dateLimite = new Date(ao.dateLimiteRemise);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const joursRestants = Math.ceil((dateLimite - today) / (1000 * 60 * 60 * 24));
              return (
                <div key={ao.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{ao.titre || ao.nom}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Date limite : {dateLimite.toLocaleDateString('fr-FR')} 
                      {joursRestants === 0 ? ' (AUJOURD\'HUI)' : joursRestants > 0 ? ` (dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''})` : ` (${Math.abs(joursRestants)} jour${Math.abs(joursRestants) > 1 ? 's' : ''} de retard)`}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/tenders')}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Voir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tableau récapitulatif */}
      {showTableauRecap && (
        <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-lg mb-4">Tableau récapitulatif</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">Par domaine</h4>
              <div className="space-y-2">
                {Object.entries(tableauRecap.parDomaine).map(([domaine, data]) => (
                  <div key={domaine} className="flex justify-between text-sm">
                    <span>{domaine}</span>
                    <span className="font-semibold">
                      {data.count} projet{data.count > 1 ? 's' : ''} - {formatMontant(data.montant, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Par type</h4>
              <div className="space-y-2">
                {Object.entries(tableauRecap.parType).map(([type, data]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{type}</span>
                    <span className="font-semibold">
                      {data.count} projet{data.count > 1 ? 's' : ''} - {formatMontant(data.montant, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Par année</h4>
              <div className="space-y-2">
                {Object.entries(tableauRecap.parAnnee).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([annee, data]) => (
                  <div key={annee} className="flex justify-between text-sm">
                    <span>{annee}</span>
                    <span className="font-semibold">
                      {data.count} projet{data.count > 1 ? 's' : ''} - {formatMontant(data.montant, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">
                {tableauRecap.nbProjets} projet{tableauRecap.nbProjets > 1 ? 's' : ''} - {tableauRecap.totalMontant.toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : stat.change === '0' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Graphiques avec Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres - Évolution mensuelle */}
        <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Évolution mensuelle des projets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateMonthlyData(filteredProjets)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => formatMontant(value, 0)}
              />
              <Legend />
              <Bar dataKey="montant" fill="#7c3aed" radius={[8, 8, 0, 0]} name="Montant (€)" />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="Nombre de projets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique en ligne - Tendance */}
        <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Tendance des montants</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateMonthlyData(filteredProjets)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => formatMontant(value, 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => formatMontant(value, 0)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="montant" 
                stroke="#7c3aed" 
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 4 }}
                activeDot={{ r: 6 }}
                name="Montant (€)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition par domaine - Camembert */}
      <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Répartition par domaine</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={generateDomainDistribution(filteredProjets)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {generateDomainDistribution(filteredProjets).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'][index % 6]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatMontant(value, 0)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques avancées */}
      <AdvancedStats 
        data={filteredProjets} 
        type="projects" 
        options={{ period: filterPeriode, groupBy: 'month' }}
      />

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Projets filtrés ({filteredProjets.length})</h3>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><MoreHorizontal size={20} /></button>
          </div>
          <div className="space-y-3">
            {filteredProjets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Aucun projet ne correspond aux filtres sélectionnés
              </div>
            ) : (
              filteredProjets.slice(0, 5).map((projet) => (
                <div key={projet.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{projet.nom || 'Projet sans nom'}</h4>
                    <p className="text-xs text-slate-500">
                      {projet.domaine} - {projet.type} | {formatMontant(projet.montantTravauxHT || 0, 0)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(projet, 'reference')}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <ArrowUpRight size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleEditProjet(projet)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects List */}
        <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-lg mb-6">Projets Récents</h3>
          <div className="space-y-4">
            {projets.slice(0, 3).map((projet, i) => (
              <div key={projet.id || i} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-sm">
                  {projet.nom?.charAt(0) || 'P'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                    {projet.nom || 'Projet sans nom'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {projet.domaine || 'Non renseigné'} - {projet.annee || new Date().getFullYear()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewDetail(projet, 'reference')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    title="Voir détails"
                  >
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand" />
                  </button>
                  <button
                    onClick={() => handleEditProjet(projet)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    title="Modifier"
                  >
                    <Edit size={14} className="text-slate-300 group-hover:text-brand" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleViewAllProjects}
            className="w-full mt-6 py-2 text-sm font-medium text-brand hover:bg-brand/5 border border-brand/20 rounded-lg transition-colors cursor-pointer"
          >
            Voir tous les projets
          </button>
        </div>
      </div>

      {/* Rappel composition équipe */}
      {selectedProjet && selectedProjet.equipe && selectedProjet.equipe.length > 0 && (
        <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-lg mb-4">Composition équipe titulaire - {selectedProjet.nom}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedProjet.equipe.map((membre, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="font-semibold">{membre.nom || membre.role}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{membre.fonction || membre.role}</div>
                {membre.email && <div className="text-xs text-slate-500">{membre.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
