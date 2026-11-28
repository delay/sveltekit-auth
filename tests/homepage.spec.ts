import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5173'); // Your dev server URL
  
  // Check if critical elements are present
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('aside')).toBeVisible();
  
  // Take screenshot for visual testing
  // await expect(page).toHaveScreenshot('homepage.png');
});
