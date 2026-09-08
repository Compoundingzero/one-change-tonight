import { expect, test, type Page } from '@playwright/test';

async function waitForHydration(page: Page) {
  const island = page.locator('astro-island').first();
  if (await island.count()) {
    await expect
      .poll(() => island.evaluate((element) => element.hasAttribute('ssr')))
      .toBe(false);
  }
}

test('first mobile viewport visual regression', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await waitForHydration(page);
  await expect(page).toHaveScreenshot('homepage-first-viewport.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.12,
    threshold: 0.3,
  });
});

test('desktop framework visual regression', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/room-bed-body-partner/');
  await expect(page).toHaveScreenshot('framework-first-viewport.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.12,
    threshold: 0.3,
  });
});
