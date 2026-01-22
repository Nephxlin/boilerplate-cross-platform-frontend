import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Boilerplate/)
  })

  test('should have main content visible', async ({ page }) => {
    await page.goto('/')
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should switch language', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.goto('/pt-BR')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  })
})
