// @ts-check
import { test, expect } from '@playwright/test';

async function scrollY(page) {
  return await page.evaluate(() => window.scrollY || window.pageYOffset || 0);
}
async function scrollDown(page, y = 1200) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(50);
  return scrollY(page);
}
async function afterClickScrollY(page, selector) {
  await Promise.all([page.waitForLoadState('load'), page.locator(selector).click()]);
  await page.waitForTimeout(400);
  return scrollY(page);
}

test.describe('#1449 turbo-refresh-scroll reset vs HTTP status (Turbo 8.0.14)', () => {
  test('200 OK resets scroll', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to200');
    expect(y).toBeLessThanOrEqual(5);
  });

  test('404 keeps scroll (bug)', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to404');
    expect(y).toBeGreaterThan(50);
  });

  test('500 keeps scroll (bug)', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to500');
    expect(y).toBeGreaterThan(50);
  });

  test('302→200 may not reset immediately', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to302');
    expect(y).toBeGreaterThan(50);
  });

  test('302→404 keeps scroll (bug)', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to302to404');
    expect(y).toBeGreaterThan(50);
  });

  test('302→500 keeps scroll (bug)', async ({ page }) => {
    await page.goto('/scroll_8_0_14');
    const before = await scrollDown(page, 1400);
    expect(before).toBeGreaterThan(200);
    const y = await afterClickScrollY(page, '#to302to500');
    expect(y).toBeGreaterThan(50);
  });
});
