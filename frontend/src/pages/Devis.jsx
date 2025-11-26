import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DevisAPI from '../services/devis.api';
import { ClipboardList, BarChart3, Euro, FileText } from 'lucide-react';

// Nouveaux composants professionnels
import DevisTable from '../components/DevisTable';
import DevisTVA from '../components/DevisTVA';
import BanqueReferences from '../components/BanqueReferences';
import DevisTracabilite from '../components/DevisTracabilite';
import DevisMedias from '../components/DevisMedias';
import LettreEnvoi from '../components/LettreEnvoi';

export default function Devis({ onNavigate }) {
  const [devis, setDevis] = useLocalStorage('wiw-devis', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('informations');

  const [formData, setFormData] = useState({
    numero: '',
    date: new Date().toISOString().slice(0, 10),
    dateValidite: '',
    client: {
      nom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: ''
    },
    lignes: [],
    chapitres: [],
    tauxHoraire: 0,
    rabais: 0,
    rabaisType: 'pourcentage',
    tracabilite: {
      dateRemis: '',
      dateCorrige: '',
      dateValide: '',
      dureeEstimee: 0,
      sommeHeuresPrevues: 0
    },
    photos: [],
    versionsPDF: [],
    notes: '',
    conditionsReglement: '30 jours',
    statut: 'brouillon'
  });

  const handleEdit = (id) => {
    const devisToEdit = devis.find(d => d.id === id);
    if (devisToEdit) {
      setFormData({
        ...devisToEdit,
        chapitres: devisToEdit.chapitres || [],
        tauxHoraire: devisToEdit.tauxHoraire || 0,
        rabais: devisToEdit.rabais || 0,
        rabaisType: devisToEdit.rabaisType || 'pourcentage',
        tracabilite: devisToEdit.tracabilite || {
          dateRemis: '',
          dateCorrige: '',
          dateValide: '',
          dureeEstimee: 0,
          sommeHeuresPrevues: 0
        },
        photos: devisToEdit.photos || [],
        versionsPDF: devisToEdit.versionsPDF || []
      });
      setEditingId(id);
      setShowForm(true);
      setActiveTab('informations');
    }
  };

  const handleDuplicate = (id) => {
    const devisToDuplicate = devis.find(d => d.id === id);
    if (devisToDuplicate) {
      const nouveauDevis = {
        ...devisToDuplicate,
        id: Date.now(),
        numero: `${devisToDuplicate.numero}-COPIE`,
        date: new Date().toISOString().slice(0, 10),
        dateCreation: new Date().toISOString(),
        statut: 'brouillon',
        tracabilite: {
          dateRemis: '',
          dateCorrige: '',
          dateValide: '',
          dureeEstimee: devisToDuplicate.tracabilite?.dureeEstimee || 0,
          sommeHeuresPrevues: 0
        },
        versionsPDF: []
      };
      setDevis([...devis, nouveauDevis]);
      if (window.showToast) {
        window.showToast('✅ Devis dupliqué', 'success');
      }
    }
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce devis ?')) {
      setDevis(devis.filter(d => d.id !== id));
      if (window.showToast) {
        window.showToast('🗑️ Devis supprimé', 'info');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const sommeHeures = formData.lignes
      .filter(l => l.unite === 'h')
      .reduce((acc, l) => acc + parseFloat(l.quantite || 0), 0);
    
    const devisData = {
      ...formData,
      tracabilite: {
        ...formData.tracabilite,
        sommeHeuresPrevues: sommeHeures
      }
    };

    if (editingId) {
      setDevis(devis.map(d => 
        d.id === editingId ? { ...devisData, id: editingId } : d
      ));
      if (window.showToast) {
        window.showToast('✅ Devis modifié', 'success');
      }
    } else {
      const nouveauDevis = {
        ...devisData,
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      setDevis([...devis, nouveauDevis]);
      if (window.showToast) {
        window.showToast('✅ Devis créé', 'success');
      }
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      date: new Date().toISOString().slice(0, 10),
      dateValidite: '',
      client: {
        nom: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: '',
        email: ''
      },
      lignes: [],
      chapitres: [],
      tauxHoraire: 0,
      rabais: 0,
      rabaisType: 'pourcentage',
      tracabilite: {
        dateRemis: '',
        dateCorrige: '',
        dateValide: '',
        dureeEstimee: 0,
        sommeHeuresPrevues: 0
      },
      photos: [],
      versionsPDF: [],
      notes: '',
      conditionsReglement: '30 jours',
      statut: 'brouillon'
    });
    setEditingId(null);
    setShowForm(false);
    setActiveTab('informations');
  };

  // Totaux calculés par le backend
  const [totaux, setTotaux] = useState(null);
  useEffect(() => {
    if (editingId && activeTab === 'totaux') {
      DevisAPI.getTotaux(editingId)
        .then(setTotaux)
        .catch(() => setTotaux(null));
    }
  }, [editingId, activeTab]);

  const genererPDF = () => {
    const doc = new jsPDF();
    const totalHT = calculerTotalHT();
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° ${formData.numero}`, 105, 28, { align: 'center' });
    doc.text(`Date : ${new Date(formData.date).toLocaleDateString('fr-FR')}`, 105, 34, { align: 'center' });
    
    let y = 50;
    doc.setFont('helvetica', 'bold');
    doc.text('Client :', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.text(formData.client.nom, 20, y);
    y += 5;
    doc.text(formData.client.adresse, 20, y);
    y += 5;
    doc.text(`${formData.client.codePostal} ${formData.client.ville}`, 20, y);
    
    y += 15;
    
    const tableData = [];
    
    formData.chapitres.forEach(chapitre => {
      tableData.push([
        { content: chapitre.titre, colSpan: 6, styles: { fillColor: [200, 220, 255], fontStyle: 'bold' } }
      ]);
      
      formData.lignes
        .filter(l => l.chapitreId === chapitre.id)
        .forEach(ligne => {
          const montant = ligne.puHT * ligne.quantite * (1 - ligne.remise / 100);
          tableData.push([
            ligne.designation,
            ligne.unite,
            ligne.puHT.toFixed(2) + ' €',
            ligne.quantite,
            ligne.remise ? `${ligne.remise}%` : '-',
            montant.toFixed(2) + ' €'
          ]);
        });
      
      const sousTotalChapitre = formData.lignes
        .filter(l => l.chapitreId === chapitre.id)
        .reduce((acc, l) => acc + l.puHT * l.quantite * (1 - l.remise / 100), 0);
      
      tableData.push([
        { content: 'Sous-total', colSpan: 5, styles: { fontStyle: 'bold', halign: 'right' } },
        { content: sousTotalChapitre.toFixed(2) + ' €', styles: { fontStyle: 'bold' } }
      ]);
    });
    
    formData.lignes
      .filter(l => !l.chapitreId)
      .forEach(ligne => {
        const montant = ligne.puHT * ligne.quantite * (1 - ligne.remise / 100);
        tableData.push([
          ligne.designation,
          ligne.unite,
          ligne.puHT.toFixed(2) + ' €',
          ligne.quantite,
          ligne.remise ? `${ligne.remise}%` : '-',
          montant.toFixed(2) + ' €'
        ]);
      });
    
    doc.autoTable({
      startY: y,
      head: [['Désignation', 'U', 'PU HT', 'Q', 'Remise', 'Montant HT']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [100, 100, 100] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 30, halign: 'right' }
      }
    });
    
    y = doc.lastAutoTable.finalY + 10;
    
    const montantRabais = formData.rabaisType === 'pourcentage' 
      ? totalHT * (formData.rabais / 100)
      : formData.rabais;
    
    const totalHTApresRabais = totalHT - montantRabais;
    const totalTVA = totalHTApresRabais * 0.20;
    const totalTTC = totalHTApresRabais + totalTVA;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Total HT :', 140, y);
    doc.text(totalHT.toFixed(2) + ' €', 180, y, { align: 'right' });
    
    if (formData.rabais > 0) {
      y += 6;
      doc.text(`Rabais (${formData.rabaisType === 'pourcentage' ? formData.rabais + '%' : 'montant fixe'}) :`, 140, y);
      doc.text('- ' + montantRabais.toFixed(2) + ' €', 180, y, { align: 'right' });
      
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Total HT après rabais :', 140, y);
      doc.text(totalHTApresRabais.toFixed(2) + ' €', 180, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
    }
    
    y += 6;
    doc.text('TVA 20% :', 140, y);
    doc.text(totalTVA.toFixed(2) + ' €', 180, y, { align: 'right' });
    
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total TTC :', 140, y);
    doc.text(totalTTC.toFixed(2) + ' €', 180, y, { align: 'right' });
    
    if (formData.notes) {
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes :', 20, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      const lignesNotes = doc.splitTextToSize(formData.notes, 170);
      doc.text(lignesNotes, 20, y);
    }
    
    y = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(8);
    doc.text(`Conditions de règlement : ${formData.conditionsReglement}`, 20, y);
    doc.text(`Devis valable 30 jours`, 20, y + 5);
    
    doc.save(`Devis_${formData.numero}_${new Date().toISOString().slice(0, 10)}.pdf`);
    
    if (window.showToast) {
      window.showToast('✅ PDF généré', 'success');
    }
    
    const pdfBlob = doc.output('blob');
    const nouvelleVersion = {
      id: Date.now(),
      numero: (formData.versionsPDF.length + 1).toString(),
      dateCreation: new Date().toISOString(),
      taille: pdfBlob.size,
      url: URL.createObjectURL(pdfBlob)
    };
    
    setFormData({
      ...formData,
      versionsPDF: [...formData.versionsPDF, nouvelleVersion]
    });
  };

  const tabs = [
    { id: 'informations', label: <><ClipboardList size={16} /> Informations</>, icon: <ClipboardList size={20} /> },
    { id: 'lignes', label: <><BarChart3 size={16} /> Lignes & Chapitres</>, icon: <BarChart3 size={20} /> },
    { id: 'totaux', label: <><Euro size={16} /> Totaux & TVA</>, icon: <Euro size={20} /> },
    { id: 'tracabilite', label: '📅 Traçabilité', icon: '📅' },
    { id: 'medias', label: '📸 Photos & PDF', icon: '📸' },
    { id: 'lettre', label: '✉️ Lettre', icon: '✉️' },
    { id: 'references', label: '📚 Banque', icon: '📚' }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getStatutBadge = (statut) => {
    const styles = {
      brouillon: 'bg-gray-100 text-gray-800',
      envoye: 'bg-blue-100 text-blue-800',
      accepte: 'bg-green-100 text-green-800',
      refuse: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      brouillon: <><FileText size={16} /> Brouillon</>,
      envoye: '📤 Envoyé',
      accepte: '✅ Accepté',
      refuse: '❌ Refusé'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📄 Devis</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors ${
            showForm
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <span className="hidden sm:inline">{showForm ? '❌ Fermer' : '➕ Nouveau devis'}</span>
          <span className="sm:hidden">{showForm ? '❌' : '➕'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            {editingId ? '✏️ Modifier le devis' : '➕ Nouveau devis'}
          </h2>

          <div className="border-b mb-6 overflow-x-auto">
            <nav className="flex gap-1 sm:gap-2 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 sm:px-4 py-2 sm:py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xl">{tab.icon}</span>
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'informations' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de devis *
                    </label>
                    <input
                      type="text"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                      placeholder="DEV-2025-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date du devis *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de validité
                    </label>
                    <input
                      type="date"
                      value={formData.dateValidite}
                      onChange={(e) => setFormData({ ...formData, dateValidite: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    👤 Informations client
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom / Raison sociale *
                      </label>
                      <input
                        type="text"
                        value={formData.client.nom}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, nom: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                        placeholder="Nom du client"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.client.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="email@exemple.fr"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={formData.client.adresse}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, adresse: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Adresse complète"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CP
                      </label>
                      <input
                        type="text"
                        value={formData.client.codePostal}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, codePostal: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="75001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={formData.client.ville}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, ville: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Paris"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.client.telephone}
                        onChange={(e) => setFormData({
                          ...formData,
                          client: { ...formData.client, telephone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="01 23 45 67 89"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes / Observations
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows="4"
                        placeholder="Notes internes ou à destination du client..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Conditions de règlement
                      </label>
                      <select
                        value={formData.conditionsReglement}
                        onChange={(e) => setFormData({ ...formData, conditionsReglement: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg mb-4"
                      >
                        <option value="À réception">À réception</option>
                        <option value="15 jours">15 jours</option>
                        <option value="30 jours">30 jours</option>
                        <option value="45 jours">45 jours</option>
                        <option value="60 jours">60 jours</option>
                      </select>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={formData.statut}
                        onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="brouillon">Brouillon</option>
                        <option value="envoye">📤 Envoyé</option>
                        <option value="accepte">✅ Accepté</option>
                        <option value="refuse">❌ Refusé</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lignes' && (
              <DevisTable
                lignes={formData.lignes}
                chapitres={formData.chapitres}
                onLignesChange={(lignes) => setFormData({ ...formData, lignes })}
                onChapitresChange={(chapitres) => setFormData({ ...formData, chapitres })}
                tauxHoraire={formData.tauxHoraire}
                onTauxHoraireChange={(tauxHoraire) => setFormData({ ...formData, tauxHoraire })}
              />
            )}

            {activeTab === 'totaux' && (
              totaux ? (
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Totaux calculés</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>Total HT : <b>{formatNumber(totaux.totalHT)} €</b></div>
                    <div>Total HT après rabais : <b>{formatNumber(totaux.totalHTRabais)} €</b></div>
                    <div>Montant TVA : <b>{formatNumber(totaux.montantTVA)} €</b></div>
                    <div>Total TTC : <b>{formatNumber(totaux.totalTTC)} €</b></div>
                    <div>Sous-total : <b>{formatNumber(totaux.sousTotal)} €</b></div>
                    <div>Heures totales : <b>{formatNumber(totaux.totalHeures)}</b></div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500">Sélectionnez un devis pour voir les totaux.</div>
              )
            )}

            {activeTab === 'tracabilite' && (
              <DevisTracabilite
                tracabilite={{
                  ...formData.tracabilite,
                  sommeHeuresPrevues: formData.lignes
                    .filter(l => l.unite === 'h')
                    .reduce((acc, l) => acc + parseFloat(l.quantite || 0), 0)
                }}
                onChange={(tracabilite) => setFormData({ ...formData, tracabilite })}
              />
            )}

            {activeTab === 'medias' && (
              <DevisMedias
                devisId={formData.numero}
                photos={formData.photos}
                versionsPDF={formData.versionsPDF}
                onPhotosChange={(photos) => setFormData({ ...formData, photos })}
                onVersionsPDFChange={(versionsPDF) => setFormData({ ...formData, versionsPDF })}
              />
            )}

            {activeTab === 'lettre' && (
              <LettreEnvoi
                devis={formData}
                onGenererPDF={(blob) => {
                  console.log('Lettre générée', blob);
                }}
              />
            )}

            {activeTab === 'references' && (
              <BanqueReferences
                onSelectReference={(ref) => {
                  setFormData({
                    ...formData,
                    lignes: [...formData.lignes, {
                      id: Date.now(),
                      ...ref,
                      chapitreId: null,
                      ordre: formData.lignes.length
                    }]
                  });
                  setActiveTab('lignes');
                  if (window.showToast) {
                    window.showToast('✅ Référence ajoutée aux lignes', 'success');
                  }
                }}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Annuler
              </button>
              {activeTab !== 'references' && (
                <>
                  <button
                    type="button"
                    onClick={genererPDF}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    📄 Générer PDF
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                  >
                    {editingId ? '💾 Modifier' : '➕ Créer'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {devis.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl font-semibold mb-2">Aucun devis</p>
              <p>Créez votre premier devis en cliquant sur "Nouveau devis"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Numéro
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
                      Client
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Montant HT
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700 hidden lg:table-cell">
                      Statut
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {devis
                    .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
                    .map((d) => {
                      const totalHT = d.lignes?.reduce((acc, ligne) => {
                        const montantBrut = ligne.puHT * ligne.quantite;
                        const montantRemise = montantBrut * (1 - ligne.remise / 100);
                        return acc + montantRemise;
                      }, 0) || 0;

                      return (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4">
                            <div className="font-semibold text-gray-900">{d.numero}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{d.client?.nom}</div>
                            <div className="text-xs text-gray-500">
                              {d.lignes?.length || 0} ligne{(d.lignes?.length || 0) > 1 ? 's' : ''}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                            <div className="font-medium text-gray-900">{d.client?.nom}</div>
                            <div className="text-sm text-gray-500">{d.client?.ville}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                            {new Date(d.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right font-semibold text-gray-900">
                            {formatNumber(totalHT)} €
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center hidden lg:table-cell">
                            {getStatutBadge(d.statut)}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(d.id)}
                                className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                title="Modifier"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDuplicate(d.id)}
                                className="px-2 sm:px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 hidden sm:inline-block"
                                title="Dupliquer"
                              >
                                <ClipboardList size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(d.id)}
                                className="px-2 sm:px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                title="Supprimer"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
