import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (normalizedId.includes('node_modules/cytoscape')) {
            return 'cytoscape-vendor';
          }

          if (
            normalizedId.includes('node_modules/@xyflow') ||
            normalizedId.includes('node_modules/classcat') ||
            normalizedId.includes('node_modules/d3-') ||
            normalizedId.includes('node_modules/use-sync-external-store') ||
            normalizedId.includes('node_modules/zustand')
          ) {
            return 'graph-vendor';
          }

          if (normalizedId.includes('node_modules')) {
            return 'react-vendor';
          }

          if (normalizedId.includes('/src/data/traceLessons.js')) {
            return 'trace-lessons';
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
