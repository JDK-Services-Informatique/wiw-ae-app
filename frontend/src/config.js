// Configuration de l'API
// `VITE_API_URL` is injected at build time by Vercel (set in Project > Environment Variables).
// Fallback to localhost for local development.
// En développement local, forcer l'utilisation de localhost
const isDevelopment = import.meta.env.DEV;
const defaultApiUrl = 'http://localhost:4000/api';

// En développement, forcer localhost même si VITE_API_URL est défini avec une URL distante
let apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

if (isDevelopment) {
  // En développement, toujours utiliser localhost sauf si explicitement défini à localhost
  if (apiUrl.includes('koyeb.app') || apiUrl.includes('railway.app') || apiUrl.includes('render.com') || apiUrl.includes('onrender.com')) {
    console.warn('⚠️ URL API distante détectée en développement, utilisation de localhost par défaut');
    apiUrl = defaultApiUrl;
  }
}

export const API_URL = apiUrl;
