import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    // Browser-like server tests can share constrained CI hosts with Astro and
    // Playwright setup. Keep assertions deterministic without inheriting the
    // unusually short five-second default per-test deadline.
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
});
