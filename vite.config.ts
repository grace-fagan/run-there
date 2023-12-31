import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $types: path.resolve('./src/types'),
      $components: path.resolve('./src/components'),
      $data: path.resolve('./src/data')
    }
  }
});
