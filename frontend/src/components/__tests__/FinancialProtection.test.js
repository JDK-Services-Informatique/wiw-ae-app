import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FinancialProtection, { useFinancialAccess } from '../FinancialProtection';
import { authService } from '../../services/auth.api';

vi.mock('../../services/auth.api', () => ({
  authService: {
    getCurrentUser: vi.fn()
  }
}));

describe('FinancialProtection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le contenu pour ADMIN', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'ADMIN' });
    
    render(
      <FinancialProtection dataType="montant">
        <span>1000 €</span>
      </FinancialProtection>
    );
    
    expect(screen.getByText('1000 €')).toBeInTheDocument();
  });

  it('masque les données pour ASSISTANT', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'ASSISTANT' });
    
    render(
      <FinancialProtection dataType="montant">
        <span>1000 €</span>
      </FinancialProtection>
    );
    
    expect(screen.queryByText('1000 €')).not.toBeInTheDocument();
    expect(screen.getByText('***')).toBeInTheDocument();
  });

  it('affiche les montants pour CHEF_PROJET mais masque les taux horaires', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'CHEF_PROJET' });
    
    const { rerender } = render(
      <FinancialProtection dataType="montant">
        <span>1000 €</span>
      </FinancialProtection>
    );
    
    expect(screen.getByText('1000 €')).toBeInTheDocument();
    
    rerender(
      <FinancialProtection dataType="tauxHoraire">
        <span>50 €/h</span>
      </FinancialProtection>
    );
    
    expect(screen.queryByText('50 €/h')).not.toBeInTheDocument();
    expect(screen.getByText('***')).toBeInTheDocument();
  });

  it('utilise le fallback si fourni', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'ASSISTANT' });
    
    render(
      <FinancialProtection dataType="montant" fallback={<span>Non disponible</span>}>
        <span>1000 €</span>
      </FinancialProtection>
    );
    
    expect(screen.getByText('Non disponible')).toBeInTheDocument();
    expect(screen.queryByText('1000 €')).not.toBeInTheDocument();
  });

  it('gère le cas où l\'utilisateur est null', () => {
    authService.getCurrentUser.mockReturnValue(null);
    
    render(
      <FinancialProtection dataType="tauxHoraire">
        <span>50 €/h</span>
      </FinancialProtection>
    );
    
    expect(screen.queryByText('50 €/h')).not.toBeInTheDocument();
    expect(screen.getByText('***')).toBeInTheDocument();
  });
});

describe('useFinancialAccess', () => {
  it('retourne les bonnes permissions pour ADMIN', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'ADMIN' });
    
    const TestComponent = () => {
      const access = useFinancialAccess();
      return (
        <div>
          <span data-testid="canViewMontants">{access.canViewMontants.toString()}</span>
          <span data-testid="canViewTauxHoraires">{access.canViewTauxHoraires.toString()}</span>
          <span data-testid="isAdmin">{access.isAdmin.toString()}</span>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('canViewMontants')).toHaveTextContent('true');
    expect(screen.getByTestId('canViewTauxHoraires')).toHaveTextContent('true');
    expect(screen.getByTestId('isAdmin')).toHaveTextContent('true');
  });

  it('retourne les bonnes permissions pour ASSISTANT', () => {
    authService.getCurrentUser.mockReturnValue({ role: 'ASSISTANT' });
    
    const TestComponent = () => {
      const access = useFinancialAccess();
      return (
        <div>
          <span data-testid="canViewMontants">{access.canViewMontants.toString()}</span>
          <span data-testid="canViewTauxHoraires">{access.canViewTauxHoraires.toString()}</span>
          <span data-testid="isAssistant">{access.isAssistant.toString()}</span>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('canViewMontants')).toHaveTextContent('false');
    expect(screen.getByTestId('canViewTauxHoraires')).toHaveTextContent('false');
    expect(screen.getByTestId('isAssistant')).toHaveTextContent('true');
  });
});

