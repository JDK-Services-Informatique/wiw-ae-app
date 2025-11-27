import React, { createContext, useContext, useState, useEffect } from 'react';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within PlanProvider');
  }
  return context;
};

// Définition des fonctionnalités par plan
export const planFeatures = {
  STARTER: {
    nom: 'STARTER',
    prix: '29€',
    maxProjets: 5,
    maxAO: 10,
    maxUtilisateurs: 1,
    maxEquipe: 3,
    maxBET: 2,
    analytics: false,
    templates: false,
    apiAccess: false,
    exportPDF: true,
    mediatheque: false,
    liaisonsAvancees: false,
    prioritySupport: false,
    features: [
      '5 projets actifs',
      '10 appels d\'offres',
      'Calcul d\'honoraires basique',
      '1 utilisateur',
      '3 membres d\'équipe max',
      '2 partenaires BET max',
      'Support email',
      'Export PDF basique'
    ]
  },
  PREMIUM: {
    nom: 'PREMIUM',
    prix: '79€',
    maxProjets: null, // illimité
    maxAO: null,
    maxUtilisateurs: 5,
    maxEquipe: 15,
    maxBET: 10,
    analytics: true,
    templates: true,
    apiAccess: false,
    exportPDF: true,
    mediatheque: true,
    liaisonsAvancees: true,
    prioritySupport: true,
    features: [
      'Projets illimités',
      'Appels d\'offres illimités',
      'Calcul d\'honoraires avancé',
      '5 utilisateurs',
      '15 membres d\'équipe max',
      '10 partenaires BET max',
      'Support prioritaire',
      'Analytics avancés',
      'Templates personnalisés',
      'Médiathèque complète',
      'Liaisons Mission-Équipe-BET',
      'Export PDF avancé'
    ]
  },
  ENTERPRISE: {
    nom: 'ENTERPRISE',
    prix: '199€',
    maxProjets: null,
    maxAO: null,
    maxUtilisateurs: null,
    maxEquipe: null,
    maxBET: null,
    analytics: true,
    templates: true,
    apiAccess: true,
    exportPDF: true,
    mediatheque: true,
    liaisonsAvancees: true,
    prioritySupport: true,
    customBranding: true,
    dedicatedManager: true,
    features: [
      'Tout illimité',
      'Utilisateurs illimités',
      'Équipe illimitée',
      'Partenaires BET illimités',
      'Support 24/7 dédié',
      'Analytics expert',
      'Templates personnalisés',
      'Médiathèque complète',
      'Liaisons Mission-Équipe-BET',
      'API access complet',
      'Branding personnalisé',
      'Chargé de compte dédié',
      'Formation sur mesure'
    ]
  }
};

export const PlanProvider = ({ children }) => {
  // Par défaut PREMIUM pour la démo, mais serait récupéré depuis le backend en production
  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('wiw_current_plan');
    return saved || 'PREMIUM';
  });

  useEffect(() => {
    localStorage.setItem('wiw_current_plan', currentPlan);
  }, [currentPlan]);

  const changePlan = (newPlan) => {
    if (planFeatures[newPlan]) {
      setCurrentPlan(newPlan);
      return true;
    }
    return false;
  };

  // Vérifier si une fonctionnalité est accessible
  const hasFeature = (feature) => {
    const plan = planFeatures[currentPlan];
    return plan && plan[feature] === true;
  };

  // Vérifier si une limite est atteinte
  const canAdd = (resource, currentCount) => {
    const plan = planFeatures[currentPlan];
    if (!plan) return false;

    const maxKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
    const max = plan[maxKey];

    // null = illimité
    if (max === null) return true;
    
    return currentCount < max;
  };

  // Obtenir les infos du plan actuel
  const getPlanInfo = () => {
    return planFeatures[currentPlan] || planFeatures.STARTER;
  };

  // Fonction pour gérer le choix d'un plan (redirige vers login si non authentifié)
  const handleChoosePlan = (planId) => {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (!isAuthenticated) {
      // Rediriger vers login avec le plan sélectionné
      window.location.href = `/login?plan=${planId}`;
      return;
    }
    
    // Si authentifié, changer le plan
    changePlan(planId);
  };

  const value = {
    currentPlan,
    changePlan,
    hasFeature,
    canAdd,
    getPlanInfo,
    planFeatures,
    handleChoosePlan
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
