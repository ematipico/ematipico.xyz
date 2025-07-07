import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    heroImage: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
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
  blog: blogCollection,
  projects: projectsCollection,
};