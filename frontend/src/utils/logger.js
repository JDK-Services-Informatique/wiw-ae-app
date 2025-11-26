// Utilitaire de logging pour le frontend
// Remplace console.log/error pour un meilleur contrôle en production

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL || 'info'] || LOG_LEVELS.info;
const isDevelopment = import.meta.env.DEV;

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  
  return JSON.stringify(logEntry);
}

export const logger = {
  error: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.error) {
      const formatted = formatLog('error', message, meta);
      console.error(formatted);
      
      // En production, on pourrait envoyer les erreurs à un service de monitoring
      if (!isDevelopment && import.meta.env.VITE_ERROR_REPORTING_URL) {
        // Optionnel: envoyer à un service de monitoring
        fetch(import.meta.env.VITE_ERROR_REPORTING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formatted
        }).catch(() => {
          // Ignorer les erreurs d'envoi pour ne pas créer de boucle
        });
      }
    }
  },
  
  warn: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.warn) {
      if (isDevelopment) {
        console.warn(formatLog('warn', message, meta));
      }
    }
  },
  
  info: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.info) {
      if (isDevelopment) {
        console.info(formatLog('info', message, meta));
      }
    }
  },
  
  debug: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.debug) {
      if (isDevelopment) {
        console.debug(formatLog('debug', message, meta));
      }
    }
  }
};

export default logger;

