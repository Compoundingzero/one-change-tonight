import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const screenshotDir = join(process.cwd(), 'docs/design-research/screenshots/final');
const stateKey = 'one-change-tonight:state:v1';

async function waitForHydration(page: Page) {
  const island = page.locator('astro-island').first();
  if (await island.count()) {
    await expect
      .poll(() => island.evaluate((element) => element.hasAttribute('ssr')))
      .toBe(false);
  }
}

function resultState(answers: Record<string, unknown>, experimentId = 'measure_first') {
  return {
    schemaVersion: 1,
    assessmentAnswers: answers,
    selectedExperimentId: experimentId,
    experimentStartDate: '2026-09-07T08:00:00.000Z',
    morningCheckIns: [],
    uiPreferences: { lowBrightness: false },
    lastUpdatedAt: new Date().toISOString(),
  };
}

async function choose(page: Page, label: string) {
  await page.getByLabel(label, { exact: true }).check();
  await page.getByRole('button', { name: /Continue|Build my plan/ }).click();
}

async function completeCheckIn(page: Page, night: 1 | 2 | 3) {
  await page.getByLabel('Heat-related awakenings').selectOption(night === 1 ? '1' : '0');
  await page.getByLabel('How damp were you?').selectOption(night === 1 ? 'damp' : 'dry');
  await page
    .getByLabel('Did you become cold afterward?')
    .selectOption(night === 1 ? 'slightly' : 'no');
  await page.getByLabel('Time until comfortable again').selectOption('10_to_30_minutes');
  await page.getByLabel('Was your partner disturbed?').selectOption('no');
  await page
    .getByLabel('Did the change help?')
    .selectOption(night === 3 ? 'clearly' : 'somewhat');
  await page.getByLabel('Try the same change again?').selectOption(night === 3 ? 'no' : 'yes');
  await page.getByRole('button', { name: `Save night ${night}` }).click();
}

test.beforeAll(() => mkdirSync(screenshotDir, { recursive: true }));

test('homepage begins with first value, selection does not auto-advance, and mobile has no overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await waitForHydration(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('still waking hot');
  await expect(
    page.getByRole('group', { name: 'What best describes the moment you woke?' }),
  ).toBeVisible();
  const firstMobileAnswer = await page
    .getByLabel('A sudden wave of heat woke me', { exact: true })
    .boundingBox();
  expect(firstMobileAnswer).not.toBeNull();
  expect((firstMobileAnswer?.y ?? 812) + (firstMobileAnswer?.height ?? 0)).toBeLessThanOrEqual(
    812,
  );
  await page.screenshot({ path: join(screenshotDir, 'first-question.png'), fullPage: true });
  await page.getByLabel('A sudden wave of heat woke me', { exact: true }).check();
  await expect(
    page.getByRole('group', { name: 'What best describes the moment you woke?' }),
  ).toBeVisible();
  await page.screenshot({
    path: join(screenshotDir, 'selected-answer.png'),
    fullPage: true,
    animations: 'disabled',
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('footer').getByRole('link', { name: 'Evidence' })).toBeVisible();
  await page.screenshot({
    path: join(screenshotDir, 'homepage-mobile-375.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await waitForHydration(page);
  const firstDesktopAnswer = await page
    .getByLabel('A sudden wave of heat woke me', { exact: true })
    .boundingBox();
  expect(firstDesktopAnswer).not.toBeNull();
  expect(
    (firstDesktopAnswer?.y ?? 1000) + (firstDesktopAnswer?.height ?? 0),
  ).toBeLessThanOrEqual(1000);

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await waitForHydration(page);
  const firstNarrowAnswer = await page
    .getByLabel('A sudden wave of heat woke me', { exact: true })
    .boundingBox();
  expect(firstNarrowAnswer).not.toBeNull();
  expect((firstNarrowAnswer?.y ?? 700) + (firstNarrowAnswer?.height ?? 0)).toBeLessThanOrEqual(
    700,
  );
});

test('complete assessment, go back, restore, check in, print, theme, start over, and delete all state', async ({
  page,
}) => {
  const requestsAfterLoad: string[] = [];
  await page.goto('/tool/');
  await waitForHydration(page);
  await page.screenshot({ path: join(screenshotDir, 'empty-state.png'), fullPage: true });
  await page.getByRole('button', { name: 'Start with the first question' }).click();
  page.on('request', (request) =>
    requestsAfterLoad.push(`${request.method()} ${request.url()} ${request.postData() ?? ''}`),
  );

  await choose(page, 'A sudden wave of heat woke me');
  await choose(page, 'My partner was cold');
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByLabel('My partner was cold', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'In my upper body, face, or chest');
  await page.getByLabel('Lower thermostat', { exact: true }).check();
  await page.getByLabel('Bedside or room fan', { exact: true }).check();
  await page.getByLabel('Cooling sheets', { exact: true }).check();
  await page.getByLabel('Room cooling made my partner too cold', { exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Five or more nights a week');
  await choose(page, 'Yes');
  await choose(page, 'I became cold or shivery');
  await choose(page, 'Some sound is okay');

  await expect(
    page.getByRole('heading', {
      name: 'The heat may be more local than room-wide',
    }),
  ).toBeVisible();
  await expect(page.locator('#result-heading')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'What this does not mean' })).toBeVisible();
  await expect(page.locator('.experiment-card .eyebrow')).toHaveText('One Change Tonight');
  await expect(
    page.getByText(/You and your partner may need different covers or airflow/),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Keep healthcare in the plan' }),
  ).toBeVisible();
  await expect(page.getByText('Maybe, after simpler tests.')).toBeVisible();
  await page.getByLabel(/open to comparing noise/).check();
  await expect(page.getByText('Worth comparing if the trade-offs work for you.')).toBeVisible();
  expect(requestsAfterLoad).toHaveLength(0);
  await page.screenshot({
    path: join(screenshotDir, 'result-sudden-personal.png'),
    fullPage: true,
  });
  await page.screenshot({ path: join(screenshotDir, 'partner-result.png'), fullPage: true });
  await page.screenshot({
    path: join(screenshotDir, 'frequent-new-worsening-reminder.png'),
    fullPage: true,
  });

  await page.reload();
  await waitForHydration(page);
  await expect(
    page.getByRole('heading', {
      name: 'The heat may be more local than room-wide',
    }),
  ).toBeVisible();
  await expect(page.locator('#result-heading')).toBeFocused();
  await page.screenshot({
    path: join(screenshotDir, 'restored-local-state.png'),
    fullPage: true,
  });
  requestsAfterLoad.length = 0;
  await page.getByRole('button', { name: 'Save night 1' }).click();
  await expect(page.getByText('Nothing was saved.')).toBeVisible();
  await page.screenshot({ path: join(screenshotDir, 'error-state.png'), fullPage: true });
  await completeCheckIn(page, 1);
  await expect(page.getByText('Night 1:', { exact: false })).toBeVisible();
  await page.screenshot({
    path: join(screenshotDir, 'one-completed-night.png'),
    fullPage: true,
  });
  await page.reload();
  await waitForHydration(page);
  await expect(page.getByRole('heading', { name: 'Morning check-in: night 2' })).toBeVisible();
  await completeCheckIn(page, 2);
  await page.reload();
  await waitForHydration(page);
  await expect(page.getByRole('heading', { name: 'Morning check-in: night 3' })).toBeVisible();
  await completeCheckIn(page, 3);
  await expect(page.getByText('Night 3:', { exact: false })).toBeVisible();
  await expect(page.getByText('What to try next:', { exact: false })).toBeVisible();
  await expect(page.getByText(/Night 3:.*Did not become cold afterward/)).toBeVisible();
  await expect(page.getByText(/up to two more nights/i)).toHaveCount(0);
  await page.screenshot({
    path: join(screenshotDir, 'three-night-tracker.png'),
    fullPage: true,
  });

  await page.evaluate(() => {
    window.print = () => undefined;
  });
  await page.getByRole('button', { name: 'Print plan' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'plan');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.result-summary')).toBeVisible();
  await expect(page.locator('.experiment-card')).toBeVisible();
  await expect(page.locator('.care-reminder')).toBeVisible();
  await expect(page.locator('.appointment-notes')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Print appointment notes' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'appointment');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.result-summary')).toBeVisible();
  await expect(page.locator('.appointment-notes')).toBeVisible();
  await expect(page.locator('.experiment-card')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Use low-brightness view' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({
    path: join(screenshotDir, 'mobile-low-brightness.png'),
    fullPage: true,
  });
  await page.evaluate(() => localStorage.setItem('one-change-tonight:awake-note:v1', '{}'));

  expect(requestsAfterLoad.join('\n')).not.toMatch(
    /sudden_wave|partner_cold|five_or_more|local_comfort|health/i,
  );
  const appOrigin = new URL(page.url()).origin;
  expect(requestsAfterLoad.every((entry) => entry.includes(appOrigin))).toBe(true);
  expect(page.url()).not.toMatch(/sudden_wave|partner_cold|five_or_more|local_comfort/);

  await page.getByRole('button', { name: 'Delete local data' }).click();
  await expect(
    page.getByRole('heading', { name: 'Find one thing to change tonight.' }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('one-change-tonight')),
    ),
  ).toEqual([]);

  await page.getByRole('button', { name: 'Start with the first question' }).click();
  await choose(page, 'The whole bedroom felt hot');
  await expect(
    page.getByRole('group', { name: 'How did the room feel to the other sleeper?' }),
  ).toBeVisible();
});

test('all four result families render through browser-restored state', async ({ browser }) => {
  const cases = [
    {
      name: 'whole-room',
      answers: {
        wake_experience: 'gradually_too_hot',
        co_sleeper_state: 'partner_also_hot',
        heat_location: 'throughout_room',
        previous_attempts: ['lower_thermostat'],
        frequency: 'one_or_two_nights',
        change_status: 'no',
        whole_room_cooling_effect: 'helped_a_lot',
      },
      heading: 'Start with the room',
      experiment: 'observe_room_and_both_sleepers',
    },
    {
      name: 'bed-build-up',
      answers: {
        wake_experience: 'bed_became_hotter',
        co_sleeper_state: 'partner_comfortable',
        heat_location: 'underneath_or_mattress',
        previous_attempts: ['cooling_sheets'],
        frequency: 'one_or_two_nights',
        change_status: 'no',
        whole_room_cooling_effect: 'helped_somewhat',
      },
      heading: 'Start with one bed layer',
      experiment: 'change_one_bed_layer',
    },
    {
      name: 'sudden-personal',
      answers: {
        wake_experience: 'sudden_wave',
        co_sleeper_state: 'partner_cold',
        heat_location: 'upper_body_face_or_chest',
        previous_attempts: ['lower_thermostat', 'bedside_or_room_fan'],
        frequency: 'five_or_more_nights',
        change_status: 'yes',
        after_episode: 'became_cold_or_shivery',
        noise_sensitivity: 'some_noise_acceptable',
      },
      heading: 'The heat may be more local than room-wide',
      experiment: 'local_comfort_during_episode',
    },
    {
      name: 'mixed',
      answers: {
        wake_experience: 'whole_bedroom_hot',
        co_sleeper_state: 'partner_cold',
        heat_location: 'upper_body_face_or_chest',
        previous_attempts: ['lower_thermostat'],
        frequency: 'not_sure',
        change_status: 'not_sure',
        whole_room_cooling_effect: 'helped_a_lot',
      },
      heading: 'Your answers point in different directions',
      experiment: 'measure_first',
    },
  ];

  for (const item of cases) {
    const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
    await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
      key: stateKey,
      value: JSON.stringify(resultState(item.answers, item.experiment)),
    });
    const page = await context.newPage();
    await page.goto('/tool/');
    await waitForHydration(page);
    await expect(page.getByRole('heading', { name: item.heading })).toBeVisible();
    await expect(page.locator('#result-heading')).toBeFocused();
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.screenshot({
      path: join(screenshotDir, `result-${item.name}.png`),
      fullPage: true,
    });
    await context.close();
  }
});

test('changing adaptive branches removes the hidden discriminator before storage or evaluation', async ({
  page,
}) => {
  await page.goto('/');
  await waitForHydration(page);
  await choose(page, 'The whole bedroom felt hot');
  await choose(page, 'My partner was cold');
  await page.screenshot({
    path: join(screenshotDir, 'conditional-question.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await choose(page, 'Throughout the entire room');
  await page.getByLabel('Lower thermostat', { exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'One or two nights a week');
  await choose(page, 'No');
  await page.getByLabel('It helped a lot', { exact: true }).check();
  for (let count = 0; count < 6; count += 1)
    await page.getByRole('button', { name: 'Back' }).click();
  await page.getByLabel('A sudden wave of heat woke me', { exact: true }).check();
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key) ?? '{}').assessmentAnswers
            ?.whole_room_cooling_effect,
        stateKey,
      ),
    )
    .toBeUndefined();
  await expect(page.getByLabel('A sudden wave of heat woke me', { exact: true })).toBeChecked();
});

test('uncertainty, responsive reflow, reduced motion, keyboard focus, high contrast, and print styles hold', async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 700 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 900 },
    { width: 1440, height: 1000 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await waitForHydration(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${viewport.width}px viewport`).toBeLessThanOrEqual(1);
    await expect(
      page.getByRole('group', { name: 'What best describes the moment you woke?' }),
    ).toBeVisible();
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await waitForHydration(page);
  await page.getByLabel('I’m not sure', { exact: true }).check();
  await page.screenshot({
    path: join(screenshotDir, 'i-am-not-sure.png'),
    fullPage: true,
    animations: 'disabled',
  });

  await page.goto('/privacy/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  await page.goto('/');
  await waitForHydration(page);

  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  const transitionDuration = await page
    .getByRole('button', { name: 'Continue' })
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(['0s', '0ms', '0.01ms', '1e-05s']).toContain(transitionDuration);

  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' });
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const zoomOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(zoomOverflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(
    page.getByRole('group', { name: 'What best describes the moment you woke?' }),
  ).toBeVisible();
});

test('awake flow, contextual handoff, public HTML without JavaScript, source links, and 404', async ({
  browser,
  page,
  request,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/awake-and-hot/');
  await waitForHydration(page);
  await choose(page, 'Mainly I feel hot');
  await choose(page, 'Comfortable or cold');
  await choose(page, 'Suddenly');
  await expect(page.getByRole('heading', { name: 'Try one small change now.' })).toBeVisible();
  await page.getByRole('button', { name: 'Save a reminder for morning' }).click();
  await expect(page.getByText('Reminder saved in this browser only.')).toBeVisible();
  await page.screenshot({
    path: join(screenshotDir, 'awake-and-hot-mobile.png'),
    fullPage: true,
  });

  await page.goto('/why/waking-sweaty-in-a-cold-room/');
  await expect(page.locator('#direct-answer')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Short answer' })).toBeVisible();
  await expect(page.getByText('Who this is for:', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'When this applies' })).toBeVisible();
  await expect(page.getByText('What we don’t know:', { exact: false })).toBeVisible();
  await expect(
    page.getByText('Observe: For one night, note whether heat began', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText('Keep the same: Leave the thermostat', { exact: false }),
  ).toBeVisible();
  await expect(page.getByText('Evidence strength:', { exact: false })).toBeVisible();
  const sourceDetailsLink = page.getByRole('link', { name: 'Use and details' }).first();
  await expect(sourceDetailsLink).toBeVisible();
  const sourceDetailsHref = (await sourceDetailsLink.getAttribute('href')) ?? '';
  expect(sourceDetailsHref).toMatch(/^\/sources\/#/);
  await expect(
    page.getByText('Answer questions about the room, bed, timing, and moisture.', {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Reviewed September 8, 2026/)).toBeVisible();
  expect(await page.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  await page.screenshot({
    path: join(screenshotDir, 'search-article-mobile.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Start the private check' }).click();
  await waitForHydration(page);
  await expect(page.getByText(/A cool room is only one part of the night/)).toBeVisible();

  await page.goto(sourceDetailsHref);
  await expect(page.locator(':target')).toBeVisible();
  await expect(page.getByText('Used here for:', { exact: false }).first()).toBeVisible();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto('/why/waking-sweaty-in-a-cold-room/');
  await expect(noJsPage.locator('#direct-answer')).toBeVisible();
  await expect(noJsPage.locator('#one-change-tonight')).toBeVisible();
  await noJs.close();

  await page.goto('/compare/passive-vs-active-bed-cooling/');
  const stop = page.getByText('Stop:', { exact: true });
  const purchaseHeading = page.getByRole('heading', { name: 'Before you compare products' });
  await expect(
    page.getByRole('heading', { name: 'Room, bedding, and clothing' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Air-based systems' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Water-based systems' })).toBeVisible();
  await expect(stop).toBeVisible();
  await expect(purchaseHeading).toBeVisible();
  expect((await stop.boundingBox())?.y).toBeLessThan(
    (await purchaseHeading.boundingBox())?.y ?? 0,
  );

  const missing = await request.get('/this-page-does-not-exist/');
  expect(missing.status()).toBe(404);
});

test('desktop homepage and framework render original diagrams with dimensions and captions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await waitForHydration(page);
  await page.screenshot({
    path: join(screenshotDir, 'homepage-desktop-1440.png'),
    fullPage: true,
  });
  await page.goto('/room-bed-body-partner/');
  await expect(page.locator('figure')).toHaveCount(10);
  const images = page.locator('figure img');
  await expect(images).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    const image = images.nth(index);
    await expect(image).toHaveAttribute('alt', /\S+/);
    await expect(image).toHaveAttribute('width', /\d+/);
    await expect(image).toHaveAttribute('height', /\d+/);
  }
});
