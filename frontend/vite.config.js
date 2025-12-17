import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-service-worker',
      closeBundle() {
        // Copier le service worker dans le dossier dist après le build
        const swSource = join(__dirname, 'public/sw.js');
        const swDest = join(__dirname, 'dist/sw.js');

        if (existsSync(swSource)) {
          try {
            copyFileSync(swSource, swDest);
            console.log('Service Worker copié avec succès');
          } catch (error) {
            console.log('Service Worker: copie ignorée -', error.message);
          }
        } else {
          console.log('Service Worker: fichier source non trouvé, copie ignorée');
        }
      }
    }
  ],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'jspdf', 'jspdf-autotable']
        }
      }
    }
  },
  publicDir: 'public'
});
