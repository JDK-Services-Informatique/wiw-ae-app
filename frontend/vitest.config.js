import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Minimal Vitest config for the frontend (React + jsdom + MSW-safe)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    },
    threads: false,
    mockReset: true,
    include: ['tests/**/*.test.[jt]s?(x)']
  }
})
