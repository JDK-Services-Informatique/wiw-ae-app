// Base de référence : Missions ↔ Compétences requises ↔ Métiers ↔ BET

export const missionsCompetencesRef = {
  'ESQ': {
    nom: 'ESQ - Esquisse',
    type: 'Base',
    competencesRequises: [
      'Conception architecturale',
      'Analyse de site',
      'Faisabilité technique',
      'Faisabilité économique',
      'Esquisse 3D'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Architecture', domaine: 'Conception', categorie: 'Designer' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Architecte concepteur',
      'Dessinateur'
    ],
    phasePrincipale: 'Conception',
    dureeTypique: '3-6 semaines'
  },
  'APS': {
    nom: 'APS - Avant-Projet Sommaire',
    type: 'Base',
    competencesRequises: [
      'Plans architecturaux',
      'Implantation',
      'Volumes et surfaces',
      'Matériaux',
      'Chiffrage sommaire'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Économie', domaine: 'Études de prix', categorie: 'Économiste' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Architecte',
      'Dessinateur projeteur',
      'Économiste'
    ],
    phasePrincipale: 'Conception',
    dureeTypique: '6-10 semaines'
  },
  'APD': {
    nom: 'APD - Avant-Projet Définitif',
    type: 'Base',
    competencesRequises: [
      'Plans détaillés',
      'Coupes et façades',
      'Choix techniques',
      'Notice descriptive',
      'Estimation détaillée'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Économie', domaine: 'Études de prix', categorie: 'Économiste' },
      { macro: 'Ingénierie', domaine: 'Structure', categorie: 'Ingénieur structure' }
    ],
    betRequis: ['Structure', 'Thermique & Fluides'],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Architecte',
      'Dessinateur projeteur',
      'Économiste',
      'BET Structure',
      'BET Fluides'
    ],
    phasePrincipale: 'Conception',
    dureeTypique: '8-12 semaines'
  },
  'PRO': {
    nom: 'PRO - Projet',
    type: 'Base',
    competencesRequises: [
      'DCE complet',
      'CCTP',
      'DPGF',
      'Plans d\'exécution préliminaires',
      'Consultation entreprises'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Économie', domaine: 'Études de prix', categorie: 'Économiste' },
      { macro: 'Ingénierie', domaine: 'Structure', categorie: 'Ingénieur structure' },
      { macro: 'Ingénierie', domaine: 'Fluides', categorie: 'Ingénieur CVC' }
    ],
    betRequis: ['Structure', 'Thermique & Fluides', 'Électricité'],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Architecte',
      'Dessinateur projeteur',
      'Économiste',
      'BET Structure',
      'BET Fluides',
      'BET Électricité',
      'Coordinateur'
    ],
    phasePrincipale: 'Projet',
    dureeTypique: '10-16 semaines'
  },
  'ACT': {
    nom: 'ACT - Assistance aux contrats de travaux',
    type: 'Base',
    competencesRequises: [
      'Analyse des offres',
      'Négociation',
      'Rédaction contrats',
      'Mise au point marchés'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Économie', domaine: 'Études de prix', categorie: 'Économiste' },
      { macro: 'Juridique', domaine: 'Marchés publics', categorie: 'Juriste' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Économiste',
      'Juriste',
      'Assistant administratif'
    ],
    phasePrincipale: 'Consultation',
    dureeTypique: '4-6 semaines'
  },
  'VISA': {
    nom: 'VISA - Visa',
    type: 'Additionnelle',
    competencesRequises: [
      'Validation plans d\'exécution',
      'Contrôle conformité',
      'Vérification technique',
      'Annotations'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Ingénierie', domaine: 'Structure', categorie: 'Ingénieur structure' }
    ],
    betRequis: ['Structure'],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Architecte',
      'BET Structure',
      'Contrôleur technique'
    ],
    phasePrincipale: 'Exécution',
    dureeTypique: '6-10 semaines'
  },
  'DET': {
    nom: 'DET - Direction de l\'exécution des travaux',
    type: 'Complémentaire',
    competencesRequises: [
      'Suivi de chantier',
      'Réunions de chantier',
      'Contrôle qualité',
      'Gestion aléas',
      'Réception travaux'
    ],
    metiersRequis: [
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' },
      { macro: 'Architecture', domaine: 'Chantier', categorie: 'Conducteur de travaux' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Architecte chef de projet',
      'Conducteur de travaux',
      'Économiste (suivi)',
      'Assistant chantier'
    ],
    phasePrincipale: 'Exécution',
    dureeTypique: 'Durée du chantier'
  },
  'OPC': {
    nom: 'OPC - Ordonnancement, pilotage, coordination',
    type: 'Complémentaire',
    competencesRequises: [
      'Planning général',
      'Coordination entreprises',
      'Suivi avancement',
      'Gestion interfaces',
      'Pilotage délais'
    ],
    metiersRequis: [
      { macro: 'Gestion', domaine: 'Coordination', categorie: 'OPC' },
      { macro: 'Architecture', domaine: 'Maîtrise d\'œuvre', categorie: 'Architecte DPLG' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Coordinateur OPC',
      'Planificateur',
      'Architecte chef de projet',
      'Assistant coordination'
    ],
    phasePrincipale: 'Exécution',
    dureeTypique: 'Durée du chantier + préparation'
  },
  'DIAG': {
    nom: 'Diagnostic technique',
    type: 'Additionnelle',
    competencesRequises: [
      'Analyse pathologies',
      'Diagnostic structure',
      'Diagnostic thermique',
      'Relevés techniques',
      'Préconisations'
    ],
    metiersRequis: [
      { macro: 'Ingénierie', domaine: 'Structure', categorie: 'Ingénieur structure' },
      { macro: 'Architecture', domaine: 'Rénovation', categorie: 'Architecte patrimoine' }
    ],
    betRequis: ['Structure', 'Thermique & Fluides'],
    fonctionsLiees: [
      'BET Structure',
      'BET Thermique',
      'Architecte patrimoine',
      'Diagnostiqueur'
    ],
    phasePrincipale: 'Études préalables',
    dureeTypique: '2-4 semaines'
  },
  'JURIDIQUE': {
    nom: 'Assistance juridique',
    type: 'Optionnelle',
    competencesRequises: [
      'Conseil juridique',
      'Montage opération',
      'Contrats',
      'Litiges',
      'Marchés publics'
    ],
    metiersRequis: [
      { macro: 'Juridique', domaine: 'Marchés publics', categorie: 'Juriste' },
      { macro: 'Juridique', domaine: 'Urbanisme', categorie: 'Juriste urbanisme' }
    ],
    betRequis: [],
    fonctionsLiees: [
      'Juriste',
      'Avocat',
      'Conseil juridique'
    ],
    phasePrincipale: 'Toutes phases',
    dureeTypique: 'Ponctuel'
  }
};

// Matrice de compatibilité : Compétences → Métiers → BET
export const competencesMetiersMatrix = {
  'Conception architecturale': {
    metiers: ['Architecte DPLG', 'Architecte', 'Designer'],
    bet: []
  },
  'Plans architecturaux': {
    metiers: ['Architecte DPLG', 'Architecte', 'Dessinateur projeteur'],
    bet: []
  },
  'Plans détaillés': {
    metiers: ['Architecte DPLG', 'Dessinateur projeteur'],
    bet: []
  },
  'Calcul structure': {
    metiers: ['Ingénieur structure'],
    bet: ['Structure']
  },
  'Étude thermique': {
    metiers: ['Ingénieur CVC', 'Ingénieur thermique'],
    bet: ['Thermique & Fluides']
  },
  'CVC': {
    metiers: ['Ingénieur CVC'],
    bet: ['Thermique & Fluides']
  },
  'Électricité': {
    metiers: ['Ingénieur électricité'],
    bet: ['Électricité']
  },
  'Suivi de chantier': {
    metiers: ['Architecte DPLG', 'Conducteur de travaux'],
    bet: []
  },
  'Économie de la construction': {
    metiers: ['Économiste'],
    bet: []
  },
  'Coordination': {
    metiers: ['OPC', 'Coordinateur'],
    bet: []
  },
  'Diagnostic structure': {
    metiers: ['Ingénieur structure', 'Architecte patrimoine'],
    bet: ['Structure']
  },
  'Diagnostic thermique': {
    metiers: ['Ingénieur thermique'],
    bet: ['Thermique & Fluides']
  },
  'Juridique': {
    metiers: ['Juriste', 'Avocat'],
    bet: []
  },
  'Acoustique': {
    metiers: ['Ingénieur acoustique'],
    bet: ['Acoustique']
  }
};

// Fonctions utilitaires
export function getMissionCompetences(missionCode) {
  return missionsCompetencesRef[missionCode] || null;
}

export function getRequiredMetiersForMission(missionCode) {
  const mission = missionsCompetencesRef[missionCode];
  return mission ? mission.metiersRequis : [];
}

export function getRequiredBETForMission(missionCode) {
  const mission = missionsCompetencesRef[missionCode];
  return mission ? mission.betRequis : [];
}

export function getFonctionsForMission(missionCode) {
  const mission = missionsCompetencesRef[missionCode];
  return mission ? mission.fonctionsLiees : [];
}

export function matchEquipeToMission(missionCode, equipeMembers, betList) {
  const mission = missionsCompetencesRef[missionCode];
  if (!mission) return { equipe: [], bet: [] };

  // Matcher les membres d'équipe selon leurs métiers
  const matchedEquipe = equipeMembers.filter(member => {
    if (!member.metier) return false;
    return mission.metiersRequis.some(metierRequis => 
      member.metier.categorie === metierRequis.categorie ||
      member.metier.domaine === metierRequis.domaine
    );
  });

  // Matcher les BET selon leur type
  const matchedBET = betList.filter(bet => 
    mission.betRequis.includes(bet.type)
  );

  return {
    equipe: matchedEquipe,
    bet: matchedBET,
    competencesManquantes: getCompetencesManquantes(mission, matchedEquipe, matchedBET)
  };
}

function getCompetencesManquantes(mission, equipe, bet) {
  const competencesDisponibles = [];
  
  // Compétences de l'équipe
  equipe.forEach(member => {
    if (member.competences) {
      competencesDisponibles.push(...member.competences);
    }
  });
  
  // Compétences des BET
  bet.forEach(b => {
    if (b.competences) {
      competencesDisponibles.push(...b.competences);
    }
  });

  // Compétences requises non couvertes
  return mission.competencesRequises.filter(
    comp => !competencesDisponibles.includes(comp)
  );
}

export function suggestEquipeForMissions(selectedMissions, equipeMembers, betList) {
  const suggestions = {};
  
  selectedMissions.forEach(missionCode => {
    suggestions[missionCode] = matchEquipeToMission(missionCode, equipeMembers, betList);
  });

  return suggestions;
}

// Export par défaut
export default {
  missionsCompetencesRef,
  competencesMetiersMatrix,
  getMissionCompetences,
  getRequiredMetiersForMission,
  getRequiredBETForMission,
  getFonctionsForMission,
  matchEquipeToMission,
  suggestEquipeForMissions
};
