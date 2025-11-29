import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import InheritanceHelper from '../components/InheritanceHelper';
import ValidationAlerts from '../components/ValidationAlerts';
import InheritanceAPI from '../services/inheritance.api';
import ValidationAPI from '../services/validation.api';
import { authService } from '../services/auth.api';
import { useListesDeroulantes } from '../hooks/useListesDeroulantes';
import { Search, BarChart3, FileText, Lightbulb, Settings, ClipboardList, Users, Edit } from 'lucide-react';
import { formatMontant } from '../utils/formatNumber';
import FinancialProtection from '../components/FinancialProtection';

export default function MissionsConseil({ onNavigate }) {
  const [missions, setMissions] = useLocalStorage('wiw-missions-conseil', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showComparatif, setShowComparatif] = useState(null);

  // Fonctions de navigation
  const handleGererEquipe = () => {
    if (onNavigate) {
      onNavigate('team');
    }
  };

  const handleConsulterBET = () => {
    if (onNavigate) {
      onNavigate('bet');
    }
  };
  
  // Liste des 10 types de missions
  const typesMissions = [
    { value: 'MOE', label: '1 - MOE (Maîtrise d\'œuvre)', icon: '🏗️' },
    { value: 'AMO', label: '2 - AMO (Assistance Maîtrise d\'Ouvrage)', icon: '🤝' },
    { value: 'FAISABILITE', label: '3 - Étude de Faisabilité', icon: 'Search' },
    { value: 'PREALABLE', label: '4 - Étude préalable', icon: 'BarChart3' },
    { value: 'PROG', label: '5 - PROG (Programme)', icon: 'FileText' },
    { value: 'CONSEIL', label: '6 - Conseil', icon: 'Lightbulb' },
    { value: 'EXPERTISE', label: '7 - Expertise', icon: '🎓' },
    { value: 'AUDIT', label: '8 - Audit Technique et Financier', icon: '🔎' },
    { value: 'OPC', label: '9 - OPC (Ordonnancement, Pilotage, Coordination)', icon: 'Settings' },
    { value: 'SPS', label: '10 - SPS (Sécurité Protection Santé)', icon: '🦺' }
  ];

  const [formData, setFormData] = useState({
    numero: '',
    date: new Date().toISOString().slice(0, 10),
    typeMission: '',
    elementMission: 'Base', // Base, Additionnelle, Complémentaire, Optionnelle
    intitule: '',
    client: {
      nom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: ''
    },
    moa: { // Maître d'Ouvrage (peut être différent du client)
      nom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: ''
    },
    equipe: [], // Max 2 partenaires { nom, fonction, coutHoraire }
    description: '',
    dureeEstimee: '', // en jours
    coutHoraireMoyen: 0, // Coût horaire moyen
    coutHoraireCible: 0, // Coût horaire cible
    montantTravauxHT: 0, // Montant des travaux HT (rappel depuis AO)
    honorairesPropose: 0,
    statut: 'brouillon', // brouillon, envoye, accepte, refuse, en_cours, termine
    notes: '',
    appelOffreId: null // ID de l'AO si la mission est liée
  });

  // État pour l'héritage et la validation
  const [inheritedData, setInheritedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [aoId, setAoId] = useState(null); // ID de l'AO sélectionné pour héritage
  
  // Récupérer les listes depuis l'API
  const { getListe } = useListesDeroulantes();
  const typesMission = getListe('types_mission');
  const phases = getListe('phases');
  const tranches = getListe('tranches');

  // Validation automatique
  useEffect(() => {
    const validateMission = async () => {
      if (!formData.equipe || formData.equipe.length === 0) return;

      try {
        // Valider l'équipe
        const validationEquipe = await ValidationAPI.validateEquipe(formData.equipe);
        setValidation(validationEquipe);
      } catch (error) {
        console.error('Erreur validation:', error);
      }
    };

    validateMission();
  }, [formData.equipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation équipe (max 2)
    if (formData.equipe.length > 2) {
      if (window.showToast) {
        window.showToast('⚠️ Maximum 2 partenaires autorisés', 'warning');
      } else {
        alert('⚠️ Maximum 2 partenaires autorisés pour WIW Dev+');
      }
      return;
    }

    if (!formData.numero || !formData.typeMission || !formData.intitule) {
      if (window.showToast) {
        window.showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'warning');
      } else {
        alert('⚠️ Veuillez remplir les champs obligatoires');
      }
      return;
    }

    // Si un AO est lié, créer la mission avec héritage
    if (formData.appelOffreId && !editingId) {
      try {
        await InheritanceAPI.createMissionWithInheritance(formData.appelOffreId, {
          designation: formData.intitule,
          typeMission: formData.typeMission,
          description: formData.description,
          equipe: JSON.stringify(formData.equipe),
          notes: formData.notes
        });
        if (window.showToast) {
          window.showToast('✅ Mission créée avec héritage automatique', 'success');
        }
      } catch (error) {
        console.error('Erreur création mission avec héritage:', error);
        if (window.showToast) {
          window.showToast('⚠️ Erreur lors de la création avec héritage, création normale...', 'warning');
        }
      }
    }
    
    if (editingId) {
      setMissions(missions.map(m => 
        m.id === editingId ? { ...formData, id: editingId } : m
      ));
      if (window.showToast) {
        window.showToast('✅ Mission modifiée', 'success');
      }
    } else {
      const nouvelleMission = {
        ...formData,
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      setMissions([...missions, nouvelleMission]);
      if (window.showToast) {
        window.showToast('✅ Mission créée', 'success');
      }
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      date: new Date().toISOString().slice(0, 10),
      typeMission: '',
      elementMission: 'Base',
      intitule: '',
      client: {
        nom: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: '',
        email: ''
      },
      moa: {
        nom: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: '',
        email: ''
      },
      equipe: [],
      description: '',
      dureeEstimee: '',
      coutHoraireMoyen: 0,
      coutHoraireCible: 0,
      montantTravauxHT: 0,
      honorairesPropose: 0,
      statut: 'brouillon',
      notes: '',
      appelOffreId: null,
      criteresPartenaires: {
        competences: '',
        experienceMin: 0,
        certifications: '',
        budgetMax: 0
      }
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (mission) => {
    setFormData(mission);
    setEditingId(mission.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      setMissions(missions.filter(m => m.id !== id));
      if (window.showToast) {
        window.showToast('✅ Mission supprimée', 'success');
      }
    }
  };

  const handleDuplicate = (mission) => {
    const copie = {
      ...mission,
      id: Date.now(),
      numero: `${mission.numero}-COPIE`,
      statut: 'brouillon',
      dateCreation: new Date().toISOString()
    };
    setMissions([...missions, copie]);
    if (window.showToast) {
      window.showToast('✅ Mission dupliquée', 'success');
    }
  };

  // Export Excel
  const handleExportExcel = (mission) => {
    try {
      // Créer le contenu Excel (format TSV pour compatibilité)
      const rows = [
        ['MISSION CONSEIL - EXPORT EXCEL'],
        [''],
        ['Informations générales'],
        ['N° Mission', mission.numero],
        ['Date', new Date(mission.date).toLocaleDateString('fr-FR')],
        ['Type', typesMissions.find(t => t.value === mission.typeMission)?.label || mission.typeMission],
        ['Élément', mission.elementMission || 'Base'],
        ['Intitulé', mission.intitule],
        ['Statut', getStatutLabel(mission.statut)],
        [''],
        ['Client'],
        ['Nom', mission.client.nom],
        ['Adresse', mission.client.adresse],
        ['Code postal', mission.client.codePostal],
        ['Ville', mission.client.ville],
        ['Téléphone', mission.client.telephone],
        ['Email', mission.client.email],
        [''],
        ['Maître d\'Ouvrage (MOA)'],
        ['Nom', mission.moa?.nom || ''],
        ['Adresse', mission.moa?.adresse || ''],
        ['Code postal', mission.moa?.codePostal || ''],
        ['Ville', mission.moa?.ville || ''],
        ['Téléphone', mission.moa?.telephone || ''],
        ['Email', mission.moa?.email || ''],
        [''],
        ['Coûts & Montants'],
        ['Coût horaire moyen', `${mission.coutHoraireMoyen || 0} €/h`],
        ['Coût horaire cible', `${mission.coutHoraireCible || 0} €/h`],
        ['Montant travaux HT', `${mission.montantTravauxHT || 0} €`],
        ['Durée estimée', `${mission.dureeEstimee || 0} jours`],
        ['Honoraires proposés', `${mission.honorairesPropose || 0} € HT`],
        ['Total honoraires', formatMontant(calculerTotalHonoraires(mission), 2) + ' HT'],
        [''],
        ['Équipe'],
      ];

      // Ajouter les partenaires
      if (mission.equipe && mission.equipe.length > 0) {
        rows.push(['Nom', 'Fonction', 'Coût horaire', 'Total estimé']);
        mission.equipe.forEach(p => {
          const { useFinancialAccess } = require('../components/FinancialProtection');
          const { canViewCoutHoraires } = useFinancialAccess();
          rows.push([
            p.nom,
            p.fonction,
            canViewCoutHoraires ? `${p.coutHoraire} €/h` : '***',
            canViewCoutHoraires ? formatMontant(p.coutHoraire * (mission.dureeEstimee || 0) * 8, 2) : '***'
          ]);
        });
      } else {
        rows.push(['Aucun partenaire']);
      }

      rows.push(['']);
      rows.push(['Description', mission.description || '']);
      rows.push(['']);
      rows.push(['Notes', mission.notes || '']);

      // Convertir en TSV (tab-separated values)
      const tsvContent = rows.map(row => row.join('\t')).join('\n');
      
      // Créer le blob et télécharger
      const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mission_${mission.numero}_${mission.client.nom.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (window.showToast) {
        window.showToast('✅ Export Excel généré avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur export Excel:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la génération Excel', 'error');
      }
    }
  };

  const handleExportPDF = (mission) => {
    try {
      const doc = new jsPDF();
      
      // En-tête entreprise
      doc.setFontSize(20);
      doc.setTextColor(124, 58, 237);
      doc.text('WIW Dev+', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Missions Conseil & Développement', 20, 28);
      doc.text('123 Avenue de l\'Architecture, 75016 Paris', 20, 33);
      doc.text('contact@wiw-app.com | +33 1 23 45 67 89', 20, 38);
      
      // Titre MISSION
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('MISSION CONSEIL', 140, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`N° ${mission.numero}`, 140, 32);
      doc.text(`Date: ${new Date(mission.date).toLocaleDateString('fr-FR')}`, 140, 37);
      
      const typeMission = typesMissions.find(t => t.value === mission.typeMission);
      doc.text(`Type: ${typeMission ? typeMission.label : mission.typeMission}`, 140, 42);
      
      // Informations client
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('CLIENT', 20, 55);
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      let yPos = 62;
      doc.text(mission.client.nom, 20, yPos);
      if (mission.client.adresse) {
        yPos += 5;
        doc.text(mission.client.adresse, 20, yPos);
      }
      if (mission.client.codePostal || mission.client.ville) {
        yPos += 5;
        doc.text(`${mission.client.codePostal} ${mission.client.ville}`, 20, yPos);
      }
      if (mission.client.telephone) {
        yPos += 5;
        doc.text(`Tel: ${mission.client.telephone}`, 20, yPos);
      }
      if (mission.client.email) {
        yPos += 5;
        doc.text(`Email: ${mission.client.email}`, 20, yPos);
      }
      
      // Intitulé de la mission
      yPos += 15;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('INTITULE DE LA MISSION', 20, yPos);
      
      yPos += 7;
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const intituleLines = doc.splitTextToSize(mission.intitule, 170);
      doc.text(intituleLines, 20, yPos);
      yPos += intituleLines.length * 5 + 10;
      
      // Description
      if (mission.description) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('DESCRIPTION', 20, yPos);
        
        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const descriptionLines = doc.splitTextToSize(mission.description, 170);
        doc.text(descriptionLines, 20, yPos);
        yPos += descriptionLines.length * 5 + 10;
      }
      
      // Équipe (si présente)
      if (mission.equipe && mission.equipe.length > 0) {
        // Nouvelle page si nécessaire
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('EQUIPE PROJET', 20, yPos);
        
        yPos += 7;
        
        const equipeData = mission.equipe.map(p => [
          p.nom,
          p.fonction,
          `${p.coutHoraire} €/h`,
            formatMontant(p.coutHoraire * (mission.dureeEstimee || 0) * 8, 2)
        ]);
        
        doc.autoTable({
          startY: yPos,
          head: [['Nom', 'Fonction', 'Coût horaire', 'Total estimé']],
          body: equipeData,
          theme: 'striped',
          headStyles: { fillColor: [124, 58, 237], textColor: 255 },
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 60 },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 45, halign: 'right' }
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // Honoraires et durée
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      const honorairesEquipe = mission.equipe.reduce((sum, p) => {
        return sum + (parseFloat(p.coutHoraire) || 0) * (parseFloat(mission.dureeEstimee) || 0) * 8;
      }, 0);
      
      const totalHonoraires = honorairesEquipe + (parseFloat(mission.honorairesPropose) || 0);
      
      doc.autoTable({
        startY: yPos,
        body: [
          ['Durée estimée', `${mission.dureeEstimee || 0} jours`],
          ['Honoraires architecte/BE', formatMontant(parseFloat(mission.honorairesPropose) || 0, 2) + ' HT'],
          ['Honoraires équipe', formatMontant(honorairesEquipe, 2) + ' HT'],
          ['Total Honoraires', formatMontant(totalHonoraires, 2) + ' HT'],
          ['TVA (20%)', formatMontant(totalHonoraires * 0.2, 2)],
          ['Total TTC', formatMontant(totalHonoraires * 1.2, 2)]
        ],
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 140, halign: 'right', fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'right', fillColor: [240, 240, 240] }
        }
      });
      
      // Notes
      if (mission.notes) {
        yPos = doc.lastAutoTable.finalY + 15;
        
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Notes:', 20, yPos);
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const notesLines = doc.splitTextToSize(mission.notes, 170);
        doc.text(notesLines, 20, yPos + 5);
      }
      
      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Document généré par WIW Dev+ - Missions Conseil', 20, 285);
      
      // Sauvegarder
      const clientNom = mission.client.nom.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Mission_${mission.numero}_${clientNom}.pdf`);
      
      if (window.showToast) {
        window.showToast('✅ PDF généré avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la génération du PDF', 'error');
      }
    }
  };

  const ajouterPartenaire = () => {
    if (formData.equipe.length >= 2) {
      if (window.showToast) {
        window.showToast('⚠️ Maximum 2 partenaires autorisés', 'warning');
      } else {
        alert('⚠️ Maximum 2 partenaires autorisés pour WIW Dev+');
      }
      return;
    }
    setFormData({
      ...formData,
      equipe: [...formData.equipe, { nom: '', fonction: '', coutHoraire: 0 }]
    });
  };

  const retirerPartenaire = (index) => {
    setFormData({
      ...formData,
      equipe: formData.equipe.filter((_, i) => i !== index)
    });
  };

  const modifierPartenaire = (index, field, value) => {
    const nouvelleEquipe = [...formData.equipe];
    nouvelleEquipe[index] = {
      ...nouvelleEquipe[index],
      [field]: value
    };
    setFormData({
      ...formData,
      equipe: nouvelleEquipe
    });
  };

  const calculerTotalHonoraires = (mission) => {
    const honorairesEquipe = mission.equipe.reduce((sum, p) => {
      return sum + (parseFloat(p.coutHoraire) || 0) * (parseFloat(mission.dureeEstimee) || 0) * 8; // 8h/jour
    }, 0);
    return honorairesEquipe + (parseFloat(mission.honorairesPropose) || 0);
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'brouillon': return '#6b7280';
      case 'envoye': return '#06b6d4';
      case 'accepte': return '#10b981';
      case 'refuse': return '#ef4444';
      case 'en_cours': return '#f59e0b';
      case 'termine': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'brouillon': 'Brouillon',
      'envoye': 'Envoyé',
      'accepte': 'Accepté',
      'refuse': 'Refusé',
      'en_cours': 'En cours',
      'termine': 'Terminé'
    };
    return labels[statut] || statut;
  };

  const getMissionIcon = (type) => {
    const mission = typesMissions.find(t => t.value === type);
    if (!mission) return <ClipboardList size={16} />;
    const iconMap = {
      'Search': <Search size={16} />,
      'BarChart3': <BarChart3 size={16} />,
      'FileText': <FileText size={16} />,
      'Lightbulb': <Lightbulb size={16} />,
      'Settings': <Settings size={16} />
    };
    return iconMap[mission.icon] || mission.icon;
  };

  const getMissionLabel = (type) => {
    const mission = typesMissions.find(t => t.value === type);
    return mission ? mission.label : type;
  };

  // Mailing automatique pour envoyer l'AO à l'équipe
  const handleMailingAutomatique = (mission) => {
    if (!mission.appelOffreId) {
      if (window.showToast) {
        window.showToast('⚠️ Aucun AO lié à cette mission', 'warning');
      } else {
        alert('⚠️ Aucun appel d\'offres lié à cette mission');
      }
      return;
    }

    if (!mission.equipe || mission.equipe.length === 0) {
      if (window.showToast) {
        window.showToast('⚠️ Aucune équipe définie pour cette mission', 'warning');
      } else {
        alert('⚠️ Aucune équipe définie. Ajoutez des partenaires avant d\'envoyer.');
      }
      return;
    }

    // Préparer les emails
    const destinataires = mission.equipe
      .filter(p => p.email)
      .map(p => p.email)
      .join(', ');

    if (!destinataires) {
      if (window.showToast) {
        window.showToast('⚠️ Aucun email trouvé dans l\'équipe', 'warning');
      } else {
        alert('⚠️ Aucune adresse email trouvée dans l\'équipe');
      }
      return;
    }

    // Créer le lien mailto
    const sujet = encodeURIComponent(`Appel d'offres - Mission ${mission.numero}`);
    const corps = encodeURIComponent(
      `Bonjour,\n\n` +
      `Nous vous informons de l'appel d'offres lié à la mission ${mission.numero}.\n\n` +
      `Mission: ${mission.intitule}\n` +
      `Client: ${mission.client.nom}\n` +
      `Type: ${getMissionLabel(mission.typeMission)}\n` +
      `Date: ${new Date(mission.date).toLocaleDateString('fr-FR')}\n\n` +
      `Cordialement,\n` +
      `Équipe WIW Dev+`
    );

    const mailtoLink = `mailto:${destinataires}?subject=${sujet}&body=${corps}`;
    window.location.href = mailtoLink;

    if (window.showToast) {
      window.showToast('📧 Ouverture du client email pour envoyer l\'AO à l\'équipe', 'info');
    }
  };

  // Comparatif (accès réservé aux ADMIN et CHEF_PROJET)
  const handleComparatif = (mission) => {
    // Vérifier les permissions: accès réservé aux ADMIN et CHEF_PROJET
    // Les ASSISTANT et USER basiques n'ont pas accès au comparatif
    const isAuthorized = authService.hasAnyRole('ADMIN', 'CHEF_PROJET');

    if (!isAuthorized) {
      if (window.showToast) {
        window.showToast('🔒 Accès réservé - Fonctionnalité disponible pour les Chefs de Projet et Administrateurs uniquement', 'warning');
      } else {
        alert('🔒 Accès réservé - Cette fonctionnalité est réservée aux Chefs de Projet et Administrateurs');
      }
      return;
    }

    setShowComparatif(mission);
  };

  // Statistiques
  const stats = {
    total: missions.length,
    brouillon: missions.filter(m => m.statut === 'brouillon').length,
    enCours: missions.filter(m => m.statut === 'en_cours').length,
    acceptees: missions.filter(m => m.statut === 'accepte').length,
    totalHonoraires: missions.reduce((sum, m) => sum + calculerTotalHonoraires(m), 0)
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{margin: '0', fontSize: 'clamp(20px, 5vw, 28px)'}}>
            Missions Conseil & MOE Réduites
          </h2>
          <p style={{margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px'}}>
            WIW Dev+ - Maximum 2 partenaires par mission
          </p>
        </div>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button 
            className="btn-primary" 
            onClick={handleGererEquipe}
            style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '10px 18px', fontSize: '14px'}}
          >
            <Users size={16} /> Gérer équipe
          </button>
          <button 
            className="btn-primary" 
            onClick={handleConsulterBET}
            style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '10px 18px', fontSize: '14px'}}
          >
            🏗️ Consulter BET
          </button>
          <button 
            className="btn" 
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            style={{
              background: showForm ? 'var(--danger)' : 'var(--brand)',
              padding: '12px 24px'
            }}>
            {showForm ? '✖ Annuler' : '+ Nouvelle mission'}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div className="stat-card">
          <div style={{fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#7c3aed'}}>
            {stats.total}
          </div>
          <div style={{fontSize: '9px', opacity: 0.5, marginTop: '5px'}}>Missions totales</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#06b6d4'}}>
            {stats.enCours}
          </div>
          <div style={{fontSize: '9px', opacity: 0.5, marginTop: '5px'}}>En cours</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#10b981'}}>
            {stats.acceptees}
          </div>
          <div style={{fontSize: '9px', opacity: 0.5, marginTop: '5px'}}>Acceptées</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#f59e0b'}}>
            {formatMontant(stats.totalHonoraires, 0)}
          </div>
          <div style={{fontSize: '9px', opacity: 0.5, marginTop: '5px'}}>Total honoraires</div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.05)'}}>
          <h3 style={{marginBottom: '20px'}}>
            {editingId ? '✏️ Modifier la mission' : '➕ Nouvelle mission'}
          </h3>
          
          {/* Héritage depuis AO si sélectionné */}
          {aoId && (
            <InheritanceHelper
              type="ao"
              sourceId={aoId}
              onInherit={(data) => {
                setInheritedData(data);
                // Pré-remplir les champs avec les données héritées
                setFormData(prev => ({
                  ...prev,
                  client: {
                    ...prev.client,
                    nom: data.client?.nom || prev.client.nom,
                    email: data.client?.email || prev.client.email,
                    telephone: data.client?.telephone || prev.client.telephone
                  }
                }));
              }}
              showValidation={true}
            />
          )}

          {/* Validation de cohérence */}
          {validation && (
            <ValidationAlerts validation={validation} className="mb-4" />
          )}

          <form onSubmit={handleSubmit}>
            {/* Sélection AO pour héritage */}
            <div style={{marginBottom: '15px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                Lier à un Appel d'Offres (optionnel - pour héritage automatique)
              </label>
              <input
                type="number"
                placeholder="ID de l'AO"
                value={aoId || ''}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value) : null;
                  setAoId(id);
                  setFormData(prev => ({ ...prev, appelOffreId: id }));
                }}
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  padding: '8px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px'
                }}
              />
              <p style={{fontSize: '12px', opacity: 0.7, marginTop: '5px'}}>
                Si un AO est sélectionné, les données client et montant travaux seront héritées automatiquement
              </p>
            </div>

            {/* Informations générales */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px'}}>
              <div className="form-group">
                <label>N° Mission *</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  placeholder="MISS-2025-001"
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Type de mission *</label>
                <select
                  value={formData.typeMission}
                  onChange={(e) => setFormData({...formData, typeMission: e.target.value})}
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                >
                  <option value="">-- Sélectionner --</option>
                  {typesMissions.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Élément de mission *</label>
                <select
                  value={formData.elementMission}
                  onChange={(e) => setFormData({...formData, elementMission: e.target.value})}
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                >
                  <option value="Base">Base</option>
                  <option value="Additionnelle">Additionnelle</option>
                  <option value="Complémentaire">Complémentaire</option>
                  <option value="Optionnelle">Optionnelle</option>
                </select>
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="envoye">Envoyé</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '15px'}}>
              <label>Intitulé de la mission *</label>
              <input
                type="text"
                value={formData.intitule}
                onChange={(e) => setFormData({...formData, intitule: e.target.value})}
                placeholder="Ex: Étude de faisabilité pour construction d'un bâtiment collectif"
                required
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
              />
            </div>

            {/* Informations client */}
            <div style={{
              padding: '15px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{margin: '0 0 15px 0', fontSize: '14px', color: '#3b82f6'}}>Client</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.client.nom}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, nom: e.target.value}
                    })}
                    placeholder="M. Dupont"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={formData.client.telephone}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, telephone: e.target.value}
                    })}
                    placeholder="06 12 34 56 78"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.client.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, email: e.target.value}
                    })}
                    placeholder="contact@exemple.fr"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginTop: '10px'}}>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={formData.client.adresse}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, adresse: e.target.value}
                    })}
                    placeholder="12 rue de la Paix"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Code postal</label>
                  <input
                    type="text"
                    value={formData.client.codePostal}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, codePostal: e.target.value}
                    })}
                    placeholder="75001"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={formData.client.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      client: {...formData.client, ville: e.target.value}
                    })}
                    placeholder="Paris"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
              </div>
            </div>

            {/* Informations Maître d'Ouvrage (MOA) */}
            <div style={{
              padding: '15px',
              background: 'rgba(168, 85, 247, 0.05)',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <h4 style={{margin: '0 0 15px 0', fontSize: '14px', color: '#a855f7'}}>Maître d'Ouvrage (MOA)</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.moa.nom}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, nom: e.target.value}
                    })}
                    placeholder="M. Dupont"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={formData.moa.telephone}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, telephone: e.target.value}
                    })}
                    placeholder="06 12 34 56 78"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.moa.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, email: e.target.value}
                    })}
                    placeholder="contact@exemple.fr"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginTop: '10px'}}>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={formData.moa.adresse}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, adresse: e.target.value}
                    })}
                    placeholder="12 rue de la Paix"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Code postal</label>
                  <input
                    type="text"
                    value={formData.moa.codePostal}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, codePostal: e.target.value}
                    })}
                    placeholder="75001"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={formData.moa.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      moa: {...formData.moa, ville: e.target.value}
                    })}
                    placeholder="Paris"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
              </div>
            </div>

            {/* Coûts horaires et Montant travaux */}
            <div style={{
              padding: '15px',
              background: 'rgba(245, 158, 11, 0.05)',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <h4 style={{margin: '0 0 15px 0', fontSize: '14px', color: '#f59e0b'}}>Coûts & Montants</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <div className="form-group">
                  <label>Coût horaire moyen (€/h)</label>
                  <input
                    type="number"
                    value={formData.coutHoraireMoyen}
                    onChange={(e) => setFormData({...formData, coutHoraireMoyen: parseFloat(e.target.value) || 0})}
                    placeholder="85"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Coût horaire cible (€/h)</label>
                  <input
                    type="number"
                    value={formData.coutHoraireCible}
                    onChange={(e) => setFormData({...formData, coutHoraireCible: parseFloat(e.target.value) || 0})}
                    placeholder="80"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                </div>
                <div className="form-group">
                  <label>Montant travaux HT (€)</label>
                  <input
                    type="number"
                    value={formData.montantTravauxHT}
                    onChange={(e) => setFormData({...formData, montantTravauxHT: parseFloat(e.target.value) || 0})}
                    placeholder="Rappel depuis AO"
                    style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                  />
                  <p style={{fontSize: '11px', opacity: 0.7, marginTop: '5px'}}>
                    <Lightbulb size={16} /> Ce montant sera hérité automatiquement si un AO est lié
                  </p>
                </div>
              </div>
            </div>

            {/* Équipe (max 2 partenaires) */}
            <div style={{
              padding: '15px',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h4 style={{margin: 0, fontSize: '14px', color: '#10b981'}}>
                  Équipe ({formData.equipe.length} / 2 partenaires)
                </h4>
                <button
                  type="button"
                  onClick={ajouterPartenaire}
                  disabled={formData.equipe.length >= 2}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    opacity: formData.equipe.length >= 2 ? 0.5 : 1,
                    cursor: formData.equipe.length >= 2 ? 'not-allowed' : 'pointer'
                  }}
                >
                  + Ajouter un partenaire
                </button>
              </div>

              {formData.equipe.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  opacity: 0.5,
                  fontSize: '13px'
                }}>
                  Aucun partenaire ajouté. Maximum 2 partenaires pour WIW Dev+.
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {formData.equipe.map((partenaire, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr auto',
                        gap: '10px',
                        alignItems: 'center',
                        padding: '10px',
                        background: 'var(--panel)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <input
                        type="text"
                        value={partenaire.nom}
                        onChange={(e) => modifierPartenaire(index, 'nom', e.target.value)}
                        placeholder="Nom du partenaire"
                        style={{padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)'}}
                      />
                      <input
                        type="text"
                        value={partenaire.fonction}
                        onChange={(e) => modifierPartenaire(index, 'fonction', e.target.value)}
                        placeholder="Fonction / Spécialité"
                        style={{padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)'}}
                      />
                      <input
                        type="number"
                        value={partenaire.coutHoraire}
                        onChange={(e) => modifierPartenaire(index, 'coutHoraire', e.target.value)}
                        placeholder="Coût/h"
                        min="0"
                        step="0.01"
                        style={{padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)'}}
                      />
                      <button
                        type="button"
                        onClick={() => retirerPartenaire(index)}
                        style={{
                          padding: '8px 12px',
                          background: 'var(--danger)',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description et honoraires */}
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label>Description de la mission</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Détails de la mission, objectifs, livrables attendus..."
                rows="4"
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)', resize: 'vertical'}}
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px'}}>
              <div className="form-group">
                <label>Durée estimée (jours)</label>
                <input
                  type="number"
                  value={formData.dureeEstimee}
                  onChange={(e) => setFormData({...formData, dureeEstimee: e.target.value})}
                  placeholder="Ex: 20"
                  min="0"
                  step="0.5"
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>

              <div className="form-group">
                <label>Honoraires proposés (€ HT)</label>
                <input
                  type="number"
                  value={formData.honorairesPropose}
                  onChange={(e) => setFormData({...formData, honorairesPropose: e.target.value})}
                  placeholder="Ex: 8000"
                  min="0"
                  step="0.01"
                  style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)'}}
                />
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '20px'}}>
              <label>Notes / Observations</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes internes, suivi, remarques..."
                rows="3"
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink)', resize: 'vertical'}}
              />
            </div>

            {/* Boutons */}
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button
                type="button"
                onClick={resetForm}
                className="btn"
                style={{background: 'var(--panel)', border: '1px solid var(--border)'}}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn"
                style={{background: 'var(--brand)'}}
              >
                {editingId ? '✓ Enregistrer' : '✓ Créer la mission'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des missions */}
      <div className="card">
        <h3 style={{marginBottom: '15px'}}>Liste des missions</h3>
        
        {missions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            opacity: 0.5
          }}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}>💼</div>
            <div>Aucune mission enregistrée</div>
            <div style={{fontSize: '12px', marginTop: '5px'}}>
              Cliquez sur "Nouvelle mission" pour commencer
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '15px'
          }}>
            {missions.map(mission => (
              <div
                key={mission.id}
                className="card"
                style={{
                  background: 'var(--panel)',
                  border: `2px solid ${getStatutColor(mission.statut)}`,
                  borderRadius: '12px',
                  padding: '15px',
                  position: 'relative'
                }}
              >
                {/* Badge statut */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: getStatutColor(mission.statut),
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                >
                  {getStatutLabel(mission.statut)}
                </div>

                {/* Header */}
                <div style={{marginBottom: '12px', paddingRight: '80px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '5px'
                  }}>
                    <span style={{fontSize: '24px'}}>
                      {getMissionIcon(mission.typeMission)}
                    </span>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'var(--brand)'
                      }}>
                        {mission.numero}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        opacity: 0.6
                      }}>
                        {getMissionLabel(mission.typeMission)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginTop: '8px',
                    color: 'var(--ink)'
                  }}>
                    {mission.intitule}
                  </div>
                </div>

                {/* Infos client */}
                <div style={{
                  padding: '10px',
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '12px'
                }}>
                  <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                    👤 {mission.client.nom}
                  </div>
                  {mission.client.telephone && (
                    <div style={{opacity: 0.7}}>📞 {mission.client.telephone}</div>
                  )}
                  {mission.client.email && (
                    <div style={{opacity: 0.7}}>✉️ {mission.client.email}</div>
                  )}
                </div>

                {/* Équipe */}
                {mission.equipe.length > 0 && (
                  <div style={{
                    padding: '10px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    fontSize: '12px'
                  }}>
                    <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                      <Users size={16} /> Équipe ({mission.equipe.length}/2)
                    </div>
                    {mission.equipe.map((p, idx) => (
                      <div key={idx} style={{opacity: 0.7, marginBottom: '2px'}}>
                        • {p.nom} {p.fonction && `- ${p.fonction}`} 
                        {p.coutHoraire > 0 && ` (${p.coutHoraire} €/h)`}
                      </div>
                    ))}
                  </div>
                )}

                {/* Honoraires et durée */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  {mission.dureeEstimee && (
                    <div>
                      <div style={{opacity: 0.6, fontSize: '10px'}}>Durée</div>
                      <div style={{fontWeight: 'bold'}}>
                        {mission.dureeEstimee} jours
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{opacity: 0.6, fontSize: '10px'}}>Honoraires</div>
                    <div style={{fontWeight: 'bold', color: '#f59e0b'}}>
                      {formatMontant(calculerTotalHonoraires(mission), 0)} HT
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '12px'
                }}>
                  <button
                    onClick={() => handleEdit(mission)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      background: 'var(--brand)'
                    }}
                  >
                    <Edit size={16} /> Modifier
                  </button>
                  <button
                    onClick={() => handleExportPDF(mission)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      background: '#10b981'
                    }}
                    title="Exporter en PDF"
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => handleExportExcel(mission)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      background: '#3b82f6'
                    }}
                    title="Exporter en Excel"
                  >
                    <BarChart3 size={16} /> Excel
                  </button>
                  <button
                    onClick={() => handleDuplicate(mission)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      background: 'var(--panel)',
                      border: '1px solid var(--border)'
                    }}
                    title="Dupliquer la mission"
                  >
                    <ClipboardList size={16} /> Dupliquer
                  </button>
                  {mission.appelOffreId && (
                    <button
                      onClick={() => handleMailingAutomatique(mission)}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '12px',
                        background: '#a855f7'
                      }}
                      title="Envoyer l'AO à l'équipe"
                    >
                      📧 Envoyer AO
                    </button>
                  )}
                  {/* Comparatif - Accès réservé */}
                  <button
                    onClick={() => handleComparatif(mission)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444'
                    }}
                    title="Comparatif (accès réservé)"
                  >
                    <BarChart3 size={16} /> Comparatif
                  </button>
                  <button
                    onClick={() => handleDelete(mission.id)}
                    className="btn"
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      background: 'var(--danger)'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
