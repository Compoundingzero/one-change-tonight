import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isPreview, siteConfig } from '@/config/site';

function xml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const GET: APIRoute = async () => {
  const articles = isPreview
    ? []
    : [...(await getCollection('guides')), ...(await getCollection('comparisons'))].filter(
        (entry) => entry.data.indexable,
      );
  const entries = articles
    .map((entry) => {
      const url = new URL(entry.data.path, siteConfig.siteUrl).toString();
      return `<entry><title>${xml(entry.data.title)}</title><id>${xml(url)}</id><link href="${xml(url)}"/><updated>${entry.data.reviewed}T00:00:00Z</updated><summary>${xml(entry.data.description)}</summary></entry>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>One Change Tonight</title><id>${xml(siteConfig.siteUrl)}</id><updated>2026-09-07T00:00:00Z</updated>${entries}</feed>`,
    { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } },
  );
};
