import { existsSync } from 'node:fs';
import { read, walk, fail } from './lib/audit-utils';

const runtime = [
  ...walk('src/components', '.tsx'),
  ...walk('src/components', '.astro'),
  ...walk('src/pages', '.astro'),
  ...walk('src/lib', '.ts'),
];
const built = existsSync('dist')
  ? [...walk('dist', '.html'), ...walk('dist/_astro', '.js')]
  : [];
const joined = [...runtime, ...built].map((file) => `${file}\n${read(file)}`).join('\n');
const forbidden = [
  'navigator.sendBeacon',
  'XMLHttpRequest',
  'WebSocket(',
  'EventSource(',
  'sessionReplay',
  'hotjar',
  'fullstory',
  'mixpanel',
  'google-analytics',
  'facebook.com/tr',
];
for (const token of forbidden)
  if (joined.toLowerCase().includes(token.toLowerCase()))
    fail(`Privacy audit found forbidden runtime token: ${token}`);
if (/fetch\s*\(/.test(joined))
  fail('Privacy audit found a runtime fetch call in the assessment surface.');
if (/<script[^>]+src=["']https?:\/\//i.test(joined))
  fail('Privacy audit found a remote script in generated or source HTML.');
if (!read('src/lib/storage/local-storage.ts').includes('deleteLocalState'))
  fail('No complete local deletion function found.');
if (
  !read('src/config/site.ts').includes(
    "analyticsEnabled: import.meta.env.PUBLIC_ANALYTICS_ENABLED === 'true'",
  )
)
  fail('Analytics is not explicitly disabled by default.');
if (!read('public/_headers').includes("connect-src 'none'"))
  fail('CSP must prohibit outbound browser connections while analytics is disabled.');
console.log(
  `Privacy audit passed: ${runtime.length} source files and ${built.length} built browser files; no outbound assessment transport, remote script, advertising, or session-replay token found.`,
);
