import { expect, test } from '@playwright/test';

test('sheet opens, resizes with keyboard and restores focus', async ({page}) => {
  await page.goto('/'); const trigger = page.getByRole('button',{name:'Open filters'}); await trigger.click();
  const modal = page.getByRole('dialog',{name:'Filters'}); await expect(modal).toBeVisible();
  const before = (await modal.boundingBox())!.height; await page.getByRole('button',{name:'Resize sheet'}).press('End');
  await expect.poll(async () => (await modal.boundingBox())!.height).toBeGreaterThan(before);
  await page.keyboard.press('Escape'); await expect(modal).not.toBeVisible(); await expect(trigger).toBeFocused();
});

test('adaptive presentation preserves edited value', async ({page}) => {
  await page.setViewportSize({width:900,height:800}); await page.goto('/'); await page.getByRole('button',{name:'Edit profile'}).click();
  const name = page.getByRole('textbox',{name:'Name'}); await name.fill('Sam'); await page.setViewportSize({width:375,height:740});
  await expect(page.getByRole('dialog')).toHaveClass(/om-sheet/); await expect(name).toHaveValue('Sam');
});

test('action buttons and async refresh work without gestures', async ({page}) => {
  await page.goto('/'); await page.getByRole('button',{name:'Show actions'}).click(); await page.getByRole('button',{name:'Archive'}).click();
  await expect(page.getByRole('button',{name:'Restore message'})).toBeVisible(); await page.getByRole('button',{name:'Refresh',exact:true}).click();
  await expect(page.getByText('Revision 1')).toBeVisible(); await expect(page.getByRole('status')).toHaveText('Refreshed');
});
