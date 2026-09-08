export interface CoreSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CorePage {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  healthAdjacent?: boolean;
  sourceIds?: string[];
  sections: CoreSection[];
}

export const corePages: CorePage[] = [
  {
    path: '/how-it-works/',
    title: 'How One Change Tonight Works',
    description:
      'Answer a few private questions about the room, bed, timing, dampness, and the other sleeper. Get one change you can undo.',
    eyebrow: 'How it works',
    intro:
      'The tool asks what happened, then suggests one small change. It does not turn your answers into a diagnosis.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-HOT-FLASHES-2026'],
    sections: [
      {
        id: 'what-it-can-tell-you',
        heading: 'What it can tell you',
        paragraphs: [
          'The result shows where to start: the whole room, one bed layer, one side of the bed, or a night of notes when the answers are mixed. Dampness and the other sleeper’s comfort can change the suggestion.',
        ],
        bullets: [
          'Which answers led to the result',
          'One thing to change tonight',
          'What to keep constant',
          'What to record in the morning',
        ],
      },
      {
        id: 'what-it-cannot-tell-you',
        heading: 'What it cannot tell you',
        paragraphs: [
          'The tool cannot identify menopause, a medical condition, a medicine effect, or any underlying cause. It does not calculate a health probability or recommend treatment.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'Why only one change?',
        paragraphs: [
          'If you change several things at once, you will not know which one mattered. Try one safe change you can undo. Finding that it did not help is still useful.',
        ],
      },
      {
        id: 'private-by-default',
        heading: 'Private by default',
        paragraphs: [
          'The assessment runs in your browser. Answers and morning notes stay there, are deleted after 90 days, and can be removed sooner. We do not ask for an account or name.',
        ],
      },
    ],
  },
  {
    path: '/room-bed-body-partner/',
    title: 'Check the Room, Bed, Body, and Other Sleeper',
    description:
      'Check the room, bed, body, and other sleeper to decide what to try first without guessing at a medical cause.',
    eyebrow: 'Four things to check',
    intro:
      'What happened in the room, bed, body, and on the other side of the bed can change what you try first.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012', 'NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'room',
        heading: 'Room',
        paragraphs: [
          'Was the entire bedroom hot? Did both sleepers notice it? If so, start with one small room or ventilation change.',
        ],
      },
      {
        id: 'bed-layer-stack',
        heading: 'Bed',
        paragraphs: [
          'Sheets, protectors, toppers, covers, sleepwear, and the mattress create the conditions around your body. If heat builds underneath or under the covers, test one removable layer.',
        ],
      },
      {
        id: 'body',
        heading: 'Body',
        paragraphs: [
          'A sudden wave, upper-body heat, sweating, or feeling cold afterward may not be explained by the room alone. The timing can guide a comfort test, but it cannot identify the cause.',
        ],
      },
      {
        id: 'partner',
        heading: 'Partner',
        paragraphs: [
          'If the other sleeper was comfortable or cold, try a change on your side before lowering the whole room again.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'Turn the map into one test',
        paragraphs: [
          'Choose the smallest area that matches what you noticed. Change one thing there and leave the rest of the setup alone for the night.',
        ],
      },
    ],
  },
  {
    path: '/three-night-experiment/',
    title: 'Try One Change for Three Nights',
    description:
      'Repeat one safe change for up to three nights and compare what happened. This is not a medical score.',
    eyebrow: 'Three nights, then compare',
    intro:
      'One night can be unusual. Trying the same change for up to three nights lets you see whether the same comfort result repeats, without keeping a permanent log.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'baseline',
        heading: 'Begin with a baseline',
        paragraphs: [
          'Record awakenings, dampness, cold afterward, time back to comfort, and partner disturbance without changing the normal setup.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'Repeat exactly one change',
        paragraphs: [
          'Use the experiment selected by the assessment. Keep the room, remaining bedding, sleepwear, and timing as stable as practical. Stop if the experiment causes discomfort or creates a safety issue.',
        ],
      },
      {
        id: 'morning-check-in',
        heading: 'Use a two-minute morning check-in',
        paragraphs: [
          'Record whether the change helped: no, unsure, somewhat, or clearly. The tracker compares observations; it does not score health or treatment response.',
        ],
      },
      {
        id: 'after-three-nights',
        heading: 'Decide what to try next',
        paragraphs: [
          'If the change helps consistently, keep it. If it does not help or the result varies, restore the usual setup and test something else. Neither result identifies a medical cause.',
        ],
      },
    ],
  },
  {
    path: '/patterns/whole-room-heat/',
    title: 'When the Whole Room Is Hot',
    description:
      'If the room and both sleepers are hot, try one small room change while leaving the bed and personal cooling alone.',
    eyebrow: 'Start with the room',
    intro:
      'Start with the room when both sleepers feel hot, the warmth lasts, and room cooling helps.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012', 'NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'clues',
        heading: 'What points this way',
        paragraphs: [
          'Both sleepers felt hot, the entire room felt warm, heat developed gradually, or whole-room cooling clearly helped.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'What to try tonight',
        paragraphs: [
          'Make the smallest safe adjustment to room cooling or ventilation already available. Keep bedding, sleepwear, personal airflow, and the other sleeper’s setup the same.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'A room contribution does not rule out a personal episode or determine the reason for sweating.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Before you buy anything',
        paragraphs: [
          'Do not add bed hardware until you have tried one small room change on its own.',
        ],
      },
    ],
  },
  {
    path: '/patterns/bed-heat-build-up/',
    title: 'When Heat Builds Up in Bed',
    description:
      'If warmth builds underneath or under the covers, try one removable layer before replacing the mattress or cooling the room more.',
    eyebrow: 'Start with one bed layer',
    intro:
      'Start with the bed when the room begins comfortable but the sleep surface or covers grow warmer.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'clues',
        heading: 'What points this way',
        paragraphs: [
          'Warmth increases over time, is strongest underneath or under covers, and is not shared by a comfortable partner.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'What to try tonight',
        paragraphs: [
          'Change the lightest safely removable bed layer. Keep the room, fan, sleepwear, and other layers stable.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'A warm bed can make discomfort worse without explaining a sudden episode or any medical cause.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Before you replace the mattress',
        paragraphs: [
          'Do not replace the mattress before isolating the removable layers above it.',
        ],
      },
    ],
  },
  {
    path: '/patterns/sudden-personal-heat/',
    title: 'When Heat Arrives Suddenly',
    description:
      'A sudden wave, upper-body heat, a comfortable partner, or feeling cold afterward can point away from more room cooling.',
    eyebrow: 'Start with timing and location',
    intro:
      'The heat appears concentrated around you rather than the room when it arrives quickly and the shared environment does not explain it.',
    healthAdjacent: true,
    sourceIds: ['MENOPAUSE-SOCIETY-HOT-FLASHES-2026', 'ACOG-MENOPAUSE-YEARS-2026'],
    sections: [
      {
        id: 'clues',
        heading: 'What points this way',
        paragraphs: [
          'Notice whether the heat arrives as a sudden wave, affects your face, chest, or upper body, leaves your partner comfortable or cold, or is followed by chills.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'What to try tonight',
        paragraphs: [
          'Keep the room steady. Prepare one quick cooling step you can keep to your side and use it when the heat begins. Record whether it helped, whether you became cold afterward, and whether it disturbed your partner.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'These observations cannot identify why the episode occurred and do not diagnose perimenopause or another condition.',
        ],
      },
      {
        id: 'when-to-seek-care',
        heading: 'Keep care in the plan',
        paragraphs: [
          'Frequent, new, worsening, severe, soaking, or concerning symptoms deserve a conversation with a qualified healthcare professional.',
        ],
      },
    ],
  },
  {
    path: '/patterns/partner-temperature-mismatch/',
    title: 'When One Sleeper Is Hot and the Other Is Cold',
    description:
      'When one sleeper is hot and the other is comfortable or cold, test a change on one side before changing the thermostat again.',
    eyebrow: 'One shared bed, two local needs',
    intro:
      'Your plan needs to work on one side of the bed when shared cooling reaches the partner before it solves the hot sleeper’s discomfort.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'clues',
        heading: 'What points this way',
        paragraphs: [
          'The partner remains comfortable or cold, a thermostat change causes partner discomfort, or only one side needs stronger airflow or less insulation.',
        ],
      },
      {
        id: 'partner-consideration',
        heading: 'Build a plan for both sides',
        paragraphs: [
          'Keep the room where both sleepers can tolerate it. Try separate top covers first, then direct airflow only where needed. Compare powered zones only after you know what a cheaper change could not solve.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'What to try tonight',
        paragraphs: [
          'Use separate existing covers while holding room conditions stable. Record comfort and disturbance for both sleepers.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Before you pay for separate controls',
        paragraphs: [
          'Do not pay for dual-zone control when only one side needs a different layer.',
        ],
      },
    ],
  },
  {
    path: '/patterns/moisture-and-recovery/',
    title: 'Moisture After Waking Hot',
    description:
      'Changing one damp item for a dry one may affect comfort after you wake, but it cannot explain or prevent the sweating.',
    eyebrow: 'What a dry layer can and cannot show',
    intro:
      'Sweat evaporation removes heat. A dry layer may feel different after you wake damp, but research cited here has not shown that it speeds recovery or explains why the heat began.',
    healthAdjacent: true,
    sourceIds: [
      'NHS-NIGHT-SWEATS-2026',
      'MENOPAUSE-SOCIETY-HOT-FLASHES-2026',
      'NCBI-SWEAT-EVAPORATION-2018',
      'OCT-METHOD-2026',
    ],
    sections: [
      {
        id: 'clues',
        heading: 'What to notice',
        paragraphs: [
          'Notice whether you wake damp or soaked, then become cold, clammy, or shivery after the strongest heat passes. You can compare one dry layer, but the result will not establish whether moisture prolonged your recovery.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'What to try tonight',
        paragraphs: [
          'Prepare one dry replacement item and change only that item after waking damp. Record what happens without assuming comfort will return faster.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'Feeling more comfortable would not show that the experiment prevented the sweat, treated its cause, or improved a health outcome.',
        ],
      },
      {
        id: 'when-to-seek-care',
        heading: 'Keep care in the plan',
        paragraphs: [
          'Regular soaking episodes, or symptoms that are new, worsening, frequent, or worrying, deserve medical advice.',
        ],
      },
    ],
  },
  {
    path: '/compare/',
    title: 'Compare Ways to Cool a Bed',
    description:
      'Compare separate bedding, directed airflow, air- and water-based examples, zones, and room cooling.',
    eyebrow: 'Room, bed, and one-side options',
    intro:
      'Separate covers, moving air, cooled pads, and room cooling affect different parts of the bed. Start with what still feels hot or damp.',
    healthAdjacent: true,
    sourceIds: [
      'PMC-SLEEP-THERMAL-ENVIRONMENT-2012',
      'BEDJET-INSTALLATION-2026',
      'SLEEPME-HOW-IT-WORKS-2026',
      'SLEEPME-DOCK-PRO-MANUAL-2026',
    ],
    sections: [
      {
        id: 'comparison',
        heading: 'What each option changes',
        paragraphs: [
          'Separate bedding changes insulation. Room or directed airflow changes moving air. Current manufacturer examples describe air moved through bedding or water circulated through a mattress pad; those are manufacturer descriptions, not independent performance findings. Room cooling changes shared air.',
        ],
      },
      {
        id: 'tradeoffs',
        heading: 'Tradeoffs that matter at night',
        paragraphs: [
          'Use the current manual for the exact system to check which side it reaches, sound, cleaning, surface feel, partner effect, placement, and the number of parts. We have not independently tested any product.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Before you buy anything',
        paragraphs: [
          'Use the assessment and try a low-cost change before paying for powered equipment.',
        ],
      },
    ],
  },
  {
    path: '/evidence/',
    title: 'Evidence and Uncertainty',
    description:
      'See which statements come from health guidance, sleep research, product manuals, or this site’s own rules.',
    eyebrow: 'Evidence before certainty',
    intro:
      'This page separates medical guidance, sleep-environment research, manufacturer documents, and this site’s own unproven tests.',
    healthAdjacent: true,
    sourceIds: [
      'NHS-NIGHT-SWEATS-2026',
      'ACOG-MENOPAUSE-YEARS-2026',
      'MENOPAUSE-SOCIETY-HOT-FLASHES-2026',
      'PMC-SLEEP-THERMAL-ENVIRONMENT-2012',
    ],
    sections: [
      {
        id: 'medical-evidence',
        heading: 'Medical evidence',
        paragraphs: [
          'Government agencies and professional medical organizations support definitions, broad safety wording, and the boundary that repeated or worrying symptoms belong in a healthcare conversation. The tool does not translate those sources into a diagnosis.',
        ],
      },
      {
        id: 'room-and-bed-research',
        heading: 'Research on the room and bed',
        paragraphs: [
          'Peer-reviewed research shows that the room, clothing, and bedding can affect sleep comfort. The tool uses those basic findings to choose what to try, not to claim a medical benefit.',
        ],
      },
      {
        id: 'manufacturer-claims',
        heading: 'Manufacturer claims',
        paragraphs: [
          'Specifications can describe how a device is intended to work. They are not independent evidence of real-world effectiveness and are not used here as medical proof.',
        ],
      },
      {
        id: 'unknowns',
        heading: 'What remains unknown',
        paragraphs: [
          'We have not tested cooling products, clinically validated the tool, or had it independently reviewed by a clinician. Its fixed rules still need to be tested with real users.',
        ],
      },
    ],
  },
  {
    path: '/sources/',
    title: 'Source Register',
    description:
      'See every health, sleep, product, privacy, accessibility, and search source used by One Change Tonight.',
    eyebrow: 'Sources and limits',
    intro:
      'Each entry names the publisher, the type of evidence, when we checked it, what it supports, and any important limit.',
    sourceIds: [
      'OCT-METHOD-2026',
      'NHS-NIGHT-SWEATS-2026',
      'ACOG-MENOPAUSE-YEARS-2026',
      'ACOG-HOT-FLASHES-2026',
      'MENOPAUSE-SOCIETY-HOT-FLASHES-2026',
      'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026',
      'PMC-SLEEP-THERMAL-ENVIRONMENT-2012',
      'NCBI-SWEAT-EVAPORATION-2018',
      'BEDJET-INSTALLATION-2026',
      'SLEEPME-DOCK-PRO-MANUAL-2026',
      'SLEEPME-HOW-IT-WORKS-2026',
      'GOOGLE-AI-SEARCH-2026',
      'GOOGLE-HELPFUL-CONTENT-2026',
      'OPENAI-PUBLISHERS-2026',
      'WEBDEV-VITALS-2026',
      'WCAG-22-2024',
      'FTC-HBNR-2024',
    ],
    sections: [
      {
        id: 'selection',
        heading: 'How sources are selected',
        paragraphs: [
          'Health statements prioritize government health agencies, major professional medical organizations, and peer-reviewed research. Technical claims use the current primary documentation for each platform or standard.',
        ],
      },
      {
        id: 'limitations',
        heading: 'Limitations',
        paragraphs: [
          'Access dates show when material was reviewed, not a promise that a source will never change. Corrections are logged, and health guidance is rechecked on a defined review cycle.',
        ],
      },
    ],
  },
  {
    path: '/methodology/',
    title: 'Methodology',
    description:
      'See how each answer affects the result, how the tool chooses one change, and what it cannot determine.',
    eyebrow: 'Fixed rules, shown plainly',
    intro:
      'No language model evaluates your answers. A fixed set of tested rules runs in your browser and shows why it chose each result.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'answer-scoring',
        heading: 'How answers are counted',
        paragraphs: [
          'Each answer adds points to whole-room heat, heat building in bed, or sudden personal heat. If the scores are close, the answers conflict, or too much is unknown, the result says so. The tool never shows a health probability or clinical risk score.',
        ],
      },
      {
        id: 'modifiers',
        heading: 'What can change the plan',
        paragraphs: [
          'Moisture, one-sided need, failed whole-room cooling, noise sensitivity, frequent disruption, and new or worsening status alter the plan without becoming diagnoses.',
        ],
      },
      {
        id: 'change-selection',
        heading: 'How the tool chooses a change',
        paragraphs: [
          'The rules exclude changes that do not apply or have already failed, then choose the safest, lowest-effort action that changes one thing. When the answers are unclear, the tool asks for a baseline night before suggesting a change.',
        ],
      },
      {
        id: 'review-status',
        heading: 'Review status',
        paragraphs: [
          'We reviewed and cited the sources. The tool has not been clinically validated or independently reviewed by a clinician.',
        ],
      },
    ],
  },
  {
    path: '/editorial-policy/',
    title: 'Editorial Policy',
    description:
      'How we check sources, label uncertainty, correct errors, discuss products, and keep medical limits clear.',
    eyebrow: 'How we write and review',
    intro:
      'Health facts need authoritative sources. Comfort advice stays separate from diagnosis and treatment.',
    sections: [
      {
        id: 'health-language',
        heading: 'Health claims',
        paragraphs: [
          'We do not diagnose, prescribe, recommend medicines, or suggest that cooling a room or bed treats a medical cause. Health facts require authoritative sources.',
        ],
      },
      {
        id: 'authorship',
        heading: 'Authorship and review',
        paragraphs: [
          'We name the organization responsible for the site. No clinician is listed as a reviewer because no clinician has independently reviewed it.',
        ],
      },
      {
        id: 'corrections',
        heading: 'Corrections and updates',
        paragraphs: [
          'Substantial changes update the review date and correction record. Manufacturer claims stay labeled as manufacturer claims; we do not present them as independent evidence.',
        ],
      },
    ],
  },
  {
    path: '/medical-boundaries/',
    title: 'Medical Boundaries',
    description:
      'This comfort tool cannot diagnose, identify a cause, recommend treatment, handle an emergency, or replace a healthcare professional.',
    eyebrow: 'Limits of this tool',
    intro:
      'One Change Tonight helps you compare the room, bed, timing, and other sleeper. It is not a diagnostic tool, medical device, menopause diagnosis, or treatment recommender.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'not-diagnosis',
        heading: 'No diagnosis or cause prediction',
        paragraphs: [
          'A result that points to sudden personal heat is not evidence of menopause. A cool room does not rule out a health issue. No result gives a probability, clinical score, or cause.',
        ],
      },
      {
        id: 'not-treatment',
        heading: 'No treatment recommendation',
        paragraphs: [
          'The site does not recommend, rank, prescribe, or discourage hormone therapy, prescription drugs, over-the-counter medicines, supplements, herbs, or changes to existing clinician-directed care.',
        ],
      },
      {
        id: 'when-to-seek-care',
        heading: 'When care belongs in the plan',
        paragraphs: [
          'New, worsening, frequent, severe, soaking, concerning, or sleep-disrupting symptoms deserve a conversation with a qualified healthcare professional. Seek urgent help if you feel seriously unwell.',
        ],
      },
    ],
  },
  {
    path: '/privacy/',
    title: 'Privacy: Your Answers Stay in This Browser',
    description:
      'No account, name, database, assessment analytics, advertising pixel, session replay, or answer-bearing URL is used by the tool.',
    eyebrow: 'Private by default',
    intro:
      'Assessment answers, results, and morning notes stay in this browser. They are not sent to us.',
    sections: [
      {
        id: 'data-stored',
        heading: 'What is stored locally',
        paragraphs: [
          'This browser may store your answers, suggested change, start date, up to three morning notes, display choice, and last-updated time. The data expires after 90 days.',
        ],
      },
      {
        id: 'data-not-stored',
        heading: 'What we do not collect',
        paragraphs: [
          'The tool does not request names, email, exact birth date, address, employer, income, diagnosis, medicines, or detailed health history. Answers are not sent to a server, analytics, logs, error reporting, marketing tools, or third parties.',
        ],
      },
      {
        id: 'deletion',
        heading: 'Delete local data',
        paragraphs: [
          'The visible delete control clears every One Change Tonight record from this browser, including the current assessment. Deleted data is not restored. The tool also removes records it cannot read or that have expired.',
        ],
      },
      {
        id: 'analytics',
        heading: 'Analytics status',
        paragraphs: [
          'Analytics is off. The site has no analytics, session replay, or advertising pixels.',
        ],
      },
    ],
  },
  {
    path: '/terms/',
    title: 'Terms of Use',
    description:
      'Rules for using this educational site, including its medical, evidence, and product-testing limits.',
    eyebrow: 'Use with the stated limits',
    intro:
      'Use this site for general education and to compare low-risk changes to your room or bed, not as personal medical advice.',
    sections: [
      {
        id: 'scope',
        heading: 'Scope',
        paragraphs: [
          'The site does not create a clinician–patient relationship or promise that any experiment or cooling option will improve comfort. Stop an experiment that causes discomfort or creates a safety concern.',
        ],
      },
      {
        id: 'care',
        heading: 'Healthcare',
        paragraphs: [
          'Do not delay professional or urgent care because of this site. Do not change medicines, supplements, or clinician-directed care based on its content.',
        ],
      },
      {
        id: 'product-comparisons',
        heading: 'Product comparisons',
        paragraphs: [
          'Product pages explain differences between cooling approaches. They do not promise that a product will work for you.',
        ],
      },
    ],
  },
  {
    path: '/corrections/',
    title: 'Corrections and Change Log',
    description:
      'Report an error and review changes to the site’s content, sources, safety language, privacy, and decision rules.',
    eyebrow: 'Make changes visible',
    intro: 'This log records substantial corrections and the date each change was reviewed.',
    sections: [
      {
        id: 'report',
        heading: 'Report a correction',
        paragraphs: [
          'Use the public correction channel linked below. Do not include assessment answers or personal health details in a report.',
        ],
      },
      {
        id: 'change-log',
        heading: 'Change log',
        paragraphs: [
          'September 8, 2026 — Rewrote the public copy in plain language, removed repeated page boilerplate, corrected the three-night tracker, and kept the existing medical and evidence limits.',
          'September 7, 2026 — Published the first evidence review, browser-only decision rules, privacy safeguards, and guides. No independent medical review or clinical validation has occurred.',
        ],
      },
    ],
  },
  {
    path: '/about/',
    title: 'About One Change Tonight',
    description: 'Why this tool helps people test one change to the room or bed.',
    eyebrow: 'Why this tool exists',
    intro:
      'One Change Tonight is for a specific moment: you woke hot even though the room felt cool. It helps you choose one change based on what happened in the room and bed.',
    sections: [
      {
        id: 'mission',
        heading: 'What it does',
        paragraphs: [
          'It helps an adult who wakes hot choose one safe, reversible change and see what happened by morning.',
        ],
      },
      {
        id: 'principles',
        heading: 'How it makes decisions',
        paragraphs: [
          'The tool starts with a no-cost test, keeps answers in the browser, and shows why it chose each step. It compares how cooling options work before discussing products and never turns comfort observations into a diagnosis.',
        ],
      },
      {
        id: 'status',
        heading: 'Current status',
        paragraphs: [
          'The first release includes cited sources and automated tests, and it does not send answers off your device. It has not been clinically validated, independently reviewed by a clinician, or tested first-hand against cooling products.',
        ],
      },
    ],
  },
  {
    path: '/contact/',
    title: 'Contact',
    description:
      'How to contact the project about corrections, accessibility, privacy, security, or general feedback without sending personal health information.',
    eyebrow: 'Contact the project',
    intro:
      'Use the public project channel below for corrections, accessibility, privacy, security, or general feedback.',
    sections: [
      {
        id: 'before-you-write',
        heading: 'Please do not send personal health details',
        paragraphs: [
          'This project cannot provide individual medical advice. Use a qualified healthcare professional for questions about symptoms, causes, or treatment.',
        ],
      },
      {
        id: 'topics',
        heading: 'What to report',
        paragraphs: [
          'Report a factual error, broken source, accessibility barrier, privacy concern, security issue, or confusing interface. Include the public page and expected behavior, not assessment answers.',
        ],
      },
    ],
  },
  {
    path: '/sitemap/',
    title: 'Sitemap',
    description:
      'Find the assessment, guides, comparisons, sources, privacy information, and site policies.',
    eyebrow: 'All public pages',
    intro:
      'Start with the assessment, browse a specific question, or review how the site works.',
    sections: [
      {
        id: 'start',
        heading: 'Start and understand',
        paragraphs: [
          'Use the assessment, the awake-and-hot shortcut, the method, or the four-part room, bed, body, and partner check.',
        ],
      },
      {
        id: 'patterns',
        heading: 'What to check',
        paragraphs: [
          'Read what to try when the whole room is hot, heat builds up in bed, heat arrives suddenly, sleepers need different temperatures, or dampness affects comfort afterward.',
        ],
      },
      {
        id: 'guides',
        heading: 'Questions and comparisons',
        paragraphs: [
          'These guides cover cold-room sweating, feeling hot then cold, failed cooling attempts, one-sided beds, cooling options, appointment notes, and when to seek care.',
        ],
      },
      {
        id: 'trust',
        heading: 'Evidence and trust',
        paragraphs: [
          'Read the sources, fixed rules, medical limits, privacy details, terms, corrections, and contact information.',
        ],
      },
    ],
  },
];

export const corePageByPath = new Map(corePages.map((page) => [page.path, page]));
