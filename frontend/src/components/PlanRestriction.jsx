import React from 'react';
import { usePlan } from '../context/PlanContext';
import { Crown, Star, Target } from 'lucide-react';

export default function PlanRestriction({ 
  feature, 
  requiredPlan = 'PREMIUM',
  children,
  fallback = null,
  showUpgrade = true 
}) {
  const { currentPlan, hasFeature, getPlanInfo } = usePlan();

  // Si la fonctionnalité est accessible
  if (feature && hasFeature(feature)) {
    return <>{children}</>;
  }

  // Vérifier les niveaux de plans
  const planLevels = { 'STARTER': 0, 'PREMIUM': 1, 'ENTERPRISE': 2 };
  const currentLevel = planLevels[currentPlan] || 0;
  const requiredLevel = planLevels[requiredPlan] || 1;

  if (currentLevel >= requiredLevel) {
    return <>{children}</>;
  }

  // Afficher le fallback ou le message d'upgrade
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(124, 58, 237, 0.1)',
      borderRadius: '8px',
      border: '2px dashed rgba(124, 58, 237, 0.3)',
      textAlign: 'center'
    }}>
      <div style={{fontSize: '48px', marginBottom: '10px'}}>🔒</div>
      <h3 style={{marginBottom: '10px'}}>Fonctionnalité {requiredPlan}</h3>
      <p style={{opacity: 0.7, marginBottom: '15px'}}>
        Cette fonctionnalité nécessite le plan <strong>{requiredPlan}</strong> ou supérieur.
      </p>
      <p style={{opacity: 0.6, fontSize: '14px', marginBottom: '15px'}}>
        Votre plan actuel: <strong>{currentPlan}</strong>
      </p>
      <button 
        className="btn-primary"
        onClick={() => {
          // Naviguer vers la page Plans
          if (window.location.hash) {
            window.location.hash = '#plans';
          }
        }}
        style={{background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'}}
      >
        ⬆️ Passer au plan {requiredPlan}
      </button>
    </div>
  );
}

// Composant pour afficher une limite atteinte
export function LimitReached({ 
  resource, 
  current, 
  max, 
  requiredPlan = 'PREMIUM' 
}) {
  return (
    <div style={{
      padding: '15px',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      marginBottom: '15px'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
        <span style={{fontSize: '24px'}}>⚠️</span>
        <strong>Limite atteinte</strong>
      </div>
      <p style={{opacity: 0.8, fontSize: '14px', marginBottom: '10px'}}>
        Vous avez atteint la limite de <strong>{max} {resource}</strong> pour le plan actuel.
      </p>
      <button 
        className="btn"
        onClick={() => {
          if (window.location.hash) {
            window.location.hash = '#plans';
          }
        }}
        style={{fontSize: '13px'}}
      >
        ⬆️ Passer au plan {requiredPlan}
      </button>
    </div>
  );
}

// Composant pour afficher le badge du plan
export function PlanBadge() {
  const { currentPlan, getPlanInfo } = usePlan();
  const planInfo = getPlanInfo();

  const colors = {
    STARTER: '#3b82f6',
    PREMIUM: '#a78bfa',
    ENTERPRISE: '#f59e0b'
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      background: colors[currentPlan] || colors.STARTER,
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white'
    }}>
      <span>{currentPlan === 'ENTERPRISE' ? <Crown size={16} /> : currentPlan === 'PREMIUM' ? <Star size={16} /> : <Target size={16} />}</span>
      <span>{currentPlan}</span>
    </div>
  );
}
