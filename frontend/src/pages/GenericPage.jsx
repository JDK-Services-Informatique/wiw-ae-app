import React from 'react';

export default function GenericPage({ title, icon, description }) {
  return (
    <div>
      <h2 style={{marginBottom: '20px', fontSize: '24px'}}>{icon} {title}</h2>

      <div className="card">
        <p style={{fontSize: '16px', opacity: 0.8}}>{description}</p>

        <div className="divider"></div>

        <div className="alert alert-info">
          Cette section est en cours de développement. Elle sera bientôt disponible avec toutes les fonctionnalités du prototype.
        </div>
      </div>
    </div>
  );
}