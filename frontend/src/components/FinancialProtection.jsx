import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/auth.api';

/**
 * Composant FinancialProtection
 * Masque les données financières sensibles selon le rôle de l'utilisateur
 * 
 * Règles :
 * - ADMIN : Accès complet
 * - CHEF_PROJET : Vision des montants mais pas des détails (taux horaires, marges)
 * - ASSISTANT : Pas de vision des données financières
 * - USER : Vision limitée selon le contexte
 */
export default function FinancialProtection({ 
  children, 
  dataType = 'montant', // 'montant', 'tauxHoraire', 'marge', 'coutHoraire'
  fallback = null,
  showLockIcon = true,
  className = ''
}) {
  const user = authService.getCurrentUser();
  const userRole = user?.role || 'USER';

  // ADMIN : Accès complet
  if (userRole === 'ADMIN') {
    return <>{children}</>;
  }

  // ASSISTANT : Pas de vision des données financières
  if (userRole === 'ASSISTANT') {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <span className={`financial-protected ${className}`} title="Données financières sensibles - Accès réservé">
        {showLockIcon && <Lock size={14} className="inline mr-1 opacity-50" />}
        <span className="opacity-50">***</span>
      </span>
    );
  }

  // CHEF_PROJET : Vision des montants mais pas des détails (taux horaires, marges)
  if (userRole === 'CHEF_PROJET') {
    const restrictedTypes = ['tauxHoraire', 'marge', 'coutHoraire'];
    if (restrictedTypes.includes(dataType)) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <span className={`financial-protected ${className}`} title="Données financières détaillées - Accès réservé">
          {showLockIcon && <Lock size={14} className="inline mr-1 opacity-50" />}
          <span className="opacity-50">***</span>
        </span>
      );
    }
    // Montants autorisés pour CHEF_PROJET
    return <>{children}</>;
  }

  // USER : Vision limitée (montants uniquement, pas de détails)
  const restrictedTypes = ['tauxHoraire', 'marge', 'coutHoraire'];
  if (restrictedTypes.includes(dataType)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <span className={`financial-protected ${className}`} title="Données financières détaillées - Accès réservé">
        {showLockIcon && <Lock size={14} className="inline mr-1 opacity-50" />}
        <span className="opacity-50">***</span>
      </span>
    );
  }

  // Par défaut, afficher le contenu
  return <>{children}</>;
}

/**
 * Hook pour vérifier si l'utilisateur peut voir les données financières
 */
export function useFinancialAccess() {
  const user = authService.getCurrentUser();
  const userRole = user?.role || 'USER';

  return {
    canViewMontants: ['ADMIN', 'CHEF_PROJET', 'USER'].includes(userRole),
    canViewTauxHoraires: userRole === 'ADMIN',
    canViewMarges: userRole === 'ADMIN',
    canViewCoutHoraires: userRole === 'ADMIN',
    canExportFinancial: ['ADMIN', 'CHEF_PROJET'].includes(userRole),
    isAdmin: userRole === 'ADMIN',
    isChefProjet: userRole === 'CHEF_PROJET',
    isAssistant: userRole === 'ASSISTANT',
    userRole
  };
}

/**
 * Composant pour masquer une colonne entière dans un tableau
 */
export function FinancialColumn({ 
  header, 
  dataType, 
  children, 
  className = '' 
}) {
  const { canViewTauxHoraires, canViewMarges, canViewCoutHoraires, canViewMontants } = useFinancialAccess();
  
  let canView = true;
  if (dataType === 'tauxHoraire' || dataType === 'coutHoraire') {
    canView = canViewTauxHoraires;
  } else if (dataType === 'marge') {
    canView = canViewMarges;
  } else if (dataType === 'montant') {
    canView = canViewMontants;
  }

  if (!canView) {
    return null; // Masquer la colonne complètement
  }

  return (
    <th className={className}>
      {header}
    </th>
  );
}

/**
 * Composant pour masquer une cellule dans un tableau
 */
export function FinancialCell({ 
  dataType, 
  children, 
  className = '',
  showLockIcon = true
}) {
  return (
    <td className={className}>
      <FinancialProtection 
        dataType={dataType}
        showLockIcon={showLockIcon}
      >
        {children}
      </FinancialProtection>
    </td>
  );
}

