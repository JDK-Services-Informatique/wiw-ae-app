/**
 * Page des Appels d'Offres (Tenders)
 * Version refactorisée utilisant des composants modulaires
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useTenders, DOMAINE_TYPES } from '../hooks/useTenders';
import { useListesDeroulantes } from '../hooks/useListesDeroulantes';

// Composants
import {
  TenderHeader,
  TenderFilters,
  TenderList
} from '../components/tenders';
import AssistantAO from '../components/AssistantAO';
import AnalysePostMortem from '../components/AnalysePostMortem';
import VoiceInputButton from '../components/VoiceInputButton';

// Utils
import { formatMontant } from '../utils/formatNumber';

// Data
import { missionsCompetencesRef } from '../data/missionsCompetences';

// Icons
import {
  BarChart3, ClipboardList, Building2,
  Target, FolderOpen
} from 'lucide-react';

export default function Tenders({ onNavigate }) {
  const navigate = useNavigate();

  // Hook principal pour les AO
  const {
    aos,
    filteredAOs,
    selectedAO,
    editingAO,
    isCreating,
    filterStatut,
    stats,
    planInfo,
    isAtLimit,
    setSelectedAO,
    setFilterStatut,
    createAO,
    editAO,
    saveAO,
    cancelEdit,
    updateEditingField,
    updateDomaine,
    addPhoto,
    setVignette,
    addTranche,
    updateTranche,
    deleteTranche,
    addDocument,
    deleteDocument,
    addLienMarche,
    deleteLienMarche,
    toggleMission
  } = useTenders();

  // Listes déroulantes
  const { listes } = useListesDeroulantes();
  const statutsAO = listes?.statutsAO || [];

  // États UI
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [showAssistantAO, setShowAssistantAO] = useState(false);
  const [showRelances, setShowRelances] = useState(false);
  const [showAnalysePostMortem, setShowAnalysePostMortem] = useState(false);
  const [aoPourAnalyse, setAoPourAnalyse] = useState(null);

  // Handlers de navigation
  const handleGoToMissions = () => navigate('/templates');

  const handleCreerDevis = (ao) => {
    localStorage.setItem('wiw-devis-prefill', JSON.stringify({
      client: {
        nom: ao.maitreOuvrage || ao.client || '',
        adresse: ao.localisation || ''
      },
      notes: `Devis suite à AO: ${ao.objet || ao.titre || ao.nom}`
    }));
    navigate('/devis');
  };

  // Handler upload vignette
  const handleUploadVignette = (aoId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Le fichier est trop volumineux (max 5 MB)');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => setVignette(aoId, reader.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handler upload photos
  const handleAddPhotoAO = (aoId, e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          addPhoto(aoId, { nom: file.name, data: event.target.result });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handler upload document légal
  const handleUploadDocumentLegal = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'DPGF' ? '.xlsx,.xls' : '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          alert('Le fichier ne doit pas dépasser 50 MB');
          return;
        }
        addDocument({
          type,
          nom: file.name,
          date: new Date().toISOString().split('T')[0],
          taille: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        });
      }
    };
    input.click();
  };

  // Handler ajout lien marché
  const handleAddLienMarche = () => {
    const plateforme = prompt('Nom de la plateforme:');
    if (!plateforme) return;
    const url = prompt('URL du marché:');
    if (!url) return;
    addLienMarche({ plateforme, url, statut: 'Publié' });
  };

  // Handler save
  const handleSaveAO = () => {
    saveAO(editingAO);
  };

  return (
    <div>
      {/* En-tête avec stats et exports */}
      <TenderHeader
        aos={aos}
        planInfo={planInfo}
        isAtLimit={isAtLimit}
        onNewAO={createAO}
        onOpenAssistant={() => setShowAssistantAO(true)}
      />

      {/* Filtres */}
      <TenderFilters
        filterStatut={filterStatut}
        onFilterChange={setFilterStatut}
        stats={stats}
        onGoToMissions={handleGoToMissions}
      />

      {/* Planning relances */}
      {showRelances && (
        <div className="card" style={{ marginBottom: '20px', background: 'rgba(168, 85, 247, 0.1)' }}>
          <h3 style={{ marginBottom: '15px' }}>
            <ClipboardList size={16} /> Planning des relances
          </h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Appel d'offres</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {aos.flatMap(ao =>
                  (ao.relances || []).map((rel, i) => (
                    <tr key={`${ao.id}-${i}`}>
                      <td>{ao.titre}</td>
                      <td>{new Date(rel.date).toLocaleDateString('fr-FR')}</td>
                      <td><span className="badge badge-info">{rel.type}</span></td>
                      <td>
                        <span className={`badge ${
                          rel.statut === 'Effectué' ? 'badge-success' :
                          rel.statut === 'Planifié' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {rel.statut}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Création/Édition AO */}
      {editingAO && (
        <div className="card" style={{ marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {isCreating ? '+ Nouvel appel d\'offres' : 'Modifier l\'appel d\'offres'}
          </h3>

          {/* Formulaire principal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {/* Titre */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Titre *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={editingAO.titre}
                  onChange={(e) => updateEditingField('titre', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                  placeholder="Ex: Résidence Les Oliviers"
                />
                <VoiceInputButton
                  onTranscript={(t) => updateEditingField('titre', t.trim())}
                />
              </div>
            </div>

            {/* Client */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Client *</label>
              <input
                type="text"
                value={editingAO.client}
                onChange={(e) => updateEditingField('client', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                placeholder="Ex: Ville de Lyon"
              />
            </div>

            {/* Statut */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Statut *</label>
              <select
                value={editingAO.statut}
                onChange={(e) => updateEditingField('statut', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="En négociation">En négociation</option>
                <option value="Gagné">Gagné</option>
                <option value="Perdu">Perdu</option>
                {statutsAO.filter(s => !['Nouveau', 'En cours', 'En négociation', 'Gagné', 'Perdu'].includes(s))
                  .map(statut => <option key={statut} value={statut}>{statut}</option>)}
              </select>
            </div>

            {/* Domaine */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Domaine *</label>
              <select
                value={editingAO.domaine || 'Logements'}
                onChange={(e) => updateDomaine(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                {Object.keys(DOMAINE_TYPES).map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Type *</label>
              <select
                value={editingAO.type}
                onChange={(e) => updateEditingField('type', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                {(DOMAINE_TYPES[editingAO.domaine] || []).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Montant */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Montant honoraires *</label>
              <input
                type="number"
                value={editingAO.montant}
                onChange={(e) => updateEditingField('montant', parseInt(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                placeholder="Ex: 450000"
              />
            </div>

            {/* Montant travaux */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Montant travaux HT</label>
              <input
                type="number"
                value={editingAO.montantTravauxPrevisionnel || ''}
                onChange={(e) => updateEditingField('montantTravauxPrevisionnel', parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                placeholder="Ex: 2800000"
              />
            </div>

            {/* Durée */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Durée prévisionnelle</label>
              <input
                type="text"
                value={editingAO.dureePrevisionnelle || ''}
                onChange={(e) => updateEditingField('dureePrevisionnelle', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                placeholder="Ex: 18 mois"
              />
            </div>

            {/* Date rendu */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Date rendu *</label>
              <input
                type="date"
                value={editingAO.dateRendu}
                onChange={(e) => updateEditingField('dateRendu', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Section Vignette */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Vignette & Photothèque</h4>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Vignette</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {editingAO.vignette?.startsWith('data:') ? (
                    <img
                      src={editingAO.vignette}
                      alt="Vignette"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{
                      width: '120px',
                      height: '120px',
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      {editingAO.vignette || ''}
                    </div>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={() => handleUploadVignette(editingAO.id || 'new')}
                  >
                    {editingAO.vignette?.startsWith('data:') ? 'Changer' : 'Ajouter vignette'}
                  </button>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Photothèque</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                    Ajouter photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleAddPhotoAO(editingAO.id || 'new', e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '13px', opacity: 0.7 }}>
                    {(editingAO.photos || []).length} photo(s)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Tranches */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '16px' }}>
                <BarChart3 size={16} /> Tranches & Phasage
              </h4>
              <button className="btn-secondary" onClick={addTranche}>
                + Ajouter tranche
              </button>
            </div>

            {(editingAO.tranches || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {editingAO.tranches.map((tranche, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '10px'
                    }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Phase</label>
                        <input
                          type="text"
                          value={tranche.phase || `Phase ${tranche.num}`}
                          onChange={(e) => updateTranche(index, 'phase', e.target.value)}
                          style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Description</label>
                        <input
                          type="text"
                          value={tranche.description || ''}
                          onChange={(e) => updateTranche(index, 'description', e.target.value)}
                          style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Montant</label>
                        <input
                          type="number"
                          value={tranche.montant || 0}
                          onChange={(e) => updateTranche(index, 'montant', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => deleteTranche(index)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          Suppr.
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{
                  padding: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '6px',
                  textAlign: 'right'
                }}>
                  <strong>Total:</strong> {formatMontant(
                    (editingAO.tranches || []).reduce((sum, t) => sum + (t.montant || 0), 0), 0
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
                Aucune tranche définie.
              </div>
            )}
          </div>

          {/* Section Missions */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: 'rgba(124, 58, 237, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
              <Target size={16} /> Missions requises
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {Object.keys(missionsCompetencesRef).map(code => {
                const mission = missionsCompetencesRef[code];
                const isSelected = editingAO.missionsSelectionnees?.includes(code);

                return (
                  <div
                    key={code}
                    onClick={() => toggleMission(code)}
                    style={{
                      padding: '10px',
                      background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: isSelected ? '#a78bfa' : 'inherit' }}>
                      {code}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{mission.nom}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Documents */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>
              <FolderOpen size={16} /> Documents légaux
            </h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => handleUploadDocumentLegal('DPGF')}>
                + DPGF
              </button>
              <button className="btn" onClick={() => handleUploadDocumentLegal('CCTP')}>
                + CCTP
              </button>
              <button className="btn" onClick={() => handleUploadDocumentLegal('Plans')}>
                + Plans
              </button>
            </div>
            {(editingAO.documentsLegaux || []).length > 0 && (
              <div style={{ display: 'grid', gap: '8px' }}>
                {editingAO.documentsLegaux.map((doc, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{doc.nom}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{doc.type} - {doc.taille}</div>
                    </div>
                    <button
                      className="btn-icon"
                      onClick={() => deleteDocument(doc.nom)}
                    >
                      Suppr.
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Liens marchés */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Liens marchés publics</h4>
            <button className="btn" onClick={handleAddLienMarche} style={{ marginBottom: '15px' }}>
              + Ajouter un lien
            </button>
            {(editingAO.liensMarchesPublics || []).length > 0 && (
              <div style={{ display: 'grid', gap: '8px' }}>
                {editingAO.liensMarchesPublics.map((lien, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{lien.plateforme}</div>
                      <a href={lien.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px' }}>
                        {lien.url}
                      </a>
                    </div>
                    <button className="btn-icon" onClick={() => deleteLienMarche(lien.url)}>
                      Suppr.
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn-primary" onClick={handleSaveAO}>
              Enregistrer
            </button>
            <button className="btn-secondary" onClick={cancelEdit}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des AO */}
      <TenderList
        aos={filteredAOs}
        isDetailedView={isDetailedView}
        onToggleView={() => setIsDetailedView(!isDetailedView)}
        onSelect={setSelectedAO}
        onEdit={editAO}
      />

      {/* Modal détails AO */}
      {selectedAO && (
        <div className="card" style={{ marginTop: '20px', background: 'rgba(59, 130, 246, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>{selectedAO.titre}</h3>
            <button className="btn-secondary" onClick={() => setSelectedAO(null)}>
              Fermer
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div><strong>Client:</strong> {selectedAO.client}</div>
            <div><strong>Statut:</strong> {selectedAO.statut}</div>
            <div><strong>Montant:</strong> {formatMontant(selectedAO.montant, 0)}</div>
            <div><strong>Type:</strong> {selectedAO.type}</div>
            <div><strong>Domaine:</strong> {selectedAO.domaine}</div>
            <div><strong>Durée:</strong> {selectedAO.dureePrevisionnelle || '-'}</div>
            <div><strong>Date rendu:</strong> {selectedAO.dateRendu ? new Date(selectedAO.dateRendu).toLocaleDateString('fr-FR') : '-'}</div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => editAO(selectedAO)}>
              Modifier
            </button>
            <button className="btn" onClick={() => handleCreerDevis(selectedAO)}>
              Créer un devis
            </button>
            {selectedAO.statut === 'Perdu' && (
              <button
                className="btn-secondary"
                onClick={() => {
                  setAoPourAnalyse(selectedAO);
                  setShowAnalysePostMortem(true);
                }}
              >
                Analyse Post-Mortem
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Assistant AO */}
      {showAssistantAO && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Assistant AO</h3>
              <button className="btn-secondary" onClick={() => setShowAssistantAO(false)}>
                Fermer
              </button>
            </div>
            <AssistantAO onClose={() => setShowAssistantAO(false)} />
          </div>
        </div>
      )}

      {/* Modal Analyse Post-Mortem */}
      {showAnalysePostMortem && aoPourAnalyse && (
        <AnalysePostMortem
          ao={aoPourAnalyse}
          onClose={() => {
            setShowAnalysePostMortem(false);
            setAoPourAnalyse(null);
          }}
        />
      )}
    </div>
  );
}
