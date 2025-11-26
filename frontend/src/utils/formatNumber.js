// Utilitaire pour formater les nombres avec séparateurs de milliers
// Format français : 1 234,56 €

/**
 * Formate un nombre avec séparateurs de milliers et décimales
 * @param {number} value - La valeur à formater
 * @param {number} decimals - Nombre de décimales (défaut: 2)
 * @param {string} currency - Devise à ajouter (défaut: '€')
 * @returns {string} - Nombre formaté (ex: "1 234,56 €")
 */
export function formatCurrency(value, decimals = 2, currency = 'EUR') {
  if (value === null || value === undefined || isNaN(value)) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true
    }).format(0);
  }

  const numValue = parseFloat(value);
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  }).format(numValue);
}

/**
 * Formate un nombre avec séparateurs de milliers (sans devise)
 * @param {number} value - La valeur à formater
 * @param {number} decimals - Nombre de décimales (défaut: 0)
 * @returns {string} - Nombre formaté (ex: "1 234" ou "1 234,56")
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const numValue = parseFloat(value);
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  }).format(numValue);
}

/**
 * Parse un nombre formaté français vers un nombre
 * @param {string} formattedValue - Valeur formatée (ex: "1 234,56")
 * @returns {number} - Nombre parsé
 */
export function parseFormattedNumber(formattedValue) {
  if (!formattedValue) return 0;
  
  // Remplacer espace (séparateur milliers) et virgule (décimales)
  const cleaned = formattedValue
    .replace(/\s/g, '') // Supprimer espaces
    .replace(',', '.'); // Remplacer virgule par point
  
  return parseFloat(cleaned) || 0;
}

/**
 * Formate un nombre d'heures
 * @param {number} hours - Nombre d'heures
 * @returns {string} - Formaté (ex: "1 234,5 h")
 */
export function formatHours(hours) {
  return `${formatNumber(hours, 1)} h`;
}

/**
 * Formate une surface
 * @param {number} surface - Surface en m²
 * @returns {string} - Formaté (ex: "1 234,56 m²")
 */
export function formatSurface(surface) {
  return `${formatNumber(surface, 2)} m²`;
}

export default {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
  formatHours,
  formatSurface
};

