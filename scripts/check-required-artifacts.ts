import { existsSync, readFileSync, statSync } from 'node:fs';
import { fail, walk } from './lib/audit-utils';

const required = [
  'README.md',
  'AGENTS.md',
  'PLANS.md',
  'docs/BASELINE.md',
  'docs/BUILD_STATUS.md',
  'docs/DECISIONS.md',
  'docs/PRODUCT_SPEC.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISION_ENGINE.md',
  'docs/DESIGN_SYSTEM.md',
  'docs/UX_PRINCIPLES.md',
  'docs/CONTENT_STYLE_GUIDE.md',
  'docs/CONTENT_OPERATIONS.md',
  'docs/SOURCE_POLICY.md',
  'docs/CLAIM_POLICY.md',
  'docs/MEDICAL_BOUNDARIES.md',
  'docs/MEDICAL_REVIEW.md',
  'docs/LOGIC_AUDIT.md',
  'docs/PRIVACY_ARCHITECTURE.md',
  'docs/SECURITY.md',
  'docs/ACCESSIBILITY.md',
  'docs/SEO_GEO.md',
  'docs/INTERNAL_LINK_MAP.md',
  'docs/DEPLOYMENT.md',
  'docs/OWNER_SETUP.md',
  'docs/OWNER_ACTIONS.md',
  'docs/QA_REPORT.md',
  'docs/RED_TEAM_REPORT.md',
  'docs/LAUNCH_CHECKLIST.md',
  'docs/TRAFFIC_READINESS_REPORT.md',
  'docs/research/query-map.csv',
  'docs/research/serp-gap-analysis.md',
  'docs/research/search-intent-map.md',
  'docs/research/tool-landscape.md',
  'docs/research/design-assessment.md',
  'docs/research/opportunity-summary.md',
  'docs/research/source-register.md',
  'docs/design-research/BASELINE.md',
  'docs/design-research/EXISTING_UX_AUDIT.md',
  'docs/design-research/EXISTING_SCREEN_INVENTORY.md',
  'docs/design-research/site-audits/shots.md',
  'docs/design-research/site-audits/it-tools.md',
  'docs/design-research/site-audits/cleanup-pictures.md',
  'docs/design-research/site-audits/ray.md',
  'docs/design-research/site-audits/squoosh.md',
  'docs/design-research/site-audits/transform-tools.md',
  'docs/design-research/site-audits/readme-so.md',
  'docs/design-research/site-audits/excalidraw.md',
  'docs/design-research/site-audits/unscreen-and-canva.md',
  'docs/design-research/site-audits/carbon.md',
  'docs/design-research/site-audits/tinypng.md',
  'docs/design-research/design-pattern-matrix.csv',
  'docs/design-research/interaction-matrix.csv',
  'docs/design-research/mobile-matrix.csv',
  'docs/design-research/seo-shell-matrix.csv',
  'docs/design-research/accessibility-observations.md',
  'docs/design-research/research-limitations.md',
  'docs/design-research/PATTERN_LIBRARY.md',
  'docs/design-research/ANTI_PATTERN_LIBRARY.md',
  'docs/design-research/REFERENCE_INFLUENCE_MAP.md',
  'docs/design-research/PATTERN_SCORECARD.csv',
  'docs/design-research/PATTERN_SELECTION.md',
  'docs/design-research/CONCEPT_EVALUATION.md',
  'docs/design-research/SELECTED_DIRECTION.md',
  'docs/design-research/FINAL_SCREEN_REVIEW.md',
];
const missing = required.filter((path) => !existsSync(path));
if (missing.length) fail(`Missing required artifacts:\n${missing.join('\n')}`);
const empty = required.filter((path) => statSync(path).size < 20);
if (empty.length) fail(`Required artifacts are empty or incomplete:\n${empty.join('\n')}`);

const queryMap = readFileSync('docs/research/query-map.csv', 'utf8').trim().split(/\r?\n/);
if (queryMap.length !== 26)
  fail(
    `Query map must contain one header and exactly 25 query rows; found ${queryMap.length - 1}.`,
  );
if (!queryMap[0]?.includes('query_family') || !queryMap[0]?.includes('target_route'))
  fail('Query map is missing its required query-family or target-route columns.');

const diagrams = existsSync('public/diagrams') ? walk('public/diagrams', '.svg') : [];
if (diagrams.length < 10) fail(`Only ${diagrams.length} original diagrams found; 10 required.`);
const undersizedDiagrams = diagrams.filter((path) => statSync(path).size < 100);
if (undersizedDiagrams.length)
  fail(`Diagram files are empty or incomplete:\n${undersizedDiagrams.join('\n')}`);

const screenshots = existsSync('docs/design-research/screenshots/final')
  ? walk('docs/design-research/screenshots/final', '.png')
  : [];
if (screenshots.length < 20)
  fail(`Only ${screenshots.length} final-state screenshots found; at least 20 required.`);
const requiredScreenshots = [
  'homepage-mobile-375.png',
  'homepage-desktop-1440.png',
  'first-question.png',
  'partner-result.png',
  'result-whole-room.png',
  'result-bed-build-up.png',
  'result-mixed.png',
  'three-night-tracker.png',
  'awake-and-hot-mobile.png',
  'search-article-mobile.png',
];
const screenshotDirectory = 'docs/design-research/screenshots/final';
const missingScreenshots = requiredScreenshots.filter(
  (name) => !existsSync(`${screenshotDirectory}/${name}`),
);
if (missingScreenshots.length)
  fail(`Required final-state screenshots are missing:\n${missingScreenshots.join('\n')}`);
const undersizedScreenshots = screenshots.filter((path) => statSync(path).size < 10_000);
if (undersizedScreenshots.length)
  fail(`Screenshot files are empty or incomplete:\n${undersizedScreenshots.join('\n')}`);
console.log(
  `Artifact audit passed: ${required.length} required documents, ${diagrams.length} original diagrams, and ${screenshots.length} final screenshots.`,
);
