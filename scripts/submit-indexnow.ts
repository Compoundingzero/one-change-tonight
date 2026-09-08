import { z } from 'zod';

const input = z
  .object({
    host: z
      .string()
      .url()
      .transform((value) => new URL(value).host),
    key: z.string().min(8),
  })
  .safeParse({
    host: process.env.PUBLIC_SITE_URL,
    key: process.env.PUBLIC_INDEXNOW_KEY,
  });

if (!input.success) {
  console.error('Set a valid PUBLIC_SITE_URL and owner-provided PUBLIC_INDEXNOW_KEY first.');
  process.exitCode = 1;
} else if (!process.argv.includes('--confirm')) {
  console.log(
    'Dry run only. Add `--confirm` to submit the public sitemap URLs after the key file is reachable.',
  );
  console.log(`Host: ${input.data.host}`);
} else {
  const siteUrl = `https://${input.data.host}`;
  const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Could not read sitemap: ${sitemapResponse.status}`);
  const xml = await sitemapResponse.text();
  const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]!);
  if (!urlList.length)
    throw new Error(
      'The sitemap has no public URLs. Refusing to submit a preview or empty sitemap.',
    );
  const keyLocation = `${siteUrl}/${input.data.key}.txt`;
  const keyResponse = await fetch(keyLocation);
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== input.data.key) {
    throw new Error(`IndexNow key validation failed at ${keyLocation}.`);
  }
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ host: input.data.host, key: input.data.key, keyLocation, urlList }),
  });
  if (!response.ok && response.status !== 202)
    throw new Error(`IndexNow returned ${response.status}.`);
  console.log(
    `Submitted ${urlList.length} public URLs to IndexNow. Submission does not guarantee indexing or ranking.`,
  );
}
