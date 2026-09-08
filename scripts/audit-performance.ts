import { existsSync, statSync } from 'node:fs';
import { fail, walk } from './lib/audit-utils';

if (!existsSync('dist')) fail('Build dist/ before running the performance budget audit.');
const assets = walk('dist/_astro');
const js = assets.filter((file) => file.endsWith('.js')).map((file) => statSync(file).size);
const css = assets.filter((file) => file.endsWith('.css')).map((file) => statSync(file).size);
const totalJs = js.reduce((sum, size) => sum + size, 0);
const totalCss = css.reduce((sum, size) => sum + size, 0);
if (totalJs > 150 * 1024)
  fail(`Total hydrated JavaScript ${totalJs} B exceeds 150 KB tool budget.`);
if (totalCss > 50 * 1024) fail(`Initial CSS ${totalCss} B exceeds 50 KB budget.`);
const oversized = walk('dist').filter(
  (file) =>
    !file.includes('/_astro/') && statSync(file).isFile() && statSync(file).size > 200 * 1024,
);
if (oversized.length) fail(`Oversized public assets: ${oversized.join(', ')}`);
console.log(
  `Performance budget passed: ${(totalJs / 1024).toFixed(1)} KB JS and ${(totalCss / 1024).toFixed(1)} KB CSS uncompressed; no public asset exceeds 200 KB.`,
);
