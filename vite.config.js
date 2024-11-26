import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/': { // This proxies all routes
        target: 'http://localhost:8088', // Replace with your backend server
        changeOrigin: true,
        secure: false, // If your backend is not using https
        rewrite: (path) => path.replace(/^\/$/, '/'), // To avoid double slashes
      },
    },
  },
});
