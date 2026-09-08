import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function assertNoSeriousOrCritical(page: Page, label: string) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(
    blocking,
    `${label}: ${blocking.map((item) => `${item.id} (${item.nodes.length})`).join(', ')}`,
  ).toEqual([]);
}

async function waitForHydration(page: Page) {
  const island = page.locator('astro-island').first();
  if (await island.count()) {
    await expect
      .poll(() => island.evaluate((element) => element.hasAttribute('ssr')))
      .toBe(false);
  }
}

async function checkQuestionAndContinue(page: Page, label: string, answer: string) {
  await assertNoSeriousOrCritical(page, label);
  await page.getByLabel(answer, { exact: true }).check();
  await page.getByRole('button', { name: /Continue|Build my plan/ }).click();
}

test('every common, sudden, and optional question plus result and tracker has no serious/critical axe issue', async ({
  page,
}) => {
  await page.goto('/tool/');
  await waitForHydration(page);
  await assertNoSeriousOrCritical(page, 'tool intro');
  await page.getByRole('button', { name: 'Start with the first question' }).click();
  await checkQuestionAndContinue(page, 'wake experience', 'A sudden wave of heat woke me');
  await checkQuestionAndContinue(page, 'co-sleeper state', 'My partner was cold');
  await checkQuestionAndContinue(page, 'heat location', 'In my upper body, face, or chest');
  await assertNoSeriousOrCritical(page, 'previous attempts');
  await page.getByLabel('Nothing yet', { exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await checkQuestionAndContinue(page, 'frequency', 'One or two nights a week');
  await checkQuestionAndContinue(page, 'change status', 'No');
  await checkQuestionAndContinue(page, 'after episode', 'I became comfortable');
  await checkQuestionAndContinue(page, 'noise sensitivity', 'Some sound is okay');
  await assertNoSeriousOrCritical(page, 'result and tracker');
});

test('whole-room conditional question has no serious/critical axe issue', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await checkQuestionAndContinue(
    page,
    'wake experience whole-room route',
    'The whole bedroom felt hot',
  );
  await checkQuestionAndContinue(
    page,
    'co-sleeper whole-room route',
    'My partner was also hot',
  );
  await checkQuestionAndContinue(
    page,
    'location whole-room route',
    'Throughout the entire room',
  );
  await page.getByLabel('Lower thermostat', { exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await checkQuestionAndContinue(page, 'frequency whole-room route', 'Less than once a week');
  await checkQuestionAndContinue(page, 'change status whole-room route', 'No');
  await assertNoSeriousOrCritical(page, 'whole-room cooling effect');
});

for (const [label, path] of [
  ['homepage', '/'],
  ['comparison', '/compare/air-vs-water-bed-cooling/'],
  ['search article', '/why/waking-sweaty-in-a-cold-room/'],
  ['awake shortcut', '/awake-and-hot/'],
  ['privacy', '/privacy/'],
] as const) {
  test(`${label} has no serious/critical axe issue`, async ({ page }) => {
    await page.goto(path);
    await waitForHydration(page);
    await assertNoSeriousOrCritical(page, label);
  });
}
