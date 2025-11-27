import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { missionsCompetencesRef, matchEquipeToMission, suggestEquipeForMissions } from '../data/missionsCompetences';
import { usePlan } from '../context/PlanContext';
import { LimitReached } from '../components/PlanRestriction';
import AnalysePostMortem from '../components/AnalysePostMortem';
import ViewToggle from '../components/ViewToggle';
import AssistantAO from '../components/AssistantAO';
import AOPerdusAPI from '../services/aoPerdus.api';
import { useListesDeroulantes } from '../hooks/useListesDeroulantes';
import VoiceInputButton from '../components/VoiceInputButton';
import { defaultAOs } from '../data/defaultData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BarChart3, ClipboardList, Building2, FileText, Euro, Lightbulb, Users, Target, FolderOpen, Ruler, Download } from 'lucide-react';
import { formatMontant as formatMontantUtil } from '../utils/formatNumber';
import AOPipelineStats from '../components/AOPipelineStats';
import { exportAOExcel, exportAOPDF } from '../utils/exportAO';

export default function Tenders({ onNavigate }) {
  const navigate = useNavigate();
  const { canAdd, getPlanInfo } = usePlan();
  const planInfo = getPlanInfo();

  // Fonction pour naviguer vers Missions (Templates)
  const handleGoToMissions = () => {
    // Naviguer vers la page Templates/Missions
    navigate('/templates');
  };

  // Fonction pour créer un devis depuis un AO
  const handleCreerDevis = (ao) => {
    // Stocker les infos du client pour pré-remplir le devis
    localStorage.setItem('wiw-devis-prefill', JSON.stringify({
      client: {
        nom: ao.maitreOuvrage || ao.client || '',
        adresse: ao.localisation || '',
        ville: ao.localisation || ''
      },
      notes: `Devis suite à AO: ${ao.objet || ao.titre || ao.nom}`
    }));
    navigate('/devis');
    
    // Fallback pour onNavigate si fourni
    if (onNavigate) {
      onNavigate('devis');
    }
  };

  // Fonction pour voir le projet référence lié
  const handleVoirReference = (ao) => {
    navigate('/references');
    
    // Fallback pour onNavigate si fourni
    if (onNavigate) {
      onNavigate('references');
    }
  };
  
  // Mapping Domaine → Types (même que Références pour cohérence)
  const domaineTypes = {
    'Logements': ['Logements collectifs', 'Maisons individuelles', 'Résidence étudiante', 'Logements sociaux'],
    'Équipements publics': ['Équipement culturel', 'Équipement sportif', 'Équipement scolaire', 'Mairie/Administration'],
    'Commerce': ['Centre commercial', 'Commerce de proximité', 'Hôtel/Restaurant'],
    'Bureaux': ['Bureaux neufs', 'Réhabilitation bureaux', 'Co-working'],
    'Industrie': ['Bâtiment industriel', 'Entrepôt/Logistique'],
    'Santé': ['Hôpital', 'Clinique', 'EHPAD'],
    'Autre': ['Mixte', 'Spécifique']
  };

  const [filterStatut, setFilterStatut] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRelances, setShowRelances] = useState(false);
  const [selectedAO, setSelectedAO] = useState(null);
  const [editingAO, setEditingAO] = useState(null);
  const [creatingAO, setCreatingAO] = useState(false);
  const [showRessourcesModal, setShowRessourcesModal] = useState(false);
  const [showAnalysePostMortem, setShowAnalysePostMortem] = useState(false);
  const [aoPourAnalyse, setAoPourAnalyse] = useState(null);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [showAssistantAO, setShowAssistantAO] = useState(false);
  const [showPhotothequeAO, setShowPhotothequeAO] = useState(null); // ID de l'AO pour afficher la photothèque

  // Données équipe et BET (normalement depuis Team.jsx et BET.jsx)
  const [equipeMembres] = useState([
    { 
      id: 1, 
      nom: 'Jean Dupont', 
      role: 'Architecte DPLG', 
      email: 'j.dupont@cabinet.fr',
      tel: '06 12 34 56 78',
      metier: { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      competences: ['Conception architecturale', 'Plans architecturaux', 'Plans détaillés', 'Suivi de chantier']
    },
    { 
      id: 2, 
      nom: 'Marie Martin', 
      role: 'Ingénieur structure', 
      email: 'm.martin@bet-structure.fr',
      tel: '06 23 45 67 89',
      metier: { macro: 'Ingénierie', domaine: 'Bureau d\'Études Techniques', categorie: 'Ingénieur Structure' },
      competences: ['Calcul structure', 'Diagnostic structure', 'Plans ferraillage']
    },
    { 
      id: 3, 
      nom: 'Sophie Leblanc', 
      role: 'Économiste TCE', 
      email: 's.leblanc@economiste.fr',
      tel: '06 34 56 78 90',
      metier: { macro: 'Économie', domaine: 'Étude de coûts', categorie: 'Économiste TCE' },
      competences: ['Économie de la construction', 'Chiffrage sommaire', 'Estimation détaillée', 'DPGF']
    }
  ]);

  const [betDisponibles] = useState([
    { 
      id: 1, 
      nom: 'Bureau Études BET MARTIN', 
      type: 'Structure',
      contact: 'Pierre Martin',
      tel: '01 23 45 67 89',
      email: 'contact@bet-martin.fr',
      competences: ['Calcul béton armé', 'Calcul métal', 'Diagnostic structure']
    },
    { 
      id: 2, 
      nom: 'Ingénierie Thermique LEROY', 
      type: 'Thermique & Fluides',
      contact: 'Sophie Leroy',
      tel: '01 34 56 78 90',
      email: 'contact@leroy-thermique.fr',
      competences: ['Étude thermique RT2020', 'CVC', 'BBC']
    },
    { 
      id: 3, 
      nom: 'BET Acoustique SONIC', 
      type: 'Acoustique',
      contact: 'Jean Petit',
      tel: '01 45 67 89 01',
      email: 'contact@sonic-acoustique.fr',
      competences: ['Isolation acoustique', 'Modélisation']
    }
  ]);

  const handleNewAO = () => {
    // Vérifier la limite du plan
    if (!canAdd('AO', aos.length)) {
      if (window.showToast) {
        window.showToast(`⚠️ Limite atteinte: ${planInfo.maxAO} appels d'offres max pour le plan ${planInfo.nom}`, 'warning');
      } else {
        alert(`⚠️ Limite atteinte: ${planInfo.maxAO} appels d'offres maximum pour votre plan.\n\nPassez au plan supérieur pour ajouter plus d'AO.`);
      }
      return;
    }

    setCreatingAO(true);
    setEditingAO({
      titre: '',
      domaine: 'Logements',
      type: 'Logements collectifs',
      client: '',
      montant: 0,
      dureePrevisionnelle: '',
      delai: '',
      statut: 'Nouveau',
      dateRendu: '',
      vignette: '🏗️',
      photos: [],
      tranches: [],
      partenaires: [],
      contactsInternes: [],
      contactsClients: [],
      relances: [],
      documentsLegaux: [],
      liensMarchesPublics: [],
      missionsSelectionnees: [], // Nouveau: missions pour cet AO
      montantTravauxPrevisionnel: 0,
      texteLegal: ''
    });
  };
  
  const [aos, setAOs] = useLocalStorage('wiw-tenders', defaultAOs);
  
  // Ancien code pour référence (à supprimer après vérification)
  /* const [aos, setAOs] = useState(() => {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem('wiw-aos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement AOs:', e);
      }
    }
    // Sinon utiliser les données par défaut
    return [
    {
      id: 1,
      titre: 'Résidence Les Oliviers',
      domaine: 'Logements',
      type: 'Logements collectifs',
      client: 'Ville de Lyon',
      montant: 450000,
      dureePrevisionnelle: '18 mois',
      delai: '120 jours',
      statut: 'En cours',
      dateRendu: '2025-01-15',
      vignette: '[Entreprise]', // Note: sera remplacé par une icône dans l'affichage
      photos: [],
      montantTravauxPrevisionnel: 2800000,
      tranches: [
        { num: 1, description: 'Phase 1 - Bâtiment A', montant: 300000, delai: 80 },
        { num: 2, description: 'Phase 2 - Bâtiment B', montant: 150000, delai: 40 }
      ],
      partenaires: [
        { nom: 'BET Structures Martin', domaine: 'Structure', pourcentage: 30, montant: 135000 },
        { nom: 'BET Fluides Dupont', domaine: 'Fluides', pourcentage: 25, montant: 112500 }
      ],
      contactsInternes: [
        { nom: 'Jean Dupont', role: 'Chef de projet', tel: '06 12 34 56 78', email: 'j.dupont@cabinet.fr' },
        { nom: 'Marie Martin', role: 'Architecte', tel: '06 23 45 67 89', email: 'm.martin@cabinet.fr' }
      ],
      contactsClients: [
        { nom: 'Pierre Bernard', role: 'Responsable urbanisme', tel: '04 78 12 34 56', email: 'p.bernard@lyon.fr' }
      ],
      relances: [
        { date: '2024-12-01', type: 'Email', statut: 'Envoyé' },
        { date: '2024-12-15', type: 'Téléphone', statut: 'Planifié' }
      ],
      documentsLegaux: [
        { type: 'DPGF', nom: 'DPGF_Oliviers.xlsx', date: '2024-11-20', taille: '2.4 MB' },
        { type: 'CCTP', nom: 'CCTP_Lot_Gros_Oeuvre.pdf', date: '2024-11-18', taille: '8.7 MB' },
        { type: 'Plans', nom: 'Plans_Architecture_PC.pdf', date: '2024-11-15', taille: '15.2 MB' }
      ],
      liensMarchesPublics: [
        { plateforme: 'AWS', url: 'https://www.aws-france.com/AO/12345', statut: 'Publié' },
        { plateforme: 'Place des Marchés', url: 'https://www.marches-publics.gouv.fr/AO/67890', statut: 'Publié' }
      ],
      missionsSelectionnees: ['ESQ', 'APS', 'APD', 'PRO', 'ACT', 'DET'], // Missions nécessaires pour cet AO
      texteLegal: ''
    },
    {
      id: 2,
      titre: 'Centre Commercial Rivoli',
      domaine: 'Commerce',
      type: 'Centre commercial',
      client: 'SCI Immobilière',
      montant: 1200000,
      dureePrevisionnelle: '24 mois',
      delai: '180 jours',
      statut: 'Nouveau',
      dateRendu: '2025-02-20',
      vignette: '🛍️',
      photos: [],
      montantTravauxPrevisionnel: 12000000,
      tranches: [],
      partenaires: [],
      contactsInternes: [
        { nom: 'Sophie Leblanc', role: 'Directrice', tel: '06 34 56 78 90', email: 's.leblanc@cabinet.fr' }
      ],
      contactsClients: [
        { nom: 'Marc Dubois', role: 'Gérant', tel: '01 45 67 89 01', email: 'm.dubois@sci-rivoli.fr' }
      ],
      relances: [],
      documentsLegaux: [
        { type: 'DPGF', nom: 'DPGF_Centre_Commercial.xlsx', date: '2024-12-05', taille: '3.1 MB' }
      ],
      liensMarchesPublics: [],
      missionsSelectionnees: ['ESQ', 'APS', 'APD', 'PRO', 'ACT', 'VISA', 'DET'], // Missions pour centre commercial
      texteLegal: ''
    },
    {
      id: 3,
      titre: 'École Primaire Victor Hugo',
      domaine: 'Équipements publics',
      type: 'Équipement scolaire',
      client: 'Mairie de Villeurbanne',
      montant: 850000,
      dureePrevisionnelle: '20 mois',
      delai: '150 jours',
      statut: 'En cours',
      dateRendu: '2025-01-10',
      vignette: '🏫',
      photos: [],
      montantTravauxPrevisionnel: 8500000,
      tranches: [
        { num: 1, description: 'Corps principal', montant: 650000, delai: 100 },
        { num: 2, description: 'Préau et cantine', montant: 200000, delai: 50 }
      ],
      partenaires: [
        { nom: 'Acoustique Pro', domaine: 'Acoustique', pourcentage: 15, montant: 127500 }
      ],
      contactsInternes: [
        { nom: 'Luc Moreau', role: 'BET Structure', tel: '06 45 67 89 12', email: 'l.moreau@bet.fr' }
      ],
      contactsClients: [
        { nom: 'Claire Petit', role: 'Adjointe éducation', tel: '04 72 34 56 78', email: 'c.petit@villeurbanne.fr' }
      ],
      relances: [
        { date: '2024-11-20', type: 'Visite site', statut: 'Effectué' }
      ],
      documentsLegaux: [
        { type: 'CCTP', nom: 'CCTP_Ecole_Victor_Hugo.pdf', date: '2024-11-10', taille: '12.5 MB' },
        { type: 'Plans', nom: 'Plans_Ecole_Permis_Construire.pdf', date: '2024-11-08', taille: '18.9 MB' }
      ],
      liensMarchesPublics: [
        { plateforme: 'Maximilien', url: 'https://www.maximilien.fr/AO/56789', statut: 'Publié' }
      ],
      missionsSelectionnees: ['DIAG', 'ESQ', 'APS', 'APD', 'PRO', 'ACT', 'DET', 'OPC'], // Missions pour école (avec diagnostic et OPC)
      texteLegal: ''
    }
    ];
  }); */
  
  // Alias pour compatibilité
  const tenders = aos;

  // Gestion photothèque et vignette
  const handleAddPhotoAO = (aoId, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAOs(prev => prev.map(ao => {
            if (ao.id === aoId) {
              const newPhoto = {
                id: Date.now() + Math.random(),
                nom: file.name,
                data: event.target.result,
                date: new Date().toISOString()
              };
              return { ...ao, photos: [...(ao.photos || []), newPhoto] };
            }
            return ao;
          }));
          
          // Mettre à jour editingAO si c'est celui en cours
          if (editingAO && editingAO.id === aoId) {
            setEditingAO(prev => ({
              ...prev,
              photos: [...(prev.photos || []), newPhoto]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDeletePhotoAO = (aoId, photoId) => {
    setAOs(prev => prev.map(ao => {
      if (ao.id === aoId) {
        return { ...ao, photos: (ao.photos || []).filter(ph => ph.id !== photoId) };
      }
      return ao;
    }));
    
    if (editingAO && editingAO.id === aoId) {
      setEditingAO(prev => ({
        ...prev,
        photos: (prev.photos || []).filter(ph => ph.id !== photoId)
      }));
    }
  };

  const handleSetVignetteAO = (aoId, photoId) => {
    const ao = aos.find(a => a.id === aoId);
    if (!ao) return;
    
    const photo = ao.photos?.find(ph => ph.id === photoId);
    if (photo) {
      setAOs(prev => prev.map(a => 
        a.id === aoId ? { ...a, vignette: photo.data } : a
      ));
      
      if (editingAO && editingAO.id === aoId) {
        setEditingAO(prev => ({ ...prev, vignette: photo.data }));
      }
      
      if (window.showToast) {
        window.showToast('✅ Vignette définie', 'success');
      }
    }
  };

  const handleUploadVignette = (aoId) => {
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
          setAOs(prev => prev.map(a => 
            a.id === aoId ? { ...a, vignette: reader.result } : a
          ));
          
          if (editingAO && editingAO.id === aoId) {
            setEditingAO(prev => ({ ...prev, vignette: reader.result }));
          }
          
          if (window.showToast) {
            window.showToast('✅ Vignette téléchargée', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Gestion partenaires
  const handleAddPartenaire = () => {
    if (!editingAO) return;
    const nom = prompt('Nom du partenaire BET:');
    if (!nom) return;
    
    const domaine = prompt('Domaine (Structure, Fluides, Acoustique, etc.):') || 'Structure';
    const pourcentage = parseFloat(prompt('Pourcentage (%):') || '0');
    const montant = (editingAO.montant * pourcentage) / 100;
    
    const newPartenaire = {
      nom,
      domaine,
      pourcentage,
      montant
    };
    
    setEditingAO({
      ...editingAO,
      partenaires: [...(editingAO.partenaires || []), newPartenaire]
    });
  };

  const handleUpdatePartenaire = (index, field, value) => {
    if (!editingAO) return;
    const updatedPartenaires = [...(editingAO.partenaires || [])];
    updatedPartenaires[index] = {
      ...updatedPartenaires[index],
      [field]: value
    };
    
    // Recalculer le montant si pourcentage change
    if (field === 'pourcentage') {
      updatedPartenaires[index].montant = (editingAO.montant * value) / 100;
    }
    
    setEditingAO({ ...editingAO, partenaires: updatedPartenaires });
  };

  const handleDeletePartenaire = (index) => {
    if (!editingAO) return;
    const updatedPartenaires = editingAO.partenaires.filter((_, i) => i !== index);
    setEditingAO({ ...editingAO, partenaires: updatedPartenaires });
  };

  const handleLinkBET = (betId) => {
    if (!editingAO) return;
    const bet = betDisponibles.find(b => b.id === betId);
    if (!bet) return;
    
    const pourcentage = parseFloat(prompt(`Pourcentage pour ${bet.nom} (%):`) || '0');
    const montant = (editingAO.montant * pourcentage) / 100;
    
    const newPartenaire = {
      nom: bet.nom,
      domaine: bet.type,
      pourcentage,
      montant,
      betId: bet.id
    };
    
    setEditingAO({
      ...editingAO,
      partenaires: [...(editingAO.partenaires || []), newPartenaire]
    });
    
    if (window.showToast) {
      window.showToast(`✅ ${bet.nom} lié à l'AO`, 'success');
    }
  };

  // Gestion contacts
  const handleAddContactInterne = () => {
    if (!editingAO) return;
    const nom = prompt('Nom du contact interne:');
    if (!nom) return;
    const role = prompt('Rôle:') || '';
    const tel = prompt('Téléphone:') || '';
    const email = prompt('Email:') || '';
    
    const newContact = { nom, role, tel, email };
    setEditingAO({
      ...editingAO,
      contactsInternes: [...(editingAO.contactsInternes || []), newContact]
    });
  };

  const handleAddContactClient = () => {
    if (!editingAO) return;
    const nom = prompt('Nom du contact client:');
    if (!nom) return;
    const role = prompt('Rôle:') || '';
    const tel = prompt('Téléphone:') || '';
    const email = prompt('Email:') || '';
    
    const newContact = { nom, role, tel, email };
    setEditingAO({
      ...editingAO,
      contactsClients: [...(editingAO.contactsClients || []), newContact]
    });
  };

  const handleDeleteContactInterne = (index) => {
    if (!editingAO) return;
    const updated = editingAO.contactsInternes.filter((_, i) => i !== index);
    setEditingAO({ ...editingAO, contactsInternes: updated });
  };

  const handleDeleteContactClient = (index) => {
    if (!editingAO) return;
    const updated = editingAO.contactsClients.filter((_, i) => i !== index);
    setEditingAO({ ...editingAO, contactsClients: updated });
  };

  // Gestion tranches/phasage
  const handleAddTranche = () => {
    if (!editingAO) return;
    const newTranche = {
      num: (editingAO.tranches?.length || 0) + 1,
      description: '',
      montant: 0,
      delai: 0,
      phase: 'Phase 1'
    };
    setEditingAO({
      ...editingAO,
      tranches: [...(editingAO.tranches || []), newTranche]
    });
  };

  const handleUpdateTranche = (index, field, value) => {
    if (!editingAO) return;
    const updatedTranches = [...(editingAO.tranches || [])];
    updatedTranches[index] = {
      ...updatedTranches[index],
      [field]: value
    };
    setEditingAO({ ...editingAO, tranches: updatedTranches });
  };

  const handleDeleteTranche = (index) => {
    if (!editingAO) return;
    const updatedTranches = editingAO.tranches.filter((_, i) => i !== index);
    setEditingAO({ ...editingAO, tranches: updatedTranches });
  };

  // Calcul montant total travaux
  const calculerMontantTotalTravaux = (ao) => {
    if (ao.montantTravauxPrevisionnel) {
      return ao.montantTravauxPrevisionnel;
    }
    if (ao.tranches && ao.tranches.length > 0) {
      return ao.tranches.reduce((sum, t) => sum + (t.montant || 0), 0);
    }
    return 0;
  };

  // Fonctions utilitaires
  const handleUploadDocumentLegal = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'DPGF' ? '.xlsx,.xls' : '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          alert('⚠️ Le fichier ne doit pas dépasser 50 MB');
          return;
        }
        const newDoc = {
          type,
          nom: file.name,
          date: new Date().toISOString().split('T')[0],
          taille: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        };
        setEditingAO(prev => ({
          ...prev,
          documentsLegaux: [...(prev.documentsLegaux || []), newDoc]
        }));
        alert(`✅ Document "${file.name}" ajouté`);
      }
    };
    input.click();
  };

  const handleDeleteDocumentLegal = (docNom) => {
    if (confirm(`Supprimer le document "${docNom}" ?`)) {
      setEditingAO(prev => ({
        ...prev,
        documentsLegaux: prev.documentsLegaux.filter(d => d.nom !== docNom)
      }));
      alert('✅ Document supprimé');
    }
  };

  const handleAddLienMarche = () => {
    const plateforme = prompt('Nom de la plateforme (ex: AWS, Place des Marchés, Maximilien):');
    if (!plateforme) return;
    
    const url = prompt('URL du marché:');
    if (!url) return;

    const newLien = {
      plateforme,
      url,
      statut: 'Publié'
    };
    
    setEditingAO(prev => ({
      ...prev,
      liensMarchesPublics: [...(prev.liensMarchesPublics || []), newLien]
    }));
    alert('✅ Lien ajouté');
  };

  const handleDeleteLienMarche = (url) => {
    if (confirm('Supprimer ce lien ?')) {
      setEditingAO(prev => ({
        ...prev,
        liensMarchesPublics: prev.liensMarchesPublics.filter(l => l.url !== url)
      }));
      alert('✅ Lien supprimé');
    }
  };

  const formatMontant = (montant) => {
    if (!montant) return '-';
    return formatMontantUtil(montant, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return '#3b82f6';
      case 'En cours': return '#f97316';
      case 'En négociation': return '#a855f7';
      case 'Gagné': return '#10b981';
      case 'Perdu': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleEditAO = (ao, e) => {
    e.stopPropagation();
    setEditingAO({...ao});
    setSelectedAO(null);
  };

  const handleViewDetails = (ao, e) => {
    e.stopPropagation();
    setSelectedAO(ao);
  };

  const handleSaveAO = () => {
    if (!editingAO.titre.trim()) {
      alert('⚠️ Le titre est obligatoire');
      return;
    }
    if (creatingAO) {
      alert('✅ Nouvel appel d\'offres créé avec succès');
      setCreatingAO(false);
    } else {
      alert('✅ Appel d\'offres modifié avec succès');
    }
    setEditingAO(null);
  };

  // Filtrage par statut et recherche
  const filteredTenders = aos.filter(t => {
    const matchStatut = filterStatut === 'tous' || t.statut === filterStatut;
    const matchSearch = !searchQuery.trim() || 
      t.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.domaine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatut && matchSearch;
  });
  const isAtLimit = planInfo.maxAO !== null && aos.length >= planInfo.maxAO;
  
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
        <div>
          <h2 style={{fontSize: '24px', marginBottom: '5px'}}>Appels d'Offres</h2>
          {planInfo.maxAO !== null && (
            <div style={{fontSize: '13px', opacity: 0.7}}>
              {aos.length} / {planInfo.maxAO} AO utilisés
              {isAtLimit && (
                <span style={{marginLeft: '8px', color: '#f59e0b', fontWeight: 600}}>⚠️ Limite atteinte</span>
              )}
            </div>
          )}
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button className="btn-secondary" onClick={() => setShowRelances(!showRelances)}>
            Planning relances
          </button>
          <button 
            className="btn-primary" 
            onClick={() => setShowAssistantAO(true)}
            style={{
              cursor: isAtLimit ? 'not-allowed' : 'pointer',
              opacity: isAtLimit ? 0.6 : 1
            }}
            disabled={isAtLimit}
          >
            Assistant AO
          </button>
          <button 
            className="btn" 
            onClick={handleNewAO} 
            style={{
              cursor: isAtLimit ? 'not-allowed' : 'pointer',
              opacity: isAtLimit ? 0.6 : 1
            }}
            disabled={isAtLimit}
          >
            + Nouveau AO (rapide)
          </button>
        </div>
      </div>

      {/* Afficher l'alerte si limite atteinte */}
      {isAtLimit && (
        <LimitReached 
          resource="appels d'offres" 
          current={tenders.length} 
          max={planInfo.maxAO}
          requiredPlan="PREMIUM"
        />
      )}

      {/* Pipeline AO - Statistiques (KPI-01) */}
      <div className="card" style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
          <div style={{flex: 1}}>
            <AOPipelineStats aos={aos} />
          </div>
          <div style={{display: 'flex', gap: '10px', marginLeft: '20px'}}>
            <button
              onClick={() => exportAOExcel(aos)}
              className="btn"
              style={{display: 'flex', alignItems: 'center', gap: '8px'}}
              title="Exporter en Excel"
            >
              <Download size={18} />
              Excel
            </button>
            <button
              onClick={() => exportAOPDF(aos)}
              className="btn"
              style={{display: 'flex', alignItems: 'center', gap: '8px'}}
              title="Exporter en PDF"
            >
              <Download size={18} />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Filtres statut avec bouton Rappel mission */}
      <div className="card" style={{marginBottom: '20px', background: 'rgba(59, 130, 246, 0.05)'}}>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
            <span style={{fontSize: '13px', fontWeight: 'bold'}}>Filtrer par statut:</span>
            <button className={`btn ${filterStatut === 'tous' ? '' : 'btn-secondary'}`} onClick={() => setFilterStatut('tous')}>
              Tous ({tenders.length})
            </button>
            <button className={`btn ${filterStatut === 'Nouveau' ? '' : 'btn-secondary'}`} onClick={() => setFilterStatut('Nouveau')}>
              🆕 Nouveaux ({tenders.filter(t => t.statut === 'Nouveau').length})
            </button>
            <button className={`btn ${filterStatut === 'En cours' ? '' : 'btn-secondary'}`} onClick={() => setFilterStatut('En cours')}>
              ⏳ En cours ({tenders.filter(t => t.statut === 'En cours').length})
            </button>
            <button className={`btn ${filterStatut === 'Gagné' ? '' : 'btn-secondary'}`} onClick={() => setFilterStatut('Gagné')}>
              ✅ Gagnés ({tenders.filter(t => t.statut === 'Gagné').length})
            </button>
            <button className={`btn ${filterStatut === 'Perdu' ? '' : 'btn-secondary'}`} onClick={() => setFilterStatut('Perdu')}>
              ❌ Perdus ({tenders.filter(t => t.statut === 'Perdu').length})
            </button>
          </div>
          <button 
            className="btn" 
            onClick={handleGoToMissions}
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            title="Accéder aux missions pour gérer les phases et compétences"
          >
            <span><ClipboardList size={16} /></span> Rappel mission
          </button>
        </div>
      </div>

      {/* Planning des relances */}
      {showRelances && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(168, 85, 247, 0.1)'}}>
          <h3 style={{marginBottom: '15px'}}><ClipboardList size={16} /> Planning des relances</h3>
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
                {tenders.flatMap(ao => 
                  ao.relances.map((rel, i) => (
                    <tr key={`${ao.id}-${i}`}>
                      <td>{ao.titre}</td>
                      <td>{new Date(rel.date).toLocaleDateString('fr-FR')}</td>
                      <td><span className="badge badge-info">{rel.type}</span></td>
                      <td><span className={`badge ${rel.statut === 'Effectué' ? 'badge-success' : rel.statut === 'Planifié' ? 'badge-warning' : 'badge-info'}`}>{rel.statut}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Modification/Création AO */}
      {editingAO && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
          <h3 style={{marginBottom: '20px', fontSize: 'clamp(16px, 3vw, 18px)'}}>{creatingAO ? '➕ Nouvel appel d\'offres' : '✏️ Modifier l\'appel d\'offres'}</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Titre *</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                <input 
                  type="text" 
                  value={editingAO.titre}
                  onChange={(e) => setEditingAO({...editingAO, titre: e.target.value})}
                  style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box'}}
                  placeholder="Ex: Résidence Les Oliviers"
                />
                <VoiceInputButton
                  onTranscript={(transcript) => setEditingAO({...editingAO, titre: transcript.trim()})}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Client / Maître d'ouvrage *</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                <input 
                  type="text" 
                  value={editingAO.client}
                  onChange={(e) => setEditingAO({...editingAO, client: e.target.value})}
                  style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box'}}
                  placeholder="Ex: Ville de Lyon"
                />
                <VoiceInputButton
                  onTranscript={(transcript) => setEditingAO({...editingAO, client: transcript.trim()})}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Statut *</label>
              <select 
                value={editingAO.statut}
                onChange={(e) => setEditingAO({...editingAO, statut: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="En négociation">En négociation</option>
                <option value="Gagné">Gagné</option>
                {statutsAO.length > 0 ? (
                  statutsAO.map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))
                ) : (
                  <>
                    <option value="Nouveau">Nouveau</option>
                    <option value="En cours">En cours</option>
                    <option value="Gagné">Gagné</option>
                    <option value="Perdu">Perdu</option>
                    <option value="Archivé">Archivé</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Domaine *</label>
              <select 
                value={editingAO.domaine || 'Logements'}
                onChange={(e) => {
                  const newDomaine = e.target.value;
                  const firstType = domaineTypes[newDomaine][0];
                  setEditingAO({...editingAO, domaine: newDomaine, type: firstType});
                }}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                {Object.keys(domaineTypes).map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Type *</label>
              <select 
                value={editingAO.type || 'Logements collectifs'}
                onChange={(e) => setEditingAO({...editingAO, type: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                {domaineTypes[editingAO.domaine || 'Logements']?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Montant honoraires (€) *</label>
              <input 
                type="number" 
                value={editingAO.montant}
                onChange={(e) => setEditingAO({...editingAO, montant: parseInt(e.target.value) || 0})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 450000"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Montant prévisionnel travaux HT (€)</label>
              <input 
                type="number" 
                value={editingAO.montantTravauxPrevisionnel || ''}
                onChange={(e) => setEditingAO({...editingAO, montantTravauxPrevisionnel: parseFloat(e.target.value) || 0})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 2800000"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Durée prévisionnelle</label>
              <input 
                type="text" 
                value={editingAO.dureePrevisionnelle || ''}
                onChange={(e) => setEditingAO({...editingAO, dureePrevisionnelle: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 18 mois"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Délai remise offre</label>
              <input 
                type="text" 
                value={editingAO.delai}
                onChange={(e) => setEditingAO({...editingAO, delai: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                placeholder="Ex: 120 jours"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Date rendu *</label>
              <input 
                type="date" 
                value={editingAO.dateRendu}
                onChange={(e) => setEditingAO({...editingAO, dateRendu: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              />
            </div>
          </div>

          {/* Section Vignette + Photothèque */}
          <div style={{marginTop: '25px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
            <h4 style={{margin: '0 0 15px 0', fontSize: '16px'}}>🖼️ Vignette & Photothèque</h4>
            
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Vignette</label>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                  {editingAO.vignette && typeof editingAO.vignette === 'string' && editingAO.vignette.startsWith('data:') ? (
                    <div style={{position: 'relative'}}>
                      <img 
                        src={editingAO.vignette} 
                        alt="Vignette" 
                        style={{
                          width: '120px', 
                          height: '120px', 
                          objectFit: 'cover', 
                          border: '1px solid var(--border)', 
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        onClick={() => setEditingAO({...editingAO, vignette: '🏗️'})}
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
                        title="Supprimer la vignette"
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
                      fontSize: '48px',
                      background: 'rgba(255,255,255,0.05)'
                    }}>
                      {editingAO.vignette || '🏗️'}
                    </div>
                  )}
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleUploadVignette(editingAO.id || 'new')}
                    style={{cursor: 'pointer'}}
                  >
                    {editingAO.vignette && typeof editingAO.vignette === 'string' && editingAO.vignette.startsWith('data:') ? '🔄 Changer' : '📤 Ajouter vignette'}
                  </button>
                </div>
              </div>
              
              <div style={{flex: 1}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Photothèque</label>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
                  <label className="btn-secondary" style={{cursor: 'pointer', display: 'inline-block'}}>
                    📸 Ajouter photos
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => handleAddPhotoAO(editingAO.id || 'new', e)}
                      style={{display: 'none'}}
                    />
                  </label>
                  <span style={{fontSize: '13px', opacity: 0.7}}>
                    {(editingAO.photos || []).length} photo{(editingAO.photos || []).length > 1 ? 's' : ''}
                  </span>
                  {(editingAO.photos || []).length > 0 && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowPhotothequeAO(editingAO.id || 'new')}
                      style={{cursor: 'pointer'}}
                    >
                      👁️ Voir photos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Tranches & Phasage */}
          <div style={{marginTop: '25px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h4 style={{margin: 0, fontSize: '16px'}}><BarChart3 size={16} /> Tranches & Phasage</h4>
              <button 
                className="btn-secondary" 
                onClick={handleAddTranche}
                style={{cursor: 'pointer', fontSize: '13px', padding: '6px 12px'}}
              >
                ➕ Ajouter tranche
              </button>
            </div>
            
            {(editingAO.tranches || []).length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {editingAO.tranches.map((tranche, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px'}}>
                      <div>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 500}}>Phase</label>
                        <input 
                          type="text" 
                          value={tranche.phase || `Phase ${tranche.num}`}
                          onChange={(e) => handleUpdateTranche(index, 'phase', e.target.value)}
                          style={{width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px'}}
                          placeholder="Ex: Phase 1"
                        />
                      </div>
                      <div>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 500}}>Description</label>
                        <input 
                          type="text" 
                          value={tranche.description || ''}
                          onChange={(e) => handleUpdateTranche(index, 'description', e.target.value)}
                          style={{width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px'}}
                          placeholder="Ex: Bâtiment A"
                        />
                      </div>
                      <div>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 500}}>Montant (€)</label>
                        <input 
                          type="number" 
                          value={tranche.montant || 0}
                          onChange={(e) => handleUpdateTranche(index, 'montant', parseFloat(e.target.value) || 0)}
                          style={{width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px'}}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 500}}>Délai (jours)</label>
                        <input 
                          type="number" 
                          value={tranche.delai || 0}
                          onChange={(e) => handleUpdateTranche(index, 'delai', parseInt(e.target.value) || 0)}
                          style={{width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px'}}
                          placeholder="0"
                        />
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleDeleteTranche(index)}
                          style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer'}}
                          title="Supprimer cette tranche"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', textAlign: 'right'}}>
                  <strong>Total tranches:</strong> {formatMontant((editingAO.tranches || []).reduce((sum, t) => sum + (t.montant || 0), 0))}
                </div>
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '20px', opacity: 0.6}}>
                <div style={{fontSize: '32px', marginBottom: '10px'}}><BarChart3 size={32} /></div>
                <p>Aucune tranche définie. Cliquez sur "Ajouter tranche" pour commencer.</p>
              </div>
            )}
          </div>

          {/* Section Missions requises */}
          <div style={{marginTop: '25px', padding: '15px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.2)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h4 style={{margin: 0, fontSize: '16px'}}><Target size={16} /> Missions requises pour ce projet</h4>
              {editingAO.missionsSelectionnees && editingAO.missionsSelectionnees.length > 0 && (
                <span style={{fontSize: '13px', color: '#a78bfa', fontWeight: 600}}>
                  {editingAO.missionsSelectionnees.length} mission{editingAO.missionsSelectionnees.length > 1 ? 's' : ''} sélectionnée{editingAO.missionsSelectionnees.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div style={{marginBottom: '15px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', fontSize: '13px'}}>
              <Lightbulb size={16} /> <strong>Astuce:</strong> Sélectionnez les missions nécessaires pour ce projet. Le système vous suggérera automatiquement l'équipe et les BET requis.
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px'}}>
              {Object.keys(missionsCompetencesRef).map(code => {
                const mission = missionsCompetencesRef[code];
                const isSelected = editingAO.missionsSelectionnees?.includes(code);
                
                return (
                  <div
                    key={code}
                    onClick={() => {
                      const current = editingAO.missionsSelectionnees || [];
                      const updated = isSelected 
                        ? current.filter(m => m !== code)
                        : [...current, code];
                      setEditingAO({...editingAO, missionsSelectionnees: updated});
                    }}
                    style={{
                      padding: '12px',
                      background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        background: '#a78bfa',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        ✓
                      </div>
                    )}
                    <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '14px', color: isSelected ? '#a78bfa' : 'inherit'}}>
                      {code}
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '6px'}}>
                      {mission.nom}
                    </div>
                    <div style={{fontSize: '11px', opacity: 0.6, display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      <span>📅 {mission.phasePrincipale}</span>
                      <span>⏱️ {mission.dureeTypique}</span>
                    </div>
                    {mission.betRequis && mission.betRequis.length > 0 && (
                      <div style={{fontSize: '10px', opacity: 0.7, marginTop: '6px', color: '#a78bfa'}}>
                        <Building2 size={16} /> BET: {mission.betRequis.join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Aperçu des ressources si missions sélectionnées */}
            {editingAO.missionsSelectionnees && editingAO.missionsSelectionnees.length > 0 && (
              <div style={{marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                <div style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '14px', color: '#10b981'}}>
                  ✅ Aperçu des ressources nécessaires:
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                  <div style={{padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
                      {equipeMembres.filter(m => 
                        editingAO.missionsSelectionnees.some(code => {
                          const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                          return matching.equipe.some(e => e.id === m.id);
                        })
                      ).length}
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.8}}>Membres d'équipe</div>
                  </div>
                  <div style={{padding: '12px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '6px'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#a78bfa'}}>
                      {betDisponibles.filter(b => 
                        editingAO.missionsSelectionnees.some(code => {
                          const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                          return matching.bet.some(bet => bet.id === b.id);
                        })
                      ).length}
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.8}}>BET requis</div>
                  </div>
                  <div style={{padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f87171'}}>
                      {editingAO.missionsSelectionnees.reduce((total, code) => {
                        const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                        return total + (matching.competencesManquantes?.length || 0);
                      }, 0)}
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.8}}>Compétences manquantes</div>
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setSelectedAO({...editingAO, id: editingAO.id || 'temp'});
                    setShowRessourcesModal(true);
                  }}
                  style={{marginTop: '12px', width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
                >
                  <BarChart3 size={16} /> Voir détails complets des ressources
                </button>
              </div>
            )}
          </div>

          {/* Section Documents légaux */}
          <div style={{marginTop: '25px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
            <h4 style={{marginBottom: '15px', fontSize: '16px'}}><FolderOpen size={16} /> Documents légaux</h4>
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
              <button className="btn" onClick={() => handleUploadDocumentLegal('DPGF')} style={{fontSize: '13px', padding: '8px 14px'}}>
                <BarChart3 size={16} /> + DPGF (.xlsx)
              </button>
              <button className="btn" onClick={() => handleUploadDocumentLegal('CCTP')} style={{fontSize: '13px', padding: '8px 14px'}}>
                <ClipboardList size={16} /> + CCTP (.pdf)
              </button>
              <button className="btn" onClick={() => handleUploadDocumentLegal('Plans')} style={{fontSize: '13px', padding: '8px 14px'}}>
                <Ruler size={16} /> + Plans (.pdf)
              </button>
            </div>
            {editingAO.documentsLegaux && editingAO.documentsLegaux.length > 0 && (
              <div style={{display: 'grid', gap: '8px'}}>
                {editingAO.documentsLegaux.map((doc, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <span>{doc.type === 'DPGF' ? <BarChart3 size={16} /> : doc.type === 'CCTP' ? <ClipboardList size={16} /> : <Ruler size={16} />}</span>
                      <div style={{fontSize: '13px'}}>
                        <div style={{fontWeight: 'bold'}}>{doc.nom}</div>
                        <div style={{opacity: 0.7, fontSize: '11px'}}>{doc.type} • {doc.taille}</div>
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => handleDeleteDocumentLegal(doc.nom)} title="Supprimer">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Liens marchés publics */}
          <div style={{marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
            <h4 style={{marginBottom: '15px', fontSize: '16px'}}>🔗 Liens marchés publics</h4>
            <button className="btn" onClick={handleAddLienMarche} style={{fontSize: '13px', padding: '8px 14px', marginBottom: '15px'}}>
              ➕ Ajouter un lien
            </button>
            {editingAO.liensMarchesPublics && editingAO.liensMarchesPublics.length > 0 && (
              <div style={{display: 'grid', gap: '8px'}}>
                {editingAO.liensMarchesPublics.map((lien, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px'
                  }}>
                    <div style={{fontSize: '13px'}}>
                      <div style={{fontWeight: 'bold'}}>{lien.plateforme}</div>
                      <a href={lien.url} target="_blank" rel="noopener noreferrer" style={{fontSize: '11px', color: 'var(--brand)', wordBreak: 'break-all'}}>
                        {lien.url}
                      </a>
                    </div>
                    <button className="btn-icon" onClick={() => handleDeleteLienMarche(lien.url)} title="Supprimer">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button className="btn-primary" onClick={handleSaveAO}>💾 Enregistrer</button>
            <button className="btn-secondary" onClick={() => { setEditingAO(null); setCreatingAO(false); }}>❌ Annuler</button>
          </div>
        </div>
      )}

      {/* Liste des AO */}
      <div className="card" style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
          <h3>Liste des appels d'offres</h3>
          <ViewToggle 
            isDetailed={isDetailedView} 
            onToggle={() => setIsDetailedView(!isDetailedView)}
            labelSynthetique="Vue tableau"
            labelDetaillee="Vue cartes"
          />
        </div>
        
        {isDetailedView ? (
          // Vue cartes
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
            {filteredTenders.map(ao => (
              <div key={ao.id} className="card" style={{padding: '0', overflow: 'hidden', cursor: 'pointer'}} onClick={() => setSelectedAO(ao)}>
                {/* Bouton Modifier en tête de carte */}
                <div style={{
                  padding: '15px 20px 10px 20px',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button 
                    className="btn-icon" 
                    title="Modifier" 
                    onClick={(e) => handleEditAO(ao, e)}
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
                  height: '120px',
                  background: ao.vignette 
                    ? `url(${ao.vignette}) center/cover no-repeat` 
                    : 'linear-gradient(135deg, var(--brand) 0%, var(--brand-accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!ao.vignette && (
                    <div style={{fontSize: '40px', opacity: 0.8}}>
                      {ao.vignette || '🏗️'}
                    </div>
                  )}
                </div>
                
                <div style={{padding: '20px'}}>
                  <h4 style={{marginBottom: '10px', fontSize: '16px', fontWeight: '600'}}>{ao.titre}</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', opacity: 0.8}}>
                    <div>🏷️ {ao.type || 'Type non spécifié'}</div>
                    <div>👤 {ao.client}</div>
                    <div><Euro size={16} /> {formatMontant(ao.montant)}</div>
                    <div>📅 Rendu: {new Date(ao.dateRendu).toLocaleDateString('fr-FR')}</div>
                    <div>⏱️ {ao.dureePrevisionnelle || 'Durée non spécifiée'}</div>
                  </div>
                  <div style={{marginTop: '15px'}}>
                    <span className={`badge ${
                      ao.statut === 'Nouveau' ? 'badge-info' : 
                      ao.statut === 'En cours' ? 'badge-warning' : 
                      ao.statut === 'Gagné' ? 'badge-success' :
                      ao.statut === 'Perdu' ? 'badge-danger' :
                      'badge-secondary'
                    }`}>
                      {ao.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vue tableau (existante)
          <div className="table-container overflow-x-auto -mx-4 sm:mx-0">
            <table className="table min-w-[800px]">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Titre</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden md:table-cell">Type</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Client</th>
                  <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Montant</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden lg:table-cell">Durée</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden md:table-cell">Date rendu</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Statut</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenders.map(ao => (
                  <tr key={ao.id} onClick={() => setSelectedAO(ao)} style={{cursor: 'pointer'}}>
                    <td className="px-2 sm:px-4 py-3">
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '20px'}}>{ao.vignette || '🏗️'}</span>
                        <span className="text-xs sm:text-sm">{ao.titre}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden md:table-cell">{ao.type || '-'}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden lg:table-cell">{ao.client}</td>
                    <td className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">{formatMontant(ao.montant)}</td>
                    <td className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden lg:table-cell">{ao.dureePrevisionnelle || '-'}</td>
                    <td className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden md:table-cell">{new Date(ao.dateRendu).toLocaleDateString('fr-FR')}</td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <span className={`badge text-xs ${
                        ao.statut === 'Nouveau' ? 'badge-info' : 
                        ao.statut === 'En cours' ? 'badge-warning' : 
                        ao.statut === 'Gagné' ? 'badge-success' :
                        ao.statut === 'Perdu' ? 'badge-danger' :
                        'badge-secondary'
                      }`}>
                        {ao.statut}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <button className="btn-icon text-xs" title="Modifier" onClick={(e) => handleEditAO(ao, e)}>✏️</button>
                      <button className="btn-icon text-xs" title="Détails" onClick={(e) => handleViewDetails(ao, e)}>👁️</button>
                      {ao.statut !== 'Perdu' && ao.statut !== 'Gagné' && (
                        <button 
                          className="btn-icon" 
                          title="Marquer comme perdu" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAoPourAnalyse(ao);
                            setShowAnalysePostMortem(true);
                          }}
                          style={{color: '#ef4444'}}
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredTenders.length === 0 && (
          <div style={{textAlign: 'center', padding: '60px 20px'}}>
            <div style={{fontSize: '64px', marginBottom: '20px'}}><ClipboardList size={64} /></div>
            <p style={{fontSize: '18px', opacity: 0.7}}>
              Aucun appel d'offres pour le moment
            </p>
            <p style={{fontSize: '14px', opacity: 0.5, marginTop: '10px'}}>
              Créez votre premier appel d'offres pour commencer
            </p>
          </div>
        )}
      </div>      {/* Détails AO sélectionné */}
      {selectedAO && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h3>📄 Détails: {selectedAO.titre}</h3>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              {selectedAO.statut === 'accepté' && (
                <button 
                  className="btn-primary" 
                  onClick={() => handleCreerDevis(selectedAO)}
                  style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
                >
                  <FileText size={16} /> Créer devis
                </button>
              )}
              <button 
                className="btn-primary" 
                onClick={() => handleVoirReference(selectedAO)}
                style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}
              >
                🏛️ Voir références
              </button>
              {selectedAO.missionsSelectionnees && selectedAO.missionsSelectionnees.length > 0 && (
                <button 
                  className="btn-primary" 
                  onClick={() => setShowRessourcesModal(true)}
                  style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
                >
                  <BarChart3 size={16} /> Voir ressources ({selectedAO.missionsSelectionnees.length} missions)
                </button>
              )}
              <button className="btn-secondary" onClick={() => setSelectedAO(null)}>Fermer</button>
            </div>
          </div>
          
          {/* Informations principales */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px'}}>
            <div style={{wordWrap: 'break-word'}}><strong>Client:</strong> {selectedAO.client}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Statut:</strong> <span style={{color: getStatusColor(selectedAO.statut), fontWeight: 600}}>{selectedAO.statut}</span></div>
            <div style={{wordWrap: 'break-word'}}><strong>Domaine:</strong> {selectedAO.domaine || '-'}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Type:</strong> {selectedAO.type || '-'}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Montant honoraires:</strong> {formatMontant(selectedAO.montant)}</div>
            <div style={{wordWrap: 'break-word'}}><strong>Date rendu:</strong> {new Date(selectedAO.dateRendu).toLocaleDateString('fr-FR')}</div>
            <div><strong>Durée prévisionnelle:</strong> {selectedAO.dureePrevisionnelle || '-'}</div>
            <div><strong>Délai remise:</strong> {selectedAO.delai || '-'}</div>
          </div>

          {/* Partenaires BET - Cliquable */}
          {selectedAO.partenaires && selectedAO.partenaires.length > 0 && (
            <div style={{marginBottom: '20px'}}>
              <h4 style={{marginBottom: '10px', fontSize: '15px'}}>🤝 Répartition par partenaire</h4>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Domaine</th>
                      <th>%</th>
                      <th>Montant</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAO.partenaires.map((partenaire, i) => (
                      <tr 
                        key={i}
                        style={{cursor: partenaire.betId ? 'pointer' : 'default'}}
                        onClick={() => {
                          if (partenaire.betId) {
                            if (window.showToast) {
                              window.showToast(`🔗 Lien vers BET: ${partenaire.nom}`, 'info');
                            }
                            // TODO: Naviguer vers la page BET avec filtre sur ce BET
                          }
                        }}
                      >
                        <td style={{fontWeight: partenaire.betId ? 'bold' : 'normal'}}>
                          {partenaire.nom}
                          {partenaire.betId && <span style={{marginLeft: '5px', fontSize: '11px', opacity: 0.7}}>🔗</span>}
                        </td>
                        <td>{partenaire.domaine}</td>
                        <td>{partenaire.pourcentage}%</td>
                        <td>{formatMontant(partenaire.montant)}</td>
                        <td>
                          {partenaire.email && (
                            <a 
                              href={`mailto:${partenaire.email}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{color: 'var(--brand)', textDecoration: 'none', marginRight: '8px'}}
                            >
                              ✉️
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{fontWeight: 'bold', background: 'rgba(168, 85, 247, 0.1)'}}>
                      <td colSpan="2">Total</td>
                      <td>{selectedAO.partenaires.reduce((sum, p) => sum + (p.pourcentage || 0), 0).toFixed(1)}%</td>
                      <td>{formatMontant(selectedAO.partenaires.reduce((sum, p) => sum + (p.montant || 0), 0))}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Texte légal */}
          {selectedAO.texteLegal && (
            <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
              <h4 style={{marginBottom: '10px', fontSize: '15px'}}>📄 Texte légal d'appel d'offre</h4>
              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                fontSize: '13px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {selectedAO.texteLegal}
              </div>
            </div>
          )}

          {/* Contacts */}
          {(selectedAO.contactsInternes?.length > 0 || selectedAO.contactsClients?.length > 0) && (
            <div style={{marginBottom: '20px'}}>
              <h4 style={{marginBottom: '10px', fontSize: '15px'}}><Users size={16} /> Contacts</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                {selectedAO.contactsInternes?.length > 0 && (
                  <div>
                    <h5 style={{marginBottom: '8px', fontSize: '13px', opacity: 0.8}}>Effectif interne</h5>
                    {selectedAO.contactsInternes.map((contact, i) => (
                      <div key={i} style={{
                        padding: '10px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        <div style={{fontWeight: 'bold', fontSize: '13px'}}>{contact.nom}</div>
                        <div style={{fontSize: '11px', opacity: 0.7}}>{contact.role}</div>
                        {contact.tel && (
                          <div style={{fontSize: '11px', opacity: 0.7}}>📞 {contact.tel}</div>
                        )}
                        {contact.email && (
                          <a 
                            href={`mailto:${contact.email}`}
                            style={{fontSize: '11px', color: 'var(--brand)', textDecoration: 'none'}}
                          >
                            ✉️ {contact.email}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {selectedAO.contactsClients?.length > 0 && (
                  <div>
                    <h5 style={{marginBottom: '8px', fontSize: '13px', opacity: 0.8}}>Contacts clients</h5>
                    {selectedAO.contactsClients.map((contact, i) => (
                      <div key={i} style={{
                        padding: '10px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        <div style={{fontWeight: 'bold', fontSize: '13px'}}>{contact.nom}</div>
                        <div style={{fontSize: '11px', opacity: 0.7}}>{contact.role}</div>
                        {contact.tel && (
                          <div style={{fontSize: '11px', opacity: 0.7}}>📞 {contact.tel}</div>
                        )}
                        {contact.email && (
                          <a 
                            href={`mailto:${contact.email}`}
                            style={{fontSize: '11px', color: 'var(--brand)', textDecoration: 'none'}}
                          >
                            ✉️ {contact.email}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
            {/* Contacts internes */}
            <div>
              <h4 style={{marginBottom: '10px', fontSize: 'clamp(14px, 2.5vw, 15px)'}}><Users size={16} /> Contacts internes</h4>
              {selectedAO.contactsInternes.map((contact, i) => (
                <div key={i} style={{padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginBottom: '8px', wordWrap: 'break-word'}}>
                  <div style={{fontWeight: 'bold'}}>{contact.nom}</div>
                  <div style={{fontSize: '12px', opacity: 0.7}}>{contact.role}</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>📞 {contact.tel}</div>
                  <div style={{fontSize: '12px'}}>✉️ {contact.email}</div>
                </div>
              ))}
            </div>

            {/* Contacts clients */}
            <div>
              <h4 style={{marginBottom: '10px', fontSize: '15px'}}><Building2 size={16} /> Contacts clients</h4>
              {selectedAO.contactsClients.map((contact, i) => (
                <div key={i} style={{padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginBottom: '8px'}}>
                  <div style={{fontWeight: 'bold'}}>{contact.nom}</div>
                  <div style={{fontSize: '12px', opacity: 0.7}}>{contact.role}</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>📞 {contact.tel}</div>
                  <div style={{fontSize: '12px'}}>✉️ {contact.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tranches */}
          {selectedAO.tranches.length > 0 && (
            <div style={{marginTop: '20px'}}>
              <h4 style={{marginBottom: '10px', fontSize: '15px'}}><ClipboardList size={16} /> Tranches du projet</h4>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tranche</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Délai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAO.tranches.map(tranche => (
                      <tr key={tranche.num}>
                        <td>Tranche {tranche.num}</td>
                      <td>{tranche.description}</td>
                      <td>{tranche.montant.toLocaleString('fr-FR')} €</td>
                      <td>{tranche.delai} jours</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents légaux */}
          <div style={{marginTop: '20px'}}>
            <h4 style={{marginBottom: '10px', fontSize: '15px'}}><FolderOpen size={16} /> Documents légaux</h4>
            {selectedAO.documentsLegaux && selectedAO.documentsLegaux.length > 0 ? (
              <div style={{display: 'grid', gap: '10px'}}>
                {selectedAO.documentsLegaux.map((doc, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <span style={{fontSize: '24px'}}>
                        {doc.type === 'DPGF' ? <BarChart3 size={16} /> : doc.type === 'CCTP' ? <ClipboardList size={16} /> : <Ruler size={16} />}
                      </span>
                      <div>
                        <div style={{fontWeight: 'bold', marginBottom: '3px'}}>{doc.nom}</div>
                        <div style={{fontSize: '11px', opacity: 0.7}}>
                          {doc.type} • {doc.taille} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button className="btn-icon" title="Télécharger">⬇️</button>
                      <button className="btn-icon" title="Ouvrir">👁️</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '13px'}}>
                Aucun document légal ajouté
              </div>
            )}
          </div>

          {/* Liens marchés publics */}
          <div style={{marginTop: '20px'}}>
            <h4 style={{marginBottom: '10px', fontSize: '15px'}}>🔗 Liens marchés publics</h4>
            {selectedAO.liensMarchesPublics && selectedAO.liensMarchesPublics.length > 0 ? (
              <div style={{display: 'grid', gap: '10px'}}>
                {selectedAO.liensMarchesPublics.map((lien, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <div>
                      <div style={{fontWeight: 'bold', marginBottom: '3px'}}>{lien.plateforme}</div>
                      <a 
                        href={lien.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{fontSize: '12px', color: 'var(--brand)', textDecoration: 'underline'}}
                        onClick={(e) => e.stopPropagation()}>
                        {lien.url}
                      </a>
                      <div style={{fontSize: '11px', opacity: 0.7, marginTop: '3px'}}>
                        Statut: {lien.statut}
                      </div>
                    </div>
                    <button className="btn-icon" title="Ouvrir dans un nouvel onglet" onClick={(e) => {
                      e.stopPropagation();
                      window.open(lien.url, '_blank');
                    }}>
                      🔗
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '13px'}}>
                Aucun lien marché public ajouté
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Ressources suggérées */}
      {showRessourcesModal && selectedAO && selectedAO.missionsSelectionnees && (
        <div className="modal-overlay" onClick={() => setShowRessourcesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0}}><BarChart3 size={16} /> Ressources pour: {selectedAO.titre}</h2>
              <button className="btn-secondary" onClick={() => setShowRessourcesModal(false)}>✕</button>
            </div>

            <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px'}}>
              <div style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>
                <ClipboardList size={16} /> {selectedAO.missionsSelectionnees.length} mission{selectedAO.missionsSelectionnees.length > 1 ? 's' : ''} requise{selectedAO.missionsSelectionnees.length > 1 ? 's' : ''}
              </div>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {selectedAO.missionsSelectionnees.map(code => (
                  <span key={code} style={{
                    padding: '4px 12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Analyse pour chaque mission */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {selectedAO.missionsSelectionnees.map(code => {
                const missionRef = missionsCompetencesRef[code];
                if (!missionRef) return null;

                const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);

                return (
                  <div key={code} style={{
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    border: '2px solid rgba(124, 58, 237, 0.3)'
                  }}>
                    {/* En-tête mission */}
                    <div style={{marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                      <h3 style={{margin: '0 0 8px 0', color: '#a78bfa'}}>{missionRef.nom}</h3>
                      <div style={{display: 'flex', gap: '15px', fontSize: '13px', opacity: 0.8}}>
                        <span>📅 Phase: {missionRef.phasePrincipale}</span>
                        <span>⏱️ Durée: {missionRef.dureeTypique}</span>
                      </div>
                    </div>

                    {/* Compétences requises */}
                    <div style={{marginBottom: '15px'}}>
                      <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '14px'}}>💼 Compétences requises:</div>
                      <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                        {missionRef.competencesRequises.map((comp, i) => (
                          <span key={i} style={{
                            padding: '4px 10px',
                            background: 'rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fonctions liées */}
                    {missionRef.fonctionsLiees && missionRef.fonctionsLiees.length > 0 && (
                      <div style={{marginBottom: '15px'}}>
                        <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '14px'}}><Users size={16} /> Fonctions liées:</div>
                        <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                          {missionRef.fonctionsLiees.map((fonc, i) => (
                            <span key={i} style={{
                              padding: '4px 10px',
                              background: 'rgba(16, 185, 129, 0.3)',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}>
                              {fonc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Équipe suggérée */}
                    <div style={{marginBottom: '15px'}}>
                      <div style={{fontWeight: 'bold', marginBottom: '10px', fontSize: '14px', color: '#10b981'}}>
                        ✅ Équipe suggérée ({matching.equipe.length}):
                      </div>
                      {matching.equipe.length > 0 ? (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px'}}>
                          {matching.equipe.map(membre => (
                            <div key={membre.id} style={{
                              padding: '12px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              borderRadius: '8px',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{membre.nom}</div>
                              <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '6px'}}>{membre.role}</div>
                              <div style={{fontSize: '11px', marginBottom: '2px'}}>📞 {membre.tel}</div>
                              <div style={{fontSize: '11px', marginBottom: '8px'}}>✉️ {membre.email}</div>
                              {membre.competences && membre.competences.length > 0 && (
                                <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px'}}>
                                  {membre.competences.map((comp, i) => (
                                    <span key={i} style={{
                                      padding: '2px 6px',
                                      background: 'rgba(16, 185, 129, 0.2)',
                                      borderRadius: '6px',
                                      fontSize: '10px',
                                      opacity: 0.9
                                    }}>
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '13px', color: '#f87171'}}>
                          ⚠️ Aucun membre de l'équipe disponible ne correspond aux compétences requises
                        </div>
                      )}
                    </div>

                    {/* BET requis */}
                    {missionRef.betRequis && missionRef.betRequis.length > 0 && (
                      <div style={{marginBottom: '15px'}}>
                        <div style={{fontWeight: 'bold', marginBottom: '10px', fontSize: '14px', color: '#a78bfa'}}>
                          <Building2 size={16} /> BET requis ({matching.bet.length}/{missionRef.betRequis.length}):
                        </div>
                        {matching.bet.length > 0 ? (
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px'}}>
                            {matching.bet.map(bet => (
                              <div key={bet.id} style={{
                                padding: '12px',
                                background: 'rgba(124, 58, 237, 0.15)',
                                borderRadius: '8px',
                                border: '1px solid rgba(124, 58, 237, 0.3)'
                              }}>
                                <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{bet.nom}</div>
                                <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '6px'}}>{bet.type}</div>
                                <div style={{fontSize: '11px', marginBottom: '2px'}}>👤 {bet.contact}</div>
                                <div style={{fontSize: '11px', marginBottom: '2px'}}>📞 {bet.tel}</div>
                                <div style={{fontSize: '11px', marginBottom: '8px'}}>✉️ {bet.email}</div>
                                {bet.competences && bet.competences.length > 0 && (
                                  <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px'}}>
                                    {bet.competences.map((comp, i) => (
                                      <span key={i} style={{
                                        padding: '2px 6px',
                                        background: 'rgba(124, 58, 237, 0.2)',
                                        borderRadius: '6px',
                                        fontSize: '10px',
                                        opacity: 0.9
                                      }}>
                                        {comp}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px'}}>
                            <div style={{fontSize: '13px', color: '#f87171', marginBottom: '6px'}}>
                              ⚠️ BET manquant{missionRef.betRequis.length > 1 ? 's' : ''} pour cette mission:
                            </div>
                            <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                              {missionRef.betRequis.map((type, i) => (
                                <span key={i} style={{
                                  padding: '4px 10px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 600
                                }}>
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Compétences manquantes */}
                    {matching.competencesManquantes && matching.competencesManquantes.length > 0 && (
                      <div style={{
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', color: '#f87171'}}>
                          ⚠️ Compétences manquantes:
                        </div>
                        <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                          {matching.competencesManquantes.map((comp, i) => (
                            <span key={i} style={{
                              padding: '4px 10px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}>
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Résumé global */}
            <div style={{marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px'}}>
              <div style={{fontWeight: 'bold', marginBottom: '10px'}}><BarChart3 size={16} /> Résumé global:</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
                    {equipeMembres.filter(m => 
                      selectedAO.missionsSelectionnees.some(code => {
                        const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                        return matching.equipe.some(e => e.id === m.id);
                      })
                    ).length}
                  </div>
                  <div style={{fontSize: '12px', opacity: 0.7}}>Membres d'équipe nécessaires</div>
                </div>
                <div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#a78bfa'}}>
                    {betDisponibles.filter(b => 
                      selectedAO.missionsSelectionnees.some(code => {
                        const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                        return matching.bet.some(bet => bet.id === b.id);
                      })
                    ).length}
                  </div>
                  <div style={{fontSize: '12px', opacity: 0.7}}>BET requis</div>
                </div>
                <div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f87171'}}>
                    {selectedAO.missionsSelectionnees.reduce((total, code) => {
                      const matching = matchEquipeToMission(code, equipeMembres, betDisponibles);
                      return total + (matching.competencesManquantes?.length || 0);
                    }, 0)}
                  </div>
                  <div style={{fontSize: '12px', opacity: 0.7}}>Compétences manquantes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
        <div className="card" style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>🆕</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#3b82f6'}}>{tenders.filter(t => t.statut === 'Nouveau').length}</div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Nouveaux AO</div>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>⏳</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#f97316'}}>{tenders.filter(t => t.statut === 'En cours').length}</div>
          <div style={{fontSize: '13px', opacity: 0.7}}>En cours</div>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}><Euro size={32} /></div>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#10b981'}}>
            {(tenders.reduce((sum, t) => sum + t.montant, 0) / 1000000).toFixed(1)}M€
          </div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Montant total          </div>
        </div>
      </div>

      {/* Modal Analyse Post-Mortem */}
      {showAnalysePostMortem && aoPourAnalyse && (
        <AnalysePostMortem
          ao={aoPourAnalyse}
          onSave={async (analyseData) => {
            try {
              await AOPerdusAPI.marquerPerdu(aoPourAnalyse.id, analyseData);
              if (window.showToast) {
                window.showToast('✅ AO marqué comme perdu avec analyse', 'success');
              }
              // Recharger les données
              setShowAnalysePostMortem(false);
              setAoPourAnalyse(null);
              // TODO: Recharger la liste des AO
            } catch (error) {
              console.error('Erreur marquage AO perdu:', error);
              if (window.showToast) {
                window.showToast('❌ Erreur lors du marquage', 'error');
              }
            }
          }}
          onCancel={() => {
            setShowAnalysePostMortem(false);
            setAoPourAnalyse(null);
          }}
        />
      )}

      {/* Assistant AO */}
      {showAssistantAO && (
        <AssistantAO
          onComplete={(data) => {
            // TODO: Créer l'AO avec toutes les données
            console.log('Assistant terminé:', data);
            setShowAssistantAO(false);
            if (window.showToast) {
              window.showToast('✅ AO créé avec succès via l\'assistant', 'success');
            }
            // Recharger la liste
          }}
          onCancel={() => setShowAssistantAO(false)}
        />
      )}
    </div>
  );
}