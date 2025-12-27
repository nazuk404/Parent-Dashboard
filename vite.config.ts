import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/email': 'http://localhost:5000',
      '/api/health': 'http://localhost:5000',
    },
  },
})
