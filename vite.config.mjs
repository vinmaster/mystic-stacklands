import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: './src/client',
  publicDir: 'assets',
  clearScreen: false,
  build: {
    outDir: '../../public',
    emptyOutDir: true,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        main: './src/client/index.html',
      },
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  server: {
    port: 8080,
  },
});
