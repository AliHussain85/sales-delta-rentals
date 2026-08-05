import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'html2canvas-pro': fileURLToPath(
        new URL('./node_modules/html2canvas-pro/dist/html2canvas-pro.esm.js', import.meta.url),
      ),
    },
  },
  optimizeDeps: {
    include: ['html2canvas-pro'],
  },
})
