import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://ematipico.xyz",
	vite: {
		plugins: [tailwindcss(), mdx()],
	},
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
	},
});
