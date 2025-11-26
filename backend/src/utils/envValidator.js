// Validation des variables d'environnement critiques au démarrage
import logger from './logger.js';

const requiredEnvVars = {
  JWT_SECRET: {
    required: true,
    minLength: 32,
    description: 'Secret JWT pour signer les tokens (minimum 32 caractères)'
  },
  DATABASE_URL: {
    required: true,
    description: 'URL de connexion à la base de données'
  }
};

const optionalEnvVars = {
  NODE_ENV: {
    default: 'development',
    allowedValues: ['development', 'production', 'test']
  },
  PORT: {
    default: '4000',
    validator: (value) => {
      const port = parseInt(value, 10);
      return !isNaN(port) && port > 0 && port < 65536;
    }
  },
  LOG_LEVEL: {
    default: 'info',
    allowedValues: ['error', 'warn', 'info', 'debug']
  }
};

export function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // Vérifier les variables requises
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    
    if (!value) {
      if (config.required) {
        errors.push(`Variable d'environnement requise manquante: ${varName} - ${config.description}`);
      }
      continue;
    }

    // Vérifier la longueur minimale
    if (config.minLength && value.length < config.minLength) {
      errors.push(
        `Variable ${varName} trop courte (minimum ${config.minLength} caractères, actuellement ${value.length})`
      );
    }
  }

  // Vérifier les variables optionnelles
  for (const [varName, config] of Object.entries(optionalEnvVars)) {
    const value = process.env[varName];
    
    if (!value) {
      process.env[varName] = config.default;
      warnings.push(`Variable ${varName} non définie, utilisation de la valeur par défaut: ${config.default}`);
      continue;
    }

    // Vérifier les valeurs autorisées
    if (config.allowedValues && !config.allowedValues.includes(value)) {
      warnings.push(
        `Variable ${varName} a une valeur non standard: ${value}. Valeurs recommandées: ${config.allowedValues.join(', ')}`
      );
    }

    // Valider avec une fonction personnalisée
    if (config.validator && !config.validator(value)) {
      errors.push(`Variable ${varName} a une valeur invalide: ${value}`);
    }
  }

  // Afficher les erreurs et warnings
  if (errors.length > 0) {
    logger.error('Erreurs de configuration détectées:', { errors });
    console.error('\n❌ ERREURS DE CONFIGURATION:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\n');
    throw new Error('Variables d\'environnement manquantes ou invalides. Vérifiez votre configuration.');
  }

  if (warnings.length > 0) {
    logger.warn('Avertissements de configuration:', { warnings });
    warnings.forEach(warn => logger.warn(warn));
  }

  logger.info('Validation des variables d\'environnement réussie');
}

export default validateEnvironment;

