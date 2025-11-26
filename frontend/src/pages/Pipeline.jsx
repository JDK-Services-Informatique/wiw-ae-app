import React from 'react';
import PipelineProspection from '../components/PipelineProspection';

export default function Pipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pipeline de Prospection
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualisez et gérez vos opportunités commerciales dans un pipeline interactif
        </p>
      </div>

      <PipelineProspection />
    </div>
  );
}