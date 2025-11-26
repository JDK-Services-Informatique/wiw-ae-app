import React from 'react';
import { PlanProvider } from '../context/PlanContext';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Provider global combinant tous les contextes de l'application
 * Utilisez ce provider à la racine de l'application pour activer tous les contextes
 */
export default function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <PlanProvider>
        {children}
      </PlanProvider>
    </ThemeProvider>
  );
}

