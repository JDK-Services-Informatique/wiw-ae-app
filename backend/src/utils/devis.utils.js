// Utilitaires pour les calculs de devis

export function calculateLigneMontant(ligne) {
  const montantBrut = ligne.puHT * ligne.quantite;
  const montantRemise = montantBrut * (1 - ligne.remise / 100);
  return Math.round(montantRemise * 100) / 100; // Arrondi à 2 décimales
}

export function calculateChapitreSousTotal(lignes) {
  return lignes.reduce((total, ligne) => total + calculateLigneMontant(ligne), 0);
}

export function calculateSommeHeures(lignes) {
  return lignes
    .filter(ligne => ligne.unite === 'h')
    .reduce((total, ligne) => total + parseFloat(ligne.quantite || 0), 0);
}

export function calculateTVA(lignes, tauxTVA, rabais = 0, rabaisType = 'pourcentage') {
  const totalHT = lignes.reduce((total, ligne) => total + calculateLigneMontant(ligne), 0);

  // Appliquer le rabais
  let totalHTRabais = totalHT;
  if (rabaisType === 'pourcentage') {
    totalHTRabais = totalHT * (1 - rabais / 100);
  } else {
    totalHTRabais = Math.max(0, totalHT - rabais); // Éviter les valeurs négatives
  }

  const montantTVA = totalHTRabais * (tauxTVA / 100);
  const totalTTC = totalHTRabais + montantTVA;

  return {
    totalHT: Math.round(totalHT * 100) / 100,
    totalHTRabais: Math.round(totalHTRabais * 100) / 100,
    montantTVA: Math.round(montantTVA * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100
  };
}

export function formatCurrency(amount, locale = 'fr-FR', currency = 'EUR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(amount, locale = 'fr-FR') {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Validation des données de devis
export function validateDevisData(devisData) {
  const errors = [];

  if (!devisData.numero || typeof devisData.numero !== 'string' || devisData.numero.trim().length === 0) {
    errors.push('Le numéro du devis est obligatoire');
  }

  if (!devisData.clientNom || typeof devisData.clientNom !== 'string' || devisData.clientNom.trim().length === 0) {
    errors.push('Le nom du client est obligatoire');
  }

  if (devisData.tauxHoraire !== undefined && (typeof devisData.tauxHoraire !== 'number' || devisData.tauxHoraire < 0)) {
    errors.push('Le taux horaire doit être un nombre positif');
  }

  if (devisData.rabais !== undefined && (typeof devisData.rabais !== 'number' || devisData.rabais < 0)) {
    errors.push('Le rabais doit être un nombre positif');
  }

  if (devisData.rabaisType && !['pourcentage', 'montant'].includes(devisData.rabaisType)) {
    errors.push('Le type de rabais doit être "pourcentage" ou "montant"');
  }

  return errors;
}

// Génération automatique de numéro de devis
export function generateDevisNumero(utilisateurId, existingDevis = []) {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString().slice(-2);

  // Trouver le dernier numéro pour cette année
  const yearDevis = existingDevis.filter(devis =>
    devis.numero && devis.numero.startsWith(`DEV-${yearPrefix}-`)
  );

  let nextNumber = 1;
  if (yearDevis.length > 0) {
    const numbers = yearDevis.map(devis => {
      const parts = devis.numero.split('-');
      return parseInt(parts[2]) || 0;
    });
    nextNumber = Math.max(...numbers) + 1;
  }

  return `DEV-${yearPrefix}-${nextNumber.toString().padStart(3, '0')}`;
}

// Calcul de la cohérence heures/durée
export function checkCoherenceHeures(dureeEstimee, sommeHeuresPrevues) {
  if (!dureeEstimee || !sommeHeuresPrevues) return null;

  const ecart = Math.abs(dureeEstimee - sommeHeuresPrevues);
  const ecartPourcentage = (ecart / dureeEstimee) * 100;

  return {
    ecart: Math.round(ecart * 100) / 100,
    ecartPourcentage: Math.round(ecartPourcentage * 100) / 100,
    isCoherent: ecartPourcentage <= 25, // Alerte si > 25%
    niveau: ecartPourcentage <= 10 ? 'vert' :
            ecartPourcentage <= 25 ? 'orange' : 'rouge'
  };
}