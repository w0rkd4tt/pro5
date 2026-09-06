import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    type: z.enum(['CVE Analysis', 'Paper Notes', 'Disclosure', 'Field Note']),
    tags: z.array(z.string()).min(1),
    draft: z.boolean(),
    cveIds: z.array(z.string()).optional(),
    references: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
    featured: z.boolean().optional(),
    coverLabel: z.string().optional()
  })
});

const posts = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/posts' }), schema: z.object({ title: z.string(), slug: z.string(), type: z.enum(['writeup', 'blog']), date: z.coerce.date(), summary: z.string(), tags: z.array(z.string()), category: z.string().optional(), coverImage: z.string().optional(), draft: z.boolean().default(false) }) });
export const collections = { research, posts };
