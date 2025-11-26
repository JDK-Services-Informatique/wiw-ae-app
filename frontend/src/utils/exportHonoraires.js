import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './formatNumber';

/**
 * Export Excel/PDF pour Honoraires (EXP-01)
 * Fonctions utilitaires pour exporter les honoraires en Excel et PDF
 */

/**
 * Exporter les honoraires en Excel (format XLSX avec SheetJS)
 * @param {object} honorairesData - Données des honoraires
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportHonorairesExcel(honorairesData, fileName = null) {
  try {
    const {
      montantTravaux = 0,
      evolutions = [],
      missions = [],
      partenaires = []
    } = honorairesData;

    // Créer un nouveau workbook
    const wb = XLSX.utils.book_new();

    // Feuille 1 : Résumé
    const summaryData = [
      ['CALCUL D\'HONORAIRES'],
      [''],
      ['Montant des Travaux HT', formatCurrency(montantTravaux, 0)],
      [''],
      ['ÉVOLUTIONS DES POURCENTAGES'],
      ['Mission', ...evolutions.map(e => e.nom || 'Évolution')]
    ];

    // Ajouter les missions avec leurs pourcentages par évolution
    missions.forEach(mission => {
      const row = [mission.nom || mission.id];
      evolutions.forEach(evolution => {
        const pourcentage = evolution.pourcentages?.[mission.id] || 0;
        const montant = (montantTravaux * pourcentage) / 100;
        row.push(`${pourcentage.toFixed(2)}% (${formatCurrency(montant, 2)})`);
      });
      summaryData.push(row);
    });

    // Totaux
    summaryData.push(['']);
    summaryData.push(['TOTAL']);
    const totalRow = ['Total'];
    evolutions.forEach(evolution => {
      const totalPourcentage = Object.values(evolution.pourcentages || {}).reduce((sum, p) => sum + (p || 0), 0);
      const totalMontant = (montantTravaux * totalPourcentage) / 100;
      totalRow.push(`${totalPourcentage.toFixed(2)}% (${formatCurrency(totalMontant, 2)})`);
    });
    summaryData.push(totalRow);
    summaryData.push(['']);
    summaryData.push(['Date de génération', new Date().toLocaleString('fr-FR')]);

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Résumé');

    // Feuille 2 : Partenaires
    if (partenaires && partenaires.length > 0) {
      const partenairesData = [
        ['PARTENAIRES'],
        ['Nom', 'Coût horaire', 'Heures estimées', 'Montant prévisionnel']
      ];
      partenaires.forEach(p => {
        partenairesData.push([
          p.nom || '',
          `${formatCurrency(p.coutHoraire || 0, 2)}/h`,
          `${(p.heuresEstimees || 0).toFixed(1)} h`,
          formatCurrency((p.coutHoraire || 0) * (p.heuresEstimees || 0), 2)
        ]);
      });
      const ws2 = XLSX.utils.aoa_to_sheet(partenairesData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Partenaires');
    }

    // Générer le fichier Excel
    const finalFileName = fileName || `Honoraires_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, finalFileName);

    if (window.showToast) {
      window.showToast('✅ Export Excel généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export Excel honoraires:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération Excel', 'error');
    }
    throw error;
  }
}

/**
 * Exporter les honoraires en PDF
 * @param {object} honorairesData - Données des honoraires
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportHonorairesPDF(honorairesData, fileName = null) {
  try {
    const {
      montantTravaux = 0,
      evolutions = [],
      missions = [],
      partenaires = []
    } = honorairesData;

    const doc = new jsPDF();
    
    // En-tête entreprise
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('WIW Dev+', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Calcul d\'Honoraires', 20, 28);
    doc.text('123 Avenue de l\'Architecture, 75016 Paris', 20, 33);
    doc.text('contact@wiw-app.com | +33 1 23 45 67 89', 20, 38);
    
    // Titre
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('CALCUL D\'HONORAIRES', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 57);
    
    let yPos = 70;

    // Montant des travaux
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Montant des Travaux HT:', 20, yPos);
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text(formatCurrency(montantTravaux, 0), 20, yPos + 7);
    yPos += 20;

    // Tableau des évolutions
    if (evolutions.length > 0 && missions.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Évolutions des Pourcentages', 20, yPos);
      yPos += 10;

      // Préparer les données du tableau
      const tableData = missions.map(mission => {
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
      tableData.push(totalRow);

      const headers = ['Mission', ...evolutions.map(e => e.nom || 'Évolution')];

      doc.autoTable({
        startY: yPos,
        head: [headers],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 80 },
        },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Partenaires
    if (partenaires && partenaires.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Partenaires', 20, yPos);
      yPos += 10;

      const partenairesData = partenaires.map(p => [
        p.nom || '',
        formatCurrency(p.coutHoraire || 0, 2) + '/h',
        `${(p.heuresEstimees || 0).toFixed(1)} h`,
        formatCurrency((p.coutHoraire || 0) * (p.heuresEstimees || 0), 2)
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Nom', 'Coût horaire', 'Heures estimées', 'Montant prévisionnel']],
        body: partenairesData,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Document généré par WIW Dev+ - Calcul d'Honoraires - Page ${i}/${pageCount}`,
        20,
        285
      );
    }

    // Sauvegarder
    const finalFileName = fileName || `Honoraires_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(finalFileName);

    if (window.showToast) {
      window.showToast('✅ PDF généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export PDF honoraires:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération du PDF', 'error');
    }
    throw error;
  }
}

/**
 * Exporter les missions en Excel (format XLSX avec SheetJS)
 * @param {Array} missions - Liste des missions
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportMissionsExcel(missions = [], fileName = null) {
  try {
    // Créer un nouveau workbook
    const wb = XLSX.utils.book_new();

    // Préparer les données
    const data = [
      ['Numéro', 'Client', 'Type', 'Montant Travaux HT', 'Honoraires HT', 'Durée', 'Statut', 'Date']
    ];

    missions.forEach(mission => {
      data.push([
        mission.numero || '',
        mission.client?.nom || '',
        mission.typeMission || '',
        formatCurrency(mission.montantTravauxHT || 0, 2),
        formatCurrency(mission.honorairesPropose || 0, 2),
        `${mission.dureeEstimee || 0} jours`,
        mission.statut || '',
        mission.date ? new Date(mission.date).toLocaleDateString('fr-FR') : ''
      ]);
    });

    // Ajouter les métadonnées
    data.push(['']);
    data.push(['Date de génération', new Date().toLocaleString('fr-FR')]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Missions');

    // Générer le fichier Excel
    const finalFileName = fileName || `Missions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, finalFileName);

    if (window.showToast) {
      window.showToast('✅ Export Excel généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export Excel missions:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération Excel', 'error');
    }
    throw error;
  }
}

/**
 * Exporter les missions en PDF
 * @param {Array} missions - Liste des missions
 * @param {string} fileName - Nom du fichier (optionnel)
 */
export function exportMissionsPDF(missions = [], fileName = null) {
  try {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('WIW Dev+', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Export des Missions', 20, 28);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 33);
    
    let yPos = 50;

    if (missions.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Aucune mission à exporter', 20, yPos);
    } else {
      const tableData = missions.map(mission => [
        mission.numero || '',
        mission.client?.nom || '',
        mission.typeMission || '',
        formatCurrency(mission.montantTravauxHT || 0, 2),
        formatCurrency(mission.honorairesPropose || 0, 2),
        `${mission.dureeEstimee || 0} jours`,
        mission.statut || ''
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Numéro', 'Client', 'Type', 'Montant Travaux HT', 'Honoraires HT', 'Durée', 'Statut']],
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
    doc.text('Document généré par WIW Dev+ - Export des Missions', 20, 285);

    const finalFileName = fileName || `Missions_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(finalFileName);

    if (window.showToast) {
      window.showToast('✅ PDF généré avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur export PDF missions:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la génération du PDF', 'error');
    }
    throw error;
  }
}

export default {
  exportHonorairesExcel,
  exportHonorairesPDF,
  exportMissionsExcel,
  exportMissionsPDF
};
