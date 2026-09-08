import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function walk(directory: string, suffix?: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) files.push(...walk(path, suffix));
    else if (!suffix || path.endsWith(suffix)) files.push(path);
  }
  return files;
}

export function read(path: string): string {
  return readFileSync(path, 'utf8');
}

export function frontmatter(text: string): string {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match?.[1]) throw new Error('Missing frontmatter');
  return match[1];
}

export function field(source: string, key: string): string {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.replace(/^['"]|['"]$/g, '').trim() ?? '';
}

export function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}
