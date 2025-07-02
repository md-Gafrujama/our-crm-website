import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || '5173', 10),
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://our-crm-website.vercel.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log(`Rewriting path: ${path} -> ${newPath}`);
          return newPath;
        }
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});