import React from 'react';
import VoiceInputButton from './VoiceInputButton';

/**
 * Champ de saisie avec bouton de remplissage vocal intégré
 */
export default function VoiceInputField({
  value,
  onChange,
  onVoiceInput,
  placeholder,
  type = 'text',
  label,
  required = false,
  disabled = false,
  style = {},
  ...props
}) {
  const handleVoiceTranscript = (transcript) => {
    if (onVoiceInput) {
      onVoiceInput(transcript);
    } else if (onChange) {
      // Par défaut, remplacer le contenu
      const event = {
        target: {
          value: transcript.trim()
        }
      };
      onChange(event);
    }
  };

  const handleVoiceAppend = (transcript) => {
    if (onChange) {
      const event = {
        target: {
          value: value ? `${value} ${transcript.trim()}` : transcript.trim()
        }
      };
      onChange(event);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--panel)',
            color: 'var(--ink)',
            fontSize: '14px',
            ...style
          }}
          {...props}
        />
        <VoiceInputButton
          onTranscript={handleVoiceTranscript}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

