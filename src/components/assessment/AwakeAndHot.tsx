import { useState } from 'preact/hooks';
import './awake.css';

type Room = 'whole_room' | 'mainly_me' | 'unsure';
type Partner = 'also_hot' | 'comfortable_or_cold' | 'alone_or_unsure';
type Timing = 'sudden' | 'gradual' | 'unsure';

export default function AwakeAndHot() {
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'failed' | null>(null);

  const roomAction =
    room === 'whole_room' && partner === 'also_hot'
      ? 'Make one small room or ventilation change you already use safely.'
      : room === 'whole_room'
        ? 'Don’t cool the whole room much more. Try one small change on your side.'
        : room === 'mainly_me'
          ? 'Leave the room as it is. Use one cooling step you already use safely, on your side only.'
          : 'Don’t change the whole room yet. Use one cooling step you already use safely, then notice whether the room feels hot too.';
  const partnerAction =
    partner === 'also_hot'
      ? 'Leave bedding and personal cooling unchanged tonight so you can tell whether your one change helped.'
      : partner === 'comfortable_or_cold'
        ? 'Leave the other sleeper’s side as it is. Keep your change on your side.'
        : 'Leave the rest of your sleep setup as it is.';
  const timingAction =
    timing === 'sudden'
      ? 'Use the change only while the heat is present, then stop before you become too cold.'
      : timing === 'gradual'
        ? 'If safe, remove only the lightest top layer. Leave everything else as it is.'
        : 'Notice whether the heat passes quickly or builds; do not assume the room explains it.';
  const actions = [roomAction, partnerAction, timingAction];

  function saveMorningNote() {
    try {
      window.localStorage.setItem(
        'one-change-tonight:awake-note:v1',
        JSON.stringify({
          schemaVersion: 1,
          createdAt: new Date().toISOString(),
          note: 'Review the full private assessment in the morning. No personal answer was stored in this shortcut note.',
        }),
      );
      setSaveStatus('saved');
    } catch {
      setSaveStatus('failed');
    }
  }

  const questions = [
    {
      title: 'Is the whole room hot, or mainly you?',
      value: room,
      options: [
        ['whole_room', 'The whole room feels hot'],
        ['mainly_me', 'Mainly I feel hot'],
        ['unsure', 'I’m not sure'],
      ],
      set: setRoom,
    },
    {
      title: 'Is your partner also hot?',
      value: partner,
      options: [
        ['also_hot', 'Yes, also hot'],
        ['comfortable_or_cold', 'Comfortable or cold'],
        ['alone_or_unsure', 'I sleep alone or I’m not sure'],
      ],
      set: setPartner,
    },
    {
      title: 'Did the heat arrive suddenly or gradually?',
      value: timing,
      options: [
        ['sudden', 'Suddenly'],
        ['gradual', 'Gradually'],
        ['unsure', 'I’m not sure'],
      ],
      set: setTiming,
    },
  ] as const;
  const question = questions[Math.min(step, 2)]!;

  if (step >= 3) {
    return (
      <section class="awake-result" aria-live="polite">
        <p class="eyebrow">A small action for right now</p>
        <h2>Try one small change now.</h2>
        <ol>
          {actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
        <p>
          <strong>Stop</strong> if the change makes you too cold, causes breathing irritation,
          feels unsafe, or disturbs either sleeper more than it helps.
        </p>
        <p>
          These steps may make you more comfortable. They cannot explain why the heat happened
          or identify or treat a medical cause.
        </p>
        <div class="awake-actions">
          <button type="button" class="button" onClick={saveMorningNote}>
            Save a reminder for morning
          </button>
          <a class="button secondary" href="/tool/">
            Open the full assessment
          </a>
        </div>
        {saveStatus === 'saved' && <p role="status">Reminder saved in this browser only.</p>}
        {saveStatus === 'failed' && (
          <p role="alert">
            This browser did not allow the reminder to be saved. The comfort steps still work
            without storage.
          </p>
        )}
      </section>
    );
  }

  return (
    <section class="awake-question">
      <p class="progress" aria-live="polite">
        Step {step + 1} of 3
      </p>
      <fieldset>
        <legend>{question.title}</legend>
        <div class="awake-options">
          {question.options.map(([value, label]) => (
            <label class={question.value === value ? 'selected' : ''} key={value}>
              <input
                type="radio"
                name={`awake-${step}`}
                value={value}
                checked={question.value === value}
                onChange={() => question.set(value as never)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div class="awake-nav">
        {step > 0 && (
          <button
            class="button secondary"
            type="button"
            onClick={() => setStep((value) => value - 1)}
          >
            Back
          </button>
        )}
        <button
          class="button"
          type="button"
          disabled={!question.value}
          onClick={() => setStep((value) => value + 1)}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
