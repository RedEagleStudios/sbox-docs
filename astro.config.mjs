// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sbox.redeaglestudios.org',
  integrations: [react(), sitemap({
    customPages: [
      'https://sbox.redeaglestudios.org/llms.txt',
      'https://sbox.redeaglestudios.org/llms-full.txt',
    ],
  }), icon()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"]
      }
    }
  }
});