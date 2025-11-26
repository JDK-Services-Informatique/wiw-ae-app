import React from 'react';

/**
 * Composant Skeleton pour les états de chargement
 */
export default function Skeleton({ 
  className = '', 
  variant = 'rectangular', // 'rectangular', 'circular', 'text'
  width,
  height,
  lines = 1,
  animation = 'pulse' // 'pulse', 'wave', 'none'
}) {
  const baseClasses = 'bg-slate-200 dark:bg-slate-700';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  };

  if (variant === 'circular') {
    return (
      <div
        className={`${baseClasses} rounded-full ${animationClasses[animation]} ${className}`}
        style={{ width: width || height || '40px', height: height || width || '40px' }}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} rounded ${animationClasses[animation]} ${className}`}
            style={{
              width: i === lines - 1 ? '80%' : '100%',
              height: height || '16px'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} rounded ${animationClasses[animation]} ${className}`}
      style={{ width, height: height || '20px' }}
    />
  );
}

