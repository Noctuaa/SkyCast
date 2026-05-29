// @ts-check
import { defineConfig, envField } from 'astro/config';

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
  env: {
    schema: {
      OPENWEATHER_API_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  vite: {
    plugins: [wasm()],
    css: {
      transformer: 'lightningcss',
    },
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
    optimizeDeps: {
      exclude: ['@openmeteo/weather-map-layer'],
    },
  },
});
