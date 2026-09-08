# Privacy architecture

## Data boundary

Assessment answers, pattern results, experiment selection, experiment start date, up to three morning check-ins, and low-brightness preference stay in `localStorage`. No account, name, email, exact birth date, address, income, diagnosis, medication, or free-text health history is requested. No answer is placed in a URL, server request, log, analytics event, error-report payload, print service, advertising pixel, or session-replay tool.

The stored object is an allowlisted `schemaVersion: 1` shape. Unknown properties are discarded, supported v0 data is migrated, malformed data is discarded, and records expire 90 days after `lastUpdatedAt`. Successful writes are read back before the interface reports them as saved; if a privacy mode silently declines a migration write, the recoverable legacy copy is retained instead of being erased. When a valid current record already exists, stale legacy copies are removed. The awake shortcut stores only a generic reminder, never shortcut answers. “Delete my local data” removes the current state, legacy state keys, the auxiliary reminder, and replaces in-memory state immediately; deleted records are not restored.

## Network controls

The assessment and tracker contain no `fetch`, XHR, beacon, form action, or third-party SDK. Analytics is false by default and no provider is installed. Response CSP sets `connect-src 'none'`, limiting exfiltration even if incidental client code were introduced. Automated source scanning and Playwright interception verify the promise.

## Future change gate

Any telemetry proposal requires a documented data map, purpose, retention, processor review, consent/legal review where applicable, new network and deletion tests, privacy-copy update, and explicit owner decision. Aggregate events must never contain an answer, pattern, frequency, partner state, experiment, health text, or stable cross-site identifier.
