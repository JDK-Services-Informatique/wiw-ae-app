/**
 * Liste des appels d'offres (tableau ou cartes)
 */

import React from 'react';
import ViewToggle from '../ViewToggle';
import TenderTable from './TenderTable';
import TenderCard from './TenderCard';

export default function TenderList({
  aos,
  isDetailedView,
  onToggleView,
  onSelect,
  onEdit
}) {
  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3>Liste des appels d'offres</h3>
        <ViewToggle
          isDetailed={isDetailedView}
          onToggle={onToggleView}
          labelSynthetique="Vue tableau"
          labelDetaillee="Vue cartes"
        />
      </div>

      {isDetailedView ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {aos.map(ao => (
            <TenderCard
              key={ao.id}
              ao={ao}
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <TenderTable
          aos={aos}
          onSelect={onSelect}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}
