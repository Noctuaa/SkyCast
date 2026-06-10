// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import vue from '@astrojs/vue';
import wasm from 'vite-plugin-wasm';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [vue()],
  vite: {
    plugins: [wasm()],
    css: {
      transformer: 'lightningcss',
    },
    optimizeDeps: {
      exclude: ['@openmeteo/weather-map-layer'],
    },
  },
});
