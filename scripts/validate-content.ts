import { existsSync } from 'node:fs';
import { EXPERIMENTS } from '../src/data/experiments/experiments';
import { claims } from '../src/data/claims/claims';
import { corePages } from '../src/data/core-pages';
import { sourceById, sources } from '../src/data/sources/sources';
import { fail, field, frontmatter, read, walk } from './lib/audit-utils';

const contentDirectories = ['src/content/guides', 'src/content/comparisons'];
const files = contentDirectories.flatMap((directory) =>
  existsSync(directory) ? walk(directory, '.md') : [],
);
if (files.length < 16)
  fail(`Only ${files.length} substantive search pages found; at least 16 are required.`);

const routes = new Set<string>();
const titles = new Set<string>();
const canonicals = new Set<string>();
const prohibited = [
  'you have perimenopause',
  'your hormones are causing',
  'this treats hot flashes',
  'prevents night sweats',
  'guaranteed',
  'expert-approved',
  'clinically proven',
];

const routeSources = new Map<string, Set<string>>();

for (const file of files) {
  const text = read(file);
  const yaml = frontmatter(text);
  const path = field(yaml, 'path');
  const title = field(yaml, 'title');
  const description = field(yaml, 'description');
  const sourceLine = yaml.match(/^sourceIds:\s*(\[[\s\S]*?\])/m)?.[1] ?? '';
  if (!path.startsWith('/') || !path.endsWith('/'))
    fail(`${file}: path must use the trailing-slash policy.`);
  if (!title || !description) fail(`${file}: title and description are required.`);
  if (description.length < 50 || description.length > 170)
    fail(`${file}: description must be 50–170 characters.`);
  if (routes.has(path)) fail(`${file}: duplicate route ${path}.`);
  if (titles.has(title)) fail(`${file}: duplicate title ${title}.`);
  if (canonicals.has(path.toLowerCase())) fail(`${file}: duplicate canonical ${path}.`);
  routes.add(path);
  titles.add(title);
  canonicals.add(path.toLowerCase());
  const ids = sourceLine
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (!ids.length) fail(`${file}: at least one source ID is required.`);
  for (const id of ids) if (!sourceById.has(id)) fail(`${file}: unknown source ID ${id}.`);
  routeSources.set(path, new Set(ids));
  const lower = text.toLowerCase();
  for (const phrase of prohibited)
    if (lower.includes(phrase)) fail(`${file}: prohibited phrase "${phrase}".`);
  if (/medically reviewed/i.test(text) && !/not independently medically reviewed/i.test(text))
    fail(`${file}: unsupported medical-review label.`);
}

for (const page of corePages) {
  const ids = page.sourceIds ?? [];
  if (page.healthAdjacent && ids.length === 0)
    fail(`${page.path}: health-adjacent core page has no source.`);
  for (const id of ids)
    if (!sourceById.has(id)) fail(`${page.path}: unknown core-page source ID ${id}.`);
  routeSources.set(page.path, new Set(ids));
}

for (const experiment of EXPERIMENTS) {
  if (
    !experiment.safetyNote.trim() ||
    !experiment.stopConditions.length ||
    !experiment.sourceIds.length
  )
    fail(`Experiment ${experiment.id} lacks a safety field.`);
  for (const id of experiment.sourceIds)
    if (!sourceById.has(id)) fail(`Experiment ${experiment.id} has unknown source ID ${id}.`);
}

for (const claim of claims) {
  if (!claim.sourceIds.length || !claim.boundary.trim() || !claim.reviewed || !claim.confidence)
    fail(`Claim ${claim.id} lacks sources, review metadata, confidence, or a boundary.`);
  for (const id of claim.sourceIds) {
    const source = sourceById.get(id);
    if (!source) fail(`Claim ${claim.id} has unknown source ID ${id}.`);
    if (
      claim.claimClass === 'medical_guidance' &&
      !['government', 'professional'].includes(source.type)
    )
      fail(`Claim ${claim.id} uses a non-authoritative medical source ${id}.`);
    if (
      claim.claimClass === 'manufacturer_example' &&
      source.evidenceStatus !== 'manufacturer_documentation'
    )
      fail(`Claim ${claim.id} fails to label manufacturer source ${id}.`);
  }
  for (const route of claim.routes) {
    const pageSources = routeSources.get(route);
    if (!pageSources) fail(`Claim ${claim.id} references unknown public route ${route}.`);
    for (const id of claim.sourceIds)
      if (!pageSources.has(id))
        fail(
          `${route}: claim ${claim.id} source ${id} is missing from the visible source list.`,
        );
  }
}

const reviewNow = Date.now();
for (const source of sources) {
  const accessedAt = Date.parse(`${source.accessed}T00:00:00Z`);
  if (!Number.isFinite(accessedAt) || accessedAt > reviewNow + 86_400_000)
    fail(`Source ${source.id} has an invalid or future access date.`);
  if (
    (source.type === 'government' || source.type === 'professional') &&
    reviewNow - accessedAt > 120 * 86_400_000
  ) {
    fail(`Medical source ${source.id} is older than the 120-day pre-launch review interval.`);
  }
}

for (const [route, ids] of routeSources) {
  if (
    route.includes('/compare/') ||
    route.includes('/failed-fixes/') ||
    route.includes('bed-cooling')
  ) {
    const manufacturerIds = [...ids].filter(
      (id) => sourceById.get(id)?.type === 'manufacturer',
    );
    if (
      manufacturerIds.length &&
      !claims.some(
        (claim) => claim.routes.includes(route) && claim.claimClass === 'manufacturer_example',
      )
    ) {
      fail(
        `${route}: manufacturer documentation appears without a structured manufacturer claim.`,
      );
    }
  }
}

console.log(
  `Content validation passed: ${files.length} substantive pages, ${sourceById.size} registered sources, ${EXPERIMENTS.length} safe experiments.`,
);
