import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './formatNumber';

/**
 * Export Excel/PDF pour Références
 */

/**
 * Exporter les références en Excel (format XLSX avec SheetJS)
 * @param {Array} references - Liste des références
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportReferencesExcel(references = [], fileName = null) {
  try {
    // Créer un nouveau workbook
    const wb = XLSX.utils.book_new();

    // Préparer les données
    const data = [
      ['Désignation', 'Unité', 'Prix Unitaire HT', 'Catégorie', 'Description']
    ];

    references.forEach(ref => {
      data.push([
        ref.designation || ref.nom || '',
        ref.unite || '',
        formatCurrency(ref.puHT || ref.prixUnitaire || 0, 2),
        ref.categorie || '',
        ref.description || ''
      ]);
    });

    // Ajouter les métadonnées
    data.push(['']);
    data.push(['Date de génération', new Date().toLocaleString('fr-FR')]);
    data.push(['Total références', references.length]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Références');

    // Générer le fichier Excel
    const finalFileName = fileName || `References_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, finalFileName);

    if (window.showToast) {
      window.showToast('✅ Export Excel généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export Excel références:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération Excel', 'error');
    }
    throw error;
  }
}

/**
 * Exporter les références en PDF
 * @param {Array} references - Liste des références
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportReferencesPDF(references = [], fileName = null) {
  try {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('WIW Dev+', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Export des Références', 20, 28);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 33);
    
    let yPos = 50;

    if (references.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Aucune référence à exporter', 20, yPos);
    } else {
      const tableData = references.map(ref => [
        ref.designation || ref.nom || '',
        ref.unite || '',
        formatCurrency(ref.puHT || ref.prixUnitaire || 0, 2),
        ref.categorie || ''
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Désignation', 'Unité', 'Prix Unitaire HT', 'Catégorie']],
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
    doc.text('Document généré par WIW Dev+ - Export des Références', 20, 285);

    const finalFileName = fileName || `References_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(finalFileName);

    if (window.showToast) {
      window.showToast('✅ PDF généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export PDF références:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération du PDF', 'error');
    }
    throw error;
  }
}

export default {
  exportReferencesExcel,
  exportReferencesPDF
};

