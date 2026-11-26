import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base lets the build run from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
});
