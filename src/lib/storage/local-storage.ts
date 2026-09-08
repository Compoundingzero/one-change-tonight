import {
  createEmptyLocalState,
  isLocalStateExpired,
  migrateLocalState,
  sanitizeLocalState,
  type LocalAppStateV1,
} from './state';

export const LOCAL_STORAGE_KEY = 'one-change-tonight:state:v1';
export const LEGACY_LOCAL_STORAGE_KEYS = [
  'one-change-tonight:state',
  'one-change-tonight:state:v0',
] as const;
export const AUXILIARY_LOCAL_STORAGE_KEYS = ['one-change-tonight:awake-note:v1'] as const;

export interface StorageLike {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface SaveLocalStateResult {
  readonly saved: boolean;
  readonly state: LocalAppStateV1;
}

export interface DeleteLocalStateResult {
  readonly deleted: boolean;
  /** Replace any in-memory state with this value immediately after deletion. */
  readonly freshState: LocalAppStateV1;
}

function safelyRemove(storage: StorageLike, key: string): boolean {
  try {
    storage.removeItem(key);
    return storage.getItem(key) === null;
  } catch {
    return false;
  }
}

export function loadLocalState(
  storage: StorageLike,
  now: Date = new Date(),
): LocalAppStateV1 | null {
  try {
    const currentRaw = storage.getItem(LOCAL_STORAGE_KEY);
    const legacyEntry = LEGACY_LOCAL_STORAGE_KEYS.map((key) => ({
      key,
      value: storage.getItem(key),
    })).find((entry) => entry.value !== null);
    const raw = currentRaw ?? legacyEntry?.value ?? null;
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    const state = migrateLocalState(parsed);

    if (!state || isLocalStateExpired(state, now)) {
      safelyRemove(storage, LOCAL_STORAGE_KEY);
      for (const key of LEGACY_LOCAL_STORAGE_KEYS) safelyRemove(storage, key);
      return null;
    }

    if (currentRaw === null) {
      const serialized = JSON.stringify(state);
      storage.setItem(LOCAL_STORAGE_KEY, serialized);
      // Preserve the only recoverable copy if a privacy mode silently rejects
      // migration writes. A later successful load can migrate it again.
      if (storage.getItem(LOCAL_STORAGE_KEY) === serialized) {
        for (const key of LEGACY_LOCAL_STORAGE_KEYS) safelyRemove(storage, key);
      }
    } else {
      // A valid current record wins. Remove stale legacy copies when both
      // generations coexist so old health-adjacent state is not retained.
      for (const key of LEGACY_LOCAL_STORAGE_KEYS) safelyRemove(storage, key);
    }

    return state;
  } catch {
    safelyRemove(storage, LOCAL_STORAGE_KEY);
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) safelyRemove(storage, key);
    return null;
  }
}

export function saveLocalState(
  storage: StorageLike,
  state: LocalAppStateV1,
  now: Date = new Date(),
): SaveLocalStateResult {
  const sanitized = sanitizeLocalState(state, now) ?? createEmptyLocalState(now);
  try {
    const serialized = JSON.stringify(sanitized);
    storage.setItem(LOCAL_STORAGE_KEY, serialized);
    return { saved: storage.getItem(LOCAL_STORAGE_KEY) === serialized, state: sanitized };
  } catch {
    return { saved: false, state: sanitized };
  }
}

export function deleteLocalState(
  storage: StorageLike,
  now: Date = new Date(),
): DeleteLocalStateResult {
  let deleted = safelyRemove(storage, LOCAL_STORAGE_KEY);
  for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
    deleted = safelyRemove(storage, key) && deleted;
  }
  for (const key of AUXILIARY_LOCAL_STORAGE_KEYS) {
    deleted = safelyRemove(storage, key) && deleted;
  }

  return {
    deleted,
    freshState: createEmptyLocalState(now),
  };
}
