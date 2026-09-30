import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/components/shared', import.meta.url)),
      '@sections': fileURLToPath(new URL('./src/components/sections', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/components/pages', import.meta.url)),
      '@layout': fileURLToPath(new URL('./src/components/layout', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
})
