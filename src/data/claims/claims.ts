export type ClaimClass =
  | 'medical_guidance'
  | 'environmental_mechanism'
  | 'manufacturer_example'
  | 'editorial_hypothesis';

export interface ClaimRecord {
  id: string;
  routes: readonly string[];
  statement: string;
  claimClass: ClaimClass;
  sourceIds: readonly string[];
  boundary: string;
  confidence: 'high' | 'moderate' | 'limited';
  reviewed: string;
}

export const claims: readonly ClaimRecord[] = [
  {
    id: 'CLAIM-BED-MICROCLIMATE',
    routes: [
      '/why/bed-hot-room-cool/',
      '/failed-fixes/cooling-sheets-not-working/',
      '/failed-fixes/mattress-protector-trapping-heat/',
      '/failed-fixes/cooling-topper-still-hot/',
      '/compare/first-touch-vs-all-night-cooling/',
      '/compare/passive-vs-active-bed-cooling/',
    ],
    statement:
      'Bedding and clothing contribute to the thermal microclimate around a sleeper, so a one-layer comparison can be informative.',
    claimClass: 'environmental_mechanism',
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    boundary:
      'The review does not establish that a material marketed as cooling will work all night or for a particular sleeper.',
    confidence: 'moderate',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-AIR-SYSTEM-EXAMPLE',
    routes: [
      '/compare/',
      '/compare/air-vs-water-bed-cooling/',
      '/compare/bed-fan-vs-water-pad/',
      '/compare/passive-vs-active-bed-cooling/',
      '/compare/first-touch-vs-all-night-cooling/',
      '/guides/how-to-cool-one-side-of-a-bed/',
      '/guides/bed-cooling-costs-and-maintenance/',
      '/guides/separate-bedding-or-active-cooling/',
    ],
    statement:
      'A current manufacturer example uses a powered unit, hose, nozzle, and optional divided sheet to move air through bedding.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026'],
    boundary:
      'This describes one manufacturer’s configuration and is not independent performance or health evidence.',
    confidence: 'limited',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-WATER-SYSTEM-EXAMPLE',
    routes: [
      '/compare/',
      '/compare/air-vs-water-bed-cooling/',
      '/compare/bed-fan-vs-water-pad/',
      '/compare/passive-vs-active-bed-cooling/',
      '/compare/first-touch-vs-all-night-cooling/',
      '/guides/how-to-cool-one-side-of-a-bed/',
      '/guides/bed-cooling-costs-and-maintenance/',
      '/guides/separate-bedding-or-active-cooling/',
    ],
    statement:
      'Current manufacturer examples circulate temperature-controlled water through a mattress pad and require model-specific water and cleaning care.',
    claimClass: 'manufacturer_example',
    sourceIds: ['SLEEPME-HOW-IT-WORKS-2026', 'SLEEPME-DOCK-PRO-MANUAL-2026'],
    boundary:
      'Requirements vary by model; the site has not independently tested performance, reliability, or comfort.',
    confidence: 'limited',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-ZONE-CONTROL-EXAMPLE',
    routes: [
      '/compare/one-zone-vs-dual-zone/',
      '/guides/how-to-cool-one-side-of-a-bed/',
      '/guides/different-sleep-temperatures/',
    ],
    statement:
      'Current air- and water-system examples offer configurations intended for one side or separately controlled sides.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026', 'SLEEPME-HOW-IT-WORKS-2026'],
    boundary:
      '“Zone” layouts and shared components differ; verify the current manual for the exact product.',
    confidence: 'limited',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-MAINTENANCE-VARIES',
    routes: ['/guides/bed-cooling-costs-and-maintenance/'],
    statement:
      'Current manufacturer documentation shows that powered components, hoses, reservoirs, water care, and cleaning schedules vary by product and generation.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026', 'SLEEPME-DOCK-PRO-MANUAL-2026'],
    boundary:
      'These are changeable first-party policies, not independent quality rankings; verify them at decision time.',
    confidence: 'limited',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-EVAPORATION-HYPOTHESIS',
    routes: [
      '/why/waking-hot-then-cold/',
      '/why/waking-sweaty-in-a-cold-room/',
      '/patterns/moisture-and-recovery/',
    ],
    statement:
      'Sweat evaporation removes heat. The site therefore treats a dry-layer comparison as an editorial comfort hypothesis worth observing—not an established treatment or health outcome.',
    claimClass: 'editorial_hypothesis',
    sourceIds: ['NCBI-SWEAT-EVAPORATION-2018', 'OCT-METHOD-2026'],
    boundary:
      'The sources do not prove that changing an item shortens recovery or prevents an episode.',
    confidence: 'limited',
    reviewed: '2026-09-07',
  },
  {
    id: 'CLAIM-SEEK-ADVICE',
    routes: ['/guides/when-to-seek-medical-advice/', '/medical-boundaries/'],
    statement:
      'NHS guidance recommends medical advice when night sweats regularly wake or worry a person and identifies accompanying symptoms that should be reported.',
    claimClass: 'medical_guidance',
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026'],
    boundary:
      'This is general source-linked guidance, not personal triage or a conclusion about cause.',
    confidence: 'high',
    reviewed: '2026-09-07',
  },
] as const;

export const claimsForRoute = (route: string): readonly ClaimRecord[] =>
  claims.filter((claim) => claim.routes.includes(route));
