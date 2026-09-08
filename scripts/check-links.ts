import { existsSync } from 'node:fs';
import { corePages } from '../src/data/core-pages';
import { fail, field, frontmatter, read, walk } from './lib/audit-utils';

const markdown = ['src/content/guides', 'src/content/comparisons'].flatMap((directory) =>
  existsSync(directory) ? walk(directory, '.md') : [],
);
const routeSet = new Set([
  '/',
  '/tool/',
  '/awake-and-hot/',
  '/404/',
  '/robots.txt',
  '/sitemap.xml',
  '/feed.xml',
  ...corePages.map((page) => page.path),
]);
for (const file of markdown) routeSet.add(field(frontmatter(read(file)), 'path'));

const sourceFiles = [...walk('src', '.astro'), ...walk('src', '.tsx'), ...markdown];
const missing: string[] = [];
for (const file of sourceFiles) {
  const text = read(file);
  const links = [...text.matchAll(/(?:href=|href:\s*)["']?([^\s"'}>,]+)/g)].map(
    (match) => match[1] ?? '',
  );
  for (const link of links) {
    if (!link.startsWith('/') || link.startsWith('//')) continue;
    const path = link.split('#')[0]?.split('?')[0] || '/';
    const normalized =
      path === '/' || path.includes('.') ? path : `${path.replace(/\/$/, '')}/`;
    if (!routeSet.has(normalized) && !normalized.includes('${') && !normalized.includes('{'))
      missing.push(`${file}: ${link}`);
  }
}
if (missing.length) fail(`Broken internal links:\n${missing.join('\n')}`);

if (!existsSync('dist')) fail('Build dist/ before running the rendered-link audit.');
const htmlFiles = walk('dist', '.html');
const routeForFile = (file: string): string => {
  const relative = file.replace(/^dist\/?/, '');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404/';
  return `/${relative.replace(/\/index\.html$/, '')}/`;
};
const htmlByRoute = new Map(htmlFiles.map((file) => [routeForFile(file), read(file)]));
const renderedFailures: string[] = [];
const inbound = new Map([...htmlByRoute.keys()].map((route) => [route, 0]));

const decodeEntity = (value: string) =>
  value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

for (const [sourceRoute, html] of htmlByRoute) {
  const links = [...html.matchAll(/\shref=(?:"([^"]*)"|'([^']*)')/gi)].map((match) =>
    decodeEntity(match[1] ?? match[2] ?? ''),
  );
  for (const href of links) {
    if (!href || href.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
    let url: URL;
    try {
      url = new URL(href, `https://rendered.local${sourceRoute}`);
    } catch {
      renderedFailures.push(`${sourceRoute}: malformed href ${href}`);
      continue;
    }

    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      renderedFailures.push(`${sourceRoute}: malformed encoded href ${href}`);
      continue;
    }

    const extension = pathname.match(/\/[^/]+\.[a-z0-9]+$/i);
    if (extension && !pathname.endsWith('.html')) {
      if (!existsSync(`dist${pathname}`))
        renderedFailures.push(`${sourceRoute}: missing asset ${pathname}`);
      continue;
    }

    const targetRoute =
      pathname === '/index.html'
        ? '/'
        : pathname === '/404.html'
          ? '/404/'
          : pathname === '/'
            ? '/'
            : pathname.endsWith('/')
              ? pathname
              : `${pathname}/`;
    if (!htmlByRoute.has(targetRoute)) {
      renderedFailures.push(`${sourceRoute}: missing rendered route ${pathname}`);
      continue;
    }
    if (pathname !== '/' && !pathname.endsWith('/') && !pathname.endsWith('.html'))
      renderedFailures.push(`${sourceRoute}: noncanonical slashless link ${pathname}`);
    if (sourceRoute !== targetRoute)
      inbound.set(targetRoute, (inbound.get(targetRoute) ?? 0) + 1);

    if (url.hash) {
      let fragment: string;
      try {
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch {
        renderedFailures.push(`${sourceRoute}: malformed fragment ${url.hash}`);
        continue;
      }
      const targetHtml = htmlByRoute.get(targetRoute) ?? '';
      const ids = new Set(
        [...targetHtml.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) =>
          decodeEntity(match[1] ?? match[2] ?? ''),
        ),
      );
      if (!ids.has(fragment))
        renderedFailures.push(`${sourceRoute}: missing fragment ${targetRoute}#${fragment}`);
    }
  }
}

const allowedWithoutInbound = new Set(['/', '/404/', '/awake-and-hot/']);
for (const [route, count] of inbound) {
  if (!allowedWithoutInbound.has(route) && count === 0)
    renderedFailures.push(
      `${route}: rendered page is orphaned (no inbound link from another page)`,
    );
}
if (renderedFailures.length)
  fail(`Rendered-link audit failed:\n${renderedFailures.join('\n')}`);

console.log(
  `Link audit passed: ${routeSet.size} routes across ${sourceFiles.length} source files and ${htmlFiles.length} rendered pages, with fragments and orphaning checked.`,
);
