import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { getAdaptiveQuestionPath, getQuestionDefinition } from '@/data/questions/questions';
import { getExperiment } from '@/data/experiments/experiments';
import { evaluateAssessment } from '@/lib/decision-engine';
import type { AssessmentAnswers, QuestionId } from '@/lib/decision-engine';
import {
  CHECK_IN_NOT_RECORDED,
  createEmptyLocalState,
  createMorningCheckInDraft,
  deleteLocalState,
  finalizeMorningCheckInDraft,
  loadLocalState,
  saveLocalState,
  type LocalAppStateV1,
  type MorningCheckIn,
  type MorningCheckInDraft,
} from '@/lib/storage';
import './assessment.css';

type View = 'intro' | 'question' | 'result';

interface Props {
  embedded?: boolean;
  startImmediately?: boolean;
}

const genericContexts = new Set([
  'partner-temperature',
  'cold-room',
  'hot-then-cold',
  'bed-heat',
  'failed-fix',
  'mechanisms',
  'care-notes',
]);

const contextCopy: Record<string, string> = {
  'partner-temperature': 'We’ll look for a first step that keeps both sleepers comfortable.',
  'cold-room':
    'A cool room is only one part of the night. We’ll also ask about the bed, timing, dampness, and your partner.',
  'hot-then-cold': 'We’ll ask what happened while you were hot and after the heat eased.',
  'bed-heat': 'We’ll check whether warmth built around the bed before making the room colder.',
  'failed-fix': 'Tell us what you already tried so we don’t simply suggest it again.',
  mechanisms: 'We’ll first work out whether to change the room, bed, or one side.',
  'care-notes':
    'We’ll make a short note you can bring to an appointment. It describes what happened; it does not suggest a cause.',
};

function replaceAnswer(
  answers: AssessmentAnswers,
  id: QuestionId,
  value: string | readonly string[],
): AssessmentAnswers {
  return { ...answers, [id]: value } as AssessmentAnswers;
}

function answerExists(answers: AssessmentAnswers, id: QuestionId): boolean {
  const answer = answers[id];
  return Array.isArray(answer) ? answer.length > 0 : typeof answer === 'string';
}

function todayIso(): string {
  return new Date().toISOString();
}

function firstMissingNight(checkIns: readonly { night: number }[]): 1 | 2 | 3 {
  return (
    ([1, 2, 3] as const).find((night) => !checkIns.some((entry) => entry.night === night)) ?? 3
  );
}

const morningOptions = {
  heatRelatedAwakenings: [
    [CHECK_IN_NOT_RECORDED, 'Select awakenings'],
    ['0', '0'],
    ['1', '1'],
    ['2', '2'],
    ['3_plus', '3+'],
  ],
  moisture: [
    [CHECK_IN_NOT_RECORDED, 'Select moisture'],
    ['dry', 'Dry'],
    ['damp', 'Damp'],
    ['soaked', 'Soaked'],
  ],
  becameColdAfterwards: [
    [CHECK_IN_NOT_RECORDED, 'Select cold afterward'],
    ['no', 'No'],
    ['slightly', 'Slightly'],
    ['strongly', 'Strongly'],
  ],
  timeToComfort: [
    [CHECK_IN_NOT_RECORDED, 'Select time to comfort'],
    ['under_10_minutes', 'Under 10 minutes'],
    ['10_to_30_minutes', '10–30 minutes'],
    ['30_to_60_minutes', '30–60 minutes'],
    ['over_60_minutes', 'Over 60 minutes'],
    ['unknown', 'Unknown'],
  ],
  partnerDisturbed: [
    [CHECK_IN_NOT_RECORDED, 'Select partner disturbance'],
    ['yes', 'Yes'],
    ['no', 'No'],
    ['not_applicable', 'Not applicable'],
  ],
  experimentHelp: [
    [CHECK_IN_NOT_RECORDED, 'Select whether it helped'],
    ['no', 'No'],
    ['unsure', 'Unsure'],
    ['somewhat', 'Somewhat'],
    ['clearly', 'Clearly'],
  ],
  continueExperiment: [
    [CHECK_IN_NOT_RECORDED, 'Select whether to try it again'],
    ['yes', 'Yes'],
    ['no', 'No'],
    ['unsure', 'Unsure'],
  ],
} as const;

const morningLabels: Record<keyof Omit<MorningCheckInDraft, 'night' | 'date'>, string> = {
  heatRelatedAwakenings: 'Heat-related awakenings',
  moisture: 'How damp were you?',
  becameColdAfterwards: 'Did you become cold afterward?',
  timeToComfort: 'Time until comfortable again',
  partnerDisturbed: 'Was your partner disturbed?',
  experimentHelp: 'Did the change help?',
  continueExperiment: 'Try the same change again?',
};

function canonicalizeAnswers(answers: AssessmentAnswers): AssessmentAnswers {
  const active = new Set(getAdaptiveQuestionPath(answers));
  const next = { ...answers };
  for (const id of [
    'after_episode',
    'whole_room_cooling_effect',
    'noise_sensitivity',
  ] as const) {
    if (!active.has(id)) delete next[id];
  }
  return next;
}

const premiumLabels = {
  premium_active_cooling_not_yet_justified: 'Not yet',
  active_one_sided_system_may_be_worth_comparing: 'Maybe, after simpler tests',
  personal_or_dual_zone_active_system_fits_environmental_constraint:
    'Worth comparing if the trade-offs work for you',
} as const;

const clarityLabels = {
  clear_pattern: 'Clear starting point',
  mixed_pattern: 'Mixed answers',
  not_enough_information: 'Not enough information',
} as const;

const frequencyDisplayLabels = {
  less_than_weekly: 'Less than once a week',
  one_or_two_nights: 'One or two nights a week',
  three_or_four_nights: 'Three or four nights a week',
  five_or_more_nights: 'Five or more nights a week',
  not_sure: 'Not sure',
} as const;

const changeStatusDisplayLabels = {
  yes: 'Yes',
  no: 'No',
  not_sure: 'Not sure',
  prefer_not_to_answer: 'Preferred not to answer',
} as const;

const morningDisplayLabels = {
  heatRelatedAwakenings: {
    '0': '0',
    '1': '1',
    '2': '2',
    '3_plus': '3 or more',
  },
  moisture: {
    dry: 'Woke dry',
    damp: 'Woke damp',
    soaked: 'Woke soaked',
  },
  becameColdAfterwards: {
    no: 'Did not become cold afterward',
    slightly: 'Became slightly cold afterward',
    strongly: 'Became very cold afterward',
  },
  timeToComfort: {
    under_10_minutes: 'Comfort returned in under 10 minutes',
    '10_to_30_minutes': 'Comfort returned in 10–30 minutes',
    '30_to_60_minutes': 'Comfort returned in 30–60 minutes',
    over_60_minutes: 'Comfort returned after more than 60 minutes',
    unknown: 'Time until comfort was not known',
  },
  partnerDisturbed: {
    yes: 'Partner was disturbed',
    no: 'Partner was not disturbed',
    not_applicable: 'Partner disturbance did not apply',
  },
  experimentHelp: {
    no: 'The change did not help',
    unsure: 'Not sure whether the change helped',
    somewhat: 'The change helped somewhat',
    clearly: 'The change clearly helped',
  },
  continueExperiment: {
    yes: 'Plan to continue the same change',
    no: 'Do not plan to continue the same change',
    unsure: 'Not sure whether to continue the same change',
  },
} as const;

function formatMorningCheckIn(entry: MorningCheckIn): string {
  const awakenings = morningDisplayLabels.heatRelatedAwakenings[entry.heatRelatedAwakenings];
  const awakeningLabel = entry.heatRelatedAwakenings === '1' ? 'awakening' : 'awakenings';

  return [
    `${awakenings} heat-related ${awakeningLabel}`,
    morningDisplayLabels.moisture[entry.moisture],
    morningDisplayLabels.becameColdAfterwards[entry.becameColdAfterwards],
    morningDisplayLabels.timeToComfort[entry.timeToComfort],
    morningDisplayLabels.partnerDisturbed[entry.partnerDisturbed],
    morningDisplayLabels.experimentHelp[entry.experimentHelp],
    morningDisplayLabels.continueExperiment[entry.continueExperiment],
  ].join('. ');
}

export default function AssessmentApp({ embedded = false, startImmediately = false }: Props) {
  const [localState, setLocalState] = useState<LocalAppStateV1>(() => createEmptyLocalState());
  const [view, setView] = useState<View>(startImmediately ? 'question' : 'intro');
  const [step, setStep] = useState(0);
  const [restored, setRestored] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [deletionStatus, setDeletionStatus] = useState<'deleted' | 'failed' | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [context, setContext] = useState('');
  const [checkInDraft, setCheckInDraft] = useState<MorningCheckInDraft>(() =>
    createMorningCheckInDraft(1),
  );
  const [checkInError, setCheckInError] = useState(false);
  const [acceptsPremiumTradeoffs, setAcceptsPremiumTradeoffs] = useState(false);
  const headingRef = useRef<HTMLLegendElement>(null);
  const autosaveEnabled = useRef(true);
  const initialFocusPass = useRef(true);

  const answers = localState.assessmentAnswers;
  const path = useMemo(() => getAdaptiveQuestionPath(answers), [answers]);
  const currentId = path[Math.min(step, path.length - 1)] ?? 'wake_experience';
  const question = getQuestionDefinition(currentId);
  const result = useMemo(
    () =>
      view === 'result'
        ? evaluateAssessment(answers, {
            acceptsNoiseMaintenanceAndExpense: acceptsPremiumTradeoffs,
          })
        : null,
    [answers, view, acceptsPremiumTradeoffs],
  );
  const experiment = result ? getExperiment(result.experimentId) : null;

  useEffect(() => {
    try {
      const state = loadLocalState(window.localStorage);
      if (state) {
        const activeAnswers = canonicalizeAnswers(state.assessmentAnswers);
        setLocalState({ ...state, assessmentAnswers: activeAnswers });
        setRestored(
          Object.keys(state.assessmentAnswers).length > 0 || state.morningCheckIns.length > 0,
        );
        if (state.selectedExperimentId) setView('result');
      }
      const token = window.location.hash.slice(1);
      if (genericContexts.has(token)) setContext(token);
    } catch {
      setStorageAvailable(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = localState.uiPreferences.lowBrightness
      ? 'night'
      : 'light';
  }, [localState.uiPreferences.lowBrightness]);

  useEffect(() => {
    setCheckInDraft(createMorningCheckInDraft(firstMissingNight(localState.morningCheckIns)));
    setCheckInError(false);
  }, [localState.morningCheckIns]);

  useEffect(() => {
    if (initialFocusPass.current) {
      initialFocusPass.current = false;
      return;
    }
    if (view === 'question') headingRef.current?.focus();
  }, [step, view, currentId]);

  useEffect(() => {
    if (view !== 'result') return;
    const focusResult = window.setTimeout(
      () => document.getElementById('result-heading')?.focus({ preventScroll: true }),
      0,
    );
    return () => window.clearTimeout(focusResult);
  }, [view]);

  useEffect(() => {
    if (!storageAvailable || !autosaveEnabled.current) return;
    try {
      const saved = saveLocalState(window.localStorage, localState);
      if (!saved.saved) setStorageAvailable(false);
    } catch {
      setStorageAvailable(false);
    }
  }, [localState, storageAvailable]);

  function updateState(updater: (state: LocalAppStateV1) => LocalAppStateV1) {
    autosaveEnabled.current = true;
    setDeletionStatus(null);
    setLocalState((state) => {
      const updated = updater(state);
      return { ...updated, assessmentAnswers: canonicalizeAnswers(updated.assessmentAnswers) };
    });
  }

  function setSingleAnswer(value: string) {
    updateState((state) => ({
      ...state,
      assessmentAnswers: replaceAnswer(state.assessmentAnswers, currentId, value),
      lastUpdatedAt: todayIso(),
    }));
  }

  function toggleMultiple(value: string) {
    const current = (answers.previous_attempts ?? []) as readonly string[];
    let next: string[];
    if (value === 'nothing_yet' || value === 'not_sure') {
      next = current.length === 1 && current[0] === value ? [] : [value];
    } else {
      const withoutExclusive = current.filter(
        (item) => item !== 'nothing_yet' && item !== 'not_sure',
      );
      next = withoutExclusive.includes(value)
        ? withoutExclusive.filter((item) => item !== value)
        : [...withoutExclusive, value];
    }
    updateState((state) => ({
      ...state,
      assessmentAnswers: replaceAnswer(state.assessmentAnswers, currentId, next),
      lastUpdatedAt: todayIso(),
    }));
  }

  function continueFlow() {
    setShowWhy(false);
    if (step < path.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    const decision = evaluateAssessment(answers);
    updateState((state) => ({
      ...state,
      selectedExperimentId: decision.experimentId,
      experimentStartDate: state.experimentStartDate ?? todayIso(),
      lastUpdatedAt: todayIso(),
    }));
    setView('result');
  }

  function goBack() {
    setShowWhy(false);
    if (step === 0) setView('intro');
    else setStep((value) => value - 1);
  }

  function startOver() {
    autosaveEnabled.current = true;
    const fresh = createEmptyLocalState();
    setLocalState({ ...fresh, uiPreferences: localState.uiPreferences });
    setStep(0);
    setView('question');
    setRestored(false);
  }

  function deleteData() {
    const outcome = deleteLocalState(window.localStorage);
    if (!outcome.deleted) {
      setDeletionStatus('failed');
      return;
    }
    autosaveEnabled.current = false;
    setLocalState(outcome.freshState);
    setStep(0);
    setView('intro');
    setRestored(false);
    setDeletionStatus('deleted');
    setAcceptsPremiumTradeoffs(false);
    setCheckInDraft(createMorningCheckInDraft(1));
  }

  function toggleTheme() {
    updateState((state) => ({
      ...state,
      uiPreferences: { lowBrightness: !state.uiPreferences.lowBrightness },
      lastUpdatedAt: todayIso(),
    }));
  }

  function saveCheckIn(event: Event) {
    event.preventDefault();
    const completed = finalizeMorningCheckInDraft(checkInDraft);
    if (!completed) {
      setCheckInError(true);
      return;
    }
    setCheckInError(false);
    autosaveEnabled.current = true;
    setDeletionStatus(null);
    const remaining = localState.morningCheckIns.filter(
      (entry) => entry.night !== checkInDraft.night,
    );
    const updated: LocalAppStateV1 = {
      ...localState,
      assessmentAnswers: canonicalizeAnswers(localState.assessmentAnswers),
      morningCheckIns: [...remaining, completed].sort((a, b) => a.night - b.night),
      lastUpdatedAt: todayIso(),
    };

    // Persist before confirming the check-in in the UI. This avoids losing a
    // completed morning entry if the user refreshes or closes the tab at once.
    if (storageAvailable) {
      const saved = saveLocalState(window.localStorage, updated);
      setLocalState(saved.state);
      if (!saved.saved) setStorageAvailable(false);
    } else {
      setLocalState(updated);
    }
  }

  function printDocument(mode: 'plan' | 'appointment') {
    document.documentElement.dataset.printMode = mode;
    window.print();
  }

  const selected = answers[currentId];
  const completionReady = answerExists(answers, currentId);

  return (
    <section class={`assessment ${embedded ? 'embedded' : ''}`} aria-label="Night heat check">
      <div class="tool-utilities no-print">
        <button
          class="text-button"
          type="button"
          onClick={toggleTheme}
          aria-pressed={localState.uiPreferences.lowBrightness}
        >
          {localState.uiPreferences.lowBrightness
            ? embedded
              ? 'Light view'
              : 'Use light view'
            : embedded
              ? 'Low-brightness'
              : 'Use low-brightness view'}
        </button>
        <a href="/privacy/">{embedded ? 'Storage & privacy' : 'How storage works'}</a>
        <button class="text-button danger" type="button" onClick={deleteData}>
          {embedded ? 'Delete data' : 'Delete local data'}
        </button>
      </div>

      {!storageAvailable && (
        <p class="storage-warning" role="status">
          Your browser blocked local storage. The assessment still works now, but it cannot
          restore after refresh.
        </p>
      )}
      {deletionStatus === 'deleted' && (
        <p class="storage-warning" role="status">
          Local assessment data was deleted from this browser.
        </p>
      )}
      {deletionStatus === 'failed' && (
        <p class="storage-warning" role="alert">
          We couldn’t delete everything. Your plan is still on this device. Use your browser’s
          site-data settings to remove it.
        </p>
      )}

      {view === 'intro' && (
        <div class="intro-panel">
          <p class="eyebrow">About two minutes · one question at a time</p>
          <h2>Find one thing to change tonight.</h2>
          <p>
            We’ll ask about the room, bed, when the heat started, dampness, and your partner.
            Then we’ll suggest one small change to try tonight.
          </p>
          {context && <p class="context-note">{contextCopy[context]}</p>}
          <p class="trust">
            No account or name. We don’t send your answers to us or anyone else. Your plan stays
            in this browser unless you print it.
          </p>
          <p class="boundary-short">
            This cannot identify the medical cause of night sweats.{' '}
            <a href="/medical-boundaries/">Read the boundary</a>.
          </p>
          {restored && (
            <p role="status">A private plan from this browser is available to continue.</p>
          )}
          <div class="actions">
            <button
              class="button"
              type="button"
              onClick={() =>
                setView(restored && localState.selectedExperimentId ? 'result' : 'question')
              }
            >
              {restored ? 'Continue private plan' : 'Start with the first question'}
            </button>
            {restored && (
              <button class="button secondary" type="button" onClick={startOver}>
                Start over
              </button>
            )}
          </div>
        </div>
      )}

      {view === 'question' && (
        <form
          class="question-panel"
          onSubmit={(event) => {
            event.preventDefault();
            continueFlow();
          }}
        >
          <p class="progress" aria-live="polite">
            Question {step + 1} of about {path.length}
          </p>
          <fieldset>
            <legend id="question-heading" ref={headingRef} tabIndex={-1}>
              {question.prompt}
            </legend>
            <button
              class="why-button"
              type="button"
              aria-expanded={showWhy}
              onClick={() => setShowWhy((value) => !value)}
            >
              Why this matters
            </button>
            {showWhy && <p class="why-copy">{question.whyItMatters}</p>}
            <div class="answer-list">
              {question.options.map((option) => {
                const checked =
                  question.answerKind === 'multiple'
                    ? Array.isArray(selected) && selected.includes(option.value as never)
                    : selected === option.value;
                return (
                  <label class={`answer-card ${checked ? 'selected' : ''}`} key={option.value}>
                    <input
                      type={question.answerKind === 'multiple' ? 'checkbox' : 'radio'}
                      name={question.id}
                      value={option.value}
                      checked={checked}
                      onChange={() =>
                        question.answerKind === 'multiple'
                          ? toggleMultiple(option.value)
                          : setSingleAnswer(option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {!completionReady && (
            <p class="choice-hint" role="status">
              Choose the closest answer. It’s fine if you’re not sure.
            </p>
          )}
          <div class="question-actions">
            <button class="button secondary" type="button" onClick={goBack}>
              Back
            </button>
            <button class="button" type="submit" disabled={!completionReady}>
              {step === path.length - 1 ? 'Build my plan' : 'Continue'}
            </button>
          </div>
        </form>
      )}

      {view === 'result' && result && experiment && (
        <div class="result">
          <p class="sr-only" role="status">
            Assessment complete. Your result follows.
          </p>
          <header class="result-summary">
            <p class="eyebrow">{clarityLabels[result.clarity]}</p>
            <h2 id="result-heading" tabIndex={-1}>
              {result.explanation.title}
            </h2>
            <p class="result-lede">{result.explanation.interpretation}</p>
            <h3>What you told us</h3>
            <ul>
              {result.explanation.clues.slice(0, 4).map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ul>
          </header>

          <aside class="not-meaning">
            <h3>What this does not mean</h3>
            <p>{result.explanation.doesNotEstablish}</p>
            {result.explanation.uncertainty.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </aside>

          <section class="experiment-card" aria-labelledby="experiment-heading">
            <p class="eyebrow">One Change Tonight</p>
            <h3 id="experiment-heading">{experiment.plainLanguageName}</h3>
            <p class="change">
              <strong>Tonight:</strong> {experiment.oneVariableToChange}
            </p>
            <div class="result-grid">
              <div>
                <h4>Keep the same</h4>
                <ul>
                  {experiment.keepConstant.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>What to do</h4>
                <ol>
                  {experiment.steps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
            <h4>In the morning, note</h4>
            <ul>
              {experiment.whatToRecord.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>Stop if</h4>
            <ul>
              {experiment.stopConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p class="safety-note">{experiment.safetyNote}</p>
          </section>

          <section class="do-not-buy">
            <p class="eyebrow">{result.doNotBuy.title}</p>
            <p>{result.doNotBuy.body}</p>
          </section>

          {result.modifiers.includes('one_sided_solution_needed') && (
            <section class="partner-split">
              <h3>Build a plan for both sides of the bed</h3>
              <dl class="partner-needs">
                <div>
                  <dt>For the cooler sleeper</dt>
                  <dd>Keep the room comfortable and use warmer covers on their side.</dd>
                </div>
                <div>
                  <dt>What can be separated first</dt>
                  <dd>
                    Top covers, airflow, or another reversible change on the warmer side only.
                  </dd>
                </div>
                <div>
                  <dt>What remains shared</dt>
                  <dd>
                    Room conditions and any setup whose sound, airflow, or maintenance affects
                    both sleepers.
                  </dd>
                </div>
                <div>
                  <dt>Try this first</dt>
                  <dd>
                    Use separate existing covers or a cooling step you already use safely before
                    comparing powered equipment.
                  </dd>
                </div>
              </dl>
              <p>
                You and your partner may need different covers or airflow. Start with changes
                you can keep to one side.
              </p>
              <a href="/guides/how-to-cool-one-side-of-a-bed/">See ways to cool one side</a>
            </section>
          )}

          <section class="premium-fit">
            <h3>Should you compare powered bed cooling?</h3>
            <p>
              <strong>{premiumLabels[result.premiumFit.fit]}.</strong>
            </p>
            <ul>
              {result.premiumFit.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <p>{result.premiumFit.caveat}</p>
            {(result.premiumFit.fit === 'active_one_sided_system_may_be_worth_comparing' ||
              acceptsPremiumTradeoffs) && (
              <label class="tradeoff-choice">
                <input
                  type="checkbox"
                  checked={acceptsPremiumTradeoffs}
                  onChange={(event) => setAcceptsPremiumTradeoffs(event.currentTarget.checked)}
                />
                <span>
                  I’m open to comparing noise, cleaning, upkeep, complexity, and cost.
                </span>
              </label>
            )}
            <a href="/compare/">Compare cooling approaches</a>
          </section>

          <section class="tracker" aria-labelledby="tracker-heading">
            <h3 id="tracker-heading">Your three-night check</h3>
            <p>
              Night 1 → Night 2 → Night 3 → Compare. This is a short comfort check, not a
              medical score.
            </p>
            <div class="timeline" aria-label="Three-night progress">
              {[1, 2, 3].map((night) => (
                <span
                  class={
                    localState.morningCheckIns.some((entry) => entry.night === night)
                      ? 'done'
                      : ''
                  }
                  key={night}
                >
                  Night {night}
                </span>
              ))}
              <span class={localState.morningCheckIns.length === 3 ? 'done' : ''}>Compare</span>
            </div>
            {localState.morningCheckIns.length < 3 && (
              <form class="check-in" onSubmit={saveCheckIn}>
                <h4>Morning check-in: night {checkInDraft.night}</h4>
                <p class="trust">Saved in this browser only.</p>
                {checkInError && (
                  <p class="choice-hint" role="alert">
                    Choose a response for every field, including “Unsure” or “Not applicable”
                    where offered. Nothing was saved.
                  </p>
                )}
                {Object.entries(morningOptions).map(([key, options]) => (
                  <label key={key}>
                    <span>{morningLabels[key as keyof typeof morningLabels]}</span>
                    <select
                      aria-invalid={
                        checkInError &&
                        checkInDraft[key as keyof MorningCheckInDraft] === CHECK_IN_NOT_RECORDED
                      }
                      value={String(checkInDraft[key as keyof MorningCheckInDraft])}
                      onChange={(event) =>
                        setCheckInDraft({
                          ...checkInDraft,
                          [key]: event.currentTarget.value,
                        } as MorningCheckInDraft)
                      }
                    >
                      {options.map(([value, label], index) => (
                        <option value={value} key={value} disabled={index === 0}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <button class="button" type="submit">
                  Save night {checkInDraft.night}
                </button>
              </form>
            )}
            {localState.morningCheckIns.length > 0 && (
              <div class="checkin-summary">
                <h4>Night-by-night notes</h4>
                {localState.morningCheckIns.map((entry) => (
                  <p key={entry.night}>
                    <strong>Night {entry.night}:</strong> {formatMorningCheckIn(entry)}.
                  </p>
                ))}
                <p>
                  <strong>Did it help?</strong>{' '}
                  {localState.morningCheckIns.some(
                    (entry) =>
                      entry.experimentHelp === 'clearly' || entry.experimentHelp === 'somewhat',
                  )
                    ? 'You rated the change “somewhat” or “clearly” helpful on at least one night.'
                    : 'You have not recorded a clear improvement yet.'}
                </p>
                <p>
                  <strong>What still happened?</strong> Check the notes above for awakenings,
                  dampness, or feeling cold afterward.
                </p>
                <p>
                  <strong>Did the result repeat?</strong>{' '}
                  {localState.morningCheckIns.length < 2
                    ? 'Record another night before comparing.'
                    : new Set(localState.morningCheckIns.map((entry) => entry.experimentHelp))
                          .size === 1
                      ? 'You gave the same help rating on each recorded night.'
                      : 'Your help rating changed across nights.'}
                </p>
                {localState.morningCheckIns.length === 3 && (
                  <p>
                    <strong>What to try next:</strong>{' '}
                    {localState.morningCheckIns.some(
                      (entry) =>
                        entry.experimentHelp === 'clearly' ||
                        entry.experimentHelp === 'somewhat',
                    )
                      ? experiment.nextIfHelps
                      : experiment.nextIfNot}
                  </p>
                )}
              </div>
            )}
          </section>

          {result.careReminder.show && (
            <aside class="care-reminder">
              <h3>Keep healthcare in the plan</h3>
              <p>{result.careReminder.message}</p>
            </aside>
          )}

          <section class="appointment-notes">
            <h3>Appointment note</h3>
            <p>
              Tool summary: {result.explanation.title}. This describes the sleep environment,
              not a diagnosis.
            </p>
            <p>
              Sleep disruption:{' '}
              {answers.frequency ? frequencyDisplayLabels[answers.frequency] : 'Not answered'}.
              New or getting worse:{' '}
              {answers.change_status
                ? changeStatusDisplayLabels[answers.change_status]
                : 'Not answered'}
              .
            </p>
            <p>
              You can bring this note to an appointment. A qualified healthcare professional can
              decide which history, examination, or tests may matter.
            </p>
          </section>

          <div class="result-actions no-print">
            <button class="button" type="button" onClick={() => printDocument('plan')}>
              Print plan
            </button>
            <button
              class="button secondary"
              type="button"
              onClick={() => printDocument('appointment')}
            >
              Print appointment notes
            </button>
            <button class="text-button" type="button" onClick={startOver}>
              Start over
            </button>
          </div>
          <p class="storage-explanation">
            Your answers and check-ins stay only in this browser for up to 90 days. Delete local
            data to remove them now.
          </p>
        </div>
      )}
    </section>
  );
}
