import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/*.mjs',
        '**/*.cjs',
        '**/seed_sale.js',
        '**/extracted_products.json'
      ]
    }
  },
  build: {
    minify: true
  }
});
