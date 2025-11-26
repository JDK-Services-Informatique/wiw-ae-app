import React from 'react';
import AOAssistant from '../components/AOAssistant';

export default function NouvelleAO() {
  const handleAOComplete = (aoData) => {
    // Redirection vers la page de l'AO créée ou vers la liste des AO
    console.log('AO créée:', aoData);
    if (window.showToast) {
      window.showToast('AO créée avec succès ! Redirection en cours...', 'success');
    }

    // Redirection après un court délai
    setTimeout(() => {
      window.location.href = '/honoraires'; // Ou vers la page appropriée
    }, 2000);
  };

  const handleCancel = () => {
    // Retour à la page précédente ou au dashboard
    window.history.back();
  };

  return (
    <div className="space-y-6">
      <AOAssistant
        onComplete={handleAOComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}