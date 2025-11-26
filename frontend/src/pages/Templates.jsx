import React, { useState } from 'react';
import { missionsCompetencesRef, matchEquipeToMission } from '../data/missionsCompetences';
import TeamTemplates from '../components/TeamTemplates';
import { BarChart3, Building2, ClipboardList, Target } from 'lucide-react';

export default function Templates() {
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' ou 'equipes'

  // Types de missions selon la nomenclature MOP
  const typesMission = ['Base', 'Additionnelle', 'Complémentaire', 'Optionnelle'];

  // Missions de base, additionnelles, complémentaires et optionnelles
  const [missions, setMissions] = useState([
    { id: 1, code: 'ESQ', nom: 'ESQ - Esquisse', type: 'Base', description: 'Étude préliminaire et faisabilité', coutHoraireMoyen: 85, coutHoraireCible: 80, heuresEstimees: 80 },
    { id: 2, code: 'APS', nom: 'APS - Avant-Projet Sommaire', type: 'Base', description: 'Définition des grandes lignes du projet', coutHoraireMoyen: 85, coutHoraireCible: 82, heuresEstimees: 120 },
    { id: 3, code: 'APD', nom: 'APD - Avant-Projet Définitif', type: 'Base', description: 'Plans détaillés et choix techniques', coutHoraireMoyen: 85, coutHoraireCible: 85, heuresEstimees: 160 },
    { id: 4, code: 'PRO', nom: 'PRO - Projet', type: 'Base', description: 'Dossier de consultation des entreprises', coutHoraireMoyen: 85, coutHoraireCible: 87, heuresEstimees: 200 },
    { id: 5, code: 'ACT', nom: 'ACT - Assistance aux contrats de travaux', type: 'Base', description: 'Analyse des offres et assistance administrative', coutHoraireMoyen: 85, coutHoraireCible: 80, heuresEstimees: 60 },
    { id: 6, code: 'VISA', nom: 'VISA - Visa', type: 'Additionnelle', description: 'Validation des plans d\'exécution', coutHoraireMoyen: 75, coutHoraireCible: 72, heuresEstimees: 40 },
    { id: 7, code: 'DET', nom: 'DET - Direction de l\'exécution des travaux', type: 'Complémentaire', description: 'Suivi complet du chantier', coutHoraireMoyen: 90, coutHoraireCible: 92, heuresEstimees: 300 },
    { id: 8, code: 'OPC', nom: 'OPC - Ordonnancement, pilotage, coordination', type: 'Complémentaire', description: 'Coordination générale des travaux', coutHoraireMoyen: 95, coutHoraireCible: 98, heuresEstimees: 250 },
    { id: 9, code: 'JURIDIQUE', nom: 'Assistance juridique', type: 'Optionnelle', description: 'Conseil juridique spécifique', coutHoraireMoyen: 120, coutHoraireCible: 115, heuresEstimees: 20 },
    { id: 10, code: 'DIAG', nom: 'Diagnostic technique', type: 'Additionnelle', description: 'Diagnostic structure et pathologies', coutHoraireMoyen: 95, coutHoraireCible: 90, heuresEstimees: 50 }
  ]);

  // Projets disponibles (MOA) - simulation
  const [projetsDisponibles] = useState([
    { id: 1, nom: 'Résidence Les Oliviers', maitreOuvrage: 'Ville de Lyon', montantTravauxHT: 2800000 },
    { id: 2, nom: 'Centre Commercial Rivoli', maitreOuvrage: 'SCI Immobilière', montantTravauxHT: 12000000 },
    { id: 3, nom: 'École Primaire Victor Hugo', maitreOuvrage: 'Mairie de Villeurbanne', montantTravauxHT: 4200000 }
  ]);

  const [projetLie, setProjetLie] = useState(null); // Projet sélectionné
  const [selectedMissions, setSelectedMissions] = useState([]);
  const [filterType, setFilterType] = useState('tous');
  const [showRecap, setShowRecap] = useState(false);
  const [showHorairesDetail, setShowHorairesDetail] = useState(false); // Toggle pour masquer/afficher les détails horaires
  const [showMailingModal, setShowMailingModal] = useState(false); // Modal pour mailing équipe
  const [showLiaisonsModal, setShowLiaisonsModal] = useState(false); // Modal pour afficher liaisons Mission-Équipe-BET

  // Membres d'équipe disponibles avec compétences (données simulées - normalement depuis Team.jsx)
  const [equipeMembres] = useState([
    { 
      id: 1, 
      nom: 'Jean Dupont', 
      role: 'Architecte DPLG', 
      email: 'j.dupont@cabinet.fr',
      metier: { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      competences: ['Conception architecturale', 'Plans architecturaux', 'Plans détaillés', 'Suivi de chantier']
    },
    { 
      id: 2, 
      nom: 'Marie Martin', 
      role: 'Ingénieur structure', 
      email: 'm.martin@bet-structure.fr',
      metier: { macro: 'Ingénierie', domaine: 'Bureau d\'Études Techniques', categorie: 'Ingénieur Structure' },
      competences: ['Calcul structure', 'Diagnostic structure', 'Plans ferraillage']
    },
    { 
      id: 3, 
      nom: 'Sophie Leblanc', 
      role: 'Économiste TCE', 
      email: 's.leblanc@economiste-construction.fr',
      metier: { macro: 'Économie', domaine: 'Étude de coûts', categorie: 'Économiste TCE' },
      competences: ['Économie de la construction', 'Chiffrage sommaire', 'Estimation détaillée', 'DPGF']
    }
  ]);

  // BET disponibles (données simulées - normalement depuis BET.jsx)
  const [betDisponibles] = useState([
    { 
      id: 1, 
      nom: 'Bureau Études BET MARTIN', 
      type: 'Structure',
      competences: ['Calcul béton armé', 'Calcul métal', 'Diagnostic structure']
    },
    { 
      id: 2, 
      nom: 'Ingénierie Thermique LEROY', 
      type: 'Thermique & Fluides',
      competences: ['Étude thermique RT2020', 'CVC', 'BBC']
    },
    { 
      id: 3, 
      nom: 'BET Acoustique SONIC', 
      type: 'Acoustique',
      competences: ['Isolation acoustique', 'Modélisation']
    }
  ]);

  const [mailData, setMailData] = useState({
    destinataires: [],
    sujet: '',
    message: '',
    inclueMissionsSelectionnees: true
  });

  const toggleMission = (missionId) => {
    if (selectedMissions.includes(missionId)) {
      setSelectedMissions(selectedMissions.filter(id => id !== missionId));
    } else {
      setSelectedMissions([...selectedMissions, missionId]);
    }
  };

  const filteredMissions = filterType === 'tous' 
    ? missions 
    : missions.filter(m => m.type === filterType);

  const selectedMissionsData = missions.filter(m => selectedMissions.includes(m.id));
  const totalHeures = selectedMissionsData.reduce((sum, m) => sum + m.heuresEstimees, 0);
  const coutTotal = selectedMissionsData.reduce((sum, m) => sum + (m.coutHoraireMoyen * m.heuresEstimees), 0);
  const coutMoyenPondere = totalHeures > 0 ? coutTotal / totalHeures : 0;
  const coutCibleTotal = selectedMissionsData.reduce((sum, m) => sum + (m.coutHoraireCible * m.heuresEstimees), 0);
  const coutCibleMoyen = totalHeures > 0 ? coutCibleTotal / totalHeures : 0;

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const getTypeBadge = (type) => {
    if (type === 'Base') return { text: 'Base', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (type === 'Additionnelle') return { text: 'Additionnelle', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' };
    if (type === 'Complémentaire') return { text: 'Complémentaire', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' };
    if (type === 'Optionnelle') return { text: 'Optionnelle', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
    return { text: 'Autre', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
  };

  const handleOpenMailing = () => {
    if (selectedMissions.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins une mission');
      return;
    }
    
    // Pré-remplir le sujet avec le projet lié
    const sujetAuto = projetLie 
      ? `Missions pour ${projetLie.nom}` 
      : 'Nouvelles missions';
    
    setMailData({
      destinataires: [],
      sujet: sujetAuto,
      message: '',
      inclueMissionsSelectionnees: true
    });
    setShowMailingModal(true);
  };

  const handleToggleDestinataire = (membreId) => {
    setMailData(prev => ({
      ...prev,
      destinataires: prev.destinataires.includes(membreId)
        ? prev.destinataires.filter(id => id !== membreId)
        : [...prev.destinataires, membreId]
    }));
  };

  const handleSendMailing = () => {
    if (mailData.destinataires.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins un destinataire');
      return;
    }
    if (!mailData.sujet.trim() || !mailData.message.trim()) {
      alert('⚠️ Le sujet et le message sont obligatoires');
      return;
    }

    // Simulation d'envoi d'email (dans un cas réel, appel API backend)
    console.log('Envoi email:', {
      destinataires: equipeMembres.filter(m => mailData.destinataires.includes(m.id)).map(m => m.email),
      sujet: mailData.sujet,
      message: mailData.message,
      missions: mailData.inclueMissionsSelectionnees ? selectedMissionsData : []
    });

    alert(`✅ Email envoyé à ${mailData.destinataires.length} personne(s) :\n${equipeMembres.filter(m => mailData.destinataires.includes(m.id)).map(m => m.nom).join(', ')}`);
    setShowMailingModal(false);
  };

  return (
    <div>
      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('missions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'missions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Templates de Missions
            </button>
            <button
              onClick={() => setActiveTab('equipes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'equipes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Templates d'Équipe
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'missions' ? (
        <>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <div>
              <h2 style={{fontSize: '24px', marginBottom: '5px'}}>Missions</h2>
              <p style={{fontSize: '14px', opacity: 0.7}}>Gestion des missions de base, restreintes, complètes et étendues</p>
            </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button 
            className="btn-secondary"
            onClick={() => setShowLiaisonsModal(true)}
            disabled={selectedMissions.length === 0}
            style={{opacity: selectedMissions.length === 0 ? 0.5 : 1, fontSize: '13px', background: '#7c3aed', color: '#fff'}}>
            🔗 Voir liaisons Équipe/BET ({selectedMissions.length})
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowHorairesDetail(!showHorairesDetail)}
            style={{fontSize: '13px'}}>
            {showHorairesDetail ? '👁️ Masquer horaires' : '👁️‍🗨️ Afficher horaires'}
          </button>
          <button 
            className="btn" 
            onClick={handleOpenMailing}
            disabled={selectedMissions.length === 0}
            style={{opacity: selectedMissions.length === 0 ? 0.5 : 1, background: '#10b981', color: '#fff'}}>
            📧 Mailing équipe ({selectedMissions.length})
          </button>
          <button 
            className="btn" 
            onClick={() => setShowRecap(!showRecap)}
            disabled={selectedMissions.length === 0}
            style={{opacity: selectedMissions.length === 0 ? 0.5 : 1}}>
            {showRecap ? 'Masquer le récapitulatif' : <><BarChart3 size={16} /> Récapitulatif ({selectedMissions.length})</>}
          </button>
        </div>
      </div>

      {/* Liaison avec projet MOA */}
      <div className="card" style={{marginBottom: '20px', background: 'rgba(59, 130, 246, 0.05)'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'center'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}><Building2 size={16} /> Lier à un projet / Maître d'ouvrage</label>
            <select 
              value={projetLie?.id || ''}
              onChange={(e) => {
                const projet = projetsDisponibles.find(p => p.id === parseInt(e.target.value));
                setProjetLie(projet || null);
              }}
              style={{width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px'}}
            >
              <option value="">-- Aucun projet lié --</option>
              {projetsDisponibles.map(projet => (
                <option key={projet.id} value={projet.id}>
                  {projet.nom} - {projet.maitreOuvrage} ({formatMontant(projet.montantTravauxHT)} HT)
                </option>
              ))}
            </select>
          </div>
          {projetLie && (
            <div style={{padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', minWidth: '250px'}}>
              <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Montant travaux HT</div>
              <div style={{fontSize: '24px', fontWeight: 700, color: '#10b981'}}>
                {formatMontant(projetLie.montantTravauxHT)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtres par type de mission */}
      <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
        <button 
          className="btn" 
          onClick={() => setFilterType('tous')}
          style={{background: filterType === 'tous' ? 'var(--brand)' : 'var(--panel)'}}>
          Toutes ({missions.length})
        </button>
        <button 
          className="btn" 
          onClick={() => setFilterType('Base')}
          style={{background: filterType === 'Base' ? '#10b981' : 'var(--panel)', color: filterType === 'Base' ? '#fff' : 'var(--ink)'}}>
          Missions de base ({missions.filter(m => m.type === 'Base').length})
        </button>
        <button 
          className="btn" 
          onClick={() => setFilterType('Additionnelle')}
          style={{background: filterType === 'Additionnelle' ? '#fb923c' : 'var(--panel)', color: filterType === 'Additionnelle' ? '#fff' : 'var(--ink)'}}>
          Additionnelles ({missions.filter(m => m.type === 'Additionnelle').length})
        </button>
        <button 
          className="btn" 
          onClick={() => setFilterType('Complémentaire')}
          style={{background: filterType === 'Complémentaire' ? '#7c3aed' : 'var(--panel)', color: filterType === 'Complémentaire' ? '#fff' : 'var(--ink)'}}>
          Complémentaires ({missions.filter(m => m.type === 'Complémentaire').length})
        </button>
        <button 
          className="btn" 
          onClick={() => setFilterType('Optionnelle')}
          style={{background: filterType === 'Optionnelle' ? '#3b82f6' : 'var(--panel)', color: filterType === 'Optionnelle' ? '#fff' : 'var(--ink)'}}>
          Optionnelles ({missions.filter(m => m.type === 'Optionnelle').length})
        </button>
      </div>

      {/* Récapitulatif si des missions sélectionnées */}
      {showRecap && selectedMissions.length > 0 && (
        <div className="card" style={{marginBottom:'20px',background:'rgba(124, 58, 237, 0.05)',border:'1px solid rgba(124, 58, 237, 0.2)'}}>
          <h3 style={{marginBottom:'15px'}}><BarChart3 size={16} /> Récapitulatif de la sélection</h3>
          
          {/* Statistiques principales */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'15px',marginBottom:'20px'}}>
            <div style={{padding:'15px',background:'rgba(16, 185, 129, 0.1)',borderRadius:'8px'}}>
              <div style={{fontSize:'12px',opacity:0.7,marginBottom:'5px'}}>Missions sélectionnées</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:'#10b981'}}>{selectedMissions.length}</div>
            </div>
            <div style={{padding:'15px',background:'rgba(59, 130, 246, 0.1)',borderRadius:'8px'}}>
              <div style={{fontSize:'12px',opacity:0.7,marginBottom:'5px'}}>Total heures</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:'#3b82f6'}}>{totalHeures} h</div>
            </div>
            <div style={{padding:'15px',background:'rgba(124, 58, 237, 0.1)',borderRadius:'8px'}}>
              <div style={{fontSize:'12px',opacity:0.7,marginBottom:'5px'}}>Coût total HT</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:'#7c3aed'}}>{formatMontant(coutTotal)}</div>
            </div>
          </div>

          {/* Détails coûts horaires */}
          <div style={{padding:'15px',background:'rgba(251, 146, 60, 0.05)',borderRadius:'8px',marginBottom:'20px'}}>
            <h4 style={{fontSize:'14px',marginBottom:'12px',fontWeight:600}}>⏱️ Coûts horaires</h4>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'15px'}}>
              <div>
                <div style={{fontSize:'11px',opacity:0.7,marginBottom:'3px'}}>Moyen pondéré</div>
                <div style={{fontSize:'20px',fontWeight:'bold',color:'#fb923c'}}>{coutMoyenPondere.toFixed(2)} € /h</div>
              </div>
              <div>
                <div style={{fontSize:'11px',opacity:0.7,marginBottom:'3px'}}>Cible pondéré</div>
                <div style={{fontSize:'20px',fontWeight:'bold',color:'#10b981'}}>{coutCibleMoyen.toFixed(2)} € /h</div>
              </div>
              <div>
                <div style={{fontSize:'11px',opacity:0.7,marginBottom:'3px'}}>Écart moyen/cible</div>
                <div style={{fontSize:'20px',fontWeight:'bold',color: (coutMoyenPondere - coutCibleMoyen) > 0 ? '#ef4444' : '#10b981'}}>
                  {(coutMoyenPondere - coutCibleMoyen > 0 ? '+' : '')}{(coutMoyenPondere - coutCibleMoyen).toFixed(2)} €
                </div>
              </div>
            </div>
          </div>

          {/* Détail des missions sélectionnées */}
          <h4 style={{marginBottom:'10px',fontSize:'14px',opacity:0.8}}>Détail des missions</h4>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Type</th>
                  <th style={{textAlign:'center'}}>Heures</th>
                  <th style={{textAlign:'center'}}>Coût horaire</th>
                  <th style={{textAlign:'right'}}>Sous-total HT</th>
                </tr>
              </thead>
              <tbody>
                {selectedMissionsData.map(m => {
                  const badge = getTypeBadge(m.type);
                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{fontWeight:'500'}}>{m.nom}</div>
                        <div style={{fontSize:'11px',opacity:0.6,marginTop:'2px'}}>{m.description}</div>
                      </td>
                      <td>
                        <span style={{
                          padding:'4px 8px',
                          borderRadius:'4px',
                          fontSize:'11px',
                          fontWeight:'bold',
                          background: badge.bg,
                          color: badge.color
                        }}>
                          {badge.text}
                        </span>
                      </td>
                      <td style={{textAlign:'center',fontWeight:'bold'}}>{m.heuresEstimees} h</td>
                      <td style={{textAlign:'center',fontWeight:'bold'}}>{m.coutHoraireMoyen} € /h</td>
                      <td style={{textAlign:'right',fontWeight:'bold',color:'var(--brand)'}}>
                        {(m.heuresEstimees * m.coutHoraireMoyen).toLocaleString('fr-FR')} €
                      </td>
                    </tr>
                  );
                })}
              <tr style={{background:'rgba(124, 58, 237, 0.1)',fontWeight:'bold'}}>
                <td colSpan="2">TOTAL</td>
                <td style={{textAlign:'center'}}>{totalHeures} h</td>
                <td style={{textAlign:'center'}}>{coutMoyenPondere.toFixed(0)} € /h</td>
                <td style={{textAlign:'right',fontSize:'16px',color:'#7c3aed'}}>{coutTotal.toLocaleString('fr-FR')} €</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Liste des missions disponibles */}
      <div className="card">
        <h3 style={{marginBottom:'15px'}}>Sélectionner les missions du projet</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:'40px'}}>
                  <input 
                    type="checkbox" 
                    checked={selectedMissions.length === filteredMissions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMissions(filteredMissions.map(m => m.id));
                      } else {
                        setSelectedMissions([]);
                      }
                    }}
                    style={{cursor:'pointer',width:'18px',height:'18px'}}
                />
              </th>
              <th>Mission</th>
              <th>Type</th>
              {showHorairesDetail && (
                <>
                  <th style={{textAlign:'center'}}>Heures</th>
                  <th style={{textAlign:'center'}}>Coût moyen</th>
                  <th style={{textAlign:'center'}}>Coût cible</th>
                </>
              )}
              <th style={{textAlign:'right'}}>Coût total</th>
            </tr>
          </thead>
          <tbody>
            {filteredMissions.map(m => {
              const badge = getTypeBadge(m.type);
              const isSelected = selectedMissions.includes(m.id);
              return (
                <tr 
                  key={m.id} 
                  onClick={() => toggleMission(m.id)}
                  style={{
                    cursor:'pointer',
                    background: isSelected ? 'rgba(124, 58, 237, 0.1)' : 'transparent'
                  }}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleMission(m.id)}
                      style={{cursor:'pointer',width:'18px',height:'18px'}}
                    />
                  </td>
                  <td>
                    <div style={{fontWeight:'500'}}>{m.nom}</div>
                    <div style={{fontSize:'11px',opacity:0.6,marginTop:'2px'}}>{m.description}</div>
                  </td>
                  <td>
                    <span style={{
                      padding:'4px 8px',
                      borderRadius:'4px',
                      fontSize:'11px',
                      fontWeight:'bold',
                      background: badge.bg,
                      color: badge.color
                    }}>
                      {badge.text}
                    </span>
                  </td>
                  {showHorairesDetail && (
                    <>
                      <td style={{textAlign:'center',fontWeight:'500'}}>{m.heuresEstimees} h</td>
                      <td style={{textAlign:'center',fontWeight:'500'}}>{m.coutHoraireMoyen} € /h</td>
                      <td style={{textAlign:'center',fontWeight:'500',color:'#10b981'}}>{m.coutHoraireCible} € /h</td>
                    </>
                  )}
                  <td style={{textAlign:'right',fontWeight:'bold',color:'var(--brand)'}}>
                    {formatMontant(m.heuresEstimees * m.coutHoraireMoyen)}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

        {filteredMissions.length === 0 && (
          <div style={{textAlign:'center',padding:'40px',opacity:0.5}}>
            <div style={{fontSize:'48px',marginBottom:'10px'}}><ClipboardList size={48} /></div>
            <div>Aucune mission trouvée</div>
          </div>
        )}
      </div>

      {/* Modale Mailing Équipe */}
      {showMailingModal && (
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
        }} onClick={() => setShowMailingModal(false)}>
          <div className="card" style={{
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--panel)',
            padding: '25px'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{fontSize: '20px', marginBottom: '20px'}}>📧 Mailing équipe</h3>

            {/* Sélection des destinataires */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '10px', fontWeight: 500}}>Destinataires :</label>
              <div style={{display: 'grid', gap: '8px'}}>
                {equipeMembres.map(membre => (
                  <label key={membre.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: mailData.destinataires.includes(membre.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}>
                    <input 
                      type="checkbox"
                      checked={mailData.destinataires.includes(membre.id)}
                      onChange={() => handleToggleDestinataire(membre.id)}
                      style={{width: '18px', height: '18px', cursor: 'pointer'}}
                    />
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 500}}>{membre.nom}</div>
                      <div style={{fontSize: '12px', opacity: 0.7}}>
                        {membre.role} - {membre.email}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sujet */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Sujet :</label>
              <input 
                type="text"
                value={mailData.sujet}
                onChange={(e) => setMailData(prev => ({...prev, sujet: e.target.value}))}
                placeholder="Objet de l'email"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Message */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Message :</label>
              <textarea 
                value={mailData.message}
                onChange={(e) => setMailData(prev => ({...prev, message: e.target.value}))}
                placeholder="Contenu de l'email..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Inclure missions sélectionnées */}
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: mailData.inclueMissionsSelectionnees ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
              }}>
                <input 
                  type="checkbox"
                  checked={mailData.inclueMissionsSelectionnees}
                  onChange={(e) => setMailData(prev => ({...prev, inclueMissionsSelectionnees: e.target.checked}))}
                  style={{width: '18px', height: '18px', cursor: 'pointer'}}
                />
                <span style={{fontWeight: 500}}>Inclure les détails des missions sélectionnées</span>
              </label>
            </div>

            {/* Aperçu missions */}
            {mailData.inclueMissionsSelectionnees && selectedMissionsData.length > 0 && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{fontWeight: 500, marginBottom: '10px', fontSize: '13px'}}>
                  <ClipboardList size={16} /> Missions incluses ({selectedMissionsData.length}) :
                </div>
                {selectedMissionsData.map(mission => {
                  const badge = getTypeBadge(mission.type);
                  return (
                    <div key={mission.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '12px'
                    }}>
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          background: badge.bg,
                          color: badge.color,
                          marginRight: '8px'
                        }}>
                          {badge.text}
                        </span>
                        {mission.nom}
                      </div>
                      <div style={{fontWeight: 500}}>
                        {formatMontant(mission.heuresEstimees * mission.coutHoraireMoyen)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Boutons */}
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button 
                className="btn-secondary"
                onClick={() => setShowMailingModal(false)}>
                Annuler
              </button>
              <button 
                className="btn"
                onClick={handleSendMailing}
                disabled={mailData.destinataires.length === 0}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  opacity: mailData.destinataires.length === 0 ? 0.5 : 1
                }}>
                📧 Envoyer ({mailData.destinataires.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Liaisons Mission-Équipe-BET */}
      {showLiaisonsModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowLiaisonsModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '30px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
              <div>
                <h3 style={{marginBottom: '10px'}}>🔗 Liaisons Mission → Équipe → BET</h3>
                <p style={{fontSize: '13px', opacity: 0.7}}>
                  Découvrez les compétences requises et les ressources recommandées pour les missions sélectionnées
                </p>
              </div>
              <button
                onClick={() => setShowLiaisonsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
              >
                ✕
              </button>
            </div>

            {/* Affichage des liaisons pour chaque mission sélectionnée */}
            {selectedMissionsData.map((mission, idx) => {
              const missionRef = missionsCompetencesRef[mission.code];
              const matching = matchEquipeToMission(mission.code, equipeMembres, betDisponibles);
              
              if (!missionRef) return null;

              return (
                <div key={mission.id} className="card" style={{marginBottom: '20px', padding: '20px', background: 'rgba(124, 58, 237, 0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{fontSize: '16px', fontWeight: 'bold'}}>{mission.nom}</h4>
                    <span style={{
                      ...getTypeBadge(mission.type),
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: getTypeBadge(mission.type).bg,
                      color: getTypeBadge(mission.type).color
                    }}>
                      {getTypeBadge(mission.type).text}
                    </span>
                  </div>

                  {/* Informations de base */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '6px'}}>
                    <div>
                      <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '4px'}}>Phase principale</div>
                      <div style={{fontWeight: 'bold'}}>{missionRef.phasePrincipale}</div>
                    </div>
                    <div>
                      <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '4px'}}>Durée typique</div>
                      <div style={{fontWeight: 'bold'}}>{missionRef.dureeTypique}</div>
                    </div>
                  </div>

                  {/* Compétences requises */}
                  <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}><Target size={16} /> Compétences requises</div>
                    <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                      {missionRef.competencesRequises.map((comp, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            padding: '5px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fonctions liées */}
                  <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>👤 Fonctions liées</div>
                    <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                      {missionRef.fonctionsLiees.map((fonction, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            padding: '5px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {fonction}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Équipe suggérée */}
                  <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>
                      ✅ Membres d'équipe compatibles ({matching.equipe.length})
                    </div>
                    {matching.equipe.length > 0 ? (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        {matching.equipe.map(member => (
                          <div
                            key={member.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <div style={{fontWeight: 'bold', fontSize: '13px'}}>{member.nom}</div>
                              <div style={{fontSize: '11px', opacity: 0.7}}>{member.role} • {member.metier?.categorie}</div>
                            </div>
                            <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '50%'}}>
                              {member.competences?.slice(0, 3).map((comp, i) => (
                                <span
                                  key={i}
                                  style={{
                                    background: 'rgba(16, 185, 129, 0.3)',
                                    color: '#059669',
                                    padding: '3px 8px',
                                    borderRadius: '8px',
                                    fontSize: '10px'
                                  }}
                                >
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{padding: '10px', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '6px', fontSize: '12px'}}>
                        ⚠️ Aucun membre d'équipe avec les compétences requises
                      </div>
                    )}
                  </div>

                  {/* BET suggérés */}
                  {missionRef.betRequis.length > 0 && (
                    <div style={{marginBottom: '15px'}}>
                      <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>
                        <Building2 size={16} /> BET requis ({matching.bet.length}/{missionRef.betRequis.length})
                      </div>
                      <div style={{marginBottom: '8px'}}>
                        <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '6px'}}>Types requis:</div>
                        <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                          {missionRef.betRequis.map((betType, i) => (
                            <span
                              key={i}
                              style={{
                                background: 'rgba(124, 58, 237, 0.2)',
                                color: '#7c3aed',
                                padding: '4px 8px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              {betType}
                            </span>
                          ))}
                        </div>
                      </div>
                      {matching.bet.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          {matching.bet.map(bet => (
                            <div
                              key={bet.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                background: 'rgba(124, 58, 237, 0.1)',
                                border: '1px solid rgba(124, 58, 237, 0.3)',
                                borderRadius: '6px'
                              }}
                            >
                              <div>
                                <div style={{fontWeight: 'bold', fontSize: '13px'}}>{bet.nom}</div>
                                <div style={{fontSize: '11px', opacity: 0.7}}>{bet.type}</div>
                              </div>
                              <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '50%'}}>
                                {bet.competences?.slice(0, 2).map((comp, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      background: 'rgba(124, 58, 237, 0.3)',
                                      color: '#6d28d9',
                                      padding: '3px 8px',
                                      borderRadius: '8px',
                                      fontSize: '10px'
                                    }}
                                  >
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '12px'}}>
                          ❌ Aucun BET correspondant aux types requis
                        </div>
                      )}
                    </div>
                  )}

                  {/* Compétences manquantes */}
                  {matching.competencesManquantes && matching.competencesManquantes.length > 0 && (
                    <div style={{padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px'}}>
                      <div style={{fontSize: '13px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px'}}>
                        ⚠️ Compétences manquantes ({matching.competencesManquantes.length})
                      </div>
                      <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                        {matching.competencesManquantes.map((comp, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#dc2626',
                              padding: '5px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
              <button
                className="btn"
                onClick={() => setShowLiaisonsModal(false)}
                style={{padding: '10px 20px'}}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      ) : (
        <TeamTemplates
          onApplyTemplate={(template) => {
            // Logique pour appliquer le template à un projet
            console.log('Appliquer template:', template);
            if (window.showToast) {
              window.showToast(`Template "${template.nom}" appliqué avec succès`, 'success');
            }
          }}
        />
      )}
    </div>
  );
}
