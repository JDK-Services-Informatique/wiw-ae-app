import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook pour gérer les raccourcis clavier globaux
 * 
 * @param {Object} shortcuts - Objet avec les raccourcis { 'Ctrl+K': () => {...} }
 * @param {boolean} enabled - Activer/désactiver les raccourcis (défaut: true)
 */
export function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const defaultShortcuts = {
      'Ctrl+K': (e) => {
        e.preventDefault();
        // Ouvrir la recherche globale (à implémenter)
        if (window.showToast) {
          window.showToast('🔍 Recherche globale (à venir)', 'info');
        }
      },
      'Ctrl+/': (e) => {
        e.preventDefault();
        // Afficher l'aide des raccourcis
        if (window.showToast) {
          window.showToast('⌨️ Raccourcis: Ctrl+K (Recherche), Ctrl+/ (Aide), Ctrl+S (Sauvegarder)', 'info');
        }
      },
      'Ctrl+S': (e) => {
        e.preventDefault();
        // Sauvegarder (générique)
        if (window.showToast) {
          window.showToast('💾 Sauvegarde (fonctionnalité contextuelle)', 'info');
        }
      },
      'Escape': (e) => {
        // Fermer les modals ouverts (générique)
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          // Le modal se fermera via son propre handler
        }
      }
    };

    const allShortcuts = { ...defaultShortcuts, ...shortcuts };

    const handleKeyDown = (e) => {
      // Construire la combinaison de touches
      const key = [];
      if (e.ctrlKey || e.metaKey) key.push('Ctrl');
      if (e.shiftKey) key.push('Shift');
      if (e.altKey) key.push('Alt');
      key.push(e.key);

      const shortcut = key.join('+');
      
      // Chercher le raccourci correspondant
      const handler = allShortcuts[shortcut];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, shortcuts, navigate]);

  return {
    // Fonction pour enregistrer un nouveau raccourci dynamiquement
    registerShortcut: (key, handler) => {
      shortcuts[key] = handler;
    }
  };
}

export default useKeyboardShortcuts;

