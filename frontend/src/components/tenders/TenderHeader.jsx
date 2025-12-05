/**
 * En-tête de la page Appels d'Offres
 */

import React from 'react';
import { Download } from 'lucide-react';
import { LimitReached } from '../PlanRestriction';
import AOPipelineStats from '../AOPipelineStats';
import { exportAOExcel, exportAOPDF } from '../../utils/export';

export default function TenderHeader({
  aos,
  planInfo,
  isAtLimit,
  onNewAO,
  onOpenAssistant
}) {
  return (
    <>
      {/* Titre et boutons d'action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>
            Appels d'Offres
          </h2>
          {planInfo.maxAO !== null && (
            <div style={{ fontSize: '13px', opacity: 0.7 }}>
              {aos.length} / {planInfo.maxAO} AO utilisés
              {isAtLimit && (
                <span style={{
                  marginLeft: '8px',
                  color: '#f59e0b',
                  fontWeight: 600
                }}>
                  Limite atteinte
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={onOpenAssistant}
            style={{
              cursor: isAtLimit ? 'not-allowed' : 'pointer',
              opacity: isAtLimit ? 0.6 : 1
            }}
            disabled={isAtLimit}
          >
            Assistant AO
          </button>
          <button
            className="btn"
            onClick={onNewAO}
            style={{
              cursor: isAtLimit ? 'not-allowed' : 'pointer',
              opacity: isAtLimit ? 0.6 : 1
            }}
            disabled={isAtLimit}
          >
            + Nouveau AO
          </button>
        </div>
      </div>

      {/* Alerte limite */}
      {isAtLimit && (
        <LimitReached
          resource="appels d'offres"
          current={aos.length}
          max={planInfo.maxAO}
          requiredPlan="PREMIUM"
        />
      )}

      {/* Pipeline et exports */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{ flex: 1 }}>
            <AOPipelineStats aos={aos} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
            <button
              onClick={() => exportAOExcel(aos)}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              title="Exporter en Excel"
            >
              <Download size={18} />
              Excel
            </button>
            <button
              onClick={() => exportAOPDF(aos)}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              title="Exporter en PDF"
            >
              <Download size={18} />
              PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
