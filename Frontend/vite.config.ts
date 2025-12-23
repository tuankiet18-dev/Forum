import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Quan trọng: Cho phép Docker map port ra ngoài
    port: 5173,
    watch: {
      usePolling: true // Quan trọng: Giúp Hot Reload hoạt động tốt trên Windows/Docker
    }
  }
})
