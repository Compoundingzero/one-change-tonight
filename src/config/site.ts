import { z } from 'zod';

const preview = (import.meta.env.PUBLIC_DEPLOY_CONTEXT ?? 'preview') !== 'production';

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

const schema = z.object({
  deployContext: z.enum(['preview', 'production']),
  siteName: z.string().min(1),
  toolName: z.string().min(1),
  siteUrl: z.string().url().refine(usesHttps, 'Site URL must use HTTPS.'),
  organizationName: z.string().min(1),
  legalOwnerName: z.string().min(1),
  contactEmail: z.string().email(),
  jurisdiction: z.string().min(1),
  contactMethod: z.enum(['email', 'github']),
  repositoryUrl: z.string().url().refine(usesHttps, 'Repository URL must use HTTPS.'),
  socialAccounts: z.array(z.string().url()),
  evidenceReviewLabel: z.string().min(1),
  analyticsEnabled: z.boolean(),
  analyticsProviderId: z.string(),
  googleVerification: z.string(),
  bingVerification: z.string(),
  indexNowKey: z.string(),
  gptBotPolicy: z.enum(['allow', 'disallow']),
});

const raw = {
  deployContext: preview ? 'preview' : 'production',
  siteName: import.meta.env.PUBLIC_SITE_NAME ?? 'One Change Tonight',
  toolName: 'Find tonight’s change',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://example.invalid',
  organizationName: import.meta.env.PUBLIC_ORGANIZATION_NAME ?? 'One Change Tonight team',
  legalOwnerName: import.meta.env.PUBLIC_LEGAL_OWNER_NAME ?? 'OWNER_SETUP_REQUIRED',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'owner@example.invalid',
  jurisdiction: import.meta.env.PUBLIC_JURISDICTION ?? 'OWNER_SETUP_REQUIRED',
  contactMethod: import.meta.env.PUBLIC_CONTACT_METHOD === 'email' ? 'email' : 'github',
  repositoryUrl:
    import.meta.env.PUBLIC_REPOSITORY_URL ??
    'https://github.com/Compoundingzero/one-change-tonight',
  socialAccounts: String(import.meta.env.PUBLIC_SOCIAL_ACCOUNTS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  evidenceReviewLabel:
    'We reviewed these sources. No clinician has independently reviewed this site.',
  analyticsEnabled: import.meta.env.PUBLIC_ANALYTICS_ENABLED === 'true',
  analyticsProviderId: import.meta.env.PUBLIC_ANALYTICS_PROVIDER_ID ?? '',
  googleVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  bingVerification: import.meta.env.PUBLIC_BING_SITE_VERIFICATION ?? '',
  indexNowKey: import.meta.env.PUBLIC_INDEXNOW_KEY ?? '',
  gptBotPolicy: import.meta.env.PUBLIC_GPTBOT_POLICY === 'allow' ? 'allow' : 'disallow',
} as const;

export const siteConfig = schema.parse(raw);
export const isPreview = siteConfig.deployContext !== 'production';

if (!isPreview) {
  const failures: string[] = [];
  if (
    hasReservedHost(siteConfig.siteUrl) ||
    hasPlatformPreviewHost(siteConfig.siteUrl) ||
    !isRootOrigin(siteConfig.siteUrl)
  )
    failures.push('an owner-controlled production origin');
  if (looksLikePlaceholder(siteConfig.legalOwnerName)) failures.push('legal owner name');
  if (looksLikePlaceholder(siteConfig.jurisdiction)) failures.push('jurisdiction');
  if (
    hasReservedHost(`https://${siteConfig.contactEmail.split('@')[1] ?? 'example.invalid'}`) ||
    looksLikePlaceholder(siteConfig.contactEmail)
  )
    failures.push('contact email');
  if (failures.length) {
    throw new Error(
      `Production preflight failed. Owner setup required: ${failures.join(', ')}.`,
    );
  }
}

export function canonicalFor(pathname: string): string | undefined {
  if (isPreview) return undefined;
  const normalized = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
  return new URL(normalized, siteConfig.siteUrl).toString();
}
