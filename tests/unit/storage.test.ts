import { describe, expect, it } from 'vitest';

import {
  AUXILIARY_LOCAL_STORAGE_KEYS,
  LEGACY_LOCAL_STORAGE_KEYS,
  LOCAL_STORAGE_KEY,
  CHECK_IN_NOT_RECORDED,
  createMorningCheckInDraft,
  createEmptyLocalState,
  deleteLocalState,
  finalizeMorningCheckInDraft,
  loadLocalState,
  saveLocalState,
  type LocalAppStateV1,
  type StorageLike,
} from '../../src/lib/storage';

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class ThrowingRemoveStorage extends MemoryStorage {
  readonly attemptedRemovals: string[] = [];

  constructor(private readonly failingKey: string) {
    super();
  }

  override removeItem(key: string): void {
    this.attemptedRemovals.push(key);
    if (key === this.failingKey) throw new Error('Removal blocked');
    super.removeItem(key);
  }
}

class NoOpRemoveStorage extends MemoryStorage {
  constructor(private readonly ignoredKey: string) {
    super();
  }

  override removeItem(key: string): void {
    if (key === this.ignoredKey) return;
    super.removeItem(key);
  }
}

class NoOpSetStorage extends MemoryStorage {
  override setItem(key: string, value: string): void {
    // Some privacy modes expose the API but silently decline writes.
    if (key === LOCAL_STORAGE_KEY) return;
    super.setItem(key, value);
  }
}

const NOW = new Date('2026-09-07T08:00:00.000Z');

function completeState(): LocalAppStateV1 {
  return {
    schemaVersion: 1,
    assessmentAnswers: {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      frequency: 'five_or_more_nights',
    },
    selectedExperimentId: 'local_comfort_during_episode',
    experimentStartDate: '2026-09-07T00:00:00.000Z',
    morningCheckIns: [
      {
        night: 1,
        date: '2026-09-07T07:00:00.000Z',
        heatRelatedAwakenings: '1',
        moisture: 'damp',
        becameColdAfterwards: 'slightly',
        timeToComfort: '10_to_30_minutes',
        partnerDisturbed: 'no',
        experimentHelp: 'somewhat',
        continueExperiment: 'yes',
      },
    ],
    uiPreferences: { lowBrightness: true },
    lastUpdatedAt: NOW.toISOString(),
  };
}

describe('local state', () => {
  it('round-trips only the approved local schema', () => {
    const storage = new MemoryStorage();
    const input = completeState() as LocalAppStateV1 & {
      name?: string;
      medicalDiagnosis?: string;
    };
    input.name = 'must not persist';
    input.medicalDiagnosis = 'must not persist';

    const saved = saveLocalState(storage, input, NOW);
    const raw = storage.getItem(LOCAL_STORAGE_KEY) ?? '';
    const restored = loadLocalState(storage, NOW);

    expect(saved.saved).toBe(true);
    expect(restored).toEqual(saved.state);
    expect(raw).not.toContain('must not persist');
    expect(raw).not.toContain('medicalDiagnosis');
  });

  it('keeps not-recorded values in drafts and out of persisted check-ins', () => {
    const draft = createMorningCheckInDraft(1, NOW);

    expect(draft).toEqual({
      night: 1,
      date: NOW.toISOString(),
      heatRelatedAwakenings: CHECK_IN_NOT_RECORDED,
      moisture: CHECK_IN_NOT_RECORDED,
      becameColdAfterwards: CHECK_IN_NOT_RECORDED,
      timeToComfort: CHECK_IN_NOT_RECORDED,
      partnerDisturbed: CHECK_IN_NOT_RECORDED,
      experimentHelp: CHECK_IN_NOT_RECORDED,
      continueExperiment: CHECK_IN_NOT_RECORDED,
    });
    expect(finalizeMorningCheckInDraft(draft)).toBeNull();

    const completed = finalizeMorningCheckInDraft({
      ...draft,
      heatRelatedAwakenings: '0',
      moisture: 'dry',
      becameColdAfterwards: 'no',
      timeToComfort: 'under_10_minutes',
      partnerDisturbed: 'not_applicable',
      experimentHelp: 'unsure',
      continueExperiment: 'unsure',
    });
    expect(completed).not.toBeNull();
    expect(JSON.stringify(completed)).not.toContain(CHECK_IN_NOT_RECORDED);
  });

  it('rejects not-recorded values in persisted completed state', () => {
    const storage = new MemoryStorage();
    const state = completeState();
    storage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        ...state,
        morningCheckIns: [
          {
            ...state.morningCheckIns[0],
            moisture: CHECK_IN_NOT_RECORDED,
          },
        ],
      }),
    );

    expect(loadLocalState(storage, NOW)).toBeNull();
    expect(storage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it('migrates the supported v0 shape and removes the legacy key', () => {
    const storage = new MemoryStorage();
    const legacyKey = LEGACY_LOCAL_STORAGE_KEYS[0];
    storage.setItem(
      legacyKey,
      JSON.stringify({
        version: 0,
        answers: { wake_experience: 'bed_became_hotter' },
        experimentId: 'change_one_bed_layer',
        experimentStartDate: '2026-09-06T08:00:00.000Z',
        checkIns: [],
        preferences: { lowBrightness: true },
        updatedAt: '2026-09-06T08:00:00.000Z',
      }),
    );

    const restored = loadLocalState(storage, NOW);

    expect(restored?.schemaVersion).toBe(1);
    expect(restored?.assessmentAnswers.wake_experience).toBe('bed_became_hotter');
    expect(storage.getItem(legacyKey)).toBeNull();
    expect(storage.getItem(LOCAL_STORAGE_KEY)).not.toBeNull();
  });

  it('removes every legacy key after a successful migration', () => {
    const storage = new MemoryStorage();
    const legacy = JSON.stringify({
      version: 0,
      answers: { wake_experience: 'bed_became_hotter' },
      checkIns: [],
      preferences: { lowBrightness: false },
      updatedAt: '2026-09-06T08:00:00.000Z',
    });
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) storage.setItem(key, legacy);

    expect(loadLocalState(storage, NOW)?.schemaVersion).toBe(1);
    expect(storage.getItem(LOCAL_STORAGE_KEY)).not.toBeNull();
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
      expect(storage.getItem(key)).toBeNull();
    }
  });

  it('removes stale legacy copies when a valid current record already exists', () => {
    const storage = new MemoryStorage();
    saveLocalState(storage, completeState(), NOW);
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) storage.setItem(key, '{"version":0}');

    expect(loadLocalState(storage, NOW)).toEqual(completeState());
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
      expect(storage.getItem(key)).toBeNull();
    }
  });

  it('reports a failed save when storage silently declines the write', () => {
    const storage = new NoOpSetStorage();

    const saved = saveLocalState(storage, completeState(), NOW);

    expect(saved.saved).toBe(false);
    expect(storage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it('retains a legacy record when its migration write is silently declined', () => {
    const storage = new NoOpSetStorage();
    const legacyKey = LEGACY_LOCAL_STORAGE_KEYS[0];
    storage.setItem(
      legacyKey,
      JSON.stringify({
        version: 0,
        answers: { wake_experience: 'bed_became_hotter' },
        checkIns: [],
        preferences: { lowBrightness: false },
        updatedAt: '2026-09-06T08:00:00.000Z',
      }),
    );

    expect(loadLocalState(storage, NOW)?.schemaVersion).toBe(1);
    expect(storage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(legacyKey)).not.toBeNull();
  });

  it('drops corrupted and expired state instead of restoring it', () => {
    const corrupted = new MemoryStorage();
    corrupted.setItem(LOCAL_STORAGE_KEY, '{bad json');
    expect(loadLocalState(corrupted, NOW)).toBeNull();
    expect(corrupted.getItem(LOCAL_STORAGE_KEY)).toBeNull();

    const expired = new MemoryStorage();
    const old = completeState();
    expired.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...old, lastUpdatedAt: '2026-05-01T00:00:00.000Z' }),
    );
    expect(loadLocalState(expired, NOW)).toBeNull();
    expect(expired.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it('deletes current and legacy state and returns a fresh in-memory replacement', () => {
    const storage = new MemoryStorage();
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completeState()));
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) storage.setItem(key, '{}');
    for (const key of AUXILIARY_LOCAL_STORAGE_KEYS) storage.setItem(key, '{}');

    const deletion = deleteLocalState(storage, NOW);

    expect(deletion.deleted).toBe(true);
    expect(storage.length).toBe(0);
    expect(deletion.freshState).toEqual(createEmptyLocalState(NOW));
    expect(loadLocalState(storage, NOW)).toBeNull();
  });

  it('reports a failed deletion and still attempts every other key', () => {
    const failingKey = LEGACY_LOCAL_STORAGE_KEYS[0];
    const storage = new ThrowingRemoveStorage(failingKey);
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completeState()));
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) storage.setItem(key, '{}');
    for (const key of AUXILIARY_LOCAL_STORAGE_KEYS) storage.setItem(key, '{}');

    const deletion = deleteLocalState(storage, NOW);

    expect(deletion.deleted).toBe(false);
    expect(storage.getItem(failingKey)).not.toBeNull();
    expect(storage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(LEGACY_LOCAL_STORAGE_KEYS[1])).toBeNull();
    expect(storage.getItem(AUXILIARY_LOCAL_STORAGE_KEYS[0])).toBeNull();
    expect(storage.attemptedRemovals).toEqual([
      LOCAL_STORAGE_KEY,
      ...LEGACY_LOCAL_STORAGE_KEYS,
      ...AUXILIARY_LOCAL_STORAGE_KEYS,
    ]);
  });

  it('reports deletion failure when storage silently keeps a key', () => {
    const storage = new NoOpRemoveStorage(LOCAL_STORAGE_KEY);
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completeState()));

    const deletion = deleteLocalState(storage, NOW);

    expect(deletion.deleted).toBe(false);
    expect(storage.getItem(LOCAL_STORAGE_KEY)).not.toBeNull();
  });
});
