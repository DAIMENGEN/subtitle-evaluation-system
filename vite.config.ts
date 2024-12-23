import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "10.150.115.16",
    port: 3000,
  },
  resolve: {
    alias: {
      "@Root": "/src"
    }
  },
  plugins: [react()],
})
