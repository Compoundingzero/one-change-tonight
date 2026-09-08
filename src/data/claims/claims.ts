export type ClaimClass =
  | 'medical_guidance'
  | 'environmental_mechanism'
  | 'manufacturer_example'
  | 'editorial_hypothesis';

export interface ClaimRecord {
  id: string;
  label: string;
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
    label: 'Room, bedding, and clothing',
    routes: [
      '/why/bed-hot-room-cool/',
      '/why/waking-sweaty-in-a-cold-room/',
      '/failed-fixes/cooling-sheets-not-working/',
      '/failed-fixes/mattress-protector-trapping-heat/',
      '/failed-fixes/cooling-topper-still-hot/',
      '/compare/first-touch-vs-all-night-cooling/',
      '/compare/passive-vs-active-bed-cooling/',
    ],
    statement:
      'Bedding and clothing affect the temperature and moisture around a sleeper. Changing one layer at a time may help you compare comfort in your own setup.',
    claimClass: 'environmental_mechanism',
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    boundary:
      'The review does not show that a product labeled “cooling” will work all night or for a particular sleeper.',
    confidence: 'moderate',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-AIR-SYSTEM-EXAMPLE',
    label: 'Air-based systems',
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
      'BedJet’s current installation guide describes a powered unit, hose, nozzle, and optional divided sheet that move air through bedding.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026'],
    boundary:
      'This is the manufacturer’s description, not independent evidence about comfort, performance, or health.',
    confidence: 'limited',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-WATER-SYSTEM-EXAMPLE',
    label: 'Water-based systems',
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
      'Sleepme’s current product page and Dock Pro manual describe temperature-controlled water circulating through a mattress pad, with model-specific water care and cleaning.',
    claimClass: 'manufacturer_example',
    sourceIds: ['SLEEPME-HOW-IT-WORKS-2026', 'SLEEPME-DOCK-PRO-MANUAL-2026'],
    boundary:
      'Requirements vary by model. We have not independently tested comfort, reliability, or performance.',
    confidence: 'limited',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-ZONE-CONTROL-EXAMPLE',
    label: 'Separate-side controls',
    routes: [
      '/compare/one-zone-vs-dual-zone/',
      '/guides/how-to-cool-one-side-of-a-bed/',
      '/guides/different-sleep-temperatures/',
    ],
    statement:
      'Current BedJet and Sleepme materials describe configurations for one side or for separately controlled sides.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026', 'SLEEPME-HOW-IT-WORKS-2026'],
    boundary:
      '“Zone” layouts and shared components differ; verify the current manual for the exact product.',
    confidence: 'limited',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-MAINTENANCE-VARIES',
    label: 'Cleaning and upkeep',
    routes: ['/guides/bed-cooling-costs-and-maintenance/'],
    statement:
      'Current BedJet and Sleepme documents show different powered parts, hoses, reservoirs, water care, and cleaning schedules.',
    claimClass: 'manufacturer_example',
    sourceIds: ['BEDJET-INSTALLATION-2026', 'SLEEPME-DOCK-PRO-MANUAL-2026'],
    boundary:
      'These are changeable first-party policies and do not establish product quality; verify them at decision time.',
    confidence: 'limited',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-EVAPORATION-HYPOTHESIS',
    label: 'Changing a damp layer',
    routes: ['/why/waking-hot-then-cold/', '/patterns/moisture-and-recovery/'],
    statement:
      'Sweat evaporation removes heat. This site suggests observing what happens after changing one damp item for a dry one; that test is unproven.',
    claimClass: 'editorial_hypothesis',
    sourceIds: ['NCBI-SWEAT-EVAPORATION-2018', 'OCT-METHOD-2026'],
    boundary:
      'The sources do not prove that changing an item shortens recovery or prevents an episode.',
    confidence: 'limited',
    reviewed: '2026-09-08',
  },
  {
    id: 'CLAIM-SEEK-ADVICE',
    label: 'When to seek medical advice',
    routes: ['/guides/when-to-seek-medical-advice/', '/medical-boundaries/'],
    statement:
      'NHS guidance recommends medical advice when night sweats regularly wake or worry a person and identifies accompanying symptoms that should be reported.',
    claimClass: 'medical_guidance',
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026'],
    boundary:
      'This is general source-linked guidance, not personal triage or a conclusion about cause.',
    confidence: 'high',
    reviewed: '2026-09-08',
  },
] as const;

export const claimsForRoute = (route: string): readonly ClaimRecord[] =>
  claims.filter((claim) => claim.routes.includes(route));
