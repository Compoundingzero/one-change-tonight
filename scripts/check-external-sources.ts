import { sources } from '../src/data/sources/sources';

const external = sources.filter((source) => source.url.startsWith('https://'));
const warnings: string[] = [];
let resolved = 0;

for (const source of external) {
  try {
    const response = await fetch(source.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: {
        Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.5',
        'User-Agent': 'OneChangeTonight-SourceReview/1.0',
      },
    });
    if (!response.ok) {
      await response.body?.cancel();
      warnings.push(`${source.id}: HTTP ${response.status}; verify in an ordinary browser.`);
      continue;
    }
    resolved += 1;
    const original = new URL(source.url);
    const final = new URL(response.url);
    await response.body?.cancel();
    if (original.pathname !== '/' && final.pathname === '/') {
      warnings.push(
        `${source.id}: redirected from a specific source path to a site homepage (${final.href}).`,
      );
    } else if (original.hostname !== final.hostname) {
      warnings.push(
        `${source.id}: redirected to a different host (${final.hostname}); confirm publisher continuity.`,
      );
    }
  } catch (error) {
    warnings.push(
      `${source.id}: ${error instanceof Error ? error.message : 'request failed'}; verify manually.`,
    );
  }
}

console.log(`External-source review resolved ${resolved}/${external.length} current URLs.`);
if (warnings.length) {
  console.warn('Warnings requiring editorial review:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
