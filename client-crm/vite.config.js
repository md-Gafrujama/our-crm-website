import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '5173', 10), // Local dev server port
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://our-crm-website.vercel.app', // Backend URL
        changeOrigin: true,
        secure: true,
      }
    }
  }
});