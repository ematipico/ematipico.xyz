import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: "src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		slug: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string(),
		heroAltImage: z.string(),
		draft: z.boolean().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: "*.json", base: "src/content/projects" }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		githubUrl: z.string().url(),
		iconUrl: z.string().url(),
		contributions: z.string().optional(),
		order: z.number().optional(),
	}),
});

export const collections = {
	blog,
	projects,
};
