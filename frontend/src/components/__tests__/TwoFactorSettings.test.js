import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TwoFactorSettings from '../TwoFactorSettings';

describe('TwoFactorSettings', () => {
  const mockOnToggle = vi.fn();
  const mockOnSetup = vi.fn();

  it('affiche le composant avec 2FA désactivé', () => {
    render(<TwoFactorSettings enabled={false} onToggle={mockOnToggle} />);
    
    expect(screen.getByText('Authentification à deux facteurs (2FA)')).toBeInTheDocument();
    expect(screen.getByText('2FA désactivé')).toBeInTheDocument();
  });

  it('affiche le composant avec 2FA activé', () => {
    render(<TwoFactorSettings enabled={true} onToggle={mockOnToggle} />);
    
    expect(screen.getByText('2FA activé')).toBeInTheDocument();
  });

  it('affiche le bouton d\'activation', () => {
    render(<TwoFactorSettings enabled={false} onToggle={mockOnToggle} />);
    
    expect(screen.getByText(/Activer l'authentification à deux facteurs/)).toBeInTheDocument();
  });

  it('affiche le bouton de désactivation quand 2FA est activé', () => {
    render(<TwoFactorSettings enabled={true} onToggle={mockOnToggle} />);
    
    expect(screen.getByText('Désactiver')).toBeInTheDocument();
  });
});

