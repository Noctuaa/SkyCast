// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

import vue from '@astrojs/vue';

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
    css: {
      transformer: 'lightningcss',
    },
  },
});
