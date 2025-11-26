/**
 * Données par défaut réalistes et professionnelles pour l'application WIW
 * Ces données servent de base pour la démonstration et peuvent être remplacées par des données réelles
 */

// Données de projets/références professionnelles
export const defaultProjets = [
  {
    id: 1,
    nom: 'Résidence Les Jardins de la Confluence',
    domaine: 'Logements',
    type: 'Logements collectifs',
    localisation: 'Lyon 2e (69)',
    surface: 4850,
    montantTravauxHT: 4200000,
    maitreOuvrage: 'SAIEM Lyon Habitat',
    annee: '2023',
    statut: 'Livré',
    dateCreation: '2023-01-15',
    description: 'Construction de 68 logements sociaux avec espaces verts, parking souterrain et commerces de proximité. Mission complète de maîtrise d\'œuvre.',
    image: '[Entreprise]',
    photos: [],
    documents: [],
    vignette: null,
    tags: ['HQE', 'Bâtiment passif', 'Accessibilité PMR']
  },
  {
    id: 2,
    nom: 'Médiathèque Municipale Jean Jaurès',
    domaine: 'Équipements publics',
    type: 'Équipement culturel',
    localisation: 'Toulouse (31)',
    surface: 3200,
    montantTravauxHT: 6800000,
    maitreOuvrage: 'Ville de Toulouse',
    annee: '2022',
    statut: 'En cours',
    dateCreation: '2022-03-10',
    description: 'Rénovation et extension d\'une médiathèque de 3200m² avec création d\'espaces numériques, auditorium et café littéraire. Mission complète avec suivi de chantier.',
    image: '📚',
    photos: [],
    documents: [],
    vignette: null,
    tags: ['Rénovation', 'Patrimoine', 'Accessibilité']
  },
  {
    id: 3,
    nom: 'Centre Commercial Odyssée - Extension',
    domaine: 'Commerce',
    type: 'Centre commercial',
    localisation: 'Marseille 13e (13)',
    surface: 12500,
    montantTravauxHT: 18500000,
    maitreOuvrage: 'Klépierre',
    annee: '2024',
    statut: 'En cours',
    dateCreation: '2024-02-20',
    description: 'Extension d\'un centre commercial existant avec création de 25 nouvelles enseignes, parking multi-niveaux et espaces de restauration. Mission complète avec coordination SPS.',
    image: '🛍️',
    photos: [],
    documents: [],
    vignette: null,
    tags: ['Extension', 'Commerce', 'Parking']
  },
  {
    id: 4,
    nom: 'Gymnase du Lycée Victor Hugo',
    domaine: 'Équipements publics',
    type: 'Équipement sportif',
    localisation: 'Nice (06)',
    surface: 1800,
    montantTravauxHT: 3200000,
    maitreOuvrage: 'Région Provence-Alpes-Côte d\'Azur',
    annee: '2023',
    statut: 'Livré',
    dateCreation: '2023-06-05',
    description: 'Construction d\'un gymnase de 1800m² avec tribunes, vestiaires et locaux techniques. Mission complète avec certification NF Sports.',
    image: '⚽',
    photos: [],
    documents: [],
    vignette: null,
    tags: ['Sport', 'Éducation', 'NF Sports']
  },
  {
    id: 5,
    nom: 'EHPAD Les Tilleuls',
    domaine: 'Santé',
    type: 'EHPAD',
    localisation: 'Grenoble (38)',
    surface: 4200,
    montantTravauxHT: 8500000,
    maitreOuvrage: 'Groupe Korian',
    annee: '2024',
    statut: 'En cours',
    dateCreation: '2024-01-12',
    description: 'Construction d\'un EHPAD de 120 lits avec unité Alzheimer, restaurant, espace de vie et jardin thérapeutique. Mission complète avec certification qualité.',
    image: '🏥',
    photos: [],
    documents: [],
    vignette: null,
    tags: ['Santé', 'Dépendance', 'HQE']
  }
];

// Données d'appels d'offres professionnels
export const defaultAOs = [
  {
    id: 1,
    titre: 'Résidence Les Oliviers - Quartier Confluence',
    domaine: 'Logements',
    type: 'Logements collectifs',
    client: 'Ville de Lyon',
    montant: 520000,
    dureePrevisionnelle: '24 mois',
    delai: '90 jours',
    statut: 'En cours',
    dateRendu: '2025-02-15',
    dateLimiteRemise: '2025-02-15',
    datePublication: '2024-11-20',
    vignette: '[Entreprise]',
    photos: [],
    montantTravauxPrevisionnel: 3200000,
    description: 'Construction de 45 logements sociaux avec espaces verts et parking. Mission complète de maîtrise d\'œuvre.',
    tranches: [
      { num: 1, phase: 'Phase 1 - Bâtiment A', description: 'Construction structure et enveloppe bâtiment A (15 logements)', montant: 320000, delai: 90 },
      { num: 2, phase: 'Phase 2 - Bâtiment B', description: 'Construction structure et enveloppe bâtiment B (15 logements)', montant: 320000, delai: 90 },
      { num: 3, phase: 'Phase 3 - Bâtiment C', description: 'Construction structure et enveloppe bâtiment C (15 logements)', montant: 320000, delai: 90 },
      { num: 4, phase: 'Phase 4 - Aménagements', description: 'Espaces verts, voiries et réseaux divers', montant: 200000, delai: 60 }
    ],
    partenaires: [
      { nom: 'BET Structures Martin & Associés', domaine: 'Structure', pourcentage: 28, montant: 145600 },
      { nom: 'BET Fluides Dupont', domaine: 'Fluides', pourcentage: 22, montant: 114400 },
      { nom: 'BET Économie de la Construction', domaine: 'Économie', pourcentage: 8, montant: 41600 }
    ],
    contactsInternes: [
      { nom: 'Jean Dupont', role: 'Chef de projet', tel: '06 12 34 56 78', email: 'j.dupont@cabinet.fr' },
      { nom: 'Marie Martin', role: 'Architecte projet', tel: '06 23 45 67 89', email: 'm.martin@cabinet.fr' },
      { nom: 'Pierre Bernard', role: 'Directeur technique', tel: '06 34 56 78 90', email: 'p.bernard@cabinet.fr' }
    ],
    contactsClients: [
      { nom: 'Sophie Moreau', role: 'Responsable urbanisme', tel: '04 78 12 34 56', email: 's.moreau@lyon.fr' },
      { nom: 'Marc Lefebvre', role: 'Chargé de mission', tel: '04 78 12 34 57', email: 'm.lefebvre@lyon.fr' }
    ],
    relances: [
      { date: '2024-12-01', type: 'Email', statut: 'Envoyé', note: 'Envoi dossier de candidature' },
      { date: '2024-12-15', type: 'Téléphone', statut: 'Planifié', note: 'Relance pour compléments' },
      { date: '2025-01-10', type: 'Réunion', statut: 'Planifié', note: 'Présentation équipe projet' }
    ],
    documentsLegaux: [
      { type: 'DPGF', nom: 'DPGF_Oliviers_2024.xlsx', date: '2024-11-20', taille: '2.4 MB' },
      { type: 'CCAG', nom: 'CCAG_MOE_2024.pdf', date: '2024-11-20', taille: '1.8 MB' }
    ],
    texteLegal: 'Appel d\'offres ouvert selon les articles L. 2121-1 et suivants du code de la commande publique.'
  },
  {
    id: 2,
    titre: 'Rénovation Énergétique - Groupe Scolaire',
    domaine: 'Équipements publics',
    type: 'Équipement scolaire',
    client: 'Ville de Villeurbanne',
    montant: 380000,
    dureePrevisionnelle: '18 mois',
    delai: '60 jours',
    statut: 'En cours',
    dateRendu: '2025-01-30',
    dateLimiteRemise: '2025-01-30',
    datePublication: '2024-12-01',
    vignette: '🏫',
    photos: [],
    montantTravauxPrevisionnel: 2800000,
    description: 'Rénovation énergétique complète d\'un groupe scolaire de 8 classes avec isolation, remplacement menuiseries et installation photovoltaïque.',
    tranches: [
      { num: 1, phase: 'Phase 1 - Études', description: 'Diagnostic énergétique et études techniques', montant: 120000, delai: 45 },
      { num: 2, phase: 'Phase 2 - Travaux', description: 'Travaux de rénovation énergétique', montant: 260000, delai: 365 }
    ],
    partenaires: [
      { nom: 'BET Thermique Expert', domaine: 'Thermique', pourcentage: 25, montant: 95000 },
      { nom: 'BET Électricité Pro', domaine: 'Électricité', pourcentage: 15, montant: 57000 }
    ],
    contactsInternes: [
      { nom: 'Claire Dubois', role: 'Chef de projet', tel: '06 45 67 89 01', email: 'c.dubois@cabinet.fr' }
    ],
    contactsClients: [
      { nom: 'Mme Lefèvre', role: 'Responsable Patrimoine', tel: '04 78 03 45 67', email: 'patrimoine@villeurbanne.fr' }
    ],
    relances: [],
    documentsLegaux: [],
    texteLegal: 'Appel d\'offres restreint selon les articles L. 2123-1 et suivants du code de la commande publique.'
  }
];

// Données d'opportunités de prospection professionnelles
export const defaultOpportunites = [
  {
    id: 1,
    nom: 'Résidence étudiante Campus Nord - Université Lyon 2',
    client: 'Université Lumière Lyon 2',
    domaine: 'Logement',
    type: 'Neuf',
    montantEstime: 4200000,
    probabilite: 75,
    statut: 'Négociation',
    dateCreation: '2024-09-15',
    echeance: '2025-01-30',
    contact: 'M. Durand - Directeur du Patrimoine',
    tel: '04 78 69 70 00',
    email: 'patrimoine@univ-lyon2.fr',
    notes: 'Projet prioritaire, budget validé par le conseil d\'administration. Notre cabinet a déjà réalisé 3 projets similaires pour cette université. Réunion de présentation prévue le 15 janvier 2025.',
    dejaTravaillé: true,
    avantages: ['Client récurrent', 'Budget validé', 'Références solides'],
    risques: ['Concurrence forte', 'Délais serrés']
  },
  {
    id: 2,
    nom: 'Rénovation Médiathèque Municipale - Extension',
    client: 'Ville de Villeurbanne',
    domaine: 'Équipements publics',
    type: 'Rénovation',
    montantEstime: 1800000,
    probabilite: 65,
    statut: 'Prospection',
    dateCreation: '2024-10-01',
    echeance: '2025-03-15',
    contact: 'Mme Lefèvre - Responsable Culture et Patrimoine',
    tel: '04 78 03 45 67',
    email: 'culture@villeurbanne.fr',
    notes: 'Extension de 800m² avec création d\'espaces numériques et café littéraire. Concurrence de 5 cabinets. Notre proposition met l\'accent sur notre expérience en équipements culturels (3 médiathèques réalisées).',
    dejaTravaillé: true,
    avantages: ['Expérience secteur', 'Proximité géographique'],
    risques: ['Concurrence nombreuse', 'Budget à confirmer']
  },
  {
    id: 3,
    nom: 'Immeuble Bureaux Tertiaires - Quartier Part-Dieu',
    client: 'Promoteur Urbanova',
    domaine: 'Tertiaire',
    type: 'Neuf',
    montantEstime: 12500000,
    probabilite: 85,
    statut: 'Contrat signé',
    dateCreation: '2024-07-20',
    echeance: '2024-12-31',
    contact: 'M. Bernard - Directeur Général',
    tel: '04 72 11 22 33',
    email: 'contact@urbanova.fr',
    notes: 'Contrat signé le 15 novembre 2024. Mission complète de maîtrise d\'œuvre pour un immeuble de bureaux de 8500m² avec parking souterrain. Démarrage des études janvier 2025.',
    dejaTravaillé: true,
    avantages: ['Contrat signé', 'Projet d\'envergure', 'Client fidèle'],
    risques: []
  },
  {
    id: 4,
    nom: 'Extension EHPAD Les Tilleuls - 40 lits supplémentaires',
    client: 'Groupe Santé Plus',
    domaine: 'Santé',
    type: 'Extension',
    montantEstime: 3200000,
    probabilite: 50,
    statut: 'Prospection',
    dateCreation: '2024-11-05',
    echeance: '2025-06-30',
    contact: 'Dr. Petit - Directeur Médical',
    tel: '04 76 45 67 89',
    email: 'direction@ehpad-tilleuls.fr',
    notes: 'Extension d\'un EHPAD existant avec création de 40 lits supplémentaires, unité Alzheimer et espace de rééducation. Budget en attente de validation ARS. Première rencontre prévue en janvier 2025.',
    dejaTravaillé: false,
    avantages: ['Secteur porteur', 'Projet structurant'],
    risques: ['Budget non validé', 'Délais incertains']
  },
  {
    id: 5,
    nom: 'Gymnase Lycée Victor Hugo - Construction neuve',
    client: 'Région Auvergne-Rhône-Alpes',
    domaine: 'Équipements publics',
    type: 'Neuf',
    montantEstime: 4800000,
    probabilite: 60,
    statut: 'Proposition envoyée',
    dateCreation: '2024-08-12',
    echeance: '2025-02-28',
    contact: 'M. Morel - Chargé de mission Patrimoine',
    tel: '04 26 73 57 00',
    email: 'patrimoine@auvergnerhonealpes.fr',
    notes: 'Construction d\'un gymnase de 2000m² avec tribunes, vestiaires et locaux techniques. Proposition envoyée le 10 décembre 2024. Réponse attendue fin janvier 2025. Notre expérience en équipements sportifs (5 gymnases réalisés) est un atout.',
    dejaTravaillé: false,
    avantages: ['Expérience secteur', 'Références solides'],
    risques: ['Délai de réponse long', 'Concurrence régionale']
  }
];

// Données de clients/entreprises professionnelles
export const defaultClients = [
  {
    id: 1,
    nom: 'Ville de Lyon',
    type: 'Public',
    contact: {
      responsable: 'M. Jean-Pierre Martin',
      fonction: 'Directeur Général des Services',
      telephone: '04 72 10 30 30',
      portable: '06 12 34 56 78',
      email: 'dgs@lyon.fr',
      adresse: '1 place de la Comédie',
      codePostal: '69001',
      ville: 'Lyon'
    },
    informationsLegales: {
      siret: '19690012345678',
      tva: 'FR19690012345',
      formeJuridique: 'Collectivité territoriale',
      capital: null
    },
    projets: [
      { id: 1, nom: 'Résidence Les Oliviers', statut: 'En cours', montant: 3200000 },
      { id: 2, nom: 'École Maternelle Centre', statut: 'Livré', montant: 1800000 }
    ],
    historique: [
      { date: '2023-06-15', projet: 'École Maternelle Centre', type: 'Mission complète' },
      { date: '2024-11-20', projet: 'Résidence Les Oliviers', type: 'Mission complète' }
    ],
    notes: 'Client majeur, 8 projets réalisés depuis 2018. Relations excellentes avec les services techniques. Paiements réguliers.',
    secteur: 'Collectivité territoriale',
    chiffreAffaires: 8500000
  },
  {
    id: 2,
    nom: 'SAIEM Lyon Habitat',
    type: 'Public',
    contact: {
      responsable: 'Mme Sophie Dubois',
      fonction: 'Directrice du Développement',
      telephone: '04 78 69 12 34',
      portable: '06 23 45 67 89',
      email: 's.dubois@saiem-lyon.fr',
      adresse: '15 avenue de la République',
      codePostal: '69003',
      ville: 'Lyon'
    },
    informationsLegales: {
      siret: '38456789012345',
      tva: 'FR38456789012',
      formeJuridique: 'SAIEM',
      capital: 5000000
    },
    projets: [
      { id: 3, nom: 'Résidence Les Jardins', statut: 'Livré', montant: 4200000 }
    ],
    historique: [
      { date: '2021-03-10', projet: 'Résidence Les Jardins', type: 'Mission complète' }
    ],
    notes: 'Bailleur social majeur de la région. 3 projets réalisés. Excellente collaboration. Projets réguliers.',
    secteur: 'Logement social',
    chiffreAffaires: 4200000
  },
  {
    id: 3,
    nom: 'Promoteur Urbanova',
    type: 'Privé',
    contact: {
      responsable: 'M. Bernard Moreau',
      fonction: 'Directeur Général',
      telephone: '04 72 11 22 33',
      portable: '06 34 56 78 90',
      email: 'b.moreau@urbanova.fr',
      adresse: '10 rue de la Promotion',
      codePostal: '69003',
      ville: 'Lyon'
    },
    informationsLegales: {
      siret: '45234567890123',
      tva: 'FR45234567890',
      formeJuridique: 'SAS',
      capital: 2000000
    },
    projets: [
      { id: 4, nom: 'Immeuble Bureaux Part-Dieu', statut: 'Contrat signé', montant: 12500000 }
    ],
    historique: [
      { date: '2024-11-15', projet: 'Immeuble Bureaux Part-Dieu', type: 'Mission complète' }
    ],
    notes: 'Promoteur immobilier régional actif. Contrat signé pour projet Part-Dieu. Relations commerciales prometteuses.',
    secteur: 'Promotion immobilière',
    chiffreAffaires: 12500000
  }
];

// Données BET professionnelles
export const defaultBETs = [
  {
    id: 1,
    nom: 'BET Structures Martin & Associés',
    type: 'BET Structure',
    specialite: 'Structure béton et métallique',
    adresse: '25 rue de la Construction',
    codePostal: '69007',
    ville: 'Lyon',
    telephone: '04 78 12 34 56',
    portable: '06 12 34 56 78',
    email: 'contact@bet-martin.fr',
    siteWeb: 'www.bet-martin.fr',
    siret: '12345678901234',
    logo: null,
    metiers: [
      { nom: 'Structure béton', niveau: 'Expert', pourcentage: 95 },
      { nom: 'Structure métallique', niveau: 'Expert', pourcentage: 90 },
      { nom: 'Géotechnique', niveau: 'Intermédiaire', pourcentage: 65 }
    ],
    competences: ['Béton armé', 'Béton précontraint', 'Charpente métallique', 'Fondations'],
    projetsRealises: 45,
    note: 4.8,
    disponibilite: 'Disponible',
    notes: 'BET de référence pour structures complexes. Excellente réactivité et qualité des études. Partenaire privilégié depuis 2018.'
  },
  {
    id: 2,
    nom: 'BET Fluides Dupont',
    type: 'BET Fluides',
    specialite: 'Plomberie, Chauffage, Ventilation',
    adresse: '12 avenue des Fluides',
    codePostal: '69008',
    ville: 'Lyon',
    telephone: '04 78 23 45 67',
    portable: '06 23 45 67 89',
    email: 'contact@bet-fluides-dupont.fr',
    siteWeb: 'www.bet-fluides-dupont.fr',
    siret: '23456789012345',
    logo: null,
    metiers: [
      { nom: 'Plomberie', niveau: 'Expert', pourcentage: 95 },
      { nom: 'Chauffage', niveau: 'Expert', pourcentage: 92 },
      { nom: 'Ventilation', niveau: 'Expert', pourcentage: 88 },
      { nom: 'Électricité', niveau: 'Intermédiaire', pourcentage: 70 }
    ],
    competences: ['CVC', 'Plomberie sanitaire', 'Ventilation double flux', 'Géothermie'],
    projetsRealises: 38,
    note: 4.6,
    disponibilite: 'Disponible',
    notes: 'Spécialiste des installations fluides pour bâtiments tertiaires et logements. Très bon rapport qualité/prix.'
  }
];

// Statistiques dynamiques pour le Dashboard
export const calculateDashboardStats = (projets, tenders, devis, team) => {
  const currentYear = new Date().getFullYear();
  const projetsAnnee = projets.filter(p => {
    const annee = new Date(p.dateCreation || p.annee || `${currentYear}-01-01`).getFullYear();
    return annee === currentYear;
  });
  
  const projetsAnneePrecedente = projets.filter(p => {
    const annee = new Date(p.dateCreation || p.annee || `${currentYear}-01-01`).getFullYear();
    return annee === currentYear - 1;
  });

  const commandesValidees = projets.filter(p => p.statut === 'Contrat signé' || p.statut === 'En cours');
  const montantTotal = commandesValidees.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
  const montantAnneePrecedente = projetsAnneePrecedente
    .filter(p => p.statut === 'Contrat signé' || p.statut === 'En cours')
    .reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
  
  const evolution = montantAnneePrecedente > 0 
    ? ((montantTotal - montantAnneePrecedente) / montantAnneePrecedente * 100).toFixed(1)
    : 0;

  // Calcul heures facturables (estimation basée sur les projets)
  const heuresEstimees = projetsAnnee.reduce((sum, p) => {
    const montant = p.montantTravauxHT || 0;
    // Estimation : 1h pour 1000€ de travaux (ratio réaliste)
    return sum + Math.round(montant / 1000);
  }, 0);

  const heuresAnneePrecedente = projetsAnneePrecedente.reduce((sum, p) => {
    const montant = p.montantTravauxHT || 0;
    return sum + Math.round(montant / 1000);
  }, 0);

  const evolutionHeures = heuresAnneePrecedente > 0
    ? ((heuresEstimees - heuresAnneePrecedente) / heuresAnneePrecedente * 100).toFixed(1)
    : 0;

  return {
    commandesValidees: {
      value: montantTotal.toLocaleString('fr-FR') + ' €',
      change: evolution >= 0 ? `+${evolution}%` : `${evolution}%`,
      evolution: parseFloat(evolution)
    },
    projetsActifs: {
      value: projets.length.toString(),
      change: projetsAnnee.length > projetsAnneePrecedente.length 
        ? `+${projetsAnnee.length - projetsAnneePrecedente.length}`
        : projetsAnnee.length === projetsAnneePrecedente.length 
          ? '0'
          : `${projetsAnnee.length - projetsAnneePrecedente.length}`
    },
    heuresFacturables: {
      value: heuresEstimees.toLocaleString('fr-FR') + ' h',
      change: evolutionHeures >= 0 ? `+${evolutionHeures}%` : `${evolutionHeures}%`,
      evolution: parseFloat(evolutionHeures)
    },
    collaborateurs: {
      value: team.length.toString(),
      change: '0'
    }
  };
};

