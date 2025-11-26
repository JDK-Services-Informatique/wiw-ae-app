import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AOPipelineStats from '../AOPipelineStats';

describe('AOPipelineStats', () => {
  const mockAOs = [
    { id: 1, statut: 'Nouveau', montant: 100000 },
    { id: 2, statut: 'En cours', montant: 200000 },
    { id: 3, statut: 'Gagné', montant: 300000 },
    { id: 4, statut: 'Perdu', montant: 50000 }
  ];

  it('affiche les statistiques correctement', () => {
    render(<AOPipelineStats aos={mockAOs} />);
    
    expect(screen.getByText('Pipeline AO - Statistiques')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument(); // Total AO
  });

  it('calcule correctement les statistiques par statut', () => {
    render(<AOPipelineStats aos={mockAOs} />);
    
    expect(screen.getByText('Nouveaux')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText('Gagnés')).toBeInTheDocument();
    expect(screen.getByText('Perdus')).toBeInTheDocument();
  });

  it('affiche le taux de réussite', () => {
    render(<AOPipelineStats aos={mockAOs} />);
    
    // 1 gagné sur 2 (gagné + perdu) = 50%
    const tauxReussite = screen.getByText(/50\.0%/);
    expect(tauxReussite).toBeInTheDocument();
  });

  it('gère le cas avec aucun AO', () => {
    render(<AOPipelineStats aos={[]} />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Total AO
  });
});

