---
name: playwright
description: End-to-end browser automation, UI testing, and responsive visual inspection using Playwright. Use when writing or executing web tests, capturing automated screenshots across viewport sizes, verifying DOM flows, and simulating user actions.
---

# Playwright: End-to-End Testing & Visual Verification

Playwright provides cross-browser automation (Chromium, Firefox, WebKit) for validating web applications, user journeys, responsive viewports, and visual stability.

## Core Capabilities

### 1. Viewport & Responsive Testing
Validate mobile-first interfaces across standard breakpoints:
- **Mobile**: `375 x 667` (iPhone SE) / `390 x 844` (iPhone 12/13/14)
- **Tablet**: `768 x 1024` (iPad)
- **Desktop**: `1280 x 800` / `1440 x 900`

### 2. Standard Test Patterns
```javascript
import { test, expect } from '@playwright/test';

test('verifies mobile onboarding flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/app/');
  
  // Assert visibility of key interactive elements
  const ctaButton = page.locator('button[data-testid="start-onboarding"]');
  await expect(ctaButton).toBeVisible();
  await ctaButton.click();
  
  // Verify state change
  await expect(page.locator('.onboarding-step-1')).toBeVisible();
});
```

### 3. Visual Regression & Artifact Capture
- Capture full-page or element-level screenshots to inspect visual rendering.
- Verify that animations settle before capturing (`await page.waitForLoadState('networkidle')`).
- Check console errors: listen to `page.on('console', msg => ...)` and fail tests on unhandled runtime exceptions.

## Palateo Application Verification
In Palateo, use Playwright to verify:
- Waitlist submission API response and error toast display.
- Mobile bottom navigation and taste curation card rendering.
- CSP headers: confirm no inline script execution is blocked by the Content Security Policy.
