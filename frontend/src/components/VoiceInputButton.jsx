import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

/**
 * Composant bouton pour remplissage vocal
 * Utilise l'API Web Speech Recognition (Chrome, Edge)
 */
export default function VoiceInputButton({ onTranscript, disabled = false, language = 'fr-FR' }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'API est supportée
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    if (!isSupported || !isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setError(null);
      if (window.showToast) {
        window.showToast('🎤 Écoute en cours...', 'info');
      }
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      if (onTranscript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Erreur reconnaissance vocale:', event.error);
      setError(event.error);
      setIsListening(false);
      
      let errorMessage = 'Erreur de reconnaissance vocale';
      if (event.error === 'no-speech') {
        errorMessage = 'Aucune parole détectée';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone non autorisé';
      } else if (event.error === 'network') {
        errorMessage = 'Erreur réseau';
      }
      
      if (window.showToast) {
        window.showToast(`⚠️ ${errorMessage}`, 'error');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isListening, isSupported, language, onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      if (window.showToast) {
        window.showToast('⚠️ Reconnaissance vocale non supportée sur ce navigateur (Chrome/Edge requis)', 'warning');
      }
      return;
    }

    if (isListening) {
      setIsListening(false);
      if (window.showToast) {
        window.showToast('🔇 Écoute arrêtée', 'info');
      }
    } else {
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null; // Ne pas afficher si non supporté
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`voice-input-button ${isListening ? 'listening' : ''}`}
      title={isListening ? 'Arrêter la dictée' : 'Démarrer la dictée vocale'}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: isListening ? '#ef4444' : 'var(--panel)',
        color: isListening ? 'white' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {isListening ? (
        <>
          <MicOff size={16} />
          <span>Arrêter</span>
        </>
      ) : (
        <>
          <Mic size={16} />
          <span>Dictée</span>
        </>
      )}
    </button>
  );
}

