import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { defineHastPlugin } from "satteri";
import expressiveCode from "satteri-expressive-code";
import {
	expressiveCodeOptions,
	getExpressiveCodeRenderer,
} from "./src/lib/expressiveCode";

const headingLinks = defineHastPlugin({
	name: "heading-links",
	element: {
		filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
		visit(node, ctx) {
			const id = node.properties.id;
			if (typeof id !== "string") return;

			const className = Array.isArray(node.properties.className)
				? node.properties.className
				: [];
			ctx.setProperty(node, "className", [...className, "anchor"]);
			ctx.appendChild(node, {
				type: "element",
				tagName: "a",
				properties: {
					ariaLabel: "Link to this section",
					className: ["anchor-link"],
					href: `#${id}`,
				},
				children: [{ type: "text", value: "#" }],
			});
		},
	},
});

export default defineConfig({
	site: "https://ematipico.xyz",

	vite: {
		plugins: [tailwindcss()],
	},

	image: {
		domains: ["https://github.com/"],
	},

	markdown: {
		syntaxHighlight: false,
		processor: satteri({
			hastPlugins: [
				satteriHeadingIdsPlugin,
				headingLinks,
				expressiveCode({
					...expressiveCodeOptions,
					customCreateRenderer: getExpressiveCodeRenderer,
				}),
			],
		}),
	},

	devToolbar: {
		enabled: false,
	},

	integrations: [mdx()],
});
