import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // This forces Vite to listen on all local network addresses
    port: 5173,      // Ensure Vite stays on your expected port
  } ,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
