/**
 * Utilitaires d'export génériques pour Excel et PDF
 * Consolide toutes les fonctions d'export en une seule API cohérente
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './formatNumber';

// ============================================================================
// CONFIGURATION
// ============================================================================

const APP_NAME = 'WIW Dev+';
const BRAND_COLOR = [124, 58, 237]; // Violet
const GRAY_COLOR = [100, 100, 100];

/**
 * Génère un nom de fichier avec date
 * @param {string} prefix - Préfixe du fichier
 * @param {string} extension - Extension du fichier
 */
function generateFileName(prefix, extension) {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.${extension}`;
}

/**
 * Affiche un toast de succès/erreur si disponible
 * @param {string} message - Message à afficher
 * @param {string} type - Type de toast ('success' ou 'error')
 */
function showToast(message, type) {
  if (window.showToast) {
    window.showToast(message, type);
  }
}

// ============================================================================
// EXPORT EXCEL
// ============================================================================

/**
 * Exporte des données en fichier Excel
 * @param {Object} config - Configuration de l'export
 * @param {string} config.title - Titre du document
 * @param {Array<string>} config.headers - En-têtes des colonnes
 * @param {Array<Array>} config.rows - Données des lignes
 * @param {string} [config.sheetName] - Nom de la feuille
 * @param {string} [config.fileName] - Nom du fichier
 * @param {Object} [config.metadata] - Métadonnées supplémentaires
 */
export function exportToExcel({
  title,
  headers,
  rows,
  sheetName = 'Données',
  fileName = null,
  metadata = {}
}) {
  try {
    const wb = XLSX.utils.book_new();
    const data = [headers, ...rows];

    // Ajouter les métadonnées en fin de document
    data.push(['']);
    data.push(['Date de génération', new Date().toLocaleString('fr-FR')]);
    data.push(['Total éléments', rows.length]);

    Object.entries(metadata).forEach(([key, value]) => {
      data.push([key, value]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const finalFileName = fileName || generateFileName(title.replace(/\s+/g, '_'), 'xlsx');
    XLSX.writeFile(wb, finalFileName);

    showToast('Export Excel généré avec succès', 'success');
    return true;
  } catch (error) {
    console.error('Erreur export Excel:', error);
    showToast('Erreur lors de la génération Excel', 'error');
    throw error;
  }
}

/**
 * Exporte des données avec plusieurs feuilles
 * @param {Object} config - Configuration de l'export
 * @param {Array<Object>} config.sheets - Tableau de feuilles
 * @param {string} [config.fileName] - Nom du fichier
 */
export function exportToExcelMultiSheet({ sheets, fileName }) {
  try {
    const wb = XLSX.utils.book_new();

    sheets.forEach(({ name, headers, rows, metadata = {} }) => {
      const data = [headers, ...rows];
      data.push(['']);
      data.push(['Date de génération', new Date().toLocaleString('fr-FR')]);

      Object.entries(metadata).forEach(([key, value]) => {
        data.push([key, value]);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });

    const finalFileName = fileName || generateFileName('Export', 'xlsx');
    XLSX.writeFile(wb, finalFileName);

    showToast('Export Excel généré avec succès', 'success');
    return true;
  } catch (error) {
    console.error('Erreur export Excel multi-feuilles:', error);
    showToast('Erreur lors de la génération Excel', 'error');
    throw error;
  }
}

// ============================================================================
// EXPORT PDF
// ============================================================================

/**
 * Crée un document PDF avec en-tête standard
 * @param {Object} config - Configuration du document
 * @returns {Object} Instance jsPDF et position Y actuelle
 */
function createPDFDocument({ title, subtitle = '' }) {
  const doc = new jsPDF();

  // En-tête de l'entreprise
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_COLOR);
  doc.text(APP_NAME, 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(...GRAY_COLOR);
  doc.text(subtitle || title, 20, 28);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 33);

  return { doc, yPos: 50 };
}

/**
 * Ajoute un pied de page à toutes les pages du PDF
 * @param {jsPDF} doc - Document PDF
 * @param {string} footerText - Texte du pied de page
 */
function addPDFFooter(doc, footerText) {
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY_COLOR);
    doc.text(`${footerText} - Page ${i}/${pageCount}`, 20, 285);
  }
}

/**
 * Exporte des données en fichier PDF avec tableau
 * @param {Object} config - Configuration de l'export
 * @param {string} config.title - Titre du document
 * @param {Array<string>} config.headers - En-têtes des colonnes
 * @param {Array<Array>} config.rows - Données des lignes
 * @param {string} [config.fileName] - Nom du fichier
 * @param {string} [config.subtitle] - Sous-titre du document
 * @param {string} [config.emptyMessage] - Message si pas de données
 */
export function exportToPDF({
  title,
  headers,
  rows,
  fileName = null,
  subtitle = '',
  emptyMessage = 'Aucune donnée à exporter'
}) {
  try {
    const { doc, yPos } = createPDFDocument({ title, subtitle });

    if (rows.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(emptyMessage, 20, yPos);
    } else {
      doc.autoTable({
        startY: yPos,
        head: [headers],
        body: rows,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: {
          fillColor: BRAND_COLOR,
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { left: 20, right: 20 }
      });
    }

    addPDFFooter(doc, `Document généré par ${APP_NAME} - ${title}`);

    const finalFileName = fileName || generateFileName(title.replace(/\s+/g, '_'), 'pdf');
    doc.save(finalFileName);

    showToast('PDF généré avec succès', 'success');
    return true;
  } catch (error) {
    console.error('Erreur export PDF:', error);
    showToast('Erreur lors de la génération du PDF', 'error');
    throw error;
  }
}

/**
 * Exporte un PDF complexe avec plusieurs sections
 * @param {Object} config - Configuration de l'export
 * @param {string} config.title - Titre principal
 * @param {Array<Object>} config.sections - Sections du document
 * @param {string} [config.fileName] - Nom du fichier
 */
export function exportToPDFComplex({ title, sections, fileName = null }) {
  try {
    const { doc } = createPDFDocument({ title });
    let yPos = 50;

    sections.forEach(({ sectionTitle, headers, rows, emptyMessage }) => {
      // Nouvelle page si nécessaire
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      // Titre de section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(sectionTitle, 20, yPos);
      yPos += 10;

      if (rows.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(...GRAY_COLOR);
        doc.text(emptyMessage || 'Aucune donnée', 20, yPos);
        yPos += 15;
      } else {
        doc.autoTable({
          startY: yPos,
          head: [headers],
          body: rows,
          theme: 'striped',
          styles: { fontSize: 9 },
          headStyles: {
            fillColor: BRAND_COLOR,
            textColor: 255,
            fontStyle: 'bold'
          },
          margin: { left: 20, right: 20 }
        });
        yPos = doc.lastAutoTable.finalY + 15;
      }
    });

    addPDFFooter(doc, `Document généré par ${APP_NAME}`);

    const finalFileName = fileName || generateFileName(title.replace(/\s+/g, '_'), 'pdf');
    doc.save(finalFileName);

    showToast('PDF généré avec succès', 'success');
    return true;
  } catch (error) {
    console.error('Erreur export PDF complexe:', error);
    showToast('Erreur lors de la génération du PDF', 'error');
    throw error;
  }
}

// ============================================================================
// EXPORTS SPÉCIALISÉS (rétrocompatibilité)
// ============================================================================

/**
 * Export des appels d'offres en Excel
 * @param {Array} aos - Liste des AO
 * @param {string} [fileName] - Nom du fichier
 */
export function exportAOExcel(aos = [], fileName = null) {
  const headers = ['Titre', 'Client', 'Domaine', 'Type', 'Montant', 'Statut', 'Date création'];
  const rows = aos.map(ao => [
    ao.titre || ao.objet || '',
    ao.clientNom || ao.maitreOuvrage || '',
    ao.domaine || '',
    ao.type || '',
    formatCurrency(ao.montant || 0, 0),
    ao.statut || '',
    ao.createdAt ? new Date(ao.createdAt).toLocaleDateString('fr-FR') : ''
  ]);

  return exportToExcel({
    title: 'Appels_Offres',
    headers,
    rows,
    sheetName: "Appels d'Offres",
    fileName,
    metadata: { 'Total AO': aos.length }
  });
}

/**
 * Export des appels d'offres en PDF
 * @param {Array} aos - Liste des AO
 * @param {string} [fileName] - Nom du fichier
 */
export function exportAOPDF(aos = [], fileName = null) {
  const headers = ['Titre', 'Client', 'Domaine', 'Type', 'Montant', 'Statut'];
  const rows = aos.map(ao => [
    ao.titre || ao.objet || '',
    ao.clientNom || ao.maitreOuvrage || '',
    ao.domaine || '',
    ao.type || '',
    formatCurrency(ao.montant || 0, 0),
    ao.statut || ''
  ]);

  return exportToPDF({
    title: "Export des Appels d'Offres",
    headers,
    rows,
    fileName,
    emptyMessage: "Aucun appel d'offres à exporter"
  });
}

/**
 * Export des références en Excel
 * @param {Array} references - Liste des références
 * @param {string} [fileName] - Nom du fichier
 */
export function exportReferencesExcel(references = [], fileName = null) {
  const headers = ['Désignation', 'Unité', 'Prix Unitaire HT', 'Catégorie', 'Description'];
  const rows = references.map(ref => [
    ref.designation || ref.nom || '',
    ref.unite || '',
    formatCurrency(ref.puHT || ref.prixUnitaire || 0, 2),
    ref.categorie || '',
    ref.description || ''
  ]);

  return exportToExcel({
    title: 'References',
    headers,
    rows,
    sheetName: 'Références',
    fileName,
    metadata: { 'Total références': references.length }
  });
}

/**
 * Export des références en PDF
 * @param {Array} references - Liste des références
 * @param {string} [fileName] - Nom du fichier
 */
export function exportReferencesPDF(references = [], fileName = null) {
  const headers = ['Désignation', 'Unité', 'Prix Unitaire HT', 'Catégorie'];
  const rows = references.map(ref => [
    ref.designation || ref.nom || '',
    ref.unite || '',
    formatCurrency(ref.puHT || ref.prixUnitaire || 0, 2),
    ref.categorie || ''
  ]);

  return exportToPDF({
    title: 'Export des Références',
    headers,
    rows,
    fileName,
    emptyMessage: 'Aucune référence à exporter'
  });
}

/**
 * Export des missions en Excel
 * @param {Array} missions - Liste des missions
 * @param {string} [fileName] - Nom du fichier
 */
export function exportMissionsExcel(missions = [], fileName = null) {
  const headers = ['Numéro', 'Client', 'Type', 'Montant Travaux HT', 'Honoraires HT', 'Durée', 'Statut', 'Date'];
  const rows = missions.map(mission => [
    mission.numero || '',
    mission.client?.nom || '',
    mission.typeMission || '',
    formatCurrency(mission.montantTravauxHT || 0, 2),
    formatCurrency(mission.honorairesPropose || 0, 2),
    `${mission.dureeEstimee || 0} jours`,
    mission.statut || '',
    mission.date ? new Date(mission.date).toLocaleDateString('fr-FR') : ''
  ]);

  return exportToExcel({
    title: 'Missions',
    headers,
    rows,
    sheetName: 'Missions',
    fileName
  });
}

/**
 * Export des missions en PDF
 * @param {Array} missions - Liste des missions
 * @param {string} [fileName] - Nom du fichier
 */
export function exportMissionsPDF(missions = [], fileName = null) {
  const headers = ['Numéro', 'Client', 'Type', 'Montant Travaux HT', 'Honoraires HT', 'Durée', 'Statut'];
  const rows = missions.map(mission => [
    mission.numero || '',
    mission.client?.nom || '',
    mission.typeMission || '',
    formatCurrency(mission.montantTravauxHT || 0, 2),
    formatCurrency(mission.honorairesPropose || 0, 2),
    `${mission.dureeEstimee || 0} jours`,
    mission.statut || ''
  ]);

  return exportToPDF({
    title: 'Export des Missions',
    headers,
    rows,
    fileName,
    emptyMessage: 'Aucune mission à exporter'
  });
}

/**
 * Export des honoraires en Excel (complexe)
 * @param {Object} honorairesData - Données des honoraires
 * @param {string} [fileName] - Nom du fichier
 */
export function exportHonorairesExcel(honorairesData, fileName = null) {
  const {
    montantTravaux = 0,
    evolutions = [],
    missions = [],
    partenaires = []
  } = honorairesData;

  const sheets = [];

  // Feuille Résumé
  const summaryHeaders = ['Mission', ...evolutions.map(e => e.nom || 'Évolution')];
  const summaryRows = missions.map(mission => {
    const row = [mission.nom || mission.id];
    evolutions.forEach(evolution => {
      const pourcentage = evolution.pourcentages?.[mission.id] || 0;
      const montant = (montantTravaux * pourcentage) / 100;
      row.push(`${pourcentage.toFixed(2)}% (${formatCurrency(montant, 2)})`);
    });
    return row;
  });

  // Ligne des totaux
  const totalRow = ['TOTAL'];
  evolutions.forEach(evolution => {
    const totalPourcentage = Object.values(evolution.pourcentages || {}).reduce((sum, p) => sum + (p || 0), 0);
    const totalMontant = (montantTravaux * totalPourcentage) / 100;
    totalRow.push(`${totalPourcentage.toFixed(2)}% (${formatCurrency(totalMontant, 2)})`);
  });
  summaryRows.push(totalRow);

  sheets.push({
    name: 'Résumé',
    headers: summaryHeaders,
    rows: summaryRows,
    metadata: { 'Montant des Travaux HT': formatCurrency(montantTravaux, 0) }
  });

  // Feuille Partenaires
  if (partenaires.length > 0) {
    sheets.push({
      name: 'Partenaires',
      headers: ['Nom', 'Coût horaire', 'Heures estimées', 'Montant prévisionnel'],
      rows: partenaires.map(p => [
        p.nom || '',
        `${formatCurrency(p.coutHoraire || 0, 2)}/h`,
        `${(p.heuresEstimees || 0).toFixed(1)} h`,
        formatCurrency((p.coutHoraire || 0) * (p.heuresEstimees || 0), 2)
      ])
    });
  }

  return exportToExcelMultiSheet({
    sheets,
    fileName: fileName || generateFileName('Honoraires', 'xlsx')
  });
}

/**
 * Export des honoraires en PDF (complexe)
 * @param {Object} honorairesData - Données des honoraires
 * @param {string} [fileName] - Nom du fichier
 */
export function exportHonorairesPDF(honorairesData, fileName = null) {
  const {
    montantTravaux = 0,
    evolutions = [],
    missions = [],
    partenaires = []
  } = honorairesData;

  const sections = [];

  // Section Évolutions
  if (evolutions.length > 0 && missions.length > 0) {
    const headers = ['Mission', ...evolutions.map(e => e.nom || 'Évolution')];
    const rows = missions.map(mission => {
      const row = [mission.nom || mission.id];
      evolutions.forEach(evolution => {
        const pourcentage = evolution.pourcentages?.[mission.id] || 0;
        const montant = (montantTravaux * pourcentage) / 100;
        row.push(`${pourcentage.toFixed(2)}%\n${formatCurrency(montant, 2)}`);
      });
      return row;
    });

    // Ligne des totaux
    const totalRow = ['TOTAL'];
    evolutions.forEach(evolution => {
      const totalPourcentage = Object.values(evolution.pourcentages || {}).reduce((sum, p) => sum + (p || 0), 0);
      const totalMontant = (montantTravaux * totalPourcentage) / 100;
      totalRow.push(`${totalPourcentage.toFixed(2)}%\n${formatCurrency(totalMontant, 2)}`);
    });
    rows.push(totalRow);

    sections.push({
      sectionTitle: `Évolutions des Pourcentages (Travaux: ${formatCurrency(montantTravaux, 0)})`,
      headers,
      rows
    });
  }

  // Section Partenaires
  if (partenaires.length > 0) {
    sections.push({
      sectionTitle: 'Partenaires',
      headers: ['Nom', 'Coût horaire', 'Heures estimées', 'Montant prévisionnel'],
      rows: partenaires.map(p => [
        p.nom || '',
        `${formatCurrency(p.coutHoraire || 0, 2)}/h`,
        `${(p.heuresEstimees || 0).toFixed(1)} h`,
        formatCurrency((p.coutHoraire || 0) * (p.heuresEstimees || 0), 2)
      ])
    });
  }

  return exportToPDFComplex({
    title: "Calcul d'Honoraires",
    sections,
    fileName: fileName || generateFileName('Honoraires', 'pdf')
  });
}

// Export par défaut
export default {
  // Génériques
  toExcel: exportToExcel,
  toExcelMultiSheet: exportToExcelMultiSheet,
  toPDF: exportToPDF,
  toPDFComplex: exportToPDFComplex,

  // Spécialisés
  ao: { excel: exportAOExcel, pdf: exportAOPDF },
  references: { excel: exportReferencesExcel, pdf: exportReferencesPDF },
  missions: { excel: exportMissionsExcel, pdf: exportMissionsPDF },
  honoraires: { excel: exportHonorairesExcel, pdf: exportHonorairesPDF }
};
