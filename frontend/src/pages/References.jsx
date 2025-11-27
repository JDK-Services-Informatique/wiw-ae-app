import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ViewToggle from '../components/ViewToggle';
import DetailView from '../components/DetailView';
import { useListesDeroulantes } from '../hooks/useListesDeroulantes';
import VoiceInputButton from '../components/VoiceInputButton';
import jsPDF from 'jspdf';
import { defaultProjets } from '../data/defaultData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BarChart3, FileText, Ruler, Euro, FolderOpen, Download } from 'lucide-react';
import { formatMontant as formatMontantUtil } from '../utils/formatNumber';
import { exportReferencesExcel, exportReferencesPDF } from '../utils/exportReferences';

export default function References({ filter = null, onNavigate }) {
  const navigate = useNavigate();
  const { listes, loading } = useListesDeroulantes();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Récupérer les listes depuis l'API avec fallback
  const domaines = listes.domainesProjet || listes.domaines || [];
  const typesProjet = listes.typesProjet || {};
  
  // Mapping Domaine → Types (fallback si API non disponible)
  const domaineTypes = domaines.length > 0 && Object.keys(typesProjet).length > 0 ? 
    domaines.reduce((acc, domaine) => {
      acc[domaine] = typesProjet[domaine] || typesProjet[domaine] || [];
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

  // Fonctions de navigation
  const handleCreerDevis = (projet) => {
    localStorage.setItem('wiw-devis-prefill', JSON.stringify({
      client: {
        nom: projet.maitreOuvrage || '',
        ville: projet.localisation || ''
      },
      notes: `Devis pour projet: ${projet.nom}`
    }));
    navigate('/devis');
    
    // Fallback pour onNavigate si fourni
    if (onNavigate) {
      onNavigate('devis');
    }
  };

  const handleCalculerHonoraires = (projet) => {
    localStorage.setItem('wiw-honoraires-prefill', JSON.stringify({
      montantTravaux: projet.montantTravauxHT || 0,
      surface: projet.surface || 0,
      nomProjet: projet.nom
    }));
    navigate('/honoraires');
    
    // Fallback pour onNavigate si fourni
    if (onNavigate) {
      onNavigate('honoraires');
    }
  };


  const [selectedProjet, setSelectedProjet] = useState(null);
  const [editingProjet, setEditingProjet] = useState(null);
  const [showPhototheque, setShowPhototheque] = useState(null); // ID du projet pour afficher la photothèque
  const [showDocuments, setShowDocuments] = useState(null); // ID du projet pour afficher les documents

  const handleViewProjet = (projet) => {
    setSelectedProjet(projet);
  };

  const handleEditProjet = (projet) => {
    setEditingProjet({...projet});
  };

  const handleSaveProjet = () => {
    if (!editingProjet.nom.trim()) {
      alert('⚠️ Le nom est obligatoire');
      return;
    }
    alert('✅ Référence modifiée avec succès');
    setEditingProjet(null);
  };

  const [projets, setProjets] = useLocalStorage('wiw-projets', defaultProjets);

  const [showForm, setShowForm] = useState(false);
  const [newProjet, setNewProjet] = useState({
    nom: '',
    domaine: 'Logements',
    type: 'Logements collectifs',
    localisation: '',
    surface: '',
    montantTravauxHT: '',
    maitreOuvrage: '',
    annee: new Date().getFullYear().toString()
  });

  const addProjet = () => {
    if (newProjet.nom && newProjet.localisation) {
      setProjets([...projets, { 
        id: Date.now(), 
        ...newProjet,
        surface: parseFloat(newProjet.surface) || 0,
        montantTravauxHT: parseFloat(newProjet.montantTravauxHT) || 0,
        image: '🏗️'
      }]);
      setNewProjet({
        nom: '',
        domaine: 'Logements',
        type: 'Logements collectifs',
        localisation: '',
        surface: '',
        montantTravauxHT: '',
        maitreOuvrage: '',
        annee: new Date().getFullYear().toString()
      });
      setShowForm(false);
    }
  };

  const deleteProjet = (id) => {
    if (confirm('Supprimer cette référence ?')) {
      setProjets(projets.filter(p => p.id !== id));
      alert('✅ Référence supprimée');
    }
  };

  // Fonctions de calcul
  const calculerRatio = (surface, montantHT) => {
    if (!surface || !montantHT || surface === 0) return '-';
    return `${Math.round(montantHT / surface)} €/m²`;
  };

  const calculerPourcentageHonoraires = (projet) => {
    if (!projet.montantTravauxHT || projet.montantTravauxHT === 0) {
      return { montant: 0, pourcentage: 0 };
    }
    // Pourcentage par défaut de 12% (peut être ajusté)
    const pourcentage = 12;
    const montant = (projet.montantTravauxHT * pourcentage) / 100;
    return { montant, pourcentage };
  };

  // Totaux honoraires calculés par le backend
  const [honorairesProjet, setHonorairesProjet] = useState({});
  useEffect(() => {
    projets.forEach(projet => {
      axios.get('/api/honoraires/projet', { params: { montantTravaux: projet.montantTravauxHT } })
        .then(res => setHonorairesProjet(prev => ({ ...prev, [projet.id]: res.data })))
        .catch(() => setHonorairesProjet(prev => ({ ...prev, [projet.id]: null })));
    });
  }, [projets]);

  const formatMontant = (montant) => {
    if (!montant) return '-';
    return formatMontantUtil(montant, 0);
  };

  // Gestion des photos
  const handleAddPhoto = (projetId, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProjets(prev => prev.map(p => {
            if (p.id === projetId) {
              const newPhoto = {
                id: Date.now() + Math.random(),
                nom: file.name,
                data: event.target.result,
                date: new Date().toISOString()
              };
              return { ...p, photos: [...(p.photos || []), newPhoto] };
            }
            return p;
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDeletePhoto = (projetId, photoId) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        return { ...p, photos: p.photos.filter(ph => ph.id !== photoId) };
      }
      return p;
    }));
  };

  const handleSetVignette = (projetId, photoId) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        const photo = p.photos.find(ph => ph.id === photoId);
        return { ...p, vignette: photo ? photo.data : null };
      }
      return p;
    }));
    alert('✅ Vignette définie');
  };

  // Gestion des documents
  const handleAddDocument = (projetId, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProjets(prev => prev.map(p => {
          if (p.id === projetId) {
            const newDoc = {
              id: Date.now() + Math.random(),
              nom: file.name,
              type: file.type,
              size: file.size,
              data: event.target.result,
              date: new Date().toISOString()
            };
            return { ...p, documents: [...(p.documents || []), newDoc] };
          }
          return p;
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteDocument = (projetId, docId) => {
    setProjets(prev => prev.map(p => {
      if (p.id === projetId) {
        return { ...p, documents: p.documents.filter(d => d.id !== docId) };
      }
      return p;
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Génération fiche résumé A4 (portrait ou paysage)
  const genererFicheResume = (projet, orientation = 'portrait') => {
    try {
      const doc = new jsPDF(orientation === 'paysage' ? 'landscape' : 'portrait', 'mm', 'a4');
      
      // En-tête
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FICHE RÉFÉRENCE PROJET', orientation === 'paysage' ? 148 : 105, 20, { align: 'center' });
      
      // Informations principales
      let yPos = 35;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(projet.nom || 'Sans nom', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const infos = [
        `Maître d'ouvrage: ${projet.maitreOuvrage || '-'}`,
        `Localisation: ${projet.localisation || '-'}`,
        `Domaine: ${projet.domaine || '-'}`,
        `Type: ${projet.type || '-'}`,
        `Année: ${projet.annee || '-'}`,
        `Surface: ${projet.surface ? projet.surface.toLocaleString('fr-FR') + ' m²' : '-'}`,
        `Montant travaux HT: ${formatMontant(projet.montantTravauxHT)}`,
        `Ratio: ${calculerRatio(projet.surface, projet.montantTravauxHT)}`
      ];
      
      infos.forEach((info, index) => {
        doc.text(info, 20, yPos + (index * 7));
      });
      
      // Honoraires si disponible
      if (projet.montantTravauxHT > 0) {
        const honoraires = calculerPourcentageHonoraires(projet);
        yPos += 60;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Estimation Honoraires', 20, yPos);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Pourcentage: ${honoraires.pourcentage}%`, 20, yPos + 7);
        doc.text(`Montant: ${formatMontant(honoraires.montant)}`, 20, yPos + 14);
      }
      
      // Photos si disponibles (vignettes)
      if (projet.photos && projet.photos.length > 0) {
        yPos += 30;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Photothèque (${projet.photos.length} photo${projet.photos.length > 1 ? 's' : ''})`, 20, yPos);
        
        // Note: Pour ajouter des images réelles, utiliser doc.addImage()
        // doc.addImage(projet.photos[0].data, 'JPEG', 20, yPos + 5, 50, 35);
      }
      
      // Documents associés
      if (projet.documents && projet.documents.length > 0) {
        yPos += 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Documents associés (${projet.documents.length})`, 20, yPos);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        projet.documents.slice(0, 5).forEach((docItem, index) => {
          doc.text(`- ${docItem.nom}`, 25, yPos + 7 + (index * 5));
        });
      }
      
      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Document généré par WIW / AE+', orientation === 'paysage' ? 148 : 105, orientation === 'paysage' ? 200 : 285, { align: 'center' });
      doc.text(new Date().toLocaleDateString('fr-FR'), orientation === 'paysage' ? 148 : 105, orientation === 'paysage' ? 205 : 290, { align: 'center' });
      
      // Sauvegarder
      const fileName = `Fiche_Reference_${(projet.nom || 'Projet').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      
      if (window.showToast) {
        window.showToast('✅ Fiche résumé générée', 'success');
      }
    } catch (error) {
      console.error('Erreur génération fiche:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la génération', 'error');
      }
    }
  };

  // Filter projects based on filter prop
  const filteredProjets = filter 
    ? projets.filter(p => {
        if (filter === 'bet') {
          // For BET filter, show projects related to technical/engineering
          return ['Bureaux', 'Industrie', 'Santé', 'Équipements publics'].includes(p.domaine);
        } else if (filter === 'entreprises') {
          // For enterprises filter, show commercial/business projects
          return ['Commerce', 'Bureaux', 'Industrie'].includes(p.domaine);
        }
        return true;
      })
    : projets;

  // Page title based on filter
  const getPageTitle = () => {
    if (filter === 'bet') return 'Références BET';
    if (filter === 'entreprises') return 'Références Entreprises';
    return 'Références Projets';
  };

  return (
    <div>
      {/* Modal Édition Projet */}
      {editingProjet && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
          <h3 style={{marginBottom: '20px', fontSize: 'clamp(16px, 3vw, 18px)'}}>✏️ Modifier la référence</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Nom *</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                <input 
                  type="text" 
                  value={editingProjet.nom}
                  onChange={(e) => setEditingProjet({...editingProjet, nom: e.target.value})}
                  style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box'}}
                />
                <VoiceInputButton
                  onTranscript={(transcript) => setEditingProjet({...editingProjet, nom: transcript.trim()})}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Maître d'ouvrage / Client</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                <input 
                  type="text" 
                  value={editingProjet.maitreOuvrage || ''}
                  onChange={(e) => setEditingProjet({...editingProjet, maitreOuvrage: e.target.value})}
                  style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Ex: Ville de Paris"
                />
                <VoiceInputButton
                  onTranscript={(transcript) => setEditingProjet({...editingProjet, maitreOuvrage: transcript.trim()})}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Domaine</label>
              <select 
                value={editingProjet.domaine || 'Logements'}
                onChange={(e) => {
                  const newDomaine = e.target.value;
                  const firstType = domaineTypes[newDomaine][0];
                  setEditingProjet({...editingProjet, domaine: newDomaine, type: firstType});
                }}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                {Object.keys(domaineTypes).map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Type</label>
              <select 
                value={editingProjet.type}
                onChange={(e) => setEditingProjet({...editingProjet, type: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                {domaineTypes[editingProjet.domaine || 'Logements']?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Localisation</label>
              <input 
                type="text" 
                value={editingProjet.localisation}
                onChange={(e) => setEditingProjet({...editingProjet, localisation: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Année</label>
              <input 
                type="text" 
                value={editingProjet.annee}
                onChange={(e) => setEditingProjet({...editingProjet, annee: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Surface (m²)</label>
              <input 
                type="number" 
                value={editingProjet.surface || ''}
                onChange={(e) => setEditingProjet({...editingProjet, surface: parseFloat(e.target.value) || 0})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 3500"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Montant travaux HT (€)</label>
              <input 
                type="number" 
                value={editingProjet.montantTravauxHT || ''}
                onChange={(e) => setEditingProjet({...editingProjet, montantTravauxHT: parseFloat(e.target.value) || 0})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 2800000"
              />
            </div>
            {editingProjet.surface > 0 && editingProjet.montantTravauxHT > 0 && (
              <div style={{gridColumn: '1 / -1', padding: '10px', background: 'rgba(124,58,237,0.1)', borderRadius: '8px'}}>
                <strong><BarChart3 size={16} /> Ratio:</strong> {calculerRatio(editingProjet.surface, editingProjet.montantTravauxHT)}
              </div>
            )}
            {editingProjet.montantTravauxHT > 0 && (
              <div style={{gridColumn: '1 / -1', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
                  <div>
                    <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '5px'}}>Estimation honoraires</div>
                    <div style={{fontSize: '24px', fontWeight: 600, color: '#10b981'}}>
                      {formatMontant(calculerPourcentageHonoraires(editingProjet).montant)}
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '36px', fontWeight: 700, color: '#10b981'}}>
                      {calculerPourcentageHonoraires(editingProjet).pourcentage}%
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.7}}>Pourcentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn-primary" onClick={handleSaveProjet}>💾 Enregistrer</button>
            <button className="btn-secondary" onClick={() => setEditingProjet(null)}>❌ Annuler</button>
          </div>
        </div>
      )}

      {/* Modal Détails Projet */}
      {selectedProjet && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(59, 130, 246, 0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px'}}>
            <h3 style={{fontSize: 'clamp(16px, 3vw, 18px)', wordWrap: 'break-word'}}>{selectedProjet.nom}</h3>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              <button 
                className="btn-primary" 
                onClick={() => handleCreerDevis(selectedProjet)}
                style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontSize: '14px', padding: '8px 16px'}}
              >
                <FileText size={16} /> Créer devis
              </button>
              <button 
                className="btn-primary" 
                onClick={() => handleCalculerHonoraires(selectedProjet)}
                style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', fontSize: '14px', padding: '8px 16px'}}
              >
                Calculer honoraires
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => genererFicheResume(selectedProjet, 'portrait')}
                style={{fontSize: '14px', padding: '8px 16px'}}
                title="Générer fiche résumé A4 portrait"
              >
                Fiche A4
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => genererFicheResume(selectedProjet, 'paysage')}
                style={{fontSize: '14px', padding: '8px 16px'}}
                title="Générer fiche résumé A4 paysage"
              >
                Fiche Paysage
              </button>
              <button className="btn-secondary" onClick={() => setSelectedProjet(null)} style={{minWidth: 'fit-content'}}>Fermer</button>
            </div>
          </div>
          <div style={{fontSize: 'clamp(48px, 10vw, 64px)', textAlign: 'center', marginBottom: '20px'}}>{selectedProjet.image}</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
            <div style={{wordWrap: 'break-word'}}><strong>Maître d'ouvrage:</strong> {selectedProjet.maitreOuvrage || '-'}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Localisation:</strong> {selectedProjet.localisation}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Domaine:</strong> {selectedProjet.domaine || '-'}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Type:</strong> {selectedProjet.type}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Surface:</strong> {selectedProjet.surface ? `${selectedProjet.surface.toLocaleString('fr-FR')} m²` : '-'}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Montant travaux HT:</strong> {formatMontant(selectedProjet.montantTravauxHT)}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Ratio:</strong> {calculerRatio(selectedProjet.surface, selectedProjet.montantTravauxHT)}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Année:</strong> {selectedProjet.annee}</div>
          </div>
          {selectedProjet.montantTravauxHT > 0 && (
            <div className="section-box bg-emerald-500/10 border-emerald-500/30">
              <h3 className="section-subtitle text-emerald-600 dark:text-emerald-400">Estimation honoraires</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Taux standard (12%)</div>
                  <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatMontant(calculerPourcentageHonoraires(selectedProjet).montant)}
                  </div>
                </div>
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  {calculerPourcentageHonoraires(selectedProjet).pourcentage}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px'}}>
        <h2 style={{fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <FileText size={28} className="text-brand" /> {getPageTitle()}
        </h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button
            onClick={() => exportReferencesExcel(projets)}
            className="btn"
            style={{display: 'flex', alignItems: 'center', gap: '8px'}}
            title="Exporter en Excel"
          >
            <Download size={18} />
            Excel
          </button>
          <button
            onClick={() => exportReferencesPDF(projets)}
            className="btn"
            style={{display: 'flex', alignItems: 'center', gap: '8px'}}
            title="Exporter en PDF"
          >
            <Download size={18} />
            PDF
          </button>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Ajouter une référence'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{marginBottom: '20px'}}>
          <h3 style={{marginBottom: '15px'}}>Nouvelle référence</h3>
          <div className="form-group">
            <label>Nom du projet *</label>
            <input
              type="text"
              value={newProjet.nom}
              onChange={(e) => setNewProjet({ ...newProjet, nom: e.target.value })}
              placeholder="Ex: Résidence des Pins"
            />
          </div>
          <div className="form-group">
            <label>Maître d'ouvrage / Client</label>
            <input
              type="text"
              value={newProjet.maitreOuvrage}
              onChange={(e) => setNewProjet({ ...newProjet, maitreOuvrage: e.target.value })}
              placeholder="Ex: Ville de Paris, SCI..."
            />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <div className="form-group">
              <label>Domaine *</label>
              <select
                value={newProjet.domaine}
                onChange={(e) => {
                  const newDomaine = e.target.value;
                  const firstType = domaineTypes[newDomaine][0];
                  setNewProjet({ ...newProjet, domaine: newDomaine, type: firstType });
                }}
              >
                {Object.keys(domaineTypes).map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Type de projet *</label>
              <select
                value={newProjet.type}
                onChange={(e) => setNewProjet({ ...newProjet, type: e.target.value })}
              >
                {domaineTypes[newProjet.domaine]?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px'}}>
            <div className="form-group">
              <label>Localisation *</label>
              <input
                type="text"
                value={newProjet.localisation}
                onChange={(e) => setNewProjet({ ...newProjet, localisation: e.target.value })}
                placeholder="Ville"
              />
            </div>
            <div className="form-group">
              <label>Surface (m²)</label>
              <input
                type="number"
                value={newProjet.surface}
                onChange={(e) => setNewProjet({ ...newProjet, surface: e.target.value })}
                placeholder="Ex: 3500"
              />
            </div>
            <div className="form-group">
              <label>Année</label>
              <input
                type="text"
                value={newProjet.annee}
                onChange={(e) => setNewProjet({ ...newProjet, annee: e.target.value })}
                placeholder="2024"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Montant travaux HT (€)</label>
            <input
              type="number"
              value={newProjet.montantTravauxHT}
              onChange={(e) => setNewProjet({ ...newProjet, montantTravauxHT: e.target.value })}
              placeholder="Ex: 2800000"
            />
          </div>
          <button className="btn" onClick={addProjet}>Ajouter la référence</button>
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
        {filteredProjets.map(projet => (
          <div key={projet.id} className="card" style={{padding: '0', overflow: 'hidden'}}>
            {/* Bouton Modifier en tête de carte */}
            <div style={{
              padding: '15px 20px 10px 20px',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                className="btn-secondary" 
                title="Éditer" 
                onClick={() => handleEditProjet(projet)}
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
                  gap: '6px'
                }}
              >
                ✏️ Modifier
              </button>
            </div>
            
            <div style={{
              position: 'relative',
              height: '200px',
              background: projet.vignette 
                ? `url(${projet.vignette}) center/cover no-repeat` 
                : 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!projet.vignette && (
                <div style={{fontSize: '80px', opacity: 0.8}}>
                  {projet.image}
                </div>
              )}
            </div>
            <div style={{padding: '20px'}}>
              <h3 style={{marginBottom: '10px', fontSize: '18px'}}>{projet.nom}</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', opacity: 0.8}}>
                {projet.maitreOuvrage && <div>👤 {projet.maitreOuvrage}</div>}
                <div>📍 {projet.localisation}</div>
                <div>🏷️ {projet.type}</div>
                {projet.surface && <div><Ruler size={16} /> {projet.surface.toLocaleString('fr-FR')} m²</div>}
                {projet.montantTravauxHT && <div><Euro size={16} /> {formatMontant(projet.montantTravauxHT)}</div>}
                <div>📅 {projet.annee}</div>
              </div>
              <div style={{marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button 
                  className="btn-primary" 
                  title="Voir détails" 
                  onClick={() => handleViewProjet(projet)}
                  style={{padding: '10px 20px', fontSize: '14px', fontWeight: 500}}
                >
                  👁️ Détails
                </button>
                <button className="btn-icon" title="Photothèque" onClick={() => setShowPhototheque(projet.id)} style={{position: 'relative'}}>
                  📸
                  {projet.photos && projet.photos.length > 0 && (
                    <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#10b981', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                      {projet.photos.length}
                    </span>
                  )}
                </button>
                <button className="btn-icon" title="Documents" onClick={() => setShowDocuments(projet.id)} style={{position: 'relative'}}>
                  📄
                  {projet.documents && projet.documents.length > 0 && (
                    <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#3b82f6', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                      {projet.documents.length}
                    </span>
                  )}
                </button>
                <button className="btn-icon" onClick={() => deleteProjet(projet.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjets.length === 0 && (
        <div className="card" style={{textAlign: 'center', padding: '60px 20px'}}>
          <div style={{fontSize: '64px', marginBottom: '20px'}}>🏗️</div>
          <p style={{fontSize: '18px', opacity: 0.7}}>
            {filter ? `Aucune référence ${filter === 'bet' ? 'BET' : 'Entreprises'} pour le moment` : 'Aucune référence pour le moment'}
          </p>
          <p style={{fontSize: '14px', opacity: 0.5, marginTop: '10px'}}>
            Ajoutez vos projets réalisés pour constituer votre portfolio
          </p>
        </div>
      )}

      {/* Modal Photothèque */}
      {showPhototheque && (() => {
        const projet = projets.find(p => p.id === showPhototheque);
        if (!projet) return null;
        
        return (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setShowPhototheque(null)}>
            <div className="card" style={{maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto'}} onClick={(e) => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>📸 Photothèque - {projet.nom}</h3>
                <button className="btn-secondary" onClick={() => setShowPhototheque(null)}>Fermer</button>
              </div>

              <div style={{marginBottom: '20px'}}>
                <label className="btn" style={{cursor: 'pointer', display: 'inline-block'}}>
                  + Ajouter des photos
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => handleAddPhoto(projet.id, e)}
                    style={{display: 'none'}}
                  />
                </label>
                <span style={{marginLeft: '15px', fontSize: '13px', opacity: 0.7}}>
                  {projet.photos?.length || 0} photo(s)
                </span>
              </div>

              {projet.photos && projet.photos.length > 0 ? (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
                  {projet.photos.map(photo => (
                    <div key={photo.id} style={{position: 'relative', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden'}}>
                      <img 
                        src={photo.data} 
                        alt={photo.nom}
                        style={{width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                        onClick={() => window.open(photo.data, '_blank')}
                      />
                      <div style={{padding: '10px', background: 'var(--panel)'}}>
                        <div style={{fontSize: '12px', marginBottom: '8px', wordBreak: 'break-all'}}>{photo.nom}</div>
                        <div style={{display: 'flex', gap: '5px'}}>
                          <button 
                            className="btn-secondary" 
                            style={{fontSize: '11px', padding: '5px 10px'}}
                            onClick={() => handleSetVignette(projet.id, photo.id)}>
                            Définir vignette
                          </button>
                          <button 
                            className="btn-secondary" 
                            style={{fontSize: '11px', padding: '5px 10px', background: '#ef4444', borderColor: '#ef4444'}}
                            onClick={() => {
                              if (confirm('Supprimer cette photo ?')) {
                                handleDeletePhoto(projet.id, photo.id);
                              }
                            }}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px', opacity: 0.5}}>
                  <div style={{fontSize: '48px', marginBottom: '10px'}}>📷</div>
                  <p>Aucune photo ajoutée</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Modal Documents */}
      {showDocuments && (() => {
        const projet = projets.find(p => p.id === showDocuments);
        if (!projet) return null;
        
        return (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setShowDocuments(null)}>
            <div className="card" style={{maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto'}} onClick={(e) => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>📄 Documents - {projet.nom}</h3>
                <button className="btn-secondary" onClick={() => setShowDocuments(null)}>Fermer</button>
              </div>

              <div style={{marginBottom: '20px'}}>
                <label className="btn" style={{cursor: 'pointer', display: 'inline-block'}}>
                  + Ajouter des documents
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" 
                    multiple 
                    onChange={(e) => handleAddDocument(projet.id, e)}
                    style={{display: 'none'}}
                  />
                </label>
                <span style={{marginLeft: '15px', fontSize: '13px', opacity: 0.7}}>
                  {projet.documents?.length || 0} document(s)
                </span>
              </div>

              {projet.documents && projet.documents.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {projet.documents.map(doc => (
                    <div key={doc.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--panel)'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: 500, marginBottom: '5px'}}>{doc.nom}</div>
                        <div style={{fontSize: '12px', opacity: 0.6}}>
                          {formatFileSize(doc.size)} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: '10px'}}>
                        <a 
                          href={doc.data} 
                          download={doc.nom}
                          className="btn-secondary"
                          style={{fontSize: '13px', padding: '8px 15px', textDecoration: 'none'}}>
                          ⬇️ Télécharger
                        </a>
                        <button 
                          className="btn-secondary" 
                          style={{fontSize: '13px', padding: '8px 15px', background: '#ef4444', borderColor: '#ef4444'}}
                          onClick={() => {
                            if (confirm('Supprimer ce document ?')) {
                              handleDeleteDocument(projet.id, doc.id);
                            }
                          }}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px', opacity: 0.5}}>
                  <div style={{fontSize: '48px', marginBottom: '10px'}}><FolderOpen size={48} /></div>
                  <p>Aucun document ajouté</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
