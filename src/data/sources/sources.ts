export type SourceType =
  'government' | 'professional' | 'research' | 'technical' | 'manufacturer' | 'editorial';
export type EvidenceStatus =
  | 'official_guidance'
  | 'evidence_synthesis'
  | 'first_party_technical'
  | 'manufacturer_documentation'
  | 'editorial_method';

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url: string;
  type: SourceType;
  evidenceStatus: EvidenceStatus;
  published?: string;
  updated?: string;
  accessed: string;
  supports: string[];
  notes?: string;
}

export const sources: SourceRecord[] = [
  {
    id: 'OCT-METHOD-2026',
    title: 'One Change Tonight deterministic experiment method',
    publisher: 'One Change Tonight',
    url: '/methodology/',
    type: 'editorial',
    evidenceStatus: 'editorial_method',
    published: '2026-09-07',
    accessed: '2026-09-07',
    supports: [
      'One-variable editorial observation protocol',
      'Deterministic experiment-selection rules',
    ],
    notes: 'Internal editorial method, not clinical evidence.',
  },
  {
    id: 'NHS-NIGHT-SWEATS-2026',
    title: 'Night sweats',
    publisher: 'NHS',
    url: 'https://www.nhs.uk/symptoms/night-sweats/',
    type: 'government',
    evidenceStatus: 'official_guidance',
    updated: '2023-11-09',
    accessed: '2026-09-07',
    supports: [
      'Definition of night sweats',
      'When repeated soaking night sweats merit medical advice',
      'Environmental overheating distinction',
    ],
  },
  {
    id: 'ACOG-MENOPAUSE-YEARS-2026',
    title: 'The Menopause Years',
    publisher: 'American College of Obstetricians and Gynecologists',
    url: 'https://www.acog.org/womens-health/faqs/the-menopause-years',
    type: 'professional',
    evidenceStatus: 'official_guidance',
    accessed: '2026-09-07',
    supports: [
      'Hot flashes may be sudden',
      'Night sweats can disrupt sleep and next-day functioning',
      'Symptoms vary',
    ],
  },
  {
    id: 'ACOG-HOT-FLASHES-2026',
    title: 'What can I do to help with hot flashes?',
    publisher: 'American College of Obstetricians and Gynecologists',
    url: 'https://www.acog.org/womens-health/experts-and-stories/ask-acog/what-can-i-do-to-help-with-hot-flashes',
    type: 'professional',
    evidenceStatus: 'official_guidance',
    accessed: '2026-09-07',
    supports: [
      'Personal cooling can be used for comfort',
      'Clinical treatment choices belong with a qualified professional',
    ],
  },
  {
    id: 'MENOPAUSE-SOCIETY-HOT-FLASHES-2026',
    title: 'Hot Flashes',
    publisher: 'The Menopause Society',
    url: 'https://menopause.org/patient-education/menopause-topics/hot-flashes',
    type: 'professional',
    evidenceStatus: 'official_guidance',
    accessed: '2026-09-07',
    supports: [
      'Sudden upper-body heat, sweating, and chills can occur together',
      'Cooling affects comfort and is not established treatment for the underlying episode',
    ],
  },
  {
    id: 'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026',
    title: 'Night Sweats MenoNote',
    publisher: 'The Menopause Society',
    url: 'https://menopause.org/wp-content/uploads/for-women/MenoNote-Night-Sweats.pdf',
    type: 'professional',
    evidenceStatus: 'official_guidance',
    accessed: '2026-09-07',
    supports: [
      'Night sweats have multiple possible causes',
      'Some causes warrant investigation',
      'A healthcare professional may use history and testing',
    ],
  },
  {
    id: 'PMC-SLEEP-THERMAL-ENVIRONMENT-2012',
    title: 'Effects of thermal environment on sleep and circadian rhythm',
    publisher: 'Journal of Physiological Anthropology / PubMed Central',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3427038/',
    type: 'research',
    evidenceStatus: 'evidence_synthesis',
    published: '2012-05-31',
    accessed: '2026-09-07',
    supports: [
      'Thermal environment can affect sleep',
      'Bedding and clothing help create a bed microclimate',
    ],
  },
  {
    id: 'GOOGLE-AI-SEARCH-2026',
    title: 'Guide to Optimizing for Generative AI Features on Google Search',
    publisher: 'Google Search Central',
    url: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide',
    type: 'technical',
    evidenceStatus: 'first_party_technical',
    updated: '2026-08-01',
    accessed: '2026-09-07',
    supports: [
      'Normal Search technical requirements remain relevant',
      'Crawlable, helpful content and page experience matter',
      'Visibility is not guaranteed',
    ],
  },
  {
    id: 'GOOGLE-HELPFUL-CONTENT-2026',
    title: 'Creating helpful, reliable, people-first content',
    publisher: 'Google Search Central',
    url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    type: 'technical',
    evidenceStatus: 'first_party_technical',
    accessed: '2026-09-07',
    supports: [
      'People-first, original, complete content guidance',
      'Avoid search-engine-first scaled content',
    ],
  },
  {
    id: 'OPENAI-PUBLISHERS-2026',
    title: 'Publishers and Developers FAQ',
    publisher: 'OpenAI',
    url: 'https://help.openai.com/en/articles/12627856-publishers-and-developers-faq',
    type: 'technical',
    evidenceStatus: 'first_party_technical',
    updated: '2026-08-31',
    accessed: '2026-09-07',
    supports: [
      'OAI-SearchBot access controls search discovery',
      'GPTBot training policy is separate',
      'Noindex controls indexing when crawl is allowed',
    ],
  },
  {
    id: 'WEBDEV-VITALS-2026',
    title: 'Web Vitals',
    publisher: 'web.dev',
    url: 'https://web.dev/articles/vitals',
    type: 'technical',
    evidenceStatus: 'first_party_technical',
    accessed: '2026-09-07',
    supports: ['LCP, INP, and CLS thresholds and 75th-percentile evaluation'],
  },
  {
    id: 'WCAG-22-2024',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    publisher: 'W3C Web Accessibility Initiative',
    url: 'https://www.w3.org/TR/WCAG22/',
    type: 'technical',
    evidenceStatus: 'first_party_technical',
    updated: '2024-12-12',
    accessed: '2026-09-07',
    supports: ['WCAG 2.2 accessibility criteria'],
  },
  {
    id: 'FTC-HBNR-2024',
    title: 'Complying with FTC’s Health Breach Notification Rule',
    publisher: 'Federal Trade Commission',
    url: 'https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0',
    type: 'government',
    evidenceStatus: 'official_guidance',
    updated: '2024',
    accessed: '2026-09-07',
    supports: ['Health-app privacy and breach-notification context'],
  },
  {
    id: 'NCBI-SWEAT-EVAPORATION-2018',
    title: 'Sweating as a heat loss thermoeffector',
    publisher: 'Handbook of Clinical Neurology / PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30454591/',
    type: 'research',
    evidenceStatus: 'evidence_synthesis',
    published: '2018',
    accessed: '2026-09-07',
    supports: ['Evaporation of sweat removes heat from skin'],
    notes:
      'Supports basic physiology only; it does not validate the site’s dry-layer experiment or a clinical outcome.',
  },
  {
    id: 'BEDJET-INSTALLATION-2026',
    title: 'BedJet installation and component guide',
    publisher: 'BedJet',
    url: 'https://bedjet.com/pages/installation',
    type: 'manufacturer',
    evidenceStatus: 'manufacturer_documentation',
    accessed: '2026-09-07',
    supports: [
      'Example air-based system uses a powered unit, hose, nozzle, and optional divided airflow sheet',
    ],
    notes:
      'First-party manufacturer documentation; not independent evidence of comfort or health effectiveness.',
  },
  {
    id: 'SLEEPME-DOCK-PRO-MANUAL-2026',
    title: 'Chilipad Dock Pro manual',
    publisher: 'Sleepme',
    url: 'https://help.sleep.me/setup-and-maintenance-chilipad-dock-pro/chilipad-dock-pro-manual',
    type: 'manufacturer',
    evidenceStatus: 'manufacturer_documentation',
    accessed: '2026-09-07',
    supports: [
      'Example water-based system includes a reservoir, hose-connected pad, water care, and scheduled cleaning',
    ],
    notes:
      'First-party manufacturer documentation for one product generation; policies and requirements vary.',
  },
  {
    id: 'SLEEPME-HOW-IT-WORKS-2026',
    title: 'How Chilipad water-based bed cooling works',
    publisher: 'Sleepme',
    url: 'https://sleep.me/how-it-works',
    type: 'manufacturer',
    evidenceStatus: 'manufacturer_documentation',
    accessed: '2026-09-07',
    supports: [
      'Example water-based system transfers heat at a mattress pad',
      'Single- and dual-zone configurations can provide separate controls',
    ],
    notes:
      'First-party manufacturer documentation; not an independent product comparison or performance test.',
  },
];

export const sourceById = new Map(sources.map((source) => [source.id, source]));
