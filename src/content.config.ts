import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: "src/content/blog" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		slug: z.string(),
		pubDate: z.coerce.date(),
		heroImage: image(),
		heroAltImage: z.string(),
		draft: z.boolean().optional(),
	}),
});

const projects = defineCollection({
	loader: file("src/content/projects.json"),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		githubUrl: z.string().url(),
		website: z.string().url().optional(),
		iconUrl: z.string().url(),
		contributions: z.string().optional(),
		order: z.number().optional(),
	}),
});

export const collections = {
	blog,
	projects,
};
