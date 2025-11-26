import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './formatNumber';

/**
 * Export Excel/PDF pour Appels d'Offres (AO)
 */

/**
 * Exporter les AO en Excel (format XLSX avec SheetJS)
 * @param {Array} aos - Liste des appels d'offres
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportAOExcel(aos = [], fileName = null) {
  try {
    // Créer un nouveau workbook
    const wb = XLSX.utils.book_new();

    // Préparer les données
    const data = [
      ['Titre', 'Client', 'Domaine', 'Type', 'Montant', 'Statut', 'Date création']
    ];

    aos.forEach(ao => {
      data.push([
        ao.titre || ao.objet || '',
        ao.clientNom || ao.maitreOuvrage || '',
        ao.domaine || '',
        ao.type || '',
        formatCurrency(ao.montant || 0, 0),
        ao.statut || '',
        ao.createdAt ? new Date(ao.createdAt).toLocaleDateString('fr-FR') : ''
      ]);
    });

    // Ajouter les métadonnées
    data.push(['']);
    data.push(['Date de génération', new Date().toLocaleString('fr-FR')]);
    data.push(['Total AO', aos.length]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Appels d\'Offres');

    // Générer le fichier Excel
    const finalFileName = fileName || `Appels_Offres_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, finalFileName);

    if (window.showToast) {
      window.showToast('✅ Export Excel généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export Excel AO:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération Excel', 'error');
    }
    throw error;
  }
}

/**
 * Exporter les AO en PDF
 * @param {Array} aos - Liste des appels d'offres
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportAOPDF(aos = [], fileName = null) {
  try {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('WIW Dev+', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Export des Appels d\'Offres', 20, 28);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 33);
    
    let yPos = 50;

    if (aos.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Aucun appel d\'offres à exporter', 20, yPos);
    } else {
      const tableData = aos.map(ao => [
        ao.titre || ao.objet || '',
        ao.clientNom || ao.maitreOuvrage || '',
        ao.domaine || '',
        ao.type || '',
        formatCurrency(ao.montant || 0, 0),
        ao.statut || ''
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Titre', 'Client', 'Domaine', 'Type', 'Montant', 'Statut']],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' },
        margin: { left: 20, right: 20 }
      });
    }

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Document généré par WIW Dev+ - Export des Appels d\'Offres', 20, 285);

    const finalFileName = fileName || `Appels_Offres_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(finalFileName);

    if (window.showToast) {
      window.showToast('✅ PDF généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export PDF AO:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération du PDF', 'error');
    }
    throw error;
  }
}

export default {
  exportAOExcel,
  exportAOPDF
};

