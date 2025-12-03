// Vercel Serverless Function wrapper pour Express
// Ce fichier permet au serveur Express de fonctionner comme une serverless function sur Vercel

import app from '../src/server.js';

// Export the Express app as a serverless function
export default app;
