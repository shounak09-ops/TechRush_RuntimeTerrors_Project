import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Forwards to the local AI server (see /server) so the browser never
      // needs to know its real address, and no CORS config is required.
      "/api": "https://tech-rush-runtime-terrors-project-b.vercel.app",
    },
  },
})
