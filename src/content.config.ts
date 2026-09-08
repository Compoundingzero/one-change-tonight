import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articleLinkSchema = z
  .object({
    label: z.string(),
    href: z.string(),
  })
  .strict();

const articleSchema = z
  .object({
    path: z.string().startsWith('/').endsWith('/'),
    title: z.string().min(12),
    description: z.string().min(50).max(170),
    eyebrow: z.string(),
    audience: z.string(),
    directAnswer: z.string().min(80),
    uncertainty: z.string().min(35),
    applies: z.array(z.string()).min(2),
    mayNotApply: z.array(z.string()).min(1),
    observations: z.array(z.string()).min(3),
    experimentName: z.string(),
    experimentChange: z.string(),
    experimentConstant: z.string(),
    experimentSteps: z.array(z.string()).min(2),
    doNotBuy: z.string().min(35),
    safetyNote: z.string().min(45),
    sourceIds: z.array(z.string()).min(1),
    broaderLink: articleLinkSchema,
    nextLink: articleLinkSchema,
    context: z.enum([
      'cold-room',
      'partner-temperature',
      'hot-then-cold',
      'bed-heat',
      'failed-fix',
      'mechanisms',
      'care-notes',
    ]),
    published: z.string(),
    reviewed: z.string(),
    indexable: z.boolean().default(true),
  })
  .strict();

export const collections = {
  guides: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
    schema: articleSchema,
  }),
  comparisons: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/comparisons' }),
    schema: articleSchema,
  }),
};
