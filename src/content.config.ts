import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: "src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			slug: z.string(),
			pubDate: z.coerce.date(),
			hero: z.object({
				image: image(),
				alt: z.string(),
				credit: z.string().optional(),
			}),
			draft: z.boolean().optional(),
		}),
});

const projects = defineCollection({
	loader: file("src/content/projects.json"),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		githubUrl: z.url(),
		website: z.url().optional(),
		iconUrl: z.url(),
		contributions: z.string().optional(),
		order: z.number().optional(),
	}),
});

export const collections = {
	blog,
	projects,
};
