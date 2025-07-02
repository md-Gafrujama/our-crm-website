import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || '5173', 10),
    proxy: {
      '/api': {


        target: 'https://our-crm-website-tws6.vercel.app', // Your Vercel backend URL
        changeOrigin: true,
        secure: true,
        // Do NOT rewrite: keep /api for backend route matching


      }
    }
  }
});