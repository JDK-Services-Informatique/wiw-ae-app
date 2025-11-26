import React, { useState } from 'react';
import { defaultOpportunites } from '../data/defaultData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Search, Building2 } from 'lucide-react';

export default function Prospection() {
  const [periode, setPeriode] = useState('6mois'); // '6mois' ou '1an'
  const [viewMode, setViewMode] = useState('opportunites'); // 'opportunites', 'contacts', 'statistiques'
  const [showNewOpportunite, setShowNewOpportunite] = useState(false);
  const [selectedOpportunite, setSelectedOpportunite] = useState(null);

  // Liste des clients avec qui on a déjà travaillé (récupérée depuis les opportunités)
  const clientsExistants = [...new Set(defaultOpportunites.filter(o => o.dejaTravaillé).map(o => o.client))];
  
  // Données professionnelles
  const [opportunites] = useLocalStorage('wiw-opportunites', defaultOpportunites);

  // Filtrage selon la période
  const getFilteredOpportunites = () => {
    const today = new Date();
    const limitDate = new Date();
    
    if (periode === '6mois') {
      limitDate.setMonth(today.getMonth() + 6);
    } else {
      limitDate.setFullYear(today.getFullYear() + 1);
    }

    return opportunites.filter(opp => {
      const echeanceDate = new Date(opp.echeance);
      return echeanceDate >= today && echeanceDate <= limitDate;
    });
  };

  const filteredOpportunites = getFilteredOpportunites();

  // Statistiques
  const totalMontantEstime = filteredOpportunites.reduce((sum, opp) => sum + opp.montantEstime, 0);
  const montantPondere = filteredOpportunites.reduce((sum, opp) => sum + (opp.montantEstime * opp.probabilite / 100), 0);
  const tauxSuccesMoyen = filteredOpportunites.length > 0 
    ? filteredOpportunites.reduce((sum, opp) => sum + opp.probabilite, 0) / filteredOpportunites.length 
    : 0;

  const getStatutBadge = (statut) => {
    const badges = {
      'Prospection': { bg: '#6b7280', color: '#fff' },
      'Proposition envoyée': { bg: '#3b82f6', color: '#fff' },
      'Négociation': { bg: '#fb923c', color: '#fff' },
      'Contrat signé': { bg: '#10b981', color: '#fff' },
      'Abandonné': { bg: '#ef4444', color: '#fff' }
    };
    return badges[statut] || { bg: '#6b7280', color: '#fff' };
  };

  const getProbabiliteBadge = (probabilite) => {
    if (probabilite >= 75) return { bg: '#10b981', color: '#fff', text: 'Élevée' };
    if (probabilite >= 50) return { bg: '#fb923c', color: '#fff', text: 'Moyenne' };
    return { bg: '#ef4444', color: '#fff', text: 'Faible' };
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px'}}>Prospection</h2>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          {/* Sélecteur période */}
          <div style={{
            display: 'flex',
            gap: '5px',
            background: 'var(--panel)',
            padding: '5px',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <button 
              className={periode === '6mois' ? 'btn' : 'btn-secondary'}
              onClick={() => setPeriode('6mois')}
              style={{fontSize: '13px', padding: '8px 16px'}}>
              6 mois
            </button>
            <button 
              className={periode === '1an' ? 'btn' : 'btn-secondary'}
              onClick={() => setPeriode('1an')}
              style={{fontSize: '13px', padding: '8px 16px'}}>
              1 an
            </button>
          </div>
          <button className="btn" onClick={() => setShowNewOpportunite(true)}>
            ➕ Nouvelle opportunité
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
        <div className="card" style={{background: 'rgba(59, 130, 246, 0.1)'}}>
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Opportunités ({periode === '6mois' ? '6 mois' : '1 an'})</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#3b82f6'}}>{filteredOpportunites.length}</div>
        </div>
        <div className="card" style={{background: 'rgba(16, 185, 129, 0.1)'}}>
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Montant total estimé</div>
          <div style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>
            {(totalMontantEstime / 1000000).toFixed(1)} M€
          </div>
        </div>
        <div className="card" style={{background: 'rgba(251, 146, 60, 0.1)'}}>
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Montant pondéré</div>
          <div style={{fontSize: '20px', fontWeight: 'bold', color: '#fb923c'}}>
            {(montantPondere / 1000000).toFixed(1)} M€
          </div>
        </div>
        <div className="card" style={{background: 'rgba(168, 85, 247, 0.1)'}}>
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Taux succès moyen</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#a855f7'}}>{tauxSuccesMoyen.toFixed(0)}%</div>
        </div>
      </div>

      {/* Navigation onglets */}
      <div style={{display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '10px'}}>
        <button 
          className={viewMode === 'opportunites' ? 'btn' : 'btn-secondary'}
          onClick={() => setViewMode('opportunites')}>
          Opportunités ({filteredOpportunites.length})
        </button>
        <button 
          className={viewMode === 'statistiques' ? 'btn' : 'btn-secondary'}
          onClick={() => setViewMode('statistiques')}>
          Statistiques
        </button>
      </div>

      {/* Vue Opportunités */}
      {viewMode === 'opportunites' && (
        <div style={{display: 'grid', gap: '15px'}}>
          {filteredOpportunites.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px', opacity: 0.5}}>
              <div style={{fontSize: '48px', marginBottom: '10px'}}><Search size={48} /></div>
              <div>Aucune opportunité pour la période sélectionnée</div>
            </div>
          ) : (
            filteredOpportunites.map(opp => {
              const statutBadge = getStatutBadge(opp.statut);
              const probaBadge = getProbabiliteBadge(opp.probabilite);
              
              // Calcul de l'indentation selon la probabilité (affichage décalé)
              // Probabilité faible (0-33%) = 0px, moyenne (34-66%) = 20px, élevée (67-100%) = 40px
              const probaIndex = opp.probabilite < 34 ? 0 : opp.probabilite < 67 ? 1 : 2;
              const marginLeft = probaIndex * 20;
              
              // Vérifier si déjà travaillé avec ce client
              const dejaTravaillé = opp.dejaTravaillé !== undefined 
                ? opp.dejaTravaillé 
                : clientsExistants.includes(opp.client);
              
              return (
                <div 
                  key={opp.id} 
                  className="card"
                  onClick={() => setSelectedOpportunite(opp)}
                  style={{
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    marginLeft: `${marginLeft}px`, // Affichage décalé selon probabilité
                    borderLeft: dejaTravaillé ? '4px solid #10b981' : '4px solid transparent',
                    background: dejaTravaillé ? 'rgba(16, 185, 129, 0.05)' : 'var(--panel)'
                  }}
                >
                  <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'start'}}>
                    <div>
                      <h3 style={{fontSize: '18px', marginBottom: '8px'}}>{opp.nom}</h3>
                      <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span><Building2 size={16} /> {opp.client}</span>
                        {dejaTravaillé && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            background: '#10b981',
                            color: '#fff'
                          }}>
                            ✓ Déjà travaillé
                          </span>
                        )}
                        <span>📞 {opp.contact}</span>
                      </div>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px'}}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: statutBadge.bg,
                          color: statutBadge.color
                        }}>
                          {opp.statut}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: probaBadge.bg,
                          color: probaBadge.color
                        }}>
                          {probaBadge.text} ({opp.probabilite}%)
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: 'rgba(100, 100, 100, 0.2)'
                        }}>
                          {opp.domaine} - {opp.type}
                        </span>
                      </div>
                      {opp.notes && (
                        <div className="paragraph-block mt-3">
                          <p className="text-sm italic text-slate-600 dark:text-slate-400">
                            {opp.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px'}}>
                        {(opp.montantEstime / 1000000).toFixed(2)} M€
                      </div>
                      <div style={{fontSize: '11px', opacity: 0.6}}>
                        Pondéré: {((opp.montantEstime * opp.probabilite / 100) / 1000000).toFixed(2)} M€
                      </div>
                      <div style={{fontSize: '12px', marginTop: '10px', opacity: 0.7}}>
                        📅 Échéance: {new Date(opp.echeance).toLocaleDateString('fr-FR')}
                      </div>
                      <div style={{display: 'flex', gap: '5px', marginTop: '10px', justifyContent: 'flex-end'}}>
                        <button
                          className="btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOpportunite(opp);
                          }}
                          style={{padding: '4px 8px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vue Statistiques */}
      {viewMode === 'statistiques' && (
        <div style={{display: 'grid', gap: '20px'}}>
          {/* Par statut */}
          <div className="card">
            <h3 style={{marginBottom: '15px'}}>Répartition par statut</h3>
            <div style={{display: 'grid', gap: '10px'}}>
              {['Prospection', 'Proposition envoyée', 'Négociation', 'Contrat signé'].map(statut => {
                const oppStatut = filteredOpportunites.filter(o => o.statut === statut);
                const count = oppStatut.length;
                const montant = oppStatut.reduce((sum, o) => sum + o.montantEstime, 0);
                const badge = getStatutBadge(statut);
                
                if (count === 0) return null;
                
                return (
                  <div key={statut} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${badge.bg}`
                  }}>
                    <div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: badge.bg,
                        color: badge.color,
                        marginRight: '10px'
                      }}>
                        {statut}
                      </span>
                      <span style={{fontSize: '13px', opacity: 0.7}}>{count} opportunité(s)</span>
                    </div>
                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                      {(montant / 1000000).toFixed(2)} M€
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Par domaine */}
          <div className="card">
            <h3 style={{marginBottom: '15px'}}>Répartition par domaine</h3>
            <div style={{display: 'grid', gap: '10px'}}>
              {[...new Set(filteredOpportunites.map(o => o.domaine))].map(domaine => {
                const oppDomaine = filteredOpportunites.filter(o => o.domaine === domaine);
                const count = oppDomaine.length;
                const montant = oppDomaine.reduce((sum, o) => sum + o.montantEstime, 0);
                const pourcentage = (count / filteredOpportunites.length) * 100;
                
                return (
                  <div key={domaine} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <span style={{fontWeight: 'bold', marginRight: '10px'}}>{domaine}</span>
                      <span style={{fontSize: '13px', opacity: 0.7}}>
                        {count} opportunité(s) ({pourcentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{fontWeight: 'bold', fontSize: '16px', color: '#3b82f6'}}>
                      {(montant / 1000000).toFixed(2)} M€
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal détails opportunité */}
      {selectedOpportunite && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setSelectedOpportunite(null)}>
          <div className="card" style={{
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="section-title">{selectedOpportunite.nom}</h3>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedOpportunite(null)}
              >
                ✕
              </button>
            </div>
            
            {/* Section Informations générales */}
            <div className="section-box mb-6">
              <h3 className="section-subtitle">Informations générales</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-item-label">Client:</span>
                  <span className="info-item-value">{selectedOpportunite.client}</span>
                </div>
                <div className="info-item">
                  <span className="info-item-label">Contact:</span>
                  <span className="info-item-value">{selectedOpportunite.contact}</span>
                </div>
                {selectedOpportunite.tel && (
                  <div className="info-item">
                    <span className="info-item-label">Téléphone:</span>
                    <span className="info-item-value">{selectedOpportunite.tel}</span>
                  </div>
                )}
                {selectedOpportunite.email && (
                  <div className="info-item">
                    <span className="info-item-label">Email:</span>
                    <span className="info-item-value">{selectedOpportunite.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section Caractéristiques */}
            <div className="section-box mb-6">
              <h3 className="section-subtitle">Caractéristiques</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-item-label">Domaine:</span>
                  <span className="info-item-value">{selectedOpportunite.domaine}</span>
                </div>
                <div className="info-item">
                  <span className="info-item-label">Type:</span>
                  <span className="info-item-value">{selectedOpportunite.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-item-label">Montant estimé:</span>
                  <span className="info-item-value font-semibold text-emerald-600 dark:text-emerald-400">
                    {(selectedOpportunite.montantEstime / 1000000).toFixed(2)} M€
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-item-label">Probabilité:</span>
                  <span className="info-item-value">
                    <span className={getProbabiliteBadge(selectedOpportunite.probabilite).color}>
                      {selectedOpportunite.probabilite}%
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
              <button className="btn-secondary" onClick={() => setSelectedOpportunite(null)}>
                Fermer
              </button>
              <button className="btn" style={{background: '#3b82f6', color: '#fff'}}>
                ✏️ Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
