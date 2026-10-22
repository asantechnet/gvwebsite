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
      '@website': fileURLToPath(new URL('./src/website', import.meta.url)),
      '@cms': fileURLToPath(new URL('./src/cms', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/website/components', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/website/components/ui', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/website/components/shared', import.meta.url)),
      '@sections': fileURLToPath(new URL('./src/website/components/sections', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/website/components/pages', import.meta.url)),
      '@layout': fileURLToPath(new URL('./src/website/components/layout', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/shared/services', import.meta.url)),
    },
  },
})
