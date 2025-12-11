/**
 * Carte individuelle d'un appel d'offres
 */

import React from 'react';
import { Euro } from 'lucide-react';
import { formatMontant } from '../../utils/formatNumber';

const STATUS_BADGES = {
  'Nouveau': 'badge-info',
  'En cours': 'badge-warning',
  'En négociation': 'badge-secondary',
  'Gagné': 'badge-success',
  'Perdu': 'badge-danger'
};

export default function TenderCard({ ao, onSelect, onEdit }) {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(ao);
  };

  const formattedMontant = formatMontant(ao.montant, 0);
  const formattedDate = ao.dateRendu
    ? new Date(ao.dateRendu).toLocaleDateString('fr-FR')
    : 'Non définie';

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onSelect(ao)}
    >
      {/* Bouton modifier */}
      <div style={{
        padding: '15px 20px 10px 20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          className="btn-icon"
          title="Modifier"
          onClick={handleEdit}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Modifier
        </button>
      </div>

      {/* Image/Vignette */}
      <div style={{
        position: 'relative',
        height: '120px',
        background: ao.vignette?.startsWith('data:')
          ? `url(${ao.vignette}) center/cover no-repeat`
          : 'linear-gradient(135deg, var(--brand) 0%, var(--brand-accent) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!ao.vignette?.startsWith('data:') && (
          <div style={{ fontSize: '40px', opacity: 0.8 }}>
            {ao.vignette || ''}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px' }}>
        <h4 style={{
          marginBottom: '10px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {ao.titre}
        </h4>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '14px',
          opacity: 0.8
        }}>
          <div> {ao.type || 'Type non spécifié'}</div>
          <div> {ao.client}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Euro size={16} /> {formattedMontant}
          </div>
          <div> Rendu: {formattedDate}</div>
          <div> {ao.dureePrevisionnelle || 'Durée non spécifiée'}</div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <span className={`badge ${STATUS_BADGES[ao.statut] || 'badge-secondary'}`}>
            {ao.statut}
          </span>
        </div>
      </div>
    </div>
  );
}
