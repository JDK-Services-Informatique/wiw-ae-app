import logger from '../utils/logger.js';

/**
 * Service de validation avancée pour les Appels d'Offres
 * Vérifie la cohérence entre honoraires, équipes et montants
 */

/**
 * Valide la cohérence des honoraires par rapport à l'équipe
 * @param {Object} aoData - Données de l'AO
 * @param {Float} aoData.montantTravaux - Montant des travaux HT
 * @param {Float} aoData.montant - Montant total des honoraires
 * @param {Array} aoData.partenaires - Liste des partenaires avec {nom, domaine, pourcentage, montant}
 * @returns {Object} - { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateHonorairesVsEquipe(aoData) {
  const errors = [];
  const warnings = [];

  // Extraire les données depuis metadata si présentes (format API frontend)
  const partenaires = aoData.metadata?.honoraires?.partenaires || aoData.partenaires || [];
  const montantTravaux = aoData.montantTravaux;
  const montantTotal = aoData.montant;

  // 1. Vérifier que montantTravaux existe
  if (!montantTravaux || montantTravaux <= 0) {
    errors.push('Le montant des travaux doit être supérieur à 0');
    return { valid: false, errors, warnings };
  }

  // 2. Si aucun partenaire, c'est ok (AO en cours de constitution)
  if (!partenaires || partenaires.length === 0) {
    warnings.push('Aucun partenaire défini pour cet AO');
    return { valid: true, errors, warnings };
  }

  // 3. Calculer la somme des pourcentages
  const sommePourcentages = partenaires.reduce((sum, p) => sum + (p.pourcentage || 0), 0);
  const tolerancePourcentage = 0.5; // Tolérance de 0.5%

  if (Math.abs(sommePourcentages - 100) > tolerancePourcentage) {
    errors.push(
      `La somme des pourcentages (${sommePourcentages.toFixed(2)}%) doit être égale à 100% (tolérance: ±${tolerancePourcentage}%)`
    );
  }

  // 4. Vérifier que chaque montant partenaire correspond à son pourcentage
  const toleranceMontant = 100; // Tolérance de 100€ pour arrondis

  partenaires.forEach((partenaire, index) => {
    if (!partenaire.pourcentage) {
      warnings.push(`Partenaire "${partenaire.nom}": pourcentage non défini`);
      return;
    }

    if (!partenaire.montant && partenaire.montant !== 0) {
      warnings.push(`Partenaire "${partenaire.nom}": montant non défini`);
      return;
    }

    // Calculer le montant théorique basé sur le pourcentage
    const montantTheorique = (montantTravaux * partenaire.pourcentage) / 100;
    const difference = Math.abs(partenaire.montant - montantTheorique);

    if (difference > toleranceMontant) {
      errors.push(
        `Partenaire "${partenaire.nom}": montant incohérent. ` +
        `Attendu: ${montantTheorique.toFixed(2)}€ (${partenaire.pourcentage}% de ${montantTravaux}€), ` +
        `Reçu: ${partenaire.montant.toFixed(2)}€ (différence: ${difference.toFixed(2)}€)`
      );
    }
  });

  // 5. Vérifier que la somme des montants partenaires correspond au montant total si présent
  if (montantTotal) {
    const sommeMontantsPartenaires = partenaires.reduce((sum, p) => sum + (p.montant || 0), 0);
    const differenceTotal = Math.abs(sommeMontantsPartenaires - montantTotal);
    const toleranceTotal = partenaires.length * toleranceMontant; // Tolérance proportionnelle au nombre de partenaires

    if (differenceTotal > toleranceTotal) {
      warnings.push(
        `Somme des montants partenaires (${sommeMontantsPartenaires.toFixed(2)}€) ` +
        `différente du montant total AO (${montantTotal.toFixed(2)}€). ` +
        `Différence: ${differenceTotal.toFixed(2)}€`
      );
    }
  }

  // 6. Vérifier qu'il n'y a pas de partenaires en double
  const nomsPartenaires = partenaires.map(p => p.nom?.toLowerCase().trim()).filter(Boolean);
  const doublons = nomsPartenaires.filter((nom, index) => nomsPartenaires.indexOf(nom) !== index);

  if (doublons.length > 0) {
    warnings.push(`Partenaires en double détectés: ${[...new Set(doublons)].join(', ')}`);
  }

  // 7. Vérifier que les pourcentages individuels sont dans une plage raisonnable
  partenaires.forEach(partenaire => {
    if (partenaire.pourcentage < 0) {
      errors.push(`Partenaire "${partenaire.nom}": pourcentage négatif (${partenaire.pourcentage}%)`);
    }
    if (partenaire.pourcentage > 100) {
      errors.push(`Partenaire "${partenaire.nom}": pourcentage supérieur à 100% (${partenaire.pourcentage}%)`);
    }
    // Avertissement si un partenaire a moins de 1% (sauf 0%)
    if (partenaire.pourcentage > 0 && partenaire.pourcentage < 1) {
      warnings.push(`Partenaire "${partenaire.nom}": pourcentage très faible (${partenaire.pourcentage}%)`);
    }
  });

  const valid = errors.length === 0;

  if (!valid) {
    logger.warn('Validation AO échouée', { aoId: aoData.id, errors, warnings });
  } else if (warnings.length > 0) {
    logger.info('Validation AO réussie avec avertissements', { aoId: aoData.id, warnings });
  }

  return { valid, errors, warnings };
}

/**
 * Valide la cohérence globale d'un AO avant création/mise à jour
 * @param {Object} aoData - Données de l'AO
 * @returns {Object} - { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateAO(aoData) {
  const allErrors = [];
  const allWarnings = [];

  // Validation des champs obligatoires
  if (!aoData.titre || aoData.titre.trim() === '') {
    allErrors.push('Le titre est obligatoire');
  }

  if (!aoData.montantTravaux || aoData.montantTravaux <= 0) {
    allErrors.push('Le montant des travaux doit être supérieur à 0');
  }

  // Validation honoraires vs équipe
  const honorairesValidation = validateHonorairesVsEquipe(aoData);
  allErrors.push(...honorairesValidation.errors);
  allWarnings.push(...honorairesValidation.warnings);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * Middleware pour valider un AO avant création/mise à jour
 */
export function validateAOMiddleware(req, res, next) {
  const validation = validateAO(req.body);

  // Si erreurs, rejeter avec 400
  if (!validation.valid) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: validation.errors,
      warnings: validation.warnings
    });
  }

  // Si seulement des warnings, les attacher à la requête et continuer
  if (validation.warnings.length > 0) {
    req.validationWarnings = validation.warnings;
    logger.info('AO validé avec avertissements', { warnings: validation.warnings });
  }

  next();
}
