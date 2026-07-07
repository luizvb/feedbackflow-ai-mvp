import { test, expect } from '@playwright/test';

test('Golden path: submit feedback and see insight', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FeedbackFlow AI/);

  // Fill the feedback textarea
  await page.fill('textarea[placeholder*="E.g. The new dashboard"]', 'The new export feature is completely broken, we are losing money!');

  // Click the submit button
  await page.click('button:has-text("Analyze Feedback")');

  // Verify that the analyzing state appears (button disables)
  await expect(page.locator('button:has-text("Analyzing")')).toBeVisible();

  // Wait for the insight to appear
  await expect(page.locator('text="Bug Report"').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text="Negative"').first()).toBeVisible();
});
