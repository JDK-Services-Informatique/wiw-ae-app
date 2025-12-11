/**
 * Tableau des appels d'offres
 */

import React from 'react';
import { formatMontant } from '../../utils/formatNumber';

const STATUS_BADGES = {
  'Nouveau': 'badge-info',
  'En cours': 'badge-warning',
  'En négociation': 'badge-secondary',
  'Gagné': 'badge-success',
  'Perdu': 'badge-danger'
};

export default function TenderTable({ aos, onSelect, onEdit }) {
  const handleEdit = (ao, e) => {
    e.stopPropagation();
    onEdit(ao);
  };

  const handleDelete = (ao, e) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer l'AO "${ao.titre}" ?`)) {
      // Le parent gère la suppression
    }
  };

  return (
    <div className="table-container overflow-x-auto -mx-4 sm:mx-0">
      <table className="table min-w-[800px]">
        <thead>
          <tr>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Titre</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden md:table-cell">Type</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Client</th>
            <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Montant</th>
            <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden lg:table-cell">Durée</th>
            <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden md:table-cell">Date rendu</th>
            <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Statut</th>
            <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {aos.map(ao => (
            <tr
              key={ao.id}
              onClick={() => onSelect(ao)}
              style={{ cursor: 'pointer' }}
            >
              <td className="px-2 sm:px-4 py-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{ao.vignette || ''}</span>
                  <span className="text-xs sm:text-sm">{ao.titre}</span>
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3 hidden md:table-cell text-xs sm:text-sm">
                {ao.type || '-'}
              </td>
              <td className="px-2 sm:px-4 py-3 hidden lg:table-cell text-xs sm:text-sm">
                {ao.client || '-'}
              </td>
              <td className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">
                {formatMontant(ao.montant, 0)}
              </td>
              <td className="px-2 sm:px-4 py-3 text-center hidden lg:table-cell text-xs sm:text-sm">
                {ao.dureePrevisionnelle || '-'}
              </td>
              <td className="px-2 sm:px-4 py-3 text-center hidden md:table-cell text-xs sm:text-sm">
                {ao.dateRendu ? new Date(ao.dateRendu).toLocaleDateString('fr-FR') : '-'}
              </td>
              <td className="px-2 sm:px-4 py-3 text-center">
                <span className={`badge ${STATUS_BADGES[ao.statut] || 'badge-secondary'}`}>
                  {ao.statut}
                </span>
              </td>
              <td className="px-2 sm:px-4 py-3 text-center">
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    className="btn-icon"
                    title="Modifier"
                    onClick={(e) => handleEdit(ao, e)}
                  >

                  </button>
                  <button
                    className="btn-icon"
                    title="Voir détails"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(ao);
                    }}
                  >

                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {aos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          opacity: 0.6
        }}>
          <p>Aucun appel d'offres trouvé.</p>
        </div>
      )}
    </div>
  );
}
