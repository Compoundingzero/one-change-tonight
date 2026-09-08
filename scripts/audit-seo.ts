import { existsSync } from 'node:fs';
import { corePages } from '../src/data/core-pages';
import { fail, field, frontmatter, read, walk } from './lib/audit-utils';

const isPreview = process.env.PUBLIC_DEPLOY_CONTEXT !== 'production';
const siteUrl = process.env.PUBLIC_SITE_URL ?? 'https://example.invalid';

const markdown = ['src/content/guides', 'src/content/comparisons'].flatMap((directory) =>
  existsSync(directory) ? walk(directory, '.md') : [],
);
const entries = [
  ...corePages.map((page) => ({
    title: page.title,
    description: page.description,
    path: page.path,
  })),
  ...markdown.map((file) => {
    const yaml = frontmatter(read(file));
    return {
      title: field(yaml, 'title'),
      description: field(yaml, 'description'),
      path: field(yaml, 'path'),
    };
  }),
];
for (const key of ['title', 'description', 'path'] as const) {
  const values = entries.map((entry) => entry[key]);
  if (new Set(values).size !== values.length) fail(`Duplicate SEO ${key} detected.`);
}
if (!isPreview && siteUrl.includes('example.invalid'))
  fail('Production canonical is a placeholder.');
const required = ['canonical', 'og:title', 'og:description', 'robots', 'application/ld+json'];
const layout = read('src/components/layout/BaseLayout.astro');
for (const item of required)
  if (!layout.includes(item)) fail(`Base layout is missing ${item}.`);

if (!existsSync('dist')) fail('Build dist/ before running the SEO audit.');

const htmlFiles = walk('dist', '.html');
if (!htmlFiles.length) fail('No generated HTML was found in dist/.');

const generatedTitles = new Map<string, string>();
const generatedDescriptions = new Map<string, string>();
const generatedCanonicals = new Map<string, string>();
const privatePaths = new Set(['/404/', '/awake-and-hot/']);

const pagePath = (file: string) => {
  const relative = file.replace(/^dist\/?/, '');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404/';
  return `/${relative.replace(/\/index\.html$/, '')}/`;
};

const match = (html: string, pattern: RegExp) => html.match(pattern)?.[1]?.trim() ?? '';
const recordUnique = (
  values: Map<string, string>,
  value: string,
  file: string,
  label: string,
) => {
  const earlier = values.get(value);
  if (earlier) fail(`${file}: duplicate generated ${label} also used by ${earlier}.`);
  values.set(value, file);
};

for (const file of htmlFiles) {
  const html = read(file);
  const path = pagePath(file);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const robots = match(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const main = match(html, /<main[^>]*>([\s\S]*?)<\/main>/i)
    .replace(/<[^>]+>/g, '')
    .trim();

  if (!title) fail(`${file}: generated page has no title.`);
  if (!description) fail(`${file}: generated page has no meta description.`);
  if (h1Count !== 1) fail(`${file}: expected exactly one H1; found ${h1Count}.`);
  if (!main) fail(`${file}: main content is absent from the initial HTML.`);
  recordUnique(generatedTitles, title, file, 'title');
  recordUnique(generatedDescriptions, description, file, 'description');

  const shouldNoindex = isPreview || privatePaths.has(path);
  if (shouldNoindex && !robots.includes('noindex'))
    fail(`${file}: private or preview page is indexable.`);
  if (!shouldNoindex && robots.includes('noindex'))
    fail(`${file}: production public page is accidentally noindex.`);
  if (isPreview && canonical) fail(`${file}: preview page emits a canonical URL.`);
  if (!isPreview && !privatePaths.has(path)) {
    if (!canonical) fail(`${file}: production public page has no canonical.`);
    const url = new URL(canonical);
    if (url.protocol !== 'https:' || url.origin !== new URL(siteUrl).origin)
      fail(`${file}: canonical is not on the configured HTTPS origin.`);
    recordUnique(generatedCanonicals, canonical, file, 'canonical');
  }

  const jsonLdBlocks = [
    ...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  if (!jsonLdBlocks.length) fail(`${file}: generated page has no JSON-LD.`);
  for (const block of jsonLdBlocks) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block[1] ?? '');
    } catch {
      fail(`${file}: generated JSON-LD is invalid JSON.`);
    }
    const serialized = JSON.stringify(parsed);
    if (
      /"@type":"(?:MedicalWebPage|MedicalCondition|Physician|Product|Offer|AggregateRating|Review)"/.test(
        serialized,
      )
    ) {
      fail(`${file}: generated JSON-LD contains a prohibited or exaggerated type.`);
    }
  }

  if (/(?:wake_experience|co_sleeper_state|after_episode|selectedExperimentId)=/i.test(html)) {
    fail(`${file}: personal assessment state appears in generated URL markup.`);
  }
}

const robotsText = read('dist/robots.txt');
if (isPreview && !/^User-agent: \*\nDisallow: \/\n$/m.test(robotsText))
  fail('Preview robots.txt must block crawling.');
if (!isPreview) {
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'GPTBot']) {
    if (!robotsText.includes(`User-agent: ${bot}`)) fail(`Production robots.txt omits ${bot}.`);
  }
  if (!robotsText.includes(`Sitemap: ${new URL('/sitemap.xml', siteUrl).toString()}`))
    fail('Production robots.txt has the wrong sitemap URL.');
}

const sitemap = read('dist/sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) => item[1] ?? '');
if (isPreview && sitemapUrls.length) fail('Preview sitemap must not publish preview URLs.');
if (!isPreview) {
  if (!sitemapUrls.length) fail('Production sitemap is empty.');
  if (sitemapUrls.some((url) => url.includes('/awake-and-hot/') || url.includes('/404/')))
    fail('Private/noindex route appears in the production sitemap.');
  if (new Set(sitemapUrls).size !== sitemapUrls.length)
    fail('Production sitemap contains duplicate URLs.');
}

console.log(
  `SEO audit passed: ${entries.length} source records and ${htmlFiles.length} rendered pages; ${generatedCanonicals.size} production canonicals; deploy context is ${isPreview ? 'preview/noindex' : 'production/indexable'}.`,
);
