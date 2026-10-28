import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_SERVER = 'https://photorental-api-826241029359.me-west1.run.app'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: API_SERVER, changeOrigin: true },
      '/img': { target: API_SERVER, changeOrigin: true },
    },
  },
})
