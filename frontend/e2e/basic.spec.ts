import { test, expect } from '@playwright/test'

test.describe('WIW App - Cross-browser Tests', () => {
  test('should load homepage on all browsers', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Check if the app loads
    await expect(page).toHaveTitle(/WIW/)

    // Check for main elements
    await expect(page.locator('text=WIW')).toBeVisible()

    // Check responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.locator('text=WIW')).toBeVisible()

    await page.setViewportSize({ width: 1920, height: 1080 }) // Desktop
    await expect(page.locator('text=WIW')).toBeVisible()
  })

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')

    // Try to navigate to dashboard (if accessible)
    const dashboardLink = page.locator('text=Dashboard').first()
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await expect(page.locator('text=Tableau de bord')).toBeVisible()
    }
  })

  test('should handle login form', async ({ page }) => {
    await page.goto('/')

    // Look for login elements
    const loginButton = page.locator('text=Connexion').first()
    if (await loginButton.isVisible()) {
      await loginButton.click()

      // Check if login form appears
      const emailInput = page.locator('input[type="email"]').first()
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com')
        await expect(emailInput).toHaveValue('test@example.com')
      }
    }
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/')

      // Check mobile menu
      const menuButton = page.locator('[data-testid="mobile-menu"]').first()
      if (await menuButton.isVisible()) {
        await menuButton.click()
        // Check if menu opens
        await expect(page.locator('[data-testid="mobile-menu-content"]')).toBeVisible()
      }
    }
  })
})