/**
 * Utilitaire pour générer des PDF simples
 * Note: Pour une production réelle, utiliser jsPDF ou pdfmake
 */

/**
 * Génère un PDF simple avec texte
 * @param {string} title - Titre du document
 * @param {string[]} lines - Lignes de texte à inclure
 * @param {string} fileName - Nom du fichier (optionnel)
 * @returns {string} fileName - Nom du fichier généré
 */
export function generateSimplePDF(title, lines = [], fileName = 'document.pdf') {
  const date = new Date().toLocaleDateString('fr-FR');
  
  // Construire le contenu du stream
  let yPosition = 750;
  let streamContent = `BT\n/F1 18 Tf\n50 ${yPosition} Td\n(${escapeForPDF(title)}) Tj\n`;
  yPosition -= 30;
  
  streamContent += `0 -30 Td\n/F1 10 Tf\n(Date: ${date}) Tj\n`;
  yPosition -= 20;
  
  lines.forEach(line => {
    streamContent += `0 -20 Td\n(${escapeForPDF(line)}) Tj\n`;
    yPosition -= 20;
  });
  
  streamContent += 'ET';
  
  const streamLength = streamContent.length;
  
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length ${streamLength}
>>
stream
${streamContent}
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000270 00000 n 
0000000${(370 + streamLength).toString().padStart(5, '0')} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${450 + streamLength}
%%EOF`;

  return pdfContent;
}

/**
 * Échappe les caractères spéciaux pour PDF
 */
function escapeForPDF(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/ù/g, 'u')
    .replace(/ô/g, 'o')
    .replace(/î/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/€/g, 'EUR');
}

/**
 * Télécharge un blob en tant que fichier
 */
export function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Génère et télécharge un PDF
 */
export function downloadPDF(title, lines, fileName = 'document.pdf') {
  const pdfContent = generateSimplePDF(title, lines, fileName);
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  downloadBlob(blob, fileName);
}

/**
 * Génère un PDF de rapport de projet
 */
export function generateProjectReportPDF(project) {
  const lines = [
    `Projet: ${project.nom || 'Sans nom'}`,
    `Client: ${project.client || 'Non specifie'}`,
    `Montant: ${project.montant ? project.montant.toLocaleString('fr-FR') + ' EUR' : 'N/A'}`,
    `Statut: ${project.statut || 'N/A'}`,
    ``,
    `Rapport genere automatiquement par WIW / AE+`
  ];
  
  downloadPDF(`Rapport de Projet - ${project.nom || 'Document'}`, lines, `projet-${project.nom || 'rapport'}.pdf`);
}

/**
 * Génère un PDF de fiche technique
 */
export function generateTechnicalSheetPDF(equipment) {
  const lines = [
    `Designation: ${equipment.designation || 'Sans nom'}`,
    `Quantite: ${equipment.quantite || 0}`,
    `Entreprise: ${equipment.entreprise || 'Non specifie'}`,
    ``,
    `Caracteristiques techniques:`,
    `- Document officiel du fabricant`,
    `- Specifications detaillees`,
    `- Manuel d'utilisation`,
    ``,
    `Document genere par WIW / AE+`
  ];
  
  downloadPDF(
    `Fiche Technique - ${equipment.designation || 'Document'}`, 
    lines, 
    equipment.fichierTechnique || 'fiche-technique.pdf'
  );
}

/**
 * Génère un PDF de CV/document RH
 */
export function generateHRDocumentPDF(fileName, person) {
  const docType = fileName.includes('CV') ? 'Curriculum Vitae' : 
                  fileName.includes('Diplome') ? 'Diplome' : 
                  fileName.includes('Justificatif') ? 'Justificatif' : 'Document';
  
  const lines = [
    `Type de document: ${docType}`,
    person ? `Personne: ${person.nom || ''}` : '',
    person ? `Fonction: ${person.fonction || ''}` : '',
    ``,
    `Document officiel`,
    `Date d'emission: ${new Date().toLocaleDateString('fr-FR')}`,
    ``,
    `Archive numerique WIW / AE+`
  ].filter(line => line !== '');
  
  downloadPDF(docType, lines, fileName);
}

/**
 * Génère un PDF d'export de données
 */
export function generateDataExportPDF(data) {
  const lines = [
    `Application: WIW / AE+`,
    `Type: Exportation complete des donnees`,
    ``,
    `Statistiques:`,
    `- Projets actifs: ${data.projetsActifs || 0}`,
    `- CA previsionnel: ${(data.caProvisionnel || 0).toLocaleString('fr-FR')} EUR`,
    `- Partenaires: ${data.partenaires || 0}`,
    `- Taux satisfaction: ${data.satisfaction || 0}%`,
    ``,
    `Donnees exportees avec succes`,
    `Format: PDF (Document Adobe Acrobat)`
  ];
  
  const date = new Date().toISOString().split('T')[0];
  downloadPDF('Exportation des donnees', lines, `wiw-export-${date}.pdf`);
}
