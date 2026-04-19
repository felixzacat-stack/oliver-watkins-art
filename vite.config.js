import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginString from 'vite-plugin-string';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // This replaces html-loader functionality
    vitePluginString({
      include: '**/*.html',
      exclude: 'index.html'
    })
  ],
  resolve: {
    alias: {
      // This maps the 'src' prefix to your actual src directory
      'src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build', // Keeps your existing build folder name
  }
});