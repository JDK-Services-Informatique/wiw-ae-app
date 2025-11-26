import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test Message'
  };

  it('ne devrait pas s\'afficher si isOpen est false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('devrait afficher le titre et le message', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('devrait appeler onConfirm quand on clique sur Confirmer', () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('devrait appeler onClose quand on clique sur Annuler', () => {
    const onClose = vi.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('devrait utiliser la variante danger pour le style', () => {
    render(<ConfirmModal {...defaultProps} variant="danger" />);
    const confirmButton = screen.getByText('Confirmer');
    expect(confirmButton.className).toContain('bg-red-600');
  });

  it('devrait afficher le contenu additionnel via children', () => {
    render(
      <ConfirmModal {...defaultProps}>
        <div>Contenu additionnel</div>
      </ConfirmModal>
    );
    expect(screen.getByText('Contenu additionnel')).toBeInTheDocument();
  });
});

