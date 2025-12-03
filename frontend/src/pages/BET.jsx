import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { defaultBETs } from '../data/defaultData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePlan } from '../context/PlanContext';
import { LimitReached } from '../components/PlanRestriction';
import { BarChart3, Target, Building2, ClipboardList, Trophy, Edit } from 'lucide-react';
import { formatMontant } from '../utils/formatNumber';

export default function BET() {
  const { canAdd, getPlanInfo } = usePlan();
  const planInfo = getPlanInfo();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState('liste'); // 'liste', 'etudes', 'competences'
  const [selectedBET, setSelectedBET] = useState(null);
  const [editingBET, setEditingBET] = useState(null);
  const [editingEtude, setEditingEtude] = useState(null);
  const [filterMetier, setFilterMetier] = useState('tous');
  const [showTableauRecap, setShowTableauRecap] = useState(false);
  const [equipesReference] = useState([
    { id: 1, nom: 'Équipe Structure Complète', membres: ['BET Structure', 'BET VRD'], metiers: ['Structure', 'VRD'] },
    { id: 2, nom: 'Équipe Thermique & Fluides', membres: ['BET Thermique', 'BET Fluides'], metiers: ['Thermique & Fluides'] },
    { id: 3, nom: 'Équipe Acoustique & Environnement', membres: ['BET Acoustique', 'BET Environnement'], metiers: ['Acoustique', 'Environnement'] },
    { id: 4, nom: 'Équipe Sécurité & Accessibilité', membres: ['BET Sécurité', 'BET Accessibilité'], metiers: ['Sécurité', 'Accessibilité'] },
    { id: 5, nom: 'Équipe Complète Projet', membres: ['BET Structure', 'BET Thermique', 'BET Acoustique', 'BET VRD'], metiers: ['Structure', 'Thermique & Fluides', 'Acoustique', 'VRD'] },
    { id: 6, nom: 'Équipe Rénovation', membres: ['BET Structure', 'BET Thermique', 'BET Diagnostic'], metiers: ['Structure', 'Thermique & Fluides', 'Diagnostic'] },
    { id: 7, nom: 'Équipe Neuf', membres: ['BET Structure', 'BET Thermique', 'BET VRD'], metiers: ['Structure', 'Thermique & Fluides', 'VRD'] },
    { id: 8, nom: 'Équipe Énergétique', membres: ['BET Thermique', 'BET Énergies Renouvelables'], metiers: ['Thermique & Fluides', 'Énergies Renouvelables'] },
    { id: 9, nom: 'Équipe Technique Complète', membres: ['BET Structure', 'BET Thermique', 'BET Acoustique', 'BET VRD', 'BET Sécurité'], metiers: ['Structure', 'Thermique & Fluides', 'Acoustique', 'VRD', 'Sécurité'] },
    { id: 10, nom: 'Équipe Minimaliste', membres: ['BET Structure'], metiers: ['Structure'] }
  ]);

  // Liste des BET partenaires
  const [bets, setBets] = useState([
    {
      id: 1,
      nom: 'Bureau Études BET MARTIN',
      type: 'Structure',
      contact: {
        responsable: 'M. Pierre Martin',
        telephone: '01 23 45 67 89',
        portable: '06 12 34 56 78',
        email: 'contact@bet-martin.fr',
        adresse: '15 rue des Ingénieurs, 75015 Paris'
      },
      competences: ['Calcul béton armé', 'Calcul métal', 'Diagnostic structure', 'Renforcement'],
      missionsCompatibles: ['APD', 'PRO', 'VISA', 'DIAG'],
      certifications: ['Qualibat', 'ISO 9001'],
      tarifHoraire: 75,
      logo: null,
      equipe: [] // Équipe interne du BET
    },
    {
      id: 2,
      nom: 'Ingénierie Thermique LEROY',
      type: 'Thermique & Fluides',
      contact: {
        responsable: 'Mme Sophie Leroy',
        telephone: '01 34 56 78 90',
        portable: '06 23 45 67 89',
        email: 'contact@leroy-thermique.fr',
        adresse: '8 avenue de la Thermique, 69003 Lyon'
      },
      competences: ['Étude thermique RT2020', 'CVC', 'Plomberie', 'Électricité', 'BBC'],
      missionsCompatibles: ['APD', 'PRO', 'DIAG'],
      certifications: ['Qualibat', 'RGE'],
      tarifHoraire: 70,
      logo: null,
      equipe: []
    },
    {
      id: 3,
      nom: 'BET Acoustique SONIC',
      type: 'Acoustique',
      contact: {
        responsable: 'M. Jean Petit',
        telephone: '01 45 67 89 01',
        portable: '06 34 56 78 90',
        email: 'contact@sonic-acoustique.fr',
        adresse: '22 boulevard du Son, 31000 Toulouse'
      },
      competences: ['Isolation acoustique', 'Mesures in situ', 'Modélisation', 'Correction acoustique'],
      missionsCompatibles: ['APD', 'PRO'],
      certifications: ['Qualibat'],
      tarifHoraire: 80,
      logo: null,
      equipe: []
    }
  ]);

  // Études en cours
  const [etudes, setEtudes] = useState([
    {
      id: 1,
      betId: 1,
      betNom: 'Bureau Études BET MARTIN',
      projet: 'Résidence Les Oliviers',
      type: 'Structure béton armé',
      statut: 'En cours',
      dateDebut: '2024-10-01',
      dateLivraison: '2024-12-15',
      montant: 35000,
      avancement: 65,
      livrables: ['Note de calcul', 'Plans ferraillage', 'Plans coffrage']
    },
    {
      id: 2,
      betId: 2,
      betNom: 'Ingénierie Thermique LEROY',
      projet: 'Centre Commercial Rivoli',
      type: 'Étude thermique RT2020',
      statut: 'En cours',
      dateDebut: '2024-09-15',
      dateLivraison: '2024-11-30',
      montant: 28000,
      avancement: 80,
      livrables: ['Étude thermique', 'Attestation RT2020', 'Notice descriptive']
    },
    {
      id: 3,
      betId: 3,
      betNom: 'BET Acoustique SONIC',
      projet: 'École Primaire',
      type: 'Isolation acoustique',
      statut: 'Terminé',
      dateDebut: '2024-08-01',
      dateLivraison: '2024-10-15',
      montant: 15000,
      avancement: 100,
      livrables: ['Rapport acoustique', 'Préconisations', 'Mesures post-travaux']
    }
  ]);

  // Compétences disponibles
  const [competencesDisponibles] = useState({
    'Structure': [
      'Calcul béton armé',
      'Calcul métal',
      'Calcul bois',
      'Diagnostic structure',
      'Renforcement',
      'Pathologie',
      'Fondations spéciales',
      'Parasismique'
    ],
    'Thermique & Fluides': [
      'Étude thermique RT2020',
      'CVC',
      'Plomberie',
      'Électricité',
      'BBC',
      'PassivHaus',
      'Simulation dynamique',
      'Énergies renouvelables'
    ],
    'Acoustique': [
      'Isolation acoustique',
      'Mesures in situ',
      'Modélisation acoustique',
      'Correction acoustique',
      'Bruit environnemental',
      'Vibrations'
    ],
    'VRD': [
      'Voirie',
      'Réseaux',
      'Assainissement',
      'Études hydrauliques',
      'Terrassement'
    ],
    'Sécurité': [
      'Coordination SPS',
      'CSSI',
      'Mission OPC',
      'Sécurité incendie',
      'Accessibilité PMR'
    ]
  });

  // Gérer le filtre initial depuis l'URL (navigation depuis Tenders)
  useEffect(() => {
    const betId = searchParams.get('betId');
    if (betId) {
      // Trouver le BET correspondant
      const bet = bets.find(b => b.id === parseInt(betId));
      if (bet) {
        // Sélectionner automatiquement le BET et appliquer le filtre sur son type
        setSelectedBET(bet);
        setFilterMetier(bet.type);
        if (window.showToast) {
          window.showToast(`✅ Filtrage appliqué sur: ${bet.nom}`, 'success');
        }
      }
    }
  }, [searchParams, bets]);

  const handleEditBET = (bet) => {
    setEditingBET({...bet});
  };

  const handleSaveBET = () => {
    if (!editingBET.nom.trim()) {
      alert('⚠️ Le nom du BET est obligatoire');
      return;
    }
    if (editingBET.id) {
      setBets(bets.map(b => b.id === editingBET.id ? editingBET : b));
      alert('✅ BET modifié avec succès');
    } else {
      setBets([...bets, {...editingBET, id: Date.now()}]);
      alert('✅ BET ajouté avec succès');
    }
    setEditingBET(null);
  };

  const handleDeleteBET = (bet) => {
    if (confirm(`Supprimer le BET "${bet.nom}" ?`)) {
      setBets(bets.filter(b => b.id !== bet.id));
      alert('✅ BET supprimé');
    }
  };

  const handleNewBET = () => {
    setEditingBET({
      nom: '',
      type: 'Structure',
      contact: {
        responsable: '',
        telephone: '',
        portable: '',
        email: '',
        adresse: ''
      },
      competences: [],
      certifications: [],
      tarifHoraire: 0,
      logo: null
    });
  };

  // Handler pour upload logo BET
  const handleUploadLogoBET = (betId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('⚠️ Le fichier est trop volumineux (max 5 MB)');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setBets(bets.map(b => 
            b.id === betId ? { ...b, logo: reader.result } : b
          ));
          if (window.showToast) {
            window.showToast('✅ Logo BET téléchargé', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handler pour import Excel contacts
  const handleImportExcelContacts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // Simulation parsing Excel/CSV
          // En production, utiliser une librairie comme xlsx ou papaparse
          if (window.showToast) {
            window.showToast(`Import de "${file.name}" en cours...`, 'info');
          }
          
          // Simulation : ajouter quelques contacts depuis Excel
          setTimeout(() => {
            const nouveauxBets = [
              {
                id: Date.now(),
                nom: 'BET Importé 1',
                type: 'Structure',
                contact: {
                  responsable: 'Contact Importé',
                  telephone: '01 00 00 00 00',
                  email: 'contact@importe.fr',
                  adresse: 'Adresse importée'
                },
                competences: [],
                certifications: [],
                tarifHoraire: 0,
                logo: null
              }
            ];
            setBets([...bets, ...nouveauxBets]);
            if (window.showToast) {
              window.showToast('✅ Import Excel réussi', 'success');
            }
          }, 1500);
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const handleEditEtude = (etude) => {
    setEditingEtude({...etude});
  };

  const handleSaveEtude = () => {
    if (!editingEtude.projet.trim()) {
      alert('⚠️ Le nom du projet est obligatoire');
      return;
    }
    if (editingEtude.id) {
      setEtudes(etudes.map(e => e.id === editingEtude.id ? editingEtude : e));
      alert('✅ Étude modifiée avec succès');
    } else {
      setEtudes([...etudes, {...editingEtude, id: Date.now()}]);
      alert('✅ Étude ajoutée avec succès');
    }
    setEditingEtude(null);
  };

  const handleDeleteEtude = (etude) => {
    if (confirm(`Supprimer l'étude "${etude.projet}" ?`)) {
      setEtudes(etudes.filter(e => e.id !== etude.id));
      alert('✅ Étude supprimée');
    }
  };

  const handleNewEtude = () => {
    setEditingEtude({
      betId: bets[0]?.id || 0,
      betNom: bets[0]?.nom || '',
      projet: '',
      type: '',
      statut: 'En cours',
      dateDebut: new Date().toISOString().split('T')[0],
      dateLivraison: '',
      montant: 0,
      avancement: 0,
      livrables: []
    });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours': return '#f97316';
      case 'Terminé': return '#10b981';
      case 'En attente': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getTotalMontantEtudes = () => {
    return etudes.reduce((sum, e) => sum + e.montant, 0);
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
        <div>
          <h2 style={{fontSize: '24px', marginBottom: '5px'}}>Bureaux d'Études Techniques (BET)</h2>
          {viewMode === 'liste' && planInfo.maxBET !== null && (
            <div style={{fontSize: '13px', opacity: 0.7}}>
              {bets.length} / {planInfo.maxBET} partenaires BET utilisés
              {bets.length >= planInfo.maxBET && (
                <span style={{marginLeft: '8px', color: '#f59e0b', fontWeight: 600}}>⚠️ Limite atteinte</span>
              )}
            </div>
          )}
        </div>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button 
            className="btn" 
            onClick={() => setViewMode('liste')}
            style={{
              background: viewMode === 'liste' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'liste' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}>
            Liste BET
          </button>
          <button 
            className="btn" 
            onClick={() => setViewMode('etudes')}
            style={{
              background: viewMode === 'etudes' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'etudes' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}>
            Études en cours
          </button>
          <button 
            className="btn" 
            onClick={() => setViewMode('competences')}
            style={{
              background: viewMode === 'competences' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'competences' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}>
            <Target size={16} /> Compétences
          </button>
          {viewMode === 'liste' && (
            <button 
              className="btn-secondary" 
              onClick={handleImportExcelContacts}
              style={{cursor: 'pointer'}}
              title="Importer les contacts via Excel"
            >
              Importer Excel
            </button>
          )}
        </div>
      </div>

      {/* Vue Liste BET */}
      {viewMode === 'liste' && (
        <>
          {/* KPIs */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
            <div style={{padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.1)'}}>
              <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '4px'}}>BET Partenaires</div>
              <div style={{fontSize: '28px', fontWeight: 'bold', color: '#3b82f6'}}>{bets.length}</div>
            </div>
            <div style={{padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.1)'}}>
              <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '4px'}}>Études actives</div>
              <div style={{fontSize: '28px', fontWeight: 'bold', color: '#10b981'}}>{etudes.filter(e => e.statut === 'En cours').length}</div>
            </div>
            <div style={{padding: '16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.1)'}}>
              <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '4px'}}>Total engagé</div>
              <div style={{fontSize: '28px', fontWeight: 'bold', color: '#a855f7'}}>{getTotalMontantEtudes().toLocaleString('fr-FR')} €</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="card" style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 500}}>Filtrer par métier/spécialité</label>
                <select
                  value={filterMetier}
                  onChange={(e) => setFilterMetier(e.target.value)}
                  style={{padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px'}}
                >
                  <option value="tous">Tous les métiers</option>
                  <option value="Structure">Structure</option>
                  <option value="Thermique & Fluides">Thermique & Fluides</option>
                  <option value="Acoustique">Acoustique</option>
                  <option value="VRD">VRD</option>
                  <option value="Sécurité">Sécurité</option>
                </select>
              </div>
              <div style={{flex: 1}}>
                <button
                  className="btn-secondary"
                  onClick={() => setShowTableauRecap(!showTableauRecap)}
                  style={{cursor: 'pointer', marginTop: '20px'}}
                >
                  {showTableauRecap ? 'Masquer' : 'Afficher'} tableau récapitulatif
                </button>
              </div>
            </div>
          </div>

          {/* Tableau récapitulatif */}
          {showTableauRecap && (
            <div className="card" style={{marginBottom: '20px'}}>
              <h3 style={{marginBottom: '15px'}}>Tableau récapitulatif par métier/spécialité</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Métier/Spécialité</th>
                      <th>Nombre de BET</th>
                      <th>BET exerçant ce métier</th>
                      <th>Taux horaire moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Structure', 'Thermique & Fluides', 'Acoustique', 'VRD', 'Sécurité'].map(metier => {
                      const betsMetier = bets.filter(b => b.type === metier);
                      const tauxMoyen = betsMetier.length > 0
                        ? Math.round(betsMetier.reduce((sum, b) => sum + (b.tarifHoraire || 0), 0) / betsMetier.length)
                        : 0;
                      return (
                        <tr key={metier}>
                          <td style={{fontWeight: 'bold'}}>{metier}</td>
                          <td>{betsMetier.length}</td>
                          <td>
                            {betsMetier.length > 0 ? (
                              <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                                {betsMetier.map(bet => (
                                  <span key={bet.id} className="badge badge-info" style={{cursor: 'pointer'}} onClick={() => setSelectedBET(bet)}>
                                    {bet.nom}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{opacity: 0.5}}>Aucun</span>
                            )}
                          </td>
                          <td>{tauxMoyen} €/h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Équipes de référence */}
          <div className="card" style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px'}}>Équipes de référence</h3>
            <p style={{fontSize: '13px', opacity: 0.7, marginBottom: '15px'}}>
              Définir une dizaine d'équipes de référence pour simplifier la saisie
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
              {equipesReference.map(equipe => (
                <div key={equipe.id} className="card" style={{padding: '15px', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)'}}>
                  <h4 style={{fontSize: '16px', marginBottom: '10px'}}>{equipe.nom}</h4>
                  <div style={{fontSize: '12px', marginBottom: '8px'}}>
                    <strong>Membres:</strong> {equipe.membres.join(', ')}
                  </div>
                  <div style={{fontSize: '12px'}}>
                    <strong>Métiers:</strong> {equipe.metiers.join(', ')}
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      // Créer une équipe à partir de cette référence
                      alert(`Équipe "${equipe.nom}" sélectionnée. Cette fonctionnalité permettra de créer rapidement une équipe à partir de cette référence.`);
                    }}
                    style={{marginTop: '10px', fontSize: '12px', padding: '4px 8px', cursor: 'pointer'}}
                  >
                    Utiliser cette équipe
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Édition BET */}
          {editingBET && (
            <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
              <h3 style={{marginBottom: '20px', fontSize: 'clamp(16px, 3vw, 18px)'}}>{editingBET.id ? '✏️ Modifier le BET' : '➕ Nouveau BET'}</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Nom du BET *</label>
                  <input 
                    type="text" 
                    value={editingBET.nom}
                    onChange={(e) => setEditingBET({...editingBET, nom: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Spécialité</label>
                  <select 
                    value={editingBET.type}
                    onChange={(e) => setEditingBET({...editingBET, type: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  >
                    <option value="Structure">Structure</option>
                    <option value="Thermique & Fluides">Thermique & Fluides</option>
                    <option value="Acoustique">Acoustique</option>
                    <option value="VRD">VRD</option>
                    <option value="Sécurité">Sécurité</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Responsable</label>
                  <input 
                    type="text" 
                    value={editingBET.contact.responsable}
                    onChange={(e) => setEditingBET({...editingBET, contact: {...editingBET.contact, responsable: e.target.value}})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone fixe</label>
                  <input 
                    type="text" 
                    value={editingBET.contact.telephone || ''}
                    onChange={(e) => setEditingBET({...editingBET, contact: {...editingBET.contact, telephone: e.target.value}})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="Ex: 01 23 45 67 89"
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone portable</label>
                  <input 
                    type="text" 
                    value={editingBET.contact.portable || ''}
                    onChange={(e) => setEditingBET({...editingBET, contact: {...editingBET.contact, portable: e.target.value}})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="Ex: 06 12 34 56 78"
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Email</label>
                  <input 
                    type="email" 
                    value={editingBET.contact.email}
                    onChange={(e) => setEditingBET({...editingBET, contact: {...editingBET.contact, email: e.target.value}})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Tarif horaire (€)</label>
                  <input 
                    type="number" 
                    value={editingBET.tarifHoraire}
                    onChange={(e) => setEditingBET({...editingBET, tarifHoraire: parseInt(e.target.value) || 0})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Adresse</label>
                  <input 
                    type="text" 
                    value={editingBET.contact.adresse}
                    onChange={(e) => setEditingBET({...editingBET, contact: {...editingBET.contact, adresse: e.target.value}})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Logo BET</label>
                  <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px'}}>
                    {editingBET.logo ? (
                      <div style={{position: 'relative'}}>
                        <img 
                          src={editingBET.logo} 
                          alt="Logo BET" 
                          style={{
                            width: '120px', 
                            height: '120px', 
                            objectFit: 'contain', 
                            border: '1px solid var(--border)', 
                            borderRadius: '8px',
                            padding: '10px',
                            background: 'white'
                          }}
                        />
                        <button
                          onClick={() => setEditingBET({...editingBET, logo: null})}
                          className="btn-icon"
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                          }}
                          title="Supprimer le logo"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        width: '120px', 
                        height: '120px', 
                        border: '2px dashed var(--border)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        opacity: 0.5
                      }}>
                        <Building2 size={32} />
                      </div>
                    )}
                    <button 
                      className="btn-secondary" 
                      onClick={() => {
                        const betId = editingBET.id || 'new';
                        if (betId === 'new') {
                          // Pour un nouveau BET, on gère directement dans editingBET
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('⚠️ Le fichier est trop volumineux (max 5 MB)');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditingBET({...editingBET, logo: reader.result});
                                if (window.showToast) {
                                  window.showToast('✅ Logo BET téléchargé', 'success');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        } else {
                          handleUploadLogoBET(betId);
                        }
                      }}
                      style={{cursor: 'pointer'}}
                    >
                      {editingBET.logo ? '🔄 Changer le logo' : '📤 Ajouter un logo'}
                    </button>
                  </div>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Compétences (séparées par des virgules)</label>
                  <textarea 
                    value={editingBET.competences.join(', ')}
                    onChange={(e) => setEditingBET({...editingBET, competences: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
                    rows="3"
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Certifications (séparées par des virgules)</label>
                  <input 
                    type="text" 
                    value={editingBET.certifications.join(', ')}
                    onChange={(e) => setEditingBET({...editingBET, certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>

                {/* Section Équipe */}
                <div style={{gridColumn: '1 / -1', marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{margin: 0, fontSize: '16px'}}>Équipe interne</h4>
                    <button 
                      className="btn-secondary" 
                      onClick={handleAddMembreEquipe}
                      style={{fontSize: '13px', padding: '6px 12px', cursor: 'pointer'}}
                    >
                      ➕ Ajouter membre
                    </button>
                  </div>
                  
                  {(editingBET.equipe || []).length > 0 ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                      {editingBET.equipe.map((membre) => (
                        <div 
                          key={membre.id}
                          style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{flex: 1}}>
                            <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '5px'}}>{membre.nom}</div>
                            <div style={{fontSize: '12px', opacity: 0.7}}>{membre.fonction}</div>
                            {membre.email && (
                              <div style={{fontSize: '11px', opacity: 0.6}}>✉️ {membre.email}</div>
                            )}
                            {membre.telephone && (
                              <div style={{fontSize: '11px', opacity: 0.6}}>📞 {membre.telephone}</div>
                            )}
                          </div>
                          <button 
                            className="btn-icon" 
                            onClick={() => handleDeleteMembreEquipe(membre.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer'}}
                            title="Supprimer ce membre"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '20px', opacity: 0.6}}>
                      <p>Aucun membre d'équipe défini. Ajoutez des membres pour constituer l'équipe interne du BET.</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn-primary" onClick={handleSaveBET} style={{cursor: 'pointer'}}>💾 Enregistrer</button>
                <button className="btn-secondary" onClick={() => setEditingBET(null)} style={{cursor: 'pointer'}}>❌ Annuler</button>
              </div>
            </div>
          )}

          <div className="card" style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3>Liste des BET partenaires</h3>
              <button className="btn" onClick={handleNewBET} style={{cursor: 'pointer'}}>+ Nouveau BET</button>
            </div>
            
            <div style={{display: 'grid', gap: '15px'}}>
              {bets.filter(bet => filterMetier === 'tous' || bet.type === filterMetier).map(bet => (
                <div 
                  key={bet.id} 
                  className="card" 
                  onClick={() => setSelectedBET(bet)}
                  style={{
                    padding: '0',
                    background: selectedBET?.id === bet.id ? 'rgba(124, 58, 237, 0.1)' : 'var(--panel)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}>
                  {/* Bouton Modifier en tête de carte */}
                  <div style={{
                    padding: '15px 20px 10px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <button 
                      className="btn-icon" 
                      onClick={(e) => {e.stopPropagation(); handleEditBET(bet);}} 
                      title="Modifier"
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}>
                      ✏️ Modifier
                    </button>
                  </div>
                  
                  <div style={{padding: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                          <h4 style={{fontSize: '18px', margin: 0}}>{bet.nom}</h4>
                          <span className="badge badge-info">{bet.type}</span>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', fontSize: '14px', opacity: 0.8, marginBottom: '15px'}}>
                          <div>👤</div><div>{bet.contact.responsable}</div>
                          {bet.contact.telephone && (
                            <>
                              <div>📞</div><div>{bet.contact.telephone}</div>
                            </>
                          )}
                          {bet.contact.portable && (
                            <>
                              <div>📱</div><div>{bet.contact.portable}</div>
                            </>
                          )}
                          <div>✉️</div><div>{bet.contact.email}</div>
                          <div>€</div><div>{bet.tarifHoraire} €/h</div>
                        </div>
                        {/* Taux horaire moyen */}
                        {bet.metiers && bet.metiers.length > 0 && (
                          <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px', fontSize: '12px'}}>
                            <strong>Taux horaire moyen:</strong> {bet.tarifHoraire} €/h
                          </div>
                        )}
                        <div style={{marginBottom: '10px'}}>
                          <strong style={{fontSize: '12px'}}>Compétences:</strong>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                            {bet.competences.map((comp, idx) => (
                              <span key={idx} className="badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                        {bet.certifications.length > 0 && (
                          <div>
                            <strong style={{fontSize: '12px'}}>Certifications:</strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                              {bet.certifications.map((cert, idx) => (
                                <span key={idx} className="badge badge-success">{cert}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button 
                          className="btn-icon" 
                          onClick={(e) => {e.stopPropagation(); handleDeleteBET(bet);}} 
                          title="Supprimer"
                          style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer'}}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Détails BET */}
          {selectedBET && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }} onClick={() => setSelectedBET(null)}>
              <div className="card" style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--panel)',
                padding: '25px'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h2 style={{margin: 0, fontSize: '24px'}}>{selectedBET.nom}</h2>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleEditBET(selectedBET)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={16} /> Modifier
                    </button>
                    <button className="btn-secondary" onClick={() => setSelectedBET(null)} style={{cursor: 'pointer'}}>✕ Fermer</button>
                  </div>
                </div>

                <div style={{display: 'grid', gap: '20px'}}>
                  {/* Informations générales */}
                  <div style={{padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px'}}>
                    <h3 style={{marginBottom: '15px', fontSize: '18px'}}>Informations</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', fontSize: '14px'}}>
                      <div><strong>Type:</strong></div>
                      <div><span className="badge badge-info">{selectedBET.type}</span></div>
                      <div><strong>Responsable:</strong></div>
                      <div>{selectedBET.contact.responsable}</div>
                      <div><strong>Téléphone:</strong></div>
                      <div>{selectedBET.contact.telephone}</div>
                      <div><strong>Email:</strong></div>
                      <div><a href={`mailto:${selectedBET.contact.email}`} style={{color: 'var(--brand)'}}>{selectedBET.contact.email}</a></div>
                      <div><strong>Adresse:</strong></div>
                      <div>{selectedBET.contact.adresse}</div>
                      <div><strong>Tarif horaire:</strong></div>
                      <div>{selectedBET.tarifHoraire} €/h</div>
                    </div>
                  </div>

                  {/* Équipe interne */}
                  <div style={{padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px'}}>
                    <h3 style={{marginBottom: '15px', fontSize: '18px'}}>Équipe interne</h3>
                    {(selectedBET.equipe || []).length > 0 ? (
                      <div style={{display: 'grid', gap: '10px'}}>
                        {selectedBET.equipe.map((membre) => (
                          <div 
                            key={membre.id}
                            style={{
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '5px'}}>{membre.nom}</div>
                            <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>{membre.fonction}</div>
                            {membre.email && (
                              <div style={{fontSize: '11px', opacity: 0.6}}>
                                ✉️ <a href={`mailto:${membre.email}`} style={{color: 'var(--brand)'}}>{membre.email}</a>
                              </div>
                            )}
                            {membre.telephone && (
                              <div style={{fontSize: '11px', opacity: 0.6}}>📞 {membre.telephone}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', padding: '20px', opacity: 0.6}}>
                        <p>Aucun membre d'équipe défini</p>
                      </div>
                    )}
                  </div>

                  {/* Métiers avec niveaux */}
                  {selectedBET.metiers && selectedBET.metiers.length > 0 && (
                    <div style={{padding: '15px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px'}}>
                      <h3 style={{marginBottom: '15px', fontSize: '18px'}}><Target size={18} /> Métiers & Compétences (3 niveaux)</h3>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        {selectedBET.metiers.map((metier) => {
                          const niveaux = ['Débutant', 'Intermédiaire', 'Expert'];
                          const couleursNiveaux = {
                            'Débutant': { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '#ef4444' },
                            'Intermédiaire': { bg: 'rgba(251, 146, 60, 0.2)', color: '#fb923c', border: '#fb923c' },
                            'Expert': { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '#10b981' }
                          };
                          const niveauIndex = niveaux.indexOf(metier.niveau);
                          const couleur = couleursNiveaux[metier.niveau] || couleursNiveaux['Débutant'];
                          
                          return (
                            <div 
                              key={metier.id}
                              style={{
                                padding: '15px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                border: `2px solid ${couleur.border}`,
                                marginLeft: `${niveauIndex * 20}px`, // Affichage décalé
                                transition: 'all 0.3s'
                              }}
                            >
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                <div style={{fontWeight: 'bold', fontSize: '14px'}}>{metier.nom}</div>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '6px',
                                  background: couleur.bg,
                                  color: couleur.color,
                                  fontWeight: 'bold',
                                  fontSize: '12px'
                                }}>
                                  {metier.niveau}
                                </span>
                              </div>
                              {/* Barre de progression visuelle */}
                              <div style={{display: 'flex', gap: '4px'}}>
                                {niveaux.map((niv, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      flex: 1,
                                      height: '8px',
                                      background: idx <= niveauIndex ? couleur.border : 'rgba(255, 255, 255, 0.1)',
                                      borderRadius: '4px',
                                      transition: 'all 0.3s'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Taux horaire moyen */}
                      <div style={{marginTop: '15px', padding: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '8px', textAlign: 'center'}}>
                        <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '5px'}}>Taux horaire moyen (protection juridique)</div>
                        <div style={{fontSize: '24px', fontWeight: 'bold', color: '#a855f7'}}>{selectedBET.tarifHoraire} €/h</div>
                      </div>
                    </div>
                  )}

                  {/* Compétences (ancien système) */}
                  {selectedBET.competences && selectedBET.competences.length > 0 && (
                    <div style={{padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px'}}>
                      <h3 style={{marginBottom: '15px', fontSize: '18px'}}><ClipboardList size={18} /> Compétences générales</h3>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {selectedBET.competences.map((comp, idx) => (
                          <span key={idx} className="badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {selectedBET.certifications.length > 0 && (
                    <div style={{padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px'}}>
                      <h3 style={{marginBottom: '15px', fontSize: '18px'}}><Trophy size={18} /> Certifications</h3>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {selectedBET.certifications.map((cert, idx) => (
                          <span key={idx} className="badge badge-success">{cert}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                  <button className="btn-primary" onClick={() => { setEditingBET(selectedBET); setSelectedBET(null); }} style={{cursor: 'pointer'}}>
                    ✏️ Modifier
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedBET(null)} style={{cursor: 'pointer'}}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Vue Études en cours */}
      {viewMode === 'etudes' && (
        <>
          {/* Modal Édition Étude */}
          {editingEtude && (
            <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
              <h3 style={{marginBottom: '20px', fontSize: 'clamp(16px, 3vw, 18px)'}}>{editingEtude.id ? '✏️ Modifier l\'étude' : '➕ Nouvelle étude'}</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>BET *</label>
                  <select 
                    value={editingEtude.betId}
                    onChange={(e) => {
                      const betId = parseInt(e.target.value);
                      const bet = bets.find(b => b.id === betId);
                      setEditingEtude({...editingEtude, betId, betNom: bet?.nom || ''});
                    }}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box'}}
                  >
                    {bets.map(bet => (
                      <option key={bet.id} value={bet.id}>{bet.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Projet *</label>
                  <input 
                    type="text" 
                    value={editingEtude.projet}
                    onChange={(e) => setEditingEtude({...editingEtude, projet: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Type d'étude</label>
                  <input 
                    type="text" 
                    value={editingEtude.type}
                    onChange={(e) => setEditingEtude({...editingEtude, type: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Statut</label>
                  <select 
                    value={editingEtude.statut}
                    onChange={(e) => setEditingEtude({...editingEtude, statut: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Date début</label>
                  <input 
                    type="date" 
                    value={editingEtude.dateDebut}
                    onChange={(e) => setEditingEtude({...editingEtude, dateDebut: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Date livraison</label>
                  <input 
                    type="date" 
                    value={editingEtude.dateLivraison}
                    onChange={(e) => setEditingEtude({...editingEtude, dateLivraison: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Montant (€)</label>
                  <input 
                    type="number" 
                    value={editingEtude.montant}
                    onChange={(e) => setEditingEtude({...editingEtude, montant: parseInt(e.target.value) || 0})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Avancement (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={editingEtude.avancement}
                    onChange={(e) => setEditingEtude({...editingEtude, avancement: parseInt(e.target.value) || 0})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Livrables (séparés par des virgules)</label>
                  <textarea 
                    value={editingEtude.livrables.join(', ')}
                    onChange={(e) => setEditingEtude({...editingEtude, livrables: e.target.value.split(',').map(l => l.trim()).filter(l => l)})}
                    rows="2"
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  />
                </div>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn-primary" onClick={handleSaveEtude} style={{cursor: 'pointer'}}>💾 Enregistrer</button>
                <button className="btn-secondary" onClick={() => setEditingEtude(null)} style={{cursor: 'pointer'}}>❌ Annuler</button>
              </div>
            </div>
          )}

          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3><BarChart3 size={18} /> Études en cours</h3>
              <button className="btn" onClick={handleNewEtude} style={{cursor: 'pointer'}}>+ Nouvelle étude</button>
            </div>
            <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>BET</th>
                  <th>Projet</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Livraison</th>
                  <th>Montant</th>
                  <th>Avancement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {etudes.map(etude => (
                  <tr key={etude.id}>
                    <td style={{fontWeight: 500}}>{etude.betNom}</td>
                    <td>{etude.projet}</td>
                    <td><span className="badge badge-info">{etude.type}</span></td>
                    <td>
                      <span className="badge" style={{background: `${getStatusColor(etude.statut)}20`, color: getStatusColor(etude.statut)}}>
                        {etude.statut}
                      </span>
                    </td>
                    <td>{new Date(etude.dateLivraison).toLocaleDateString('fr-FR')}</td>
                    <td>{formatMontant(etude.montant, 0)}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div style={{flex: 1, height: '8px', background: 'var(--panel)', borderRadius: '4px', overflow: 'hidden'}}>
                          <div style={{width: `${etude.avancement}%`, height: '100%', background: getStatusColor(etude.statut)}}></div>
                        </div>
                        <span style={{fontSize: '12px', fontWeight: 'bold'}}>{etude.avancement}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEditEtude(etude)} title="Modifier" style={{cursor: 'pointer'}}>✏️</button>
                      <button className="btn-icon" onClick={() => handleDeleteEtude(etude)} title="Supprimer" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer'}}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}

      {/* Vue Compétences */}
      {viewMode === 'competences' && (
        <div className="card">
          <h3 style={{marginBottom: '20px'}}><Target size={18} /> Compétences disponibles par spécialité</h3>
          <p style={{marginBottom: '20px', color: 'var(--ink)', opacity: 0.7}}>
            Cliquez sur une compétence pour copier son nom
          </p>
          <div style={{display: 'grid', gap: '20px'}}>
            {Object.entries(competencesDisponibles).map(([specialite, competences]) => (
              <div key={specialite} className="card" style={{background: 'rgba(59, 130, 246, 0.05)'}}>
                <h4 style={{marginBottom: '15px', color: 'var(--brand)'}}>{specialite}</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {competences.map((comp, idx) => (
                    <span 
                      key={idx} 
                      className="badge" 
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)', 
                        color: '#3b82f6', 
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(comp);
                        alert(`✅ "${comp}" copié dans le presse-papier !`);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(59, 130, 246, 0.3)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
