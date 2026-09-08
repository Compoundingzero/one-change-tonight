import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { z } from 'zod';

const envPath = '.env.local';
const current = new Map<string, string>();

function hasReservedHost(value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === 'example.com' ||
      host === 'example.net' ||
      host === 'example.org' ||
      host.endsWith('.invalid') ||
      host.endsWith('.test') ||
      host.endsWith('.example') ||
      host.endsWith('.localhost')
    );
  } catch {
    return true;
  }
}

function hasPlatformPreviewHost(value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return [
      '.railway.app',
      '.up.railway.app',
      '.vercel.app',
      '.pages.dev',
      '.netlify.app',
    ].some((suffix) => host.endsWith(suffix));
  } catch {
    return true;
  }
}

function isRootOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return url.pathname === '/' && url.search === '' && url.hash === '';
  } catch {
    return false;
  }
}

function looksLikePlaceholder(value: string): boolean {
  return /owner.setup.required|placeholder|replace.?me|\btbd\b|\btodo\b|example/i.test(value);
}

function usesHttps(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) current.set(match[1]!, match[2]!);
  }
}

const ownerSchema = z.object({
  PUBLIC_SITE_URL: z
    .string()
    .url()
    .refine(usesHttps, 'Production URL must use HTTPS.')
    .refine(
      (value) =>
        !hasReservedHost(value) && !hasPlatformPreviewHost(value) && isRootOrigin(value),
      'Use the root origin of a real owner-controlled domain, not a platform preview URL.',
    ),
  PUBLIC_ORGANIZATION_NAME: z.string().min(2),
  PUBLIC_LEGAL_OWNER_NAME: z
    .string()
    .min(2)
    .refine((value) => !looksLikePlaceholder(value), 'Use the real legal owner identity.'),
  PUBLIC_CONTACT_EMAIL: z
    .string()
    .email()
    .refine(
      (value) =>
        !looksLikePlaceholder(value) &&
        !hasReservedHost(`https://${value.split('@')[1] ?? 'example.invalid'}`),
      'Use a monitored address on a real domain.',
    ),
  PUBLIC_JURISDICTION: z
    .string()
    .min(2)
    .refine((value) => !looksLikePlaceholder(value), 'Use the real jurisdiction.'),
  PUBLIC_CONTACT_METHOD: z.enum(['email', 'github']),
  PUBLIC_REPOSITORY_URL: z.string().url().refine(usesHttps, 'Repository URL must use HTTPS.'),
  PUBLIC_GPTBOT_POLICY: z.enum(['allow', 'disallow']),
});

const fields = [
  ['PUBLIC_SITE_URL', 'Final production URL'],
  ['PUBLIC_ORGANIZATION_NAME', 'Public organization name'],
  ['PUBLIC_LEGAL_OWNER_NAME', 'Legal owner name'],
  ['PUBLIC_CONTACT_EMAIL', 'Public contact email'],
  ['PUBLIC_JURISDICTION', 'Country or legal jurisdiction'],
  ['PUBLIC_CONTACT_METHOD', 'Contact method (email or github)'],
  ['PUBLIC_REPOSITORY_URL', 'Public GitHub repository URL'],
  ['PUBLIC_GPTBOT_POLICY', 'GPTBot policy (allow or disallow)'],
] as const;

if (!stdin.isTTY || process.argv.includes('--check')) {
  const candidate = Object.fromEntries(
    fields.map(([key]) => [key, process.env[key] ?? current.get(key) ?? '']),
  );
  const parsed = ownerSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error(
      'Owner setup is incomplete. Run `pnpm owner:setup` in an interactive terminal.',
    );
    for (const issue of parsed.error.issues)
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    process.exitCode = 1;
  } else {
    console.log('Owner-controlled production values are valid.');
  }
} else {
  const prompt = createInterface({ input: stdin, output: stdout });
  const candidate: Record<string, string> = {};
  for (const [key, label] of fields) {
    const existing = current.get(key) ?? '';
    const answer = await prompt.question(`${label}${existing ? ` [${existing}]` : ''}: `);
    candidate[key] = answer.trim() || existing;
  }
  prompt.close();
  const parsed = ownerSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error('Nothing was written because validation failed.');
    for (const issue of parsed.error.issues)
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    process.exitCode = 1;
  } else {
    const preserved = [
      'PUBLIC_GOOGLE_SITE_VERIFICATION',
      'PUBLIC_BING_SITE_VERIFICATION',
      'PUBLIC_INDEXNOW_KEY',
      'PUBLIC_ANALYTICS_ENABLED',
      'PUBLIC_ANALYTICS_PROVIDER_ID',
      'PUBLIC_SOCIAL_ACCOUNTS',
    ];
    const values = new Map(current);
    values.set('PUBLIC_DEPLOY_CONTEXT', 'production');
    for (const [key, value] of Object.entries(parsed.data)) values.set(key, value);
    for (const key of preserved)
      if (!values.has(key)) values.set(key, key === 'PUBLIC_ANALYTICS_ENABLED' ? 'false' : '');
    const output = [...values.entries()].map(([key, value]) => `${key}=${value}`).join('\n');
    writeFileSync(envPath, `${output}\n`, { mode: 0o600 });
    console.log(
      `Validated values written to ${envPath}. This ignored file must not be committed.`,
    );
  }
}
