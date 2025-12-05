/**
 * Hook custom pour la gestion des appels d'offres
 * Centralise toute la logique métier et l'état des AO
 */

import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { usePlan } from '../context/PlanContext';
import { defaultAOs } from '../data/defaultData';

// État initial d'un nouvel AO
const EMPTY_AO = {
  titre: '',
  domaine: 'Logements',
  type: 'Logements collectifs',
  client: '',
  montant: 0,
  dureePrevisionnelle: '',
  delai: '',
  statut: 'Nouveau',
  dateRendu: '',
  vignette: '',
  photos: [],
  tranches: [],
  partenaires: [],
  contactsInternes: [],
  contactsClients: [],
  relances: [],
  documentsLegaux: [],
  liensMarchesPublics: [],
  missionsSelectionnees: [],
  montantTravauxPrevisionnel: 0,
  texteLegal: ''
};

// Mapping domaine -> types
export const DOMAINE_TYPES = {
  'Logements': ['Logements collectifs', 'Maisons individuelles', 'Résidence étudiante', 'Logements sociaux'],
  'Équipements publics': ['Équipement culturel', 'Équipement sportif', 'Équipement scolaire', 'Mairie/Administration'],
  'Commerce': ['Centre commercial', 'Commerce de proximité', 'Hôtel/Restaurant'],
  'Bureaux': ['Bureaux neufs', 'Réhabilitation bureaux', 'Co-working'],
  'Industrie': ['Bâtiment industriel', 'Entrepôt/Logistique'],
  'Santé': ['Hôpital', 'Clinique', 'EHPAD'],
  'Autre': ['Mixte', 'Spécifique']
};

export function useTenders() {
  // État principal
  const [aos, setAOs] = useLocalStorage('wiw-tenders', defaultAOs);
  const [filterStatut, setFilterStatut] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAO, setSelectedAO] = useState(null);
  const [editingAO, setEditingAO] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Plan et limites
  const { canAdd, getPlanInfo } = usePlan();
  const planInfo = getPlanInfo();
  const isAtLimit = planInfo.maxAO !== null && aos.length >= planInfo.maxAO;

  // Filtrage des AO
  const filteredAOs = useMemo(() => {
    return aos.filter(ao => {
      const matchStatut = filterStatut === 'tous' || ao.statut === filterStatut;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        ao.titre?.toLowerCase().includes(query) ||
        ao.client?.toLowerCase().includes(query) ||
        ao.domaine?.toLowerCase().includes(query) ||
        ao.type?.toLowerCase().includes(query);
      return matchStatut && matchSearch;
    });
  }, [aos, filterStatut, searchQuery]);

  // Statistiques par statut
  const stats = useMemo(() => ({
    total: aos.length,
    nouveau: aos.filter(ao => ao.statut === 'Nouveau').length,
    enCours: aos.filter(ao => ao.statut === 'En cours').length,
    enNegociation: aos.filter(ao => ao.statut === 'En négociation').length,
    gagne: aos.filter(ao => ao.statut === 'Gagné').length,
    perdu: aos.filter(ao => ao.statut === 'Perdu').length
  }), [aos]);

  // Créer un nouvel AO
  const createAO = useCallback(() => {
    if (!canAdd('AO', aos.length)) {
      if (window.showToast) {
        window.showToast(`Limite atteinte: ${planInfo.maxAO} AO max pour le plan ${planInfo.nom}`, 'warning');
      }
      return false;
    }
    setIsCreating(true);
    setEditingAO({ ...EMPTY_AO });
    return true;
  }, [aos.length, canAdd, planInfo]);

  // Éditer un AO existant
  const editAO = useCallback((ao) => {
    setIsCreating(false);
    setEditingAO({ ...ao });
    setSelectedAO(null);
  }, []);

  // Sauvegarder un AO (création ou mise à jour)
  const saveAO = useCallback((aoData) => {
    if (!aoData.titre?.trim()) {
      if (window.showToast) {
        window.showToast('Le titre est obligatoire', 'error');
      }
      return false;
    }

    if (isCreating) {
      const newAO = {
        ...aoData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setAOs(prev => [...prev, newAO]);
      if (window.showToast) {
        window.showToast('Appel d\'offres créé avec succès', 'success');
      }
    } else {
      setAOs(prev => prev.map(ao =>
        ao.id === aoData.id ? { ...aoData, updatedAt: new Date().toISOString() } : ao
      ));
      if (window.showToast) {
        window.showToast('Appel d\'offres modifié avec succès', 'success');
      }
    }

    setEditingAO(null);
    setIsCreating(false);
    return true;
  }, [isCreating, setAOs]);

  // Supprimer un AO
  const deleteAO = useCallback((aoId) => {
    setAOs(prev => prev.filter(ao => ao.id !== aoId));
    setSelectedAO(null);
    if (window.showToast) {
      window.showToast('Appel d\'offres supprimé', 'success');
    }
  }, [setAOs]);

  // Annuler l'édition
  const cancelEdit = useCallback(() => {
    setEditingAO(null);
    setIsCreating(false);
  }, []);

  // Mettre à jour un champ de l'AO en cours d'édition
  const updateEditingField = useCallback((field, value) => {
    setEditingAO(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Mettre à jour le domaine (et réinitialiser le type)
  const updateDomaine = useCallback((domaine) => {
    const firstType = DOMAINE_TYPES[domaine]?.[0] || '';
    setEditingAO(prev => prev ? { ...prev, domaine, type: firstType } : null);
  }, []);

  // Gestion des photos
  const addPhoto = useCallback((aoId, photoData) => {
    const newPhoto = {
      id: Date.now() + Math.random(),
      ...photoData,
      date: new Date().toISOString()
    };

    if (editingAO?.id === aoId || (!editingAO?.id && aoId === 'new')) {
      setEditingAO(prev => ({
        ...prev,
        photos: [...(prev?.photos || []), newPhoto]
      }));
    }

    if (aoId !== 'new') {
      setAOs(prev => prev.map(ao =>
        ao.id === aoId ? { ...ao, photos: [...(ao.photos || []), newPhoto] } : ao
      ));
    }
  }, [editingAO, setAOs]);

  const deletePhoto = useCallback((aoId, photoId) => {
    if (editingAO?.id === aoId || (!editingAO?.id && aoId === 'new')) {
      setEditingAO(prev => ({
        ...prev,
        photos: (prev?.photos || []).filter(p => p.id !== photoId)
      }));
    }

    if (aoId !== 'new') {
      setAOs(prev => prev.map(ao =>
        ao.id === aoId ? { ...ao, photos: (ao.photos || []).filter(p => p.id !== photoId) } : ao
      ));
    }
  }, [editingAO, setAOs]);

  const setVignette = useCallback((aoId, photoData) => {
    if (editingAO?.id === aoId || (!editingAO?.id && aoId === 'new')) {
      setEditingAO(prev => ({ ...prev, vignette: photoData }));
    }

    if (aoId !== 'new') {
      setAOs(prev => prev.map(ao =>
        ao.id === aoId ? { ...ao, vignette: photoData } : ao
      ));
    }
  }, [editingAO, setAOs]);

  // Gestion des tranches
  const addTranche = useCallback(() => {
    if (!editingAO) return;
    const newTranche = {
      num: (editingAO.tranches?.length || 0) + 1,
      description: '',
      montant: 0,
      delai: 0,
      phase: `Phase ${(editingAO.tranches?.length || 0) + 1}`
    };
    setEditingAO(prev => ({
      ...prev,
      tranches: [...(prev?.tranches || []), newTranche]
    }));
  }, [editingAO]);

  const updateTranche = useCallback((index, field, value) => {
    setEditingAO(prev => {
      if (!prev) return null;
      const tranches = [...(prev.tranches || [])];
      tranches[index] = { ...tranches[index], [field]: value };
      return { ...prev, tranches };
    });
  }, []);

  const deleteTranche = useCallback((index) => {
    setEditingAO(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tranches: prev.tranches.filter((_, i) => i !== index)
      };
    });
  }, []);

  // Gestion des partenaires
  const addPartenaire = useCallback((partenaireData) => {
    if (!editingAO) return;
    setEditingAO(prev => ({
      ...prev,
      partenaires: [...(prev?.partenaires || []), partenaireData]
    }));
  }, [editingAO]);

  const updatePartenaire = useCallback((index, field, value) => {
    setEditingAO(prev => {
      if (!prev) return null;
      const partenaires = [...(prev.partenaires || [])];
      partenaires[index] = { ...partenaires[index], [field]: value };

      // Recalculer le montant si pourcentage change
      if (field === 'pourcentage') {
        partenaires[index].montant = (prev.montant * value) / 100;
      }

      return { ...prev, partenaires };
    });
  }, []);

  const deletePartenaire = useCallback((index) => {
    setEditingAO(prev => {
      if (!prev) return null;
      return {
        ...prev,
        partenaires: prev.partenaires.filter((_, i) => i !== index)
      };
    });
  }, []);

  // Gestion des contacts
  const addContact = useCallback((type, contactData) => {
    if (!editingAO) return;
    const field = type === 'interne' ? 'contactsInternes' : 'contactsClients';
    setEditingAO(prev => ({
      ...prev,
      [field]: [...(prev?.[field] || []), contactData]
    }));
  }, [editingAO]);

  const deleteContact = useCallback((type, index) => {
    if (!editingAO) return;
    const field = type === 'interne' ? 'contactsInternes' : 'contactsClients';
    setEditingAO(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, [editingAO]);

  // Gestion des documents légaux
  const addDocument = useCallback((docData) => {
    if (!editingAO) return;
    setEditingAO(prev => ({
      ...prev,
      documentsLegaux: [...(prev?.documentsLegaux || []), docData]
    }));
  }, [editingAO]);

  const deleteDocument = useCallback((docNom) => {
    if (!editingAO) return;
    setEditingAO(prev => ({
      ...prev,
      documentsLegaux: prev.documentsLegaux.filter(d => d.nom !== docNom)
    }));
  }, [editingAO]);

  // Gestion des liens marchés publics
  const addLienMarche = useCallback((lienData) => {
    if (!editingAO) return;
    setEditingAO(prev => ({
      ...prev,
      liensMarchesPublics: [...(prev?.liensMarchesPublics || []), lienData]
    }));
  }, [editingAO]);

  const deleteLienMarche = useCallback((url) => {
    if (!editingAO) return;
    setEditingAO(prev => ({
      ...prev,
      liensMarchesPublics: prev.liensMarchesPublics.filter(l => l.url !== url)
    }));
  }, [editingAO]);

  // Toggle missions sélectionnées
  const toggleMission = useCallback((missionCode) => {
    if (!editingAO) return;
    setEditingAO(prev => {
      const current = prev?.missionsSelectionnees || [];
      const updated = current.includes(missionCode)
        ? current.filter(m => m !== missionCode)
        : [...current, missionCode];
      return { ...prev, missionsSelectionnees: updated };
    });
  }, [editingAO]);

  return {
    // État
    aos,
    filteredAOs,
    selectedAO,
    editingAO,
    isCreating,
    filterStatut,
    searchQuery,
    stats,
    planInfo,
    isAtLimit,

    // Setters
    setSelectedAO,
    setFilterStatut,
    setSearchQuery,

    // Actions CRUD
    createAO,
    editAO,
    saveAO,
    deleteAO,
    cancelEdit,
    updateEditingField,
    updateDomaine,

    // Photos
    addPhoto,
    deletePhoto,
    setVignette,

    // Tranches
    addTranche,
    updateTranche,
    deleteTranche,

    // Partenaires
    addPartenaire,
    updatePartenaire,
    deletePartenaire,

    // Contacts
    addContact,
    deleteContact,

    // Documents
    addDocument,
    deleteDocument,

    // Liens marchés
    addLienMarche,
    deleteLienMarche,

    // Missions
    toggleMission
  };
}

export default useTenders;
