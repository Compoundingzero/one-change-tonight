import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { corePages } from '@/data/core-pages';
import { isPreview, siteConfig } from '@/config/site';

export const GET: APIRoute = async () => {
  const articles = (await Promise.all([getCollection('guides'), getCollection('comparisons')]))
    .flat()
    .filter((entry) => entry.data.indexable);
  const entries: Array<{ path: string; modified?: string }> = isPreview
    ? []
    : [
        { path: '/' },
        { path: '/tool/' },
        ...corePages.map((page) => ({ path: page.path })),
        ...articles.map((entry) => ({ path: entry.data.path, modified: entry.data.reviewed })),
      ];
  const seen = new Set<string>();
  const urls = entries
    .filter(({ path }) => !seen.has(path) && seen.add(path))
    .map(
      ({ path, modified }) =>
        `<url><loc>${new URL(path, siteConfig.siteUrl).toString()}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
