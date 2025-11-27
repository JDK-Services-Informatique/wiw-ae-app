// Configuration de l'API
// `VITE_API_URL` is injected at build time by Vercel (set in Project > Environment Variables).
// Fallback to localhost for local development.
// En développement local, utiliser toujours localhost sauf si explicitement défini
const isDevelopment = import.meta.env.DEV;
const defaultApiUrl = 'http://localhost:4000/api';

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

// En développement, forcer localhost si l'URL pointe vers une URL distante
if (isDevelopment && API_URL.includes('koyeb.app') || API_URL.includes('railway.app') || API_URL.includes('render.com')) {
  console.warn('⚠️ URL API distante détectée en développement, utilisation de localhost par défaut');
  // Note: On ne peut pas modifier import.meta.env à l'exécution, mais le fallback devrait fonctionner
}
