import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import honorairesRouter from './routes/honoraires.routes.js';
import authRouter from './routes/auth.routes.js';
import projetsRouter from './routes/projets.routes.js';
import appelsRouter from './routes/appels.routes.js';
import devisRouter from './routes/devis.routes.js';
import referencesRouter from './routes/references.routes.js';
import equipeRouter from './routes/equipe.routes.js';
import materielRouter from './routes/materiel.routes.js';
import inheritanceRouter from './routes/inheritance.routes.js';
import validationRouter from './routes/validation.routes.js';
import listesDeroulantesRouter from './routes/listesDeroulantes.routes.js';
import scenarioVersioningRouter from './routes/scenarioVersioning.routes.js';
import teamTemplateRouter from './routes/teamTemplate.routes.js';
import sponsorsRouter from './routes/sponsors.routes.js';
import { authenticate } from './middlewares/auth.middleware.js';
import { authorize, protectFinancialData, filterByRole } from './middlewares/authorization.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import logger from './utils/logger.js';
import prisma from './prismaClient.js';
import validateEnvironment from './utils/envValidator.js';
import { prismaErrorMiddleware } from './utils/prismaErrorHandler.js';

// Valider les variables d'environnement au démarrage
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Échec de la validation des variables d\'environnement');
  process.exit(1);
}

const app = express();

// Security headers avec Helmet configuré de manière stricte
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Nécessaire pour certains frameworks CSS
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // HTTP Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true
  },
  // Empêche le navigateur de deviner le type MIME
  noSniff: true,
  // Empêche l'affichage dans une iframe (protection clickjacking)
  frameguard: {
    action: 'deny'
  },
  // Supprime le header X-Powered-By (ne pas révéler la technologie)
  hidePoweredBy: true,
  // Protection XSS pour les anciens navigateurs
  xssFilter: true
}));

// CORS configuration - adaptable selon environnement
// Priority: CORS_ORIGIN (single origin) -> ALLOWED_ORIGINS (CSV) -> defaults
const allowedOrigins = (() => {
  // Si CORS_ORIGIN est défini, utiliser uniquement cette origine
  if (process.env.CORS_ORIGIN) {
    return [process.env.CORS_ORIGIN];
  }

  // Si ALLOWED_ORIGINS est défini, utiliser cette liste
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim());
  }

  // Configuration par défaut selon l'environnement
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // En développement, autoriser localhost et quelques patterns de test
  if (isDevelopment) {
    return [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5184',
      'http://localhost:5185',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
  }

  // En production, liste blanche stricte - pas de wildcards par défaut
  // Les origins de production DOIVENT être configurées via ALLOWED_ORIGINS
  logger.warn('⚠️  CORS: Aucune origin configurée pour la production. Définissez ALLOWED_ORIGINS dans .env');
  return [];
})();

logger.info('CORS allowed origins', { origins: allowedOrigins });

// Also accept FRONTEND_URL if defined (convenience for deployments)
if (process.env.FRONTEND_URL) {
  const frontendUrl = process.env.FRONTEND_URL.trim();
  if (!allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
    logger.info('Added FRONTEND_URL to allowed origins', { url: frontendUrl });
  }
}

app.use(cors({
  origin: function(origin, callback) {
    // TEMPORARY: Allow all origins for testing if CORS_ALLOW_ALL is set
    if (process.env.CORS_ALLOW_ALL === 'true') {
      logger.info('CORS_ALLOW_ALL is enabled - allowing all origins (temporary for testing)', { origin });
      return callback(null, true);
    }

    // Allow requests with no origin (mobile apps, Postman, etc.)
    // Controlled by CORS_ALLOW_BROWSERLESS:
    // - in development (NODE_ENV !== 'production') browserless requests are allowed by default
    // - in production, set CORS_ALLOW_BROWSERLESS=true to allow them, or false to block them
    const allowBrowserless = (process.env.CORS_ALLOW_BROWSERLESS === 'true') || process.env.NODE_ENV !== 'production';
    if (!origin) {
      if (allowBrowserless) {
        logger.info('CORS: Allowing browserless request');
        return callback(null, true);
      }
      const msgNoOrigin = 'Requests without an Origin header are not allowed in this environment';
      logger.warn('CORS blocked browserless request', { allowedOrigins, allowBrowserless });
      return callback(new Error(msgNoOrigin), false);
    }

    // Log all CORS requests for debugging
    logger.info('CORS request received', { origin, allowedOrigins: allowedOrigins.length });

    // Check if origin is allowed (support for wildcards)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        // Handle wildcard patterns
        const pattern = allowed.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        const matches = regex.test(origin);
        if (matches) {
          logger.info('CORS allowed via wildcard pattern', { origin, pattern: allowed });
          return true;
        }
      } else if (origin === allowed) {
        logger.info('CORS allowed via exact match', { origin, allowed });
        return true;
      }
      return false;
    });

    if (isAllowed) {
      return callback(null, true);
    }

    // TEMPORARY: Log the blocked origin for debugging
    logger.error('CORS blocked request - origin not in allowed list', {
      origin,
      allowedOrigins,
      userAgent: origin ? 'browser' : 'unknown'
    });

    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Rate limiting global pour toute l'API (sauf health checks)
app.use('/api', apiLimiter);

app.use('/api/auth', authRouter);
app.use('/api/projets', authenticate, filterByRole, projetsRouter);
app.use('/api/appels', authenticate, filterByRole, appelsRouter);
app.use('/api/honoraires', authenticate, protectFinancialData, filterByRole, honorairesRouter);
app.use('/api/devis', authenticate, filterByRole, devisRouter);
app.use('/api/references', authenticate, filterByRole, referencesRouter);
app.use('/api/equipe', authenticate, filterByRole, equipeRouter);
app.use('/api/materiels', authenticate, filterByRole, materielRouter);
app.use('/api/inheritance', authenticate, filterByRole, inheritanceRouter);
app.use('/api/validation', authenticate, filterByRole, validationRouter);
app.use('/api/listes-deroulantes', authenticate, authorize('ADMIN'), listesDeroulantesRouter);
app.use('/api/scenario-versions', authenticate, filterByRole, scenarioVersioningRouter);
app.use('/api/team-templates', authenticate, filterByRole, teamTemplateRouter);
app.use('/api/sponsors', sponsorsRouter); // Route publique pour GET, protégée pour POST/PUT/DELETE dans le router

// Health check endpoints for monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: {
      allowAll: process.env.CORS_ALLOW_ALL === 'true',
      allowedOrigins: allowedOrigins,
      origin: req.headers.origin || 'none'
    }
  });
});

app.get('/api/ready', async (req, res) => {
  try {
    // Ensure Prisma client can connect and run a lightweight query.
    // We call $connect() to eagerly establish connectivity (no $disconnect here,
    // since Prisma client is shared for the app lifetime).
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: 'not ready',
      database: 'disconnected',
      error: error.message
    });
  }
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  const origin = req.headers.origin || 'none';
  const userAgent = req.headers['user-agent'] || 'unknown';

  logger.info('CORS test endpoint called', { origin, userAgent, allowedOrigins });

  res.status(200).json({
    message: 'CORS test successful',
    origin: origin,
    allowedOrigins: allowedOrigins,
    corsAllowAll: process.env.CORS_ALLOW_ALL === 'true',
    timestamp: new Date().toISOString(),
    headers: {
      'access-control-allow-origin': res.get('Access-Control-Allow-Origin') || 'not set',
      'access-control-allow-credentials': res.get('Access-Control-Allow-Credentials') || 'not set'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Prisma error handler (avant le gestionnaire d'erreurs global)
app.use(prismaErrorMiddleware);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée', { 
    error: err.message, 
    stack: err.stack,
    url: req.url,
    method: req.method,
    code: err.code
  });
  
  // Ne pas révéler les détails d'erreur en production
  const isDev = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Erreur interne du serveur',
    ...(isDev && { stack: err.stack, code: err.code })
  });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0'; // Écoute sur toutes les interfaces

// Démarrer le serveur seulement si exécuté directement (pas importé par Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, HOST, () => {
    const databaseType = process.env.DATABASE_URL?.includes('postgresql')
      ? 'PostgreSQL'
      : process.env.DATABASE_URL?.includes('sqlite')
      ? 'SQLite'
      : 'Unknown';

    logger.info('🚀 WiW API démarrée', {
      port: PORT,
      host: HOST,
      env: process.env.NODE_ENV || 'development',
      database: databaseType
    });

    // Afficher les informations de démarrage en mode développement
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n✅ Serveur accessible à:`);
      console.log(`   - Local:   http://localhost:${PORT}`);
      console.log(`   - Réseau:  http://${HOST}:${PORT}`);
      console.log(`\n📋 Endpoints disponibles:`);
      console.log(`   - Health:  http://localhost:${PORT}/api/health`);
      console.log(`   - Ready:   http://localhost:${PORT}/api/ready`);
      console.log(`\n🔐 Routes protégées:`);
      console.log(`   - /api/devis, /api/references, /api/equipe`);
      console.log(`   - /api/honoraires, /api/projets, /api/appels\n`);
    }
  });
}

// Export pour Vercel serverless functions
export default app;
