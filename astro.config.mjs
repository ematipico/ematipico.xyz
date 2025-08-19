import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: 'https://ematipico.xyz',
  vite: {
    plugins: [tailwindcss(), mdx()],
  },
    markdown: {
        shikiConfig: {
            theme: 'dracula',
        },
    },
});
