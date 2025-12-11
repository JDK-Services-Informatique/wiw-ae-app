import { defineConfig } from 'vite';
import { copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'copy-service-worker',
      closeBundle() {
        // Copier le service worker dans le dossier dist après le build
        const srcPath = resolve(__dirname, 'public/sw.js');
        const destPath = resolve(__dirname, 'dist/sw.js');

        if (existsSync(srcPath)) {
          try {
            copyFileSync(srcPath, destPath);
            console.log('Service Worker copié avec succès');
          } catch (error) {
            console.warn('Service Worker non copié:', error.message);
          }
        } else {
          console.log('Service Worker non trouvé, ignoré');
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
