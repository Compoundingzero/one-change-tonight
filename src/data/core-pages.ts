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
      'A short, private assessment separates room, bed, sudden personal heat, moisture, and partner constraints, then selects one reversible experiment.',
    eyebrow: 'The method',
    intro:
      'The tool turns a confusing night into one careful environmental question. It does not turn observations into a diagnosis.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-HOT-FLASHES-2026'],
    sections: [
      {
        id: 'what-it-can-tell-you',
        heading: 'What it can tell you',
        paragraphs: [
          'Your answers are compared with four transparent environmental patterns: whole-room heat, bed heat build-up, sudden personal heat that the room does not fully explain, and mixed or uncertain. Moisture and a one-sided partner need can modify the plan.',
        ],
        bullets: [
          'Which observations influenced the result',
          'One variable to change tonight',
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
          'Changing several things at once may feel productive, but it makes the next morning hard to interpret. A single safe, reversible change produces a clearer observation—even when the answer is that the change did not help.',
        ],
      },
      {
        id: 'private-by-default',
        heading: 'Private by default',
        paragraphs: [
          'The assessment runs in your browser. Answers and morning check-ins use versioned local browser storage, expire after 90 days, and can be deleted at any time. No account or name is requested.',
        ],
      },
    ],
  },
  {
    path: '/room-bed-body-partner/',
    title: 'The Room–Bed–Body–Partner Framework',
    description:
      'Four observations help decide which environmental variable deserves a test without claiming to identify the medical cause of night heat.',
    eyebrow: 'A clearer map of the night',
    intro:
      'The same “I woke hot” description can contain four different environmental questions. Observe each layer before buying a solution.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012', 'NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'room',
        heading: 'Room',
        paragraphs: [
          'Ask whether the entire bedroom felt hot and whether both sleepers noticed it. A shared room problem is the clearest reason to test a room variable first.',
        ],
      },
      {
        id: 'bed-layer-stack',
        heading: 'Bed',
        paragraphs: [
          'Sheets, protectors, toppers, covers, sleepwear, and the mattress form a smaller thermal and moisture environment. Heat that builds gradually underneath or under covers makes one removable layer worth isolating.',
        ],
      },
      {
        id: 'body',
        heading: 'Body',
        paragraphs: [
          'A sudden wave, upper-body heat, sweating, or cold afterwards may not be explained by the room alone. The tool describes that timing as a personal-heat pattern while leaving the medical cause unknown.',
        ],
      },
      {
        id: 'partner',
        heading: 'Partner',
        paragraphs: [
          'A comfortable or cold partner is evidence about the shared environment, not an obstacle. It can make a one-sided change more useful than lowering the whole room again.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'Turn the map into one test',
        paragraphs: [
          'Choose the smallest area that matches the strongest observation, change one variable there, and keep the other three parts stable for the night.',
        ],
      },
    ],
  },
  {
    path: '/three-night-experiment/',
    title: 'The Three-Night, One-Variable Experiment',
    description:
      'Repeat one safe environmental change for up to three nights and compare simple observations without creating a medical improvement score.',
    eyebrow: 'A short experiment, not permanent tracking',
    intro:
      'One night can be unusual. Up to three nights can show whether a comfort result repeats while keeping the burden small.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'baseline',
        heading: 'Begin with a baseline',
        paragraphs: [
          'Record awakenings, dampness, cold afterwards, time back to comfort, and partner disturbance without changing the normal setup.',
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
        heading: 'Ask the next environmental question',
        paragraphs: [
          'A consistent improvement supports continuing a low-burden setup. An unchanged or mixed result means the next test should examine a different variable—not that the medical cause has been found.',
        ],
      },
    ],
  },
  {
    path: '/patterns/whole-room-heat/',
    title: 'Whole-Room Heat Pattern',
    description:
      'When the room and both sleepers are hot, test a shared room variable first while keeping bed and personal variables unchanged.',
    eyebrow: 'Environmental pattern',
    intro:
      'The whole room appears to be contributing when heat is shared, sustained, and responds to room cooling.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012', 'NHS-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'clues',
        heading: 'Clues that support the pattern',
        paragraphs: [
          'Both sleepers felt hot, the entire room felt warm, heat developed gradually, or whole-room cooling clearly helped.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'One Change Tonight',
        paragraphs: [
          'Use an existing room-cooling or ventilation setting at the smallest useful change. Keep bedding, sleepwear, personal airflow, and partner arrangements constant.',
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
        heading: 'Do Not Buy Yet',
        paragraphs: [
          'Do not add bed hardware while a small room change has not yet been tested cleanly.',
        ],
      },
    ],
  },
  {
    path: '/patterns/bed-heat-build-up/',
    title: 'Bed Heat Build-Up Pattern',
    description:
      'Gradual warmth underneath or under covers points to a bed-layer experiment before mattress replacement or stronger whole-room cooling.',
    eyebrow: 'Environmental pattern',
    intro:
      'Heat may be accumulating around the bed when the room starts comfortable but the sleep surface or covers warm over time.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'clues',
        heading: 'Clues that support the pattern',
        paragraphs: [
          'Warmth increases over time, is strongest underneath or under covers, and is not shared by a comfortable partner.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'One Change Tonight',
        paragraphs: [
          'Change the lightest safely removable bed layer. Keep the room, fan, sleepwear, and other layers stable.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'A warm bed can amplify discomfort without explaining a sudden episode or any medical cause.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Do Not Buy Yet',
        paragraphs: [
          'Do not replace the mattress before isolating the removable layers above it.',
        ],
      },
    ],
  },
  {
    path: '/patterns/sudden-personal-heat/',
    title: 'Sudden Personal-Heat Pattern',
    description:
      'A sudden wave, upper-body heat, comfortable partner, or cold afterwards can make more room cooling a weaker first experiment.',
    eyebrow: 'Non-diagnostic observation pattern',
    intro:
      'The heat appears concentrated around you rather than the room when it arrives quickly and the shared environment does not explain it.',
    healthAdjacent: true,
    sourceIds: ['MENOPAUSE-SOCIETY-HOT-FLASHES-2026', 'ACOG-MENOPAUSE-YEARS-2026'],
    sections: [
      {
        id: 'clues',
        heading: 'Clues that support the pattern',
        paragraphs: [
          'A sudden wave, heat in the face, chest, or upper body, a comfortable or cold partner, and chills after the episode are relevant observations.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'One Change Tonight',
        paragraphs: [
          'Keep the room stable and prepare one fast, local, reversible comfort measure for use only when the episode begins. Record relief, cold afterwards, and partner disturbance.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'This pattern cannot identify why the episode occurred and does not diagnose perimenopause or another condition.',
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
    title: 'Partner-Temperature Mismatch Pattern',
    description:
      'When one sleeper is hot and the other is comfortable or cold, a one-sided experiment may teach more than another thermostat change.',
    eyebrow: 'One shared bed, two local needs',
    intro:
      'Your plan needs to work on one side of the bed when shared cooling reaches the partner before it solves the hot sleeper’s discomfort.',
    healthAdjacent: true,
    sourceIds: ['PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'clues',
        heading: 'Clues that support the pattern',
        paragraphs: [
          'The partner remains comfortable or cold, a thermostat change causes partner discomfort, or only one side needs stronger airflow or less insulation.',
        ],
      },
      {
        id: 'partner-consideration',
        heading: 'Build a plan for both sides',
        paragraphs: [
          'Keep agreeable room conditions shared. Separate top insulation first; direct airflow only where needed; compare powered zones only after the low-cost constraint is clear.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'One Change Tonight',
        paragraphs: [
          'Use separate existing covers while holding room conditions stable. Record comfort and disturbance for both sleepers.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Do Not Buy Yet',
        paragraphs: [
          'Do not pay for dual-zone control when only one side needs a different layer.',
        ],
      },
    ],
  },
  {
    path: '/patterns/moisture-and-recovery/',
    title: 'Moisture and Recovery Pattern',
    description:
      'Sweat evaporation removes heat, so a dry-layer comparison can test a comfort hypothesis without claiming to explain or prevent an episode.',
    eyebrow: 'A hypothesis, not a diagnosis',
    intro:
      'Sweat evaporation removes heat. This site treats a dry-layer comparison as an editorial comfort hypothesis, not an established recovery effect or explanation of why the heat began.',
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
        heading: 'Clues that support a recovery question',
        paragraphs: [
          'You wake damp or soaked, then become cold, clammy, or shivery after the strongest heat passes. That sequence makes a dry-layer comparison reasonable to observe, but does not establish that moisture prolongs recovery.',
        ],
      },
      {
        id: 'one-change-tonight',
        heading: 'One Change Tonight',
        paragraphs: [
          'Prepare one dry replacement item and change only that item after waking damp. Record what happens without assuming comfort will return faster.',
        ],
      },
      {
        id: 'what-this-does-not-mean',
        heading: 'What it does not mean',
        paragraphs: [
          'Any comfort change does not show that the experiment prevented the sweat, treated its cause, or improved a health outcome.',
        ],
      },
      {
        id: 'when-to-seek-care',
        heading: 'Keep care in the plan',
        paragraphs: [
          'Regular soaking episodes or a new, worsening, frequent, or worrying pattern deserve medical advice.',
        ],
      },
    ],
  },
  {
    path: '/compare/',
    title: 'Neutral Bed-Cooling Mechanism Comparison',
    description:
      'Compare separate bedding, directed airflow, air- and water-based examples, zones, and room cooling without product rankings.',
    eyebrow: 'Mechanisms before products',
    intro:
      'Different approaches change different parts of a sleep setup. Compare the unresolved constraint before comparing brands.',
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
        heading: 'What each mechanism changes',
        paragraphs: [
          'Separate bedding changes insulation. Room or directed airflow changes moving air. Current manufacturer examples describe air moved through bedding or water circulated through a mattress pad; those are manufacturer descriptions, not independent performance findings. Room cooling changes shared air.',
        ],
      },
      {
        id: 'tradeoffs',
        heading: 'Tradeoffs that matter at night',
        paragraphs: [
          'Compare one-sided reach, perceived sound, care instructions, contact feel, partner effect, room dependence, and complexity using the current manual for the exact system. This site has not independently tested any product.',
        ],
      },
      {
        id: 'do-not-buy-yet',
        heading: 'Do Not Buy Yet',
        paragraphs: [
          'Use the assessment and a low-cost experiment before paying for a more complex mechanism. We receive no commission from these categories.',
        ],
      },
    ],
  },
  {
    path: '/evidence/',
    title: 'Evidence and Uncertainty',
    description:
      'See how One Change Tonight separates medical evidence, environmental mechanisms, manufacturer claims, and editorial interpretation.',
    eyebrow: 'Evidence before certainty',
    intro:
      'A useful answer must show which kind of evidence supports it—and where evidence stops.',
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
        id: 'environmental-mechanisms',
        heading: 'Environmental mechanisms',
        paragraphs: [
          'Peer-reviewed thermal-environment research supports treating room, clothing, and bedding as relevant parts of sleep comfort. The decision rules use observations to select experiments, not to claim clinical effectiveness.',
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
          'We have not physically tested cooling products, completed clinical validation, or obtained an independent medical review. The assessment weights are transparent editorial rules that require future real-user evaluation.',
        ],
      },
    ],
  },
  {
    path: '/sources/',
    title: 'Source Register',
    description:
      'The public register for medical, environmental, accessibility, privacy, search, editorial, and manufacturer documentation used by One Change Tonight.',
    eyebrow: 'Trace every important claim',
    intro:
      'Sources are recorded with publisher, evidence status, access date, supported claims, and an explicit limitation.',
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
      'Read the transparent weighted-rule method, experiment selection principles, uncertainty rules, and limits behind the tool.',
    eyebrow: 'Deterministic and explainable',
    intro:
      'No language model evaluates your answers. Typed, tested rules run entirely in the browser and expose the clues behind each result.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'PMC-SLEEP-THERMAL-ENVIRONMENT-2012'],
    sections: [
      {
        id: 'pattern-scoring',
        heading: 'Pattern scoring',
        paragraphs: [
          'Each answer contributes integer weights to whole-room, bed build-up, or sudden personal heat. Close scores, material contradictions, or too much uncertainty return mixed or not enough information. Percentages and clinical risk scores are never shown.',
        ],
      },
      {
        id: 'modifiers',
        heading: 'Context modifiers',
        paragraphs: [
          'Moisture, one-sided need, failed whole-room cooling, noise sensitivity, frequent disruption, and new or worsening status alter the plan without becoming diagnoses.',
        ],
      },
      {
        id: 'experiment-selection',
        heading: 'Experiment selection',
        paragraphs: [
          'The engine excludes clearly failed or inapplicable experiments, then chooses the lowest-burden safe action that changes one variable and can teach something. “Measure first” is preferred to speculation.',
        ],
      },
      {
        id: 'review-status',
        heading: 'Review status',
        paragraphs: [
          'Editorial evidence review is complete. The tool has not been clinically validated or independently medically reviewed.',
        ],
      },
    ],
  },
  {
    path: '/editorial-policy/',
    title: 'Editorial Policy',
    description:
      'Our rules for evidence, uncertainty, corrections, independence, health boundaries, product language, and update dates.',
    eyebrow: 'How content earns trust',
    intro:
      'We write for immediate usefulness, calm uncertainty, and a clear line between comfort information and medical care.',
    sections: [
      {
        id: 'independence',
        heading: 'Editorial independence',
        paragraphs: [
          'There are no affiliate links, commissions, sponsored rankings, ads, fabricated relationships, or paid product placements. Commercially adjacent pages compare mechanisms, not winners.',
        ],
      },
      {
        id: 'health-language',
        heading: 'Health-adjacent language',
        paragraphs: [
          'We do not diagnose, prescribe, recommend medicines, or imply that environmental cooling treats an underlying episode. Health facts require authoritative sources.',
        ],
      },
      {
        id: 'authorship',
        heading: 'Authorship and review',
        paragraphs: [
          'The authoring organization is disclosed without inventing a named expert. Until a real identified credentialed reviewer completes a review, the site states that it is not independently medically reviewed.',
        ],
      },
      {
        id: 'corrections',
        heading: 'Corrections and updates',
        paragraphs: [
          'Meaningful changes update the review date and correction record. Manufacturer claims remain clearly labeled and are not converted into independent evidence.',
        ],
      },
    ],
  },
  {
    path: '/medical-boundaries/',
    title: 'Medical Boundaries',
    description:
      'This comfort and sleep-environment tool cannot diagnose, triage, identify causes, recommend treatment, or replace qualified healthcare.',
    eyebrow: 'What the tool refuses to do',
    intro:
      'One Change Tonight organizes environmental observations. It is not a diagnostic tool, medical device, menopause diagnosis, or treatment recommender.',
    healthAdjacent: true,
    sourceIds: ['NHS-NIGHT-SWEATS-2026', 'MENOPAUSE-SOCIETY-NIGHT-SWEATS-2026'],
    sections: [
      {
        id: 'not-diagnosis',
        heading: 'No diagnosis or cause prediction',
        paragraphs: [
          'A sudden personal-heat pattern is not evidence of menopause. A cool-room pattern does not rule out a health issue. No result supplies a probability, clinical score, or causal statement.',
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
      'Assessment answers, result patterns, experiments, and morning check-ins do not leave the browser.',
    sections: [
      {
        id: 'data-stored',
        heading: 'What is stored locally',
        paragraphs: [
          'Versioned local storage may contain assessment choices, the selected experiment, a start date, up to three morning check-ins, interface preferences, and the last-updated time. It expires after 90 days.',
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
          'The visible delete control clears every One Change Tonight storage key and in-memory assessment state. Explicitly deleted data is not restored. Corrupted or outdated records are discarded safely.',
        ],
      },
      {
        id: 'analytics',
        heading: 'Analytics status',
        paragraphs: [
          'Analytics is disabled. If privacy-safe aggregate analytics is added later, it may record only generic page or tool lifecycle events and never answers, patterns, frequency, partner state, or experiment details.',
        ],
      },
    ],
  },
  {
    path: '/terms/',
    title: 'Terms of Use',
    description:
      'Terms for using this general educational sleep-environment decision aid, including its medical, evidence, and product-testing limitations.',
    eyebrow: 'Use with the stated limits',
    intro:
      'Use the site as general educational information and a way to structure low-risk environmental observations—not as individualized medical advice.',
    sections: [
      {
        id: 'scope',
        heading: 'Scope',
        paragraphs: [
          'The site is provided without a clinician–patient relationship and does not promise that any experiment or product mechanism will improve comfort. Stop an experiment that causes discomfort or creates a safety concern.',
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
        id: 'commercial',
        heading: 'Commercial status',
        paragraphs: [
          'We currently receive no commission from the products or product categories discussed. We do not guarantee indexing, traffic, product performance, or adoption.',
        ],
      },
    ],
  },
  {
    path: '/corrections/',
    title: 'Corrections and Change Log',
    description:
      'Report an error and review meaningful editorial, source, safety, privacy, and decision-rule changes to One Change Tonight.',
    eyebrow: 'Make changes visible',
    intro:
      'Accuracy includes showing what changed, why it changed, and when the update was reviewed.',
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
        heading: 'Meaningful changes',
        paragraphs: [
          'September 7, 2026 — initial evidence review, deterministic rules, privacy architecture, and launch corpus prepared. No independent medical review or clinical validation has occurred.',
        ],
      },
    ],
  },
  {
    path: '/about/',
    title: 'About One Change Tonight',
    description:
      'Why this focused, noncommercial tool helps tired people test one environmental variable instead of guessing or buying first.',
    eyebrow: 'A single-purpose utility',
    intro:
      'One Change Tonight was built for the moment when the room is already cool, sleep has been interrupted, and another generic list is not useful.',
    sections: [
      {
        id: 'mission',
        heading: 'The mission',
        paragraphs: [
          'Help any adult experiencing relevant night heat choose the smallest safe, reversible environmental change that can teach something by morning.',
        ],
      },
      {
        id: 'principles',
        heading: 'The principles',
        paragraphs: [
          'Action before marketing. Privacy before measurement. Explanation before certainty. Mechanisms before products. Medical boundaries before implied diagnosis.',
        ],
      },
      {
        id: 'status',
        heading: 'Current status',
        paragraphs: [
          'The first release has editorial evidence review, automated tests, and no external data processing. It has not been clinically validated, independently medically reviewed, or tested first-hand against cooling products.',
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
        heading: 'Useful report topics',
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
      'A human-readable map of the assessment, patterns, experiments, comparisons, evidence, policies, and question-led guides.',
    eyebrow: 'Find the next useful page',
    intro: 'The site is organized around the next question a tired reader is likely to ask.',
    sections: [
      {
        id: 'start',
        heading: 'Start and understand',
        paragraphs: [
          'Use the assessment, the awake-and-hot shortcut, the method, or the Room–Bed–Body–Partner framework.',
        ],
      },
      {
        id: 'patterns',
        heading: 'Environmental patterns',
        paragraphs: [
          'Whole-room heat, bed heat build-up, sudden personal heat, partner-temperature mismatch, and moisture recovery each have a focused explanation.',
        ],
      },
      {
        id: 'guides',
        heading: 'Questions and comparisons',
        paragraphs: [
          'The launch corpus covers cold-room sweating, hot-then-cold recovery, failed cooling attempts, one-sided beds, mechanism choices, clinician notes, and the care boundary.',
        ],
      },
      {
        id: 'trust',
        heading: 'Evidence and trust',
        paragraphs: [
          'Evidence, sources, methodology, medical boundaries, privacy, editorial policy, terms, corrections, about, and contact pages document how the site works.',
        ],
      },
    ],
  },
];

export const corePageByPath = new Map(corePages.map((page) => [page.path, page]));
