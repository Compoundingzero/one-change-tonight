import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const PUBLIC_COPY_EXTENSIONS = new Set(['.astro', '.md', '.ts', '.tsx']);
const COPY_ROOTS = [
  'src/components',
  'src/content',
  'src/data',
  'src/lib/decision-engine',
  'src/pages',
];

const GENERATED_COPY_PHRASES = [
  'commercially adjacent',
  'confidence in this scoped statement',
  'environmental constraint',
  'fit signal',
  'independent by design',
  'launch corpus',
  'let the night be simple',
  'lower-burden',
  'low-burden environmental test',
  'no commission',
  'next useful question',
  'one-variable editorial observation protocol',
  'premium mechanism fit',
  'private decision aid',
  'privacy architecture',
  'product funnel',
  'product rankings',
  'powered complexity',
  'ranked brands',
  'restrained environmental pattern',
  'smallest useful change',
  'this comparison is for',
  'this guide is for',
  'this page is for',
  'unmet need',
  'useful first environmental question',
  'we do not earn commissions from the products or product categories discussed',
  'we do not earn money if you buy',
] as const;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return PUBLIC_COPY_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

describe('public copy quality', () => {
  it('keeps removed template and product-strategy phrases out of public copy', () => {
    const findings = COPY_ROOTS.flatMap((root) =>
      sourceFiles(root).flatMap((file) => {
        const text = readFileSync(file, 'utf8').toLowerCase();
        return GENERATED_COPY_PHRASES.filter((phrase) => text.includes(phrase)).map(
          (phrase) => `${file}: ${phrase}`,
        );
      }),
    );

    expect(findings).toEqual([]);
  });
});
