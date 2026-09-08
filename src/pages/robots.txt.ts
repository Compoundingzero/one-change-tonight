import type { APIRoute } from 'astro';
import { isPreview, siteConfig } from '@/config/site';

export const GET: APIRoute = () => {
  if (isPreview) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const gptPolicy = siteConfig.gptBotPolicy === 'allow' ? 'Allow: /' : 'Disallow: /';
  const body = [
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    gptPolicy,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('/sitemap.xml', siteConfig.siteUrl).toString()}`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
