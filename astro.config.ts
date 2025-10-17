import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"

export default defineConfig({
	site: "https://ematipico.xyz",
	vite: {
		plugins: [tailwindcss(), mdx()],
	},
    image:{
      domains: ['https://github.com/'],
    },
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
        rehypePlugins: [
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'append',
                    content: {
                        type: 'text',
                        value: '#',
                    },
                    headingProperties: {
                        className: ['anchor'],
                    },
                    properties: {
                        className: ['anchor-link'],
                    },
                },
            ],
        ]
	},
    devToolbar: {
        enabled: false
    }
});
