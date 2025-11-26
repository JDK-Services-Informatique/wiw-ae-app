// Configuration de l'API
// `VITE_API_URL` is injected at build time by Vercel (set in Project > Environment Variables).
// Fallback to localhost for local development.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
