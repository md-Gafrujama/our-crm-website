import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt( '5173', 10),
    proxy: {
      '/api': {
        target: 'https://our-crm-website.vercel.app', // Remove trailing slash
        changeOrigin: true,
        secure: true,
        // No rewrite needed; keep /api for backend route matching
      }
    }
  }
});