// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })







// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import dotenv from 'dotenv';
// const viteBaseUrl = process.env.VITE_BASE_URL || 'http://localhost:3000';
// const frontendPort = Number(new URL(viteBaseUrl).port) || 3000;


// dotenv.config();
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: frontendPort,
//   },
// });




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
    target: 'https://our-crm-website.vercel.app',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}

  }
});