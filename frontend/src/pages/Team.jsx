import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import VoiceInputButton from '../components/VoiceInputButton';
import FinancialProtection from '../components/FinancialProtection';
import { Users, ClipboardList, Edit } from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useLocalStorage('wiw-team-members', [
    {
      id: 1,
      nom: 'Jean Dupont',
      fonction: 'Architecte DPLG',
      email: 'j.dupont@cabinet.fr',
      telephone: '01 23 45 67 89',
      portable: '06 12 34 56 78',
      metier: 'Architecture',
      competences: ['Conception', 'Plans', 'Suivi chantier'],
      tauxHoraire: 85,
      statut: 'actif',
      fichiersAnnexes: [],
      moyensHumains: [],
      moyensMateriels: [],
      justificatifs: {
        cv: null,
        diplomes: [],
        attestations: [],
        marchesPublics: []
      }
    },
    {
      id: 2,
      nom: 'Marie Martin',
      fonction: 'Architecte Projet',
      email: 'm.martin@cabinet.fr',
      telephone: '01 23 45 67 90',
      portable: '06 23 45 67 89',
      metier: 'Architecture',
      competences: ['APD', 'PRO', 'DET'],
      tauxHoraire: 75,
      statut: 'actif',
      fichiersAnnexes: [],
      moyensHumains: [],
      moyensMateriels: [],
      justificatifs: {
        cv: null,
        diplomes: [],
        attestations: [],
        marchesPublics: []
      }
    }
  ]);

  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('liste'); // 'liste', 'moyens', 'justificatifs'

  const filteredMembers = members.filter(member => {
    const matchSearch = !searchQuery.trim() || 
      member.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.fonction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const handleNewMember = () => {
    setEditingMember({
      nom: '',
      fonction: '',
      email: '',
      telephone: '',
      portable: '',
      metier: 'Architecture',
      competences: [],
      tauxHoraire: 0,
      statut: 'actif',
      fichiersAnnexes: [],
      moyensHumains: [],
      moyensMateriels: [],
      justificatifs: {
        cv: null,
        diplomes: [],
        attestations: [],
        marchesPublics: []
      }
    });
    setShowForm(true);
  };

  const handleEditMember = (member) => {
    setEditingMember({...member});
    setShowForm(true);
  };

  const handleSaveMember = () => {
    if (!editingMember.nom.trim() || !editingMember.email.trim()) {
      if (window.showToast) {
        window.showToast('⚠️ Le nom et l\'email sont obligatoires', 'warning');
      }
      return;
    }

    if (editingMember.id) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      if (window.showToast) {
        window.showToast('✅ Membre modifié avec succès', 'success');
      }
    } else {
      const newMember = {
        ...editingMember,
        id: Date.now()
      };
      setMembers([...members, newMember]);
      if (window.showToast) {
        window.showToast('✅ Membre ajouté avec succès', 'success');
      }
    }
    setEditingMember(null);
    setShowForm(false);
  };

  const handleDeleteMember = (id) => {
    if (confirm('Supprimer ce membre de l\'équipe ?')) {
      setMembers(members.filter(m => m.id !== id));
      if (window.showToast) {
        window.showToast('🗑️ Membre supprimé', 'info');
      }
    }
  };

  // Gestion fichiers annexés
  const handleUploadFichier = (memberId, type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('⚠️ Le fichier est trop volumineux (max 10 MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fichier = {
        id: Date.now(),
        nom: file.name,
        type: file.type,
        taille: file.size,
        data: reader.result,
        date: new Date().toISOString()
      };

      if (editingMember && editingMember.id === memberId) {
        if (type === 'annexe') {
          setEditingMember({
            ...editingMember,
            fichiersAnnexes: [...(editingMember.fichiersAnnexes || []), fichier]
          });
        } else if (type === 'cv') {
          setEditingMember({
            ...editingMember,
            justificatifs: {
              ...editingMember.justificatifs,
              cv: fichier
            }
          });
        } else if (type === 'diplome') {
          setEditingMember({
            ...editingMember,
            justificatifs: {
              ...editingMember.justificatifs,
              diplomes: [...(editingMember.justificatifs?.diplomes || []), fichier]
            }
          });
        } else if (type === 'attestation') {
          setEditingMember({
            ...editingMember,
            justificatifs: {
              ...editingMember.justificatifs,
              attestations: [...(editingMember.justificatifs?.attestations || []), fichier]
            }
          });
        } else if (type === 'marchePublic') {
          setEditingMember({
            ...editingMember,
            justificatifs: {
              ...editingMember.justificatifs,
              marchesPublics: [...(editingMember.justificatifs?.marchesPublics || []), fichier]
            }
          });
        }
      } else {
        setMembers(members.map(m => {
          if (m.id === memberId) {
            if (type === 'annexe') {
              return { ...m, fichiersAnnexes: [...(m.fichiersAnnexes || []), fichier] };
            } else if (type === 'cv') {
              return {
                ...m,
                justificatifs: {
                  ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                  cv: fichier
                }
              };
            } else if (type === 'diplome') {
              return {
                ...m,
                justificatifs: {
                  ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                  diplomes: [...(m.justificatifs?.diplomes || []), fichier]
                }
              };
            } else if (type === 'attestation') {
              return {
                ...m,
                justificatifs: {
                  ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                  attestations: [...(m.justificatifs?.attestations || []), fichier]
                }
              };
            } else if (type === 'marchePublic') {
              return {
                ...m,
                justificatifs: {
                  ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                  marchesPublics: [...(m.justificatifs?.marchesPublics || []), fichier]
                }
              };
            }
          }
          return m;
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteFichier = (memberId, type, fichierId) => {
    if (editingMember && editingMember.id === memberId) {
      if (type === 'annexe') {
        setEditingMember({
          ...editingMember,
          fichiersAnnexes: (editingMember.fichiersAnnexes || []).filter(f => f.id !== fichierId)
        });
      } else if (type === 'cv') {
        setEditingMember({
          ...editingMember,
          justificatifs: {
            ...editingMember.justificatifs,
            cv: null
          }
        });
      } else if (type === 'diplome') {
        setEditingMember({
          ...editingMember,
          justificatifs: {
            ...editingMember.justificatifs,
            diplomes: (editingMember.justificatifs?.diplomes || []).filter(f => f.id !== fichierId)
          }
        });
      } else if (type === 'attestation') {
        setEditingMember({
          ...editingMember,
          justificatifs: {
            ...editingMember.justificatifs,
            attestations: (editingMember.justificatifs?.attestations || []).filter(f => f.id !== fichierId)
          }
        });
      } else if (type === 'marchePublic') {
        setEditingMember({
          ...editingMember,
          justificatifs: {
            ...editingMember.justificatifs,
            marchesPublics: (editingMember.justificatifs?.marchesPublics || []).filter(f => f.id !== fichierId)
          }
        });
      }
    } else {
      setMembers(members.map(m => {
        if (m.id === memberId) {
          if (type === 'annexe') {
            return { ...m, fichiersAnnexes: (m.fichiersAnnexes || []).filter(f => f.id !== fichierId) };
          } else if (type === 'cv') {
            return {
              ...m,
              justificatifs: {
                ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                cv: null
              }
            };
          } else if (type === 'diplome') {
            return {
              ...m,
              justificatifs: {
                ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                diplomes: (m.justificatifs?.diplomes || []).filter(f => f.id !== fichierId)
              }
            };
          } else if (type === 'attestation') {
            return {
              ...m,
              justificatifs: {
                ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                attestations: (m.justificatifs?.attestations || []).filter(f => f.id !== fichierId)
              }
            };
          } else if (type === 'marchePublic') {
            return {
              ...m,
              justificatifs: {
                ...(m.justificatifs || { cv: null, diplomes: [], attestations: [], marchesPublics: [] }),
                marchesPublics: (m.justificatifs?.marchesPublics || []).filter(f => f.id !== fichierId)
              }
            };
          }
        }
        return m;
      }));
    }
  };

  // Gestion moyens humains et matériels (fichiers Word/PDF)
  const handleUploadMoyens = (memberId, type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('document')) {
      alert('⚠️ Seuls les fichiers Word (.doc, .docx) et PDF sont acceptés');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('⚠️ Le fichier est trop volumineux (max 10 MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fichier = {
        id: Date.now(),
        nom: file.name,
        type: file.type,
        taille: file.size,
        data: reader.result,
        date: new Date().toISOString()
      };

      if (editingMember && editingMember.id === memberId) {
        if (type === 'humains') {
          setEditingMember({
            ...editingMember,
            moyensHumains: [...(editingMember.moyensHumains || []), fichier]
          });
        } else if (type === 'materiels') {
          setEditingMember({
            ...editingMember,
            moyensMateriels: [...(editingMember.moyensMateriels || []), fichier]
          });
        }
      } else {
        setMembers(members.map(m => {
          if (m.id === memberId) {
            if (type === 'humains') {
              return { ...m, moyensHumains: [...(m.moyensHumains || []), fichier] };
            } else if (type === 'materiels') {
              return { ...m, moyensMateriels: [...(m.moyensMateriels || []), fichier] };
            }
          }
          return m;
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMoyens = (memberId, type, fichierId) => {
    if (editingMember && editingMember.id === memberId) {
      if (type === 'humains') {
        setEditingMember({
          ...editingMember,
          moyensHumains: (editingMember.moyensHumains || []).filter(f => f.id !== fichierId)
        });
      } else if (type === 'materiels') {
        setEditingMember({
          ...editingMember,
          moyensMateriels: (editingMember.moyensMateriels || []).filter(f => f.id !== fichierId)
        });
      }
    } else {
      setMembers(members.map(m => {
        if (m.id === memberId) {
          if (type === 'humains') {
            return { ...m, moyensHumains: (m.moyensHumains || []).filter(f => f.id !== fichierId) };
          } else if (type === 'materiels') {
            return { ...m, moyensMateriels: (m.moyensMateriels || []).filter(f => f.id !== fichierId) };
          }
        }
        return m;
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
        <div>
          <h2 style={{fontSize: '24px', marginBottom: '5px'}}>Équipe Interne</h2>
          <div style={{fontSize: '13px', opacity: 0.7}}>
            {members.length} membre{members.length > 1 ? 's' : ''} dans l'équipe
          </div>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            className="btn" 
            onClick={() => setViewMode('liste')}
            style={{
              background: viewMode === 'liste' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'liste' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            Liste
          </button>
          <button 
            className="btn" 
            onClick={() => setViewMode('moyens')}
            style={{
              background: viewMode === 'moyens' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'moyens' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            Moyens
          </button>
          <button 
            className="btn" 
            onClick={() => setViewMode('justificatifs')}
            style={{
              background: viewMode === 'justificatifs' ? 'var(--brand)' : 'var(--panel)',
              color: viewMode === 'justificatifs' ? '#fff' : 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            Justificatifs
          </button>
          <button className="btn" onClick={handleNewMember}>
            + Nouveau membre
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      {viewMode === 'liste' && (
        <div style={{marginBottom: '20px'}}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, fonction, email..."
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '12px',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'var(--panel)',
              color: 'var(--ink)'
            }}
          />
        </div>
      )}

      {/* Vue Liste */}
      {viewMode === 'liste' && (
        <>
          {/* Formulaire d'édition */}
          {showForm && editingMember && (
            <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
              <h3 style={{marginBottom: '20px', fontSize: '18px'}}>
                {editingMember.id ? 'Modifier le membre' : 'Nouveau membre'}
              </h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Nom complet *</label>
                  <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                    <input
                      type="text"
                      value={editingMember.nom}
                      onChange={(e) => setEditingMember({...editingMember, nom: e.target.value})}
                      style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                      placeholder="Ex: Jean Dupont"
                    />
                    <VoiceInputButton
                      onTranscript={(transcript) => setEditingMember({...editingMember, nom: transcript.trim()})}
                    />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Fonction *</label>
                  <input
                    type="text"
                    value={editingMember.fonction}
                    onChange={(e) => setEditingMember({...editingMember, fonction: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="Ex: Architecte DPLG"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Email *</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="email@cabinet.fr"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone fixe</label>
                  <input
                    type="tel"
                    value={editingMember.telephone}
                    onChange={(e) => setEditingMember({...editingMember, telephone: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone portable</label>
                  <input
                    type="tel"
                    value={editingMember.portable}
                    onChange={(e) => setEditingMember({...editingMember, portable: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Métier</label>
                  <select
                    value={editingMember.metier}
                    onChange={(e) => setEditingMember({...editingMember, metier: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Ingénierie">Ingénierie</option>
                    <option value="Économie">Économie</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <FinancialProtection dataType="tauxHoraire" fallback={null}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Taux horaire (€)</label>
                    <input
                      type="number"
                      value={editingMember.tauxHoraire}
                      onChange={(e) => setEditingMember({...editingMember, tauxHoraire: parseFloat(e.target.value) || 0})}
                      style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                      placeholder="85"
                    />
                  </div>
                </FinancialProtection>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Statut</label>
                  <select
                    value={editingMember.statut}
                    onChange={(e) => setEditingMember({...editingMember, statut: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="congé">En congé</option>
                  </select>
                </div>
              </div>

              <div style={{marginTop: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Compétences (séparées par des virgules)</label>
                <input
                  type="text"
                  value={editingMember.competences?.join(', ') || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    competences: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Ex: Conception, Plans, Suivi chantier"
                />
              </div>

              {/* Fichiers annexés */}
              <div style={{marginTop: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px'}}>
                <label style={{display: 'block', marginBottom: '10px', fontWeight: 500}}>Fichiers annexés (Word/PDF)</label>
                <label className="btn-secondary" style={{cursor: 'pointer', display: 'inline-block', marginBottom: '10px'}}>
                  📎 Ajouter fichier annexé
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleUploadFichier(editingMember.id || 'new', 'annexe', e)}
                    style={{display: 'none'}}
                  />
                </label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px'}}>
                  {(editingMember.fichiersAnnexes || []).map(fichier => (
                    <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{fontSize: '12px'}}>📄 {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                      <button
                        className="btn-icon"
                        onClick={() => handleDeleteFichier(editingMember.id || 'new', 'annexe', fichier.id)}
                        style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button className="btn-primary" onClick={handleSaveMember}>Enregistrer</button>
                <button className="btn-secondary" onClick={() => {
                  setEditingMember(null);
                  setShowForm(false);
                }}>Annuler</button>
              </div>
            </div>
          )}

          {/* Liste des membres */}
          <div className="card">
            <h3 style={{marginBottom: '15px'}}>Liste des membres</h3>
            
            <div style={{display: 'grid', gap: '15px'}}>
              {filteredMembers.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', opacity: 0.5}}>
                  <div style={{fontSize: '48px', marginBottom: '10px'}}><Users size={48} /></div>
                  <div>Aucun membre trouvé</div>
                </div>
              ) : (
                filteredMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="card" 
                    style={{
                      padding: '20px',
                      background: 'var(--panel)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                          <h4 style={{fontSize: '18px', margin: 0}}>{member.nom}</h4>
                          <span className="badge badge-info">{member.fonction}</span>
                          <span className={`badge ${member.statut === 'actif' ? 'badge-success' : member.statut === 'inactif' ? 'badge-error' : 'badge-warning'}`}>
                            {member.statut}
                          </span>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', fontSize: '14px', opacity: 0.8, marginBottom: '15px'}}>
                          <div>Email:</div><div><a href={`mailto:${member.email}`} style={{color: 'var(--brand)'}}>{member.email}</a></div>
                          {member.telephone && (
                            <>
                              <div>Tél:</div><div><a href={`tel:${member.telephone}`} style={{color: 'var(--brand)'}}>{member.telephone}</a></div>
                            </>
                          )}
                          {member.portable && (
                            <>
                              <div>Portable:</div><div><a href={`tel:${member.portable}`} style={{color: 'var(--brand)'}}>{member.portable}</a></div>
                            </>
                          )}
                          <div>Métier:</div><div>{member.metier}</div>
                          <div>Taux horaire:</div>
                          <div>
                            <FinancialProtection dataType="tauxHoraire">
                              <strong>{member.tauxHoraire} €/h</strong>
                            </FinancialProtection>
                          </div>
                        </div>
                        {member.competences && member.competences.length > 0 && (
                          <div style={{marginTop: '10px'}}>
                            <strong style={{fontSize: '12px'}}>Compétences:</strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                              {member.competences.map((comp, idx) => (
                                <span key={idx} className="badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button
                          className="btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMember(member);
                          }}
                          style={{padding: '6px 12px', fontSize: '13px'}}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMember(member.id);
                          }}
                          style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Vue Moyens */}
      {viewMode === 'moyens' && (
        <div>
          <div className="card" style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px'}}>Visualisation des moyens par membre</h3>
            <div style={{display: 'grid', gap: '15px'}}>
              {members.map(member => (
                <div key={member.id} className="card" style={{padding: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{fontSize: '18px', margin: 0}}>{member.nom} - {member.fonction}</h4>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleEditMember(member)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                    >
                      <Edit size={16} /> Modifier
                    </button>
                  </div>
                  
                  {/* Moyens humains */}
                  <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>Moyens humains</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 Ajouter fichier
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleUploadMoyens(member.id, 'humains', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {(member.moyensHumains || []).map(fichier => (
                        <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '12px'}}>📄 {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteMoyens(member.id, 'humains', fichier.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(member.moyensHumains || []).length === 0 && (
                        <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucun fichier</div>
                      )}
                    </div>
                  </div>

                  {/* Moyens matériels (incluant informatique) */}
                  <div style={{padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>Moyens matériels (incluant informatique)</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 Ajouter fichier
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleUploadMoyens(member.id, 'materiels', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {(member.moyensMateriels || []).map(fichier => (
                        <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '12px'}}>📄 {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteMoyens(member.id, 'materiels', fichier.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(member.moyensMateriels || []).length === 0 && (
                        <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucun fichier</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vue Justificatifs */}
      {viewMode === 'justificatifs' && (
        <div>
          <div className="card" style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px'}}>Justificatifs par membre</h3>
            <div style={{display: 'grid', gap: '15px'}}>
              {members.map(member => (
                <div key={member.id} className="card" style={{padding: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{fontSize: '18px', margin: 0}}>{member.nom} - {member.fonction}</h4>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleEditMember(member)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                    >
                      <Edit size={16} /> Modifier
                    </button>
                  </div>
                  
                  {/* CV */}
                  <div style={{marginBottom: '15px', padding: '15px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>CV</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 {member.justificatifs?.cv ? 'Remplacer CV' : 'Ajouter CV'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleUploadFichier(member.id, 'cv', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    {member.justificatifs?.cv ? (
                      <div style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '12px'}}>📄 {member.justificatifs.cv.nom} ({formatFileSize(member.justificatifs.cv.taille)})</span>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteFichier(member.id, 'cv', member.justificatifs.cv.id)}
                          style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucun CV</div>
                    )}
                  </div>

                  {/* Diplômes */}
                  <div style={{marginBottom: '15px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>Diplômes</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 Ajouter diplôme
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleUploadFichier(member.id, 'diplome', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {(member.justificatifs?.diplomes || []).map(fichier => (
                        <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '12px'}}>📜 {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteFichier(member.id, 'diplome', fichier.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(member.justificatifs?.diplomes || []).length === 0 && (
                        <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucun diplôme</div>
                      )}
                    </div>
                  </div>

                  {/* Attestations */}
                  <div style={{marginBottom: '15px', padding: '15px', background: 'rgba(251, 146, 60, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>Attestations (stage, formation, etc.)</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 Ajouter attestation
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleUploadFichier(member.id, 'attestation', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {(member.justificatifs?.attestations || []).map(fichier => (
                        <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '12px'}}><ClipboardList size={12} /> {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteFichier(member.id, 'attestation', fichier.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(member.justificatifs?.attestations || []).length === 0 && (
                        <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucune attestation</div>
                      )}
                    </div>
                  </div>

                  {/* Justificatifs marchés publics */}
                  <div style={{padding: '15px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <h5 style={{fontSize: '16px', fontWeight: 'bold'}}>Justificatifs marchés publics</h5>
                      <label className="btn-secondary" style={{cursor: 'pointer', fontSize: '12px', padding: '4px 8px'}}>
                        📎 Ajouter justificatif
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xlsx,.xls"
                          onChange={(e) => handleUploadFichier(member.id, 'marchePublic', e)}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '10px'}}>
                      Travail clandestin, CA, déclaration mandataire, etc.
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {(member.justificatifs?.marchesPublics || []).map(fichier => (
                        <div key={fichier.id} style={{padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '12px'}}>📑 {fichier.nom} ({formatFileSize(fichier.taille)})</span>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteFichier(member.id, 'marchePublic', fichier.id)}
                            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', fontSize: '12px'}}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(member.justificatifs?.marchesPublics || []).length === 0 && (
                        <div style={{fontSize: '12px', opacity: 0.5, fontStyle: 'italic'}}>Aucun justificatif</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
