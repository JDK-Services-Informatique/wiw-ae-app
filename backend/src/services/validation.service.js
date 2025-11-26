import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

/**
 * Service de validation et contrôles automatiques de cohérence
 * Selon le plan d'amélioration - Contrôles automatiques avec alertes
 */

/**
 * Valider la cohérence des pourcentages et montants
 * @param {Array} missions - Liste des missions avec pourcentages et montants
 * @param {number} montantTravaux - Montant total des travaux
 * @returns {object} - Résultat de la validation
 */
export function validatePourcentagesMontants(missions, montantTravaux) {
  const errors = [];
  const warnings = [];

  if (!missions || missions.length === 0) {
    warnings.push('Aucune mission définie');
    return { valid: true, errors, warnings };
  }

  // Calculer le total des pourcentages
  const totalPourcentages = missions.reduce((sum, m) => sum + (m.pourcentage || 0), 0);
  
  // Calculer le total des montants
  const totalMontants = missions.reduce((sum, m) => sum + (m.montantHT || 0), 0);

  // Vérifier la cohérence entre pourcentages et montants
  const montantAttendu = (montantTravaux * totalPourcentages) / 100;
  const ecart = Math.abs(totalMontants - montantAttendu);
  const ecartPourcentage = montantAttendu > 0 ? (ecart / montantAttendu) * 100 : 0;

  // Alerte si écart > 10%
  if (ecartPourcentage > 10) {
    errors.push(`Incohérence détectée : écart de ${ecartPourcentage.toFixed(1)}% entre les pourcentages et les montants`);
  } else if (ecartPourcentage > 5) {
    warnings.push(`Écart mineur : ${ecartPourcentage.toFixed(1)}% entre les pourcentages et les montants`);
  }

  // Vérifier que la somme des % est cohérente (règle 60/40 indicative)
  if (totalPourcentages < 30 || totalPourcentages > 100) {
    warnings.push(`Total des pourcentages (${totalPourcentages.toFixed(1)}%) en dehors de la plage recommandée (30-100%)`);
  }

  // Vérifier que chaque mission a un pourcentage ou un montant
  missions.forEach((mission, index) => {
    if (!mission.pourcentage && !mission.montantHT) {
      warnings.push(`Mission ${index + 1} (${mission.designation || 'Sans nom'}) : ni pourcentage ni montant défini`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalPourcentages,
    totalMontants,
    montantAttendu,
    ecart,
    ecartPourcentage
  };
}

/**
 * Valider le ratio €/m²
 * @param {number} montantTravaux - Montant des travaux
 * @param {number} surface - Surface en m²
 * @param {string} domaine - Domaine du projet
 * @returns {object} - Résultat de la validation
 */
export async function validateRatioEurosM2(montantTravaux, surface, domaine = null) {
  const warnings = [];

  if (!montantTravaux || !surface || surface === 0) {
    return { valid: true, warnings: ['Surface ou montant non défini'] };
  }

  const ratio = montantTravaux / surface;

  // Ratios indicatifs par domaine (en €/m²)
  const ratiosIndicatifs = {
    'Logements': { min: 1000, max: 3000 },
    'Équipements publics': { min: 1500, max: 5000 },
    'Commerce': { min: 800, max: 2500 },
    'Bureaux': { min: 1200, max: 3500 },
    'Industrie': { min: 500, max: 1500 },
    'Santé': { min: 2000, max: 6000 }
  };

  // Comparer avec les ratios historiques si disponibles
  if (domaine && ratiosIndicatifs[domaine]) {
    const { min, max } = ratiosIndicatifs[domaine];
    if (ratio < min) {
      warnings.push(`Ratio €/m² (${Math.round(ratio)} €/m²) inférieur à la fourchette typique pour ${domaine} (${min}-${max} €/m²)`);
    } else if (ratio > max) {
      warnings.push(`Ratio €/m² (${Math.round(ratio)} €/m²) supérieur à la fourchette typique pour ${domaine} (${min}-${max} €/m²)`);
    }
  } else {
    // Ratio général (500-6000 €/m²)
    if (ratio < 500) {
      warnings.push(`Ratio €/m² très faible (${Math.round(ratio)} €/m²) - vérifier les données`);
    } else if (ratio > 6000) {
      warnings.push(`Ratio €/m² très élevé (${Math.round(ratio)} €/m²) - vérifier les données`);
    }
  }

  return {
    valid: true,
    warnings,
    ratio: Math.round(ratio)
  };
}

/**
 * Valider la cohérence montants vs heures
 * @param {Array} partenaires - Liste des partenaires avec heures et taux horaires
 * @param {number} montantTotal - Montant total des honoraires
 * @returns {object} - Résultat de la validation
 */
export function validateMontantsHeures(partenaires, montantTotal) {
  const errors = [];
  const warnings = [];

  if (!partenaires || partenaires.length === 0) {
    return { valid: true, errors, warnings };
  }

  // Calculer le coût total basé sur les heures
  const coutTotalHeures = partenaires.reduce((sum, p) => {
    const heures = p.heuresEstimees || p.heures || 0;
    const taux = p.coutHoraire || 0;
    return sum + (heures * taux);
  }, 0);

  // Comparer avec le montant total
  const ecart = Math.abs(montantTotal - coutTotalHeures);
  const ecartPourcentage = montantTotal > 0 ? (ecart / montantTotal) * 100 : 0;

  // Alerte si écart > 25%
  if (ecartPourcentage > 25) {
    errors.push(`Incohérence importante : écart de ${ecartPourcentage.toFixed(1)}% entre le montant total (${montantTotal.toFixed(2)} €) et le coût calculé (${coutTotalHeures.toFixed(2)} €)`);
  } else if (ecartPourcentage > 10) {
    warnings.push(`Écart modéré : ${ecartPourcentage.toFixed(1)}% entre le montant total et le coût calculé`);
  }

  // Vérifier que chaque partenaire a un taux horaire
  partenaires.forEach((partenaire, index) => {
    if (!partenaire.coutHoraire || partenaire.coutHoraire === 0) {
      warnings.push(`Partenaire ${index + 1} (${partenaire.nom || 'Sans nom'}) : taux horaire non défini`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    coutTotalHeures,
    montantTotal,
    ecart,
    ecartPourcentage
  };
}

/**
 * Valider la complétude des tranches
 * @param {Array} missions - Liste des missions avec tranches
 * @returns {object} - Résultat de la validation
 */
export function validateTranches(missions) {
  const errors = [];
  const warnings = [];

  if (!missions || missions.length === 0) {
    return { valid: true, errors, warnings };
  }

  // Grouper par tranche
  const tranches = {
    FERME: [],
    CONDITIONNELLE: [],
    OPTIONNELLE: []
  };

  missions.forEach(m => {
    const tranche = m.tranche?.toUpperCase() || 'FERME';
    if (tranches[tranche]) {
      tranches[tranche].push(m);
    }
  });

  // Vérifier que les tranches fermes sont complètes
  if (tranches.FERME.length === 0) {
    warnings.push('Aucune mission dans la tranche FERME - les tranches fermes doivent être complètes');
  }

  // Vérifier que chaque tranche ferme a au moins une mission de base
  const tranchesFermesAvecBase = tranches.FERME.filter(m => 
    m.typeMission?.toUpperCase() === 'BASE' || m.typeMission?.toUpperCase() === 'MOE'
  );
  
  if (tranches.FERME.length > 0 && tranchesFermesAvecBase.length === 0) {
    errors.push('Les tranches fermes doivent contenir au moins une mission de base');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    tranches: {
      ferme: tranches.FERME.length,
      conditionnelle: tranches.CONDITIONNELLE.length,
      optionnelle: tranches.OPTIONNELLE.length
    }
  };
}

/**
 * Valider la complétude de l'équipe
 * @param {Array} equipe - Liste des membres de l'équipe
 * @returns {object} - Résultat de la validation
 */
export function validateEquipe(equipe) {
  const errors = [];
  const warnings = [];

  if (!equipe || equipe.length === 0) {
    warnings.push('Aucune équipe définie');
    return { valid: true, errors, warnings };
  }

  // Vérifier que chaque membre a un taux horaire
  equipe.forEach((membre, index) => {
    if (!membre.coutHoraire || membre.coutHoraire === 0) {
      warnings.push(`Membre ${index + 1} (${membre.nom || 'Sans nom'}) : taux horaire non défini`);
    }
    if (!membre.nom || membre.nom.trim() === '') {
      errors.push(`Membre ${index + 1} : nom manquant`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validation globale d'un AO avec ses missions et honoraires
 * @param {number} aoId - ID de l'appel d'offre
 * @returns {Promise<object>} - Résultat de la validation globale
 */
export async function validateAOComplet(aoId) {
  try {
    const ao = await prisma.appelOffre.findUnique({
      where: { id: aoId },
      include: {
        missions: {
          include: {
            honoraires: true
          }
        }
      }
    });

    if (!ao) {
      return {
        valid: false,
        errors: ['Appel d\'offre non trouvé'],
        warnings: []
      };
    }

    const allErrors = [];
    const allWarnings = [];

    // Valider le montant des travaux
    if (!ao.montantTravaux && !ao.montant) {
      allWarnings.push('Montant des travaux non défini dans l\'AO');
    }

    // Valider les missions
    if (ao.missions && ao.missions.length > 0) {
      const validationMissions = validatePourcentagesMontants(
        ao.missions.map(m => ({
          designation: m.designation,
          pourcentage: m.pourcentage,
          montantHT: m.montantHT
        })),
        ao.montantTravaux || ao.montant || 0
      );
      allErrors.push(...validationMissions.errors);
      allWarnings.push(...validationMissions.warnings);

      // Valider les tranches
      const validationTranches = validateTranches(ao.missions);
      allErrors.push(...validationTranches.errors);
      allWarnings.push(...validationTranches.warnings);
    } else {
      allWarnings.push('Aucune mission définie pour cet AO');
    }

    // Valider les honoraires
    const allHonoraires = ao.missions.flatMap(m => m.honoraires || []);
    if (allHonoraires.length > 0) {
      const montantTotalHonoraires = allHonoraires.reduce((sum, h) => sum + (h.montant || 0), 0);
      // TODO: Récupérer l'équipe pour valider montants vs heures
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      aoId,
      nbMissions: ao.missions?.length || 0
    };
  } catch (error) {
    logger.error('Erreur lors de la validation globale de l\'AO', { 
      error: error.message, 
      aoId 
    });
    return {
      valid: false,
      errors: [error.message],
      warnings: []
    };
  }
}

