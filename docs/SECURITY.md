# Security

The release is static and accountless. There is no application database, authentication surface, assessment API, form endpoint, service worker, third-party script, remote font, or runtime AI. A dependency-free server exposes only files under `dist` and rejects path traversal.

Headers include a restrictive Content Security Policy with `connect-src 'none'`, frame protection, MIME sniffing protection, strict referrer policy, a restrictive Permissions Policy, and transport-security readiness. Inline scripts are limited to first-party JSON-LD and Astro island bootstrapping; there is no inline third-party code. External links use safe new-tab behavior where applicable.

Secrets and environment files are ignored. CI installs from the lockfile, runs static validation and tests, and uses least-privilege repository permissions. Dependency findings are reviewed rather than auto-fixed across majors. Security reports should contain URLs and reproduction steps, not personal health data.
