import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, FileCheck, PieChart, TrendingUp, Calendar, Users } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Analytics() {
  const navigate = useNavigate();
  const [tenders] = useLocalStorage('wiw-tenders', []);
  const [projets] = useLocalStorage('wiw-projets', []);
  const [bets] = useLocalStorage('wiw-bets', []);
  
  const [periodeEvolution, setPeriodeEvolution] = useState('3mois'); // '3mois', '6mois', '1an', '3ans'
  const [viewMode, setViewMode] = useState('previsionnel'); // 'previsionnel', 'evolution', 'partenaires'

  // Calculer les commandes validées (projets avec contrat signé)
  const commandesValidees = projets.filter(p => p.statut === 'Contrat signé' || p.statut === 'En cours');
  const montantTotalCommandes = commandesValidees.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);

  // Données pour évolution selon période
  const getEvolutionData = () => {
    const today = new Date();
    const data = [];
    
    if (periodeEvolution === '3mois') {
      for (let i = 2; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthProjets = projets.filter(p => {
          const projetDate = new Date(p.dateCreation || p.annee);
          return projetDate.getMonth() === date.getMonth() && projetDate.getFullYear() === date.getFullYear();
        });
        data.push({
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          value: monthProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
        });
      }
    } else if (periodeEvolution === '6mois') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthProjets = projets.filter(p => {
          const projetDate = new Date(p.dateCreation || p.annee);
          return projetDate.getMonth() === date.getMonth() && projetDate.getFullYear() === date.getFullYear();
        });
        data.push({
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          value: monthProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
        });
      }
    } else if (periodeEvolution === '1an') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthProjets = projets.filter(p => {
          const projetDate = new Date(p.dateCreation || p.annee);
          return projetDate.getMonth() === date.getMonth() && projetDate.getFullYear() === date.getFullYear();
        });
        data.push({
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          value: monthProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
        });
      }
    } else if (periodeEvolution === '3ans') {
      for (let i = 2; i >= 0; i--) {
        const year = today.getFullYear() - i;
        const yearProjets = projets.filter(p => {
          const projetDate = new Date(p.dateCreation || p.annee);
          return projetDate.getFullYear() === year;
        });
        data.push({
          label: year.toString(),
          value: yearProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
        });
      }
    }
    
    return data;
  };

  const evolutionData = getEvolutionData();
  const maxValue = Math.max(...evolutionData.map(d => d.value), 1);

  // Répartition par partenaires
  const repartitionPartenaires = bets.reduce((acc, bet) => {
    const projetsAvecBet = projets.filter(p => p.betId === bet.id);
    const montant = projetsAvecBet.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
    if (montant > 0) {
      acc.push({
        nom: bet.nom,
        montant: montant,
        nbProjets: projetsAvecBet.length
      });
    }
    return acc;
  }, []).sort((a, b) => b.montant - a.montant);

  const totalPartenaires = repartitionPartenaires.reduce((sum, p) => sum + p.montant, 0);

  const handleViewDetail = () => {
    navigate('/analytics?view=objectifs');
    if (window.showToast) {
      window.showToast('Affichage du détail des objectifs', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prévisionnel</h1>
          <p className="text-slate-500 dark:text-slate-400">Prévisionnel commercial et commandes validées</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('previsionnel')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'previsionnel'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Prévisionnel
          </button>
          <button
            onClick={() => setViewMode('evolution')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'evolution'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Évolution
          </button>
          <button
            onClick={() => setViewMode('partenaires')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'partenaires'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Partenaires
          </button>
        </div>
      </div>

      {/* Vue Prévisionnel */}
      {viewMode === 'previsionnel' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl"><FileCheck size={24} /></div>
                <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 gap-1">
                  <ArrowUp size={12} /> +{commandesValidees.length}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {montantTotalCommandes.toLocaleString('fr-FR')} €
              </div>
              <div className="text-sm text-slate-500">Commandes projets validées (contrats signés)</div>
            </div>

            <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
                <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {commandesValidees.length} projets
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {commandesValidees.length > 0 ? Math.round(montantTotalCommandes / commandesValidees.length).toLocaleString('fr-FR') : 0} €
              </div>
              <div className="text-sm text-slate-500">Montant moyen par projet</div>
            </div>

            <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Users size={24} /></div>
                <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {bets.length} partenaires
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{bets.length}</div>
              <div className="text-sm text-slate-500">Partenaires actifs</div>
            </div>
          </div>

          {/* Liste des commandes validées */}
          <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Commandes validées (contrats signés)</h3>
            <div className="space-y-3">
              {commandesValidees.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Aucune commande validée pour le moment
                </div>
              ) : (
                commandesValidees.map((projet, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{projet.nom || 'Projet sans nom'}</div>
                      <div className="text-sm text-slate-500">{projet.client || projet.maitreOuvrage || 'Client non renseigné'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {(projet.montantTravauxHT || 0).toLocaleString('fr-FR')} € HT
                      </div>
                      <div className="text-xs text-slate-500">{projet.statut}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Vue Évolution */}
      {viewMode === 'evolution' && (
        <>
          <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Évolution des commandes</h3>
              <select
                value={periodeEvolution}
                onChange={(e) => setPeriodeEvolution(e.target.value)}
                className="bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="3mois">3 mois</option>
                <option value="6mois">6 mois</option>
                <option value="1an">1 an</option>
                <option value="3ans">3 ans</option>
              </select>
            </div>
            <div className="flex items-end justify-between gap-4 h-64 pb-4 border-b border-slate-100 dark:border-slate-700">
              {evolutionData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full max-w-[40px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full overflow-hidden flex items-end">
                    <div
                      style={{ height: `${(item.value / maxValue) * 100}%` }}
                      className="w-full bg-brand opacity-80 group-hover:opacity-100 transition-all duration-300 rounded-t-lg relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.value.toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Vue Partenaires */}
      {viewMode === 'partenaires' && (
        <>
          <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Répartition par partenaires</h3>
            <div className="space-y-4">
              {repartitionPartenaires.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Aucun partenaire associé à des projets
                </div>
              ) : (
                repartitionPartenaires.map((partenaire, i) => {
                  const pourcentage = totalPartenaires > 0 ? (partenaire.montant / totalPartenaires) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">
                          {partenaire.nom} ({partenaire.nbProjets} projet{partenaire.nbProjets > 1 ? 's' : ''})
                        </span>
                        <span className="font-bold">
                          {partenaire.montant.toLocaleString('fr-FR')} € ({pourcentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${pourcentage}%` }} className="h-full bg-brand" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
