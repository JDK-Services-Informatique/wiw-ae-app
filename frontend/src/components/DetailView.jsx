import React from 'react';
import ViewToggle from './ViewToggle';

/**
 * Composant wrapper pour gérer les vues synthétique/détaillée
 * Selon le plan d'amélioration - Mode lecture générale vs détaillée
 */
export default function DetailView({ 
  children, 
  isDetailed, 
  onToggle,
  synthetiqueContent,
  detailleeContent,
  className = ''
}) {
  return (
    <div className={className}>
      {/* Toggle en haut à droite */}
      <div className="flex justify-end mb-4">
        <ViewToggle 
          isDetailed={isDetailed} 
          onToggle={onToggle}
        />
      </div>

      {/* Contenu selon le mode */}
      {isDetailed ? detailleeContent : synthetiqueContent}
      
      {/* Contenu enfants (si fourni) */}
      {children}
    </div>
  );
}

