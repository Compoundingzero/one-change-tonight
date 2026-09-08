import { defineConfig, devices } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  ...(externalBaseUrl
    ? {}
    : {
        webServer: {
          // Astro 7 may daemonize `astro dev` in non-interactive runners. Exercise the
          // generated static artifact through the same server used by Railway instead.
          command: 'pnpm build && pnpm start',
          url: 'http://127.0.0.1:4321',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: { PUBLIC_DEPLOY_CONTEXT: 'preview' },
        },
      }),
  projects: [
    {
      name: 'chromium',
      testMatch: /(app|performance|visual)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
