import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'copy-service-worker',
      closeBundle() {
        // Copier le service worker dans le dossier dist après le build
        try {
          copyFileSync(
            join(__dirname, 'public/sw.js'),
            join(__dirname, 'dist/sw.js')
          );
        } catch (error) {
          console.warn('Service Worker non copié:', error);
        }
      }
    }
  ],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          utils: ['jspdf', 'jspdf-autotable']
        }
      }
    }
  },
  publicDir: 'public'
});
