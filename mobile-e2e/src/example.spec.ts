import { test, expect } from '@playwright/test';

test('displays Store App home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('Store App');
  await expect(page.getByText('Ionic is working 🚀')).toBeVisible();
});
