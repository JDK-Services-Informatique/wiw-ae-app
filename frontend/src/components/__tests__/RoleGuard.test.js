import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoleGuard from '../RoleGuard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RoleGuard', () => {
  it('affiche les enfants si l\'utilisateur a le rôle autorisé', () => {
    const user = { role: 'ADMIN' };
    const allowedRoles = ['ADMIN', 'CHEF_PROJET'];
    
    renderWithRouter(
      <RoleGuard user={user} allowedRoles={allowedRoles}>
        <div>Contenu protégé</div>
      </RoleGuard>
    );
    
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
  });

  it('redirige si l\'utilisateur n\'a pas le rôle autorisé', () => {
    const user = { role: 'USER' };
    const allowedRoles = ['ADMIN'];
    
    renderWithRouter(
      <RoleGuard user={user} allowedRoles={allowedRoles}>
        <div>Contenu protégé</div>
      </RoleGuard>
    );
    
    // Le composant Navigate redirige vers /dashboard
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
  });

  it('redirige si l\'utilisateur est null', () => {
    const user = null;
    const allowedRoles = ['ADMIN'];
    
    renderWithRouter(
      <RoleGuard user={user} allowedRoles={allowedRoles}>
        <div>Contenu protégé</div>
      </RoleGuard>
    );
    
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
  });

  it('autorise plusieurs rôles', () => {
    const user = { role: 'CHEF_PROJET' };
    const allowedRoles = ['ADMIN', 'CHEF_PROJET'];
    
    renderWithRouter(
      <RoleGuard user={user} allowedRoles={allowedRoles}>
        <div>Contenu protégé</div>
      </RoleGuard>
    );
    
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
  });
});

