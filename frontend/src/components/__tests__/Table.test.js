import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from '../Table';

describe('Table', () => {
  const columns = [
    { header: 'Nom', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Rôle', accessor: 'role' }
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'USER' }
  ];

  it('affiche les en-têtes de colonnes', () => {
    render(<Table columns={columns} data={data} />);
    
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Rôle')).toBeInTheDocument();
  });

  it('affiche les données dans les cellules', () => {
    render(<Table columns={columns} data={data} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('affiche un message quand il n\'y a pas de données', () => {
    render(<Table columns={columns} data={[]} />);
    
    expect(screen.getByText('Aucune donnée')).toBeInTheDocument();
  });

  it('gère les colonnes vides', () => {
    render(<Table columns={[]} data={[]} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('affiche toutes les lignes de données', () => {
    render(<Table columns={columns} data={data} />);
    
    // Vérifier que les deux lignes sont présentes
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});

