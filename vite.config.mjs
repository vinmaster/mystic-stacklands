import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: 'src',
  // publicDir: './public',
  clearScreen: false,
  build: {
    outDir: '../public',
    emptyOutDir: true,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        // app: './src/client/index.html',
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
