/**
 * Étapes prédéfinies pour le tour guidé d'onboarding
 */

export const defaultOnboardingSteps = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Bienvenue sur votre tableau de bord',
    content: 'Ici vous pouvez voir un aperçu de tous vos projets et statistiques importantes.'
  },
  {
    target: '[data-tour="stats"]',
    title: 'Statistiques clés',
    content: 'Ces cartes affichent vos indicateurs de performance principaux.'
  },
  {
    target: '[data-tour="graphiques"]',
    title: 'Visualisations',
    content: 'Les graphiques vous aident à comprendre l\'évolution de vos projets dans le temps.'
  },
  {
    target: '[data-tour="navigation"]',
    title: 'Navigation',
    content: 'Utilisez le menu latéral pour accéder à toutes les fonctionnalités de l\'application.'
  }
];

export const tendersOnboardingSteps = [
  {
    target: '[data-tour="tenders-list"]',
    title: 'Liste des appels d\'offres',
    content: 'Ici vous pouvez voir tous vos appels d\'offres et leur statut.'
  },
  {
    target: '[data-tour="tenders-stats"]',
    title: 'Statistiques AO',
    content: 'Visualisez vos performances avec les statistiques du pipeline.'
  },
  {
    target: '[data-tour="tenders-export"]',
    title: 'Export',
    content: 'Exportez vos données en Excel ou PDF pour les partager.'
  }
];

export const honorairesOnboardingSteps = [
  {
    target: '[data-tour="honoraires-scenarios"]',
    title: 'Scénarios d\'honoraires',
    content: 'Gérez plusieurs scénarios de calcul d\'honoraires (Base, Évolution 1, Évolution 2).'
  },
  {
    target: '[data-tour="honoraires-equipe"]',
    title: 'Répartition équipe',
    content: 'Configurez la répartition des honoraires entre les membres de l\'équipe.'
  },
  {
    target: '[data-tour="honoraires-export"]',
    title: 'Export',
    content: 'Exportez vos calculs d\'honoraires pour les présenter aux clients.'
  }
];

