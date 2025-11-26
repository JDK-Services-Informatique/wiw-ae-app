import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.api';

/**
 * Composant pour activer les raccourcis clavier globaux dans l'application
 */
export default function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si l'utilisateur est en train de taper dans un input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      // Ctrl+K ou Cmd+K : Recherche globale
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (window.showToast) {
          window.showToast('🔍 Recherche globale (fonctionnalité à venir)', 'info');
        }
      }

      // Ctrl+/ ou Cmd+/ : Aide des raccourcis
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        if (window.showToast) {
          window.showToast('⌨️ Raccourcis: Ctrl+K (Recherche), Ctrl+/ (Aide), Ctrl+S (Sauvegarder), Esc (Fermer)', 'info');
        }
      }

      // Ctrl+S ou Cmd+S : Sauvegarder (générique)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Déclencher un événement personnalisé que les composants peuvent écouter
        window.dispatchEvent(new CustomEvent('global-save'));
        if (window.showToast) {
          window.showToast('💾 Sauvegarde déclenchée', 'info');
        }
      }

      // Escape : Fermer les modals
      if (e.key === 'Escape') {
        // Déclencher un événement pour fermer les modals
        window.dispatchEvent(new CustomEvent('close-modals'));
      }

      // Navigation rapide (seulement si authentifié)
      if (authService.isAuthenticated()) {
        // Ctrl+1 : Dashboard
        if ((e.ctrlKey || e.metaKey) && e.key === '1') {
          e.preventDefault();
          navigate('/dashboard');
        }
        // Ctrl+2 : Tenders
        if ((e.ctrlKey || e.metaKey) && e.key === '2') {
          e.preventDefault();
          navigate('/tenders');
        }
        // Ctrl+3 : Analytics
        if ((e.ctrlKey || e.metaKey) && e.key === '3') {
          e.preventDefault();
          navigate('/analytics');
        }
        // Ctrl+4 : Pipeline
        if ((e.ctrlKey || e.metaKey) && e.key === '4') {
          e.preventDefault();
          navigate('/pipeline');
        }
        // Ctrl+9 : Settings
        if ((e.ctrlKey || e.metaKey) && e.key === '9') {
          e.preventDefault();
          navigate('/settings');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return null; // Ce composant ne rend rien
}

