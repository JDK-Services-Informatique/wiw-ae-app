/**
 * Composant de filtres pour les appels d'offres
 */

import React from 'react';
import { ClipboardList } from 'lucide-react';

const STATUTS = [
  { value: 'tous', label: 'Tous', icon: '' },
  { value: 'Nouveau', label: 'Nouveaux', icon: '' },
  { value: 'En cours', label: 'En cours', icon: '' },
  { value: 'Gagné', label: 'Gagnés', icon: '' },
  { value: 'Perdu', label: 'Perdus', icon: '' }
];

export default function TenderFilters({
  filterStatut,
  onFilterChange,
  stats,
  onGoToMissions
}) {
  const getCount = (statut) => {
    switch (statut) {
      case 'tous': return stats.total;
      case 'Nouveau': return stats.nouveau;
      case 'En cours': return stats.enCours;
      case 'Gagné': return stats.gagne;
      case 'Perdu': return stats.perdu;
      default: return 0;
    }
  };

  return (
    <div className="card" style={{
      marginBottom: '20px',
      background: 'rgba(59, 130, 246, 0.05)'
    }}>
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Filtrer par statut:
          </span>

          {STATUTS.map(({ value, label, icon }) => (
            <button
              key={value}
              className={`btn ${filterStatut === value ? '' : 'btn-secondary'}`}
              onClick={() => onFilterChange(value)}
            >
              {icon} {label} ({getCount(value)})
            </button>
          ))}
        </div>

        {onGoToMissions && (
          <button
            className="btn"
            onClick={onGoToMissions}
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            title="Accéder aux missions pour gérer les phases et compétences"
          >
            <ClipboardList size={16} /> Rappel mission
          </button>
        )}
      </div>
    </div>
  );
}
