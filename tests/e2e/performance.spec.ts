import { expect, test } from '@playwright/test';

const representativeRoutes = [
  ['homepage', '/'],
  ['tool', '/tool/'],
  ['awake-and-hot', '/awake-and-hot/'],
  ['search-page', '/why/waking-sweaty-in-a-cold-room/'],
  ['comparison', '/compare/air-vs-water-bed-cooling/'],
] as const;

for (const [name, route] of representativeRoutes) {
  test(`${name} meets the browser performance envelope`, async ({ page }) => {
    await page.addInitScript(() => {
      const measurements = { cls: 0, lcpMs: 0 };
      Object.defineProperty(window, '__octVitals', { value: measurements, configurable: true });

      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        new PerformanceObserver((list) => {
          for (const item of list.getEntries()) {
            const shift = item as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
            };
            if (!shift.hadRecentInput) measurements.cls += shift.value ?? 0;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      }

      if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        new PerformanceObserver((list) => {
          const latest = list.getEntries().at(-1);
          if (latest) measurements.lcpMs = latest.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      }
    });

    const response = await page.goto(route, { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const vitals = (
        window as typeof window & { __octVitals?: { cls: number; lcpMs: number } }
      ).__octVitals ?? { cls: 0, lcpMs: 0 };

      return {
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        loadMs: Math.round(navigation.loadEventEnd),
        lcpMs: Math.round(vitals.lcpMs),
        cls: Number(vitals.cls.toFixed(4)),
        resourceCount: resources.length,
        transferredKb: Number(
          (
            (navigation.transferSize +
              resources.reduce((sum, item) => sum + item.transferSize, 0)) /
            1024
          ).toFixed(1),
        ),
      };
    });

    console.log(`[performance] ${name} ${JSON.stringify(metrics)}`);
    expect(metrics.domContentLoadedMs).toBeLessThan(2_000);
    expect(metrics.loadMs).toBeLessThan(3_000);
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.resourceCount).toBeLessThanOrEqual(20);
  });
}
