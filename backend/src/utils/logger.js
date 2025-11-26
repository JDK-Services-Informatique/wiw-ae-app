// Simple logger utility for production
// For advanced logging, consider using Winston or Pino

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] || LOG_LEVELS.info;

function formatLog(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    pid: process.pid,
    env: process.env.NODE_ENV
  });
}

export const logger = {
  error: (message, meta) => {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(formatLog('error', message, meta));
    }
  },
  
  warn: (message, meta) => {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(formatLog('warn', message, meta));
    }
  },
  
  info: (message, meta) => {
    if (currentLevel >= LOG_LEVELS.info) {
      console.info(formatLog('info', message, meta));
    }
  },
  
  debug: (message, meta) => {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.debug(formatLog('debug', message, meta));
    }
  }
};

export default logger;
