import { useState } from 'preact/hooks';
import { deleteLocalState } from '@/lib/storage';

export default function DeleteLocalDataControl() {
  const [status, setStatus] = useState<'deleted' | 'failed' | null>(null);

  function removeData() {
    try {
      const outcome = deleteLocalState(window.localStorage);
      setStatus(outcome.deleted ? 'deleted' : 'failed');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div class="local-delete">
      <button class="button secondary" type="button" onClick={removeData}>
        Delete One Change Tonight data
      </button>
      {status === 'deleted' && (
        <p role="status">
          Assessment answers, the plan, check-ins, preferences, and shortcut note were removed
          from this browser.
        </p>
      )}
      {status === 'failed' && (
        <p role="alert">
          This browser did not allow complete deletion. Use its site-data controls before
          leaving this device.
        </p>
      )}
    </div>
  );
}
