import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            if (err.code === 'ECONNREFUSED') {
              // Try next port
              const currentPort = parseInt(proxy.options.target.split(':')[2]);
              if (currentPort < 5052) {
                proxy.options.target = `http://localhost:${currentPort + 1}`;
              }
            }
          });
        }
      }
    }
  }
});