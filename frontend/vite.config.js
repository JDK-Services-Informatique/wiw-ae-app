import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(),
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
