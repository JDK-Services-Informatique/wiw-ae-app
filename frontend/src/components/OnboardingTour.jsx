import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Composant de tour guidé / onboarding
 * Affiche des étapes guidées pour aider les nouveaux utilisateurs
 */
export default function OnboardingTour({
  steps = [],
  onComplete,
  onSkip,
  showSkip = true,
  startOnMount = false,
  storageKey = 'onboarding-completed'
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const overlayRef = useRef(null);
  const { isDark } = useTheme();

  // Vérifier si le tour a déjà été complété
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed && (startOnMount || steps.length > 0)) {
      setIsActive(true);
    }
  }, [startOnMount, storageKey, steps.length]);

  // Mettre en évidence l'élément cible
  useEffect(() => {
    if (!isActive || steps.length === 0) return;

    const step = steps[currentStep];
    if (step?.target) {
      const element = typeof step.target === 'string' 
        ? document.querySelector(step.target)
        : step.target;

      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      setHighlightedElement(null);
    };
  }, [isActive, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
    if (onSkip) onSkip();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
    if (onComplete) onComplete();
  };

  if (!isActive || steps.length === 0) return null;

  const step = steps[currentStep];
  const element = highlightedElement;
  const rect = element?.getBoundingClientRect();

  return (
    <>
      {/* Overlay sombre */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Tooltip du tour */}
      {rect && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: rect.bottom + 10,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm pointer-events-auto">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-brand" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Étape {currentStep + 1} sur {steps.length}
                </span>
              </div>
              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenu */}
            <div className="mb-4">
              {step.title && (
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
              )}
              {step.content && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {step.content}
                </p>
              )}
              {step.component && step.component}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Précédent
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {showSkip && (
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Passer
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-1"
                >
                  {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                  {currentStep < steps.length - 1 && <ChevronRight size={16} />}
                </button>
              </div>
            </div>

            {/* Indicateurs de progression */}
            <div className="flex gap-1 mt-4 justify-center">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-brand w-8'
                      : 'bg-slate-200 dark:bg-slate-700 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mise en évidence de l'élément cible */}
      {element && (
        <div
          className="fixed z-[9997] pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            border: '2px solid #7c3aed',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
    </>
  );
}

/**
 * Hook pour démarrer le tour programmatiquement
 */
export function useOnboardingTour(steps, options = {}) {
  const [isActive, setIsActive] = useState(false);

  const startTour = () => {
    setIsActive(true);
  };

  const stopTour = () => {
    setIsActive(false);
  };

  return {
    isActive,
    startTour,
    stopTour,
    TourComponent: isActive ? (
      <OnboardingTour
        steps={steps}
        onComplete={() => {
          setIsActive(false);
          if (options.onComplete) options.onComplete();
        }}
        onSkip={() => {
          setIsActive(false);
          if (options.onSkip) options.onSkip();
        }}
        {...options}
      />
    ) : null
  };
}

