/**
 * 🧪 冒烟测试
 *
 * 验证基本页面可访问和导航功能正常。
 * 运行: npx playwright test e2e/smoke.spec.ts
 */
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('首页应可正常访问', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('Vibe Template')).toBeVisible();
  });

  test('底部导航应正常显示', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('首页')).toBeVisible();
    await expect(page.getByText('AI 助手')).toBeVisible();
    await expect(page.getByText('设置')).toBeVisible();
  });

  test('导航到 AI 页面', async ({ page }) => {
    await page.goto('/');
    await page.getByText('AI 助手').click();
    await expect(page).toHaveURL('/ai');
    await expect(page.getByText('AI 助手')).toBeVisible();
  });

  test('导航到设置页面', async ({ page }) => {
    await page.goto('/');
    await page.getByText('设置').click();
    await expect(page).toHaveURL('/settings');
    await expect(page.getByRole('heading', { name: '设置' })).toBeVisible();
  });
});
