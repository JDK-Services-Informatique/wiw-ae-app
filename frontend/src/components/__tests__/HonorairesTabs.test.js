import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Honoraires from '../../pages/Honoraires';

// Mock des dépendances
vi.mock('../../services/inheritance.api', () => ({
  default: {
    inheritFromAO: vi.fn(),
    inheritFromMission: vi.fn()
  }
}));

vi.mock('../../services/validation.api', () => ({
  default: {
    validatePourcentagesMontants: vi.fn(),
    validateMontantsHeures: vi.fn()
  }
}));

// Mock de window.showToast
global.window.showToast = vi.fn();

describe('Honoraires - Rendu des onglets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher l\'onglet Scénarios par défaut', () => {
    render(<Honoraires />);
    
    // Vérifier que l'onglet Scénarios est actif
    const scenariosTab = screen.getByText(/Scénarios/i);
    expect(scenariosTab).toBeInTheDocument();
    
    // Vérifier que le contenu de l'onglet Scénarios est visible
    // (le composant ScenariosHonoraires devrait être rendu)
    expect(screen.getByText(/Scénarios d'Honoraires/i)).toBeInTheDocument();
  });

  it('devrait basculer vers l\'onglet Évolution quand on clique dessus', () => {
    render(<Honoraires />);
    
    // Trouver et cliquer sur l'onglet Évolution
    const evolutionTab = screen.getByText(/Évolution des %/i);
    fireEvent.click(evolutionTab);
    
    // Vérifier que l'onglet Évolution est maintenant actif
    // (on peut vérifier la présence d'un élément spécifique à cet onglet)
    expect(evolutionTab.closest('button')).toHaveClass('border-brand');
  });

  it('devrait basculer vers l\'onglet Ventilation quand on clique dessus', () => {
    render(<Honoraires />);
    
    // Trouver et cliquer sur l'onglet Ventilation
    const ventilationTab = screen.getByText(/Ventilation Mission\/Partenaire/i);
    fireEvent.click(ventilationTab);
    
    // Vérifier que l'onglet Ventilation est maintenant actif
    expect(ventilationTab.closest('button')).toHaveClass('border-brand');
  });

  it('devrait afficher tous les onglets disponibles', () => {
    render(<Honoraires />);
    
    // Vérifier la présence de tous les onglets
    expect(screen.getByText(/Scénarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Évolution des %/i)).toBeInTheDocument();
    expect(screen.getByText(/Ventilation Mission\/Partenaire/i)).toBeInTheDocument();
  });

  it('devrait afficher les boutons d\'export dans l\'en-tête', () => {
    render(<Honoraires />);
    
    // Vérifier la présence des boutons d'export
    expect(screen.getByText(/Exporter Excel/i)).toBeInTheDocument();
    expect(screen.getByText(/Exporter PDF/i)).toBeInTheDocument();
  });
});


