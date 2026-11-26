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

test('swipe preview survives an unrelated cancellation and cancels without opening', async ({ page }) => {
  await page.goto('/');
  const content = page.locator('.om-swipe-content');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await content.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await content.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await content.evaluate((element) => {
    element.addEventListener('pointerdown', (event) => {
      if (event instanceof PointerEvent) element.setAttribute('data-pointer-id', String(event.pointerId));
    }, { once: true });
  });

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 55, y);
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');
  const pointerId = Number(await content.getAttribute('data-pointer-id'));
  await content.dispatchEvent('pointercancel', { bubbles: true, pointerId: pointerId + 1 });
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');

  await content.dispatchEvent('pointercancel', { bubbles: true, pointerId });
  await page.mouse.up();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('swipe opens actions and Escape restores focus', async ({ page }) => {
  await page.goto('/');
  const content = page.locator('.om-swipe-content');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await content.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await content.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 55, y);
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');
  await page.mouse.up();
  const archive = page.getByRole('button', { name: 'Archive' });
  await expect(archive).toBeVisible();
  await archive.focus();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('pull handle announces and commits a refresh after an earlier success', async ({ page }) => {
  await page.goto('/');
  const refresh = page.getByRole('button', { name: 'Refresh', exact: true });
  const status = page.getByRole('status');
  await refresh.click();
  await expect(status).toHaveText('Refreshed');

  const handle = page.locator('.om-refresh-handle');
  await handle.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await handle.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 75, { steps: 8 });
  await expect(status).toHaveText('Release to refresh');
  await page.mouse.up();

  await expect(page.getByText('Revision 2')).toBeVisible();
  await expect(status).toHaveText('Refreshed');
});

test('touch swipes reveal actions and touch pulls refresh content', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium touch input through CDP');
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await page.goto('/');

  const drag = async (selector: string, dx: number, dy: number, end: 'touchEnd' | 'touchCancel' = 'touchEnd') => {
    const handle = page.locator(selector);
    await handle.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    const bounds = (await handle.boundingBox())!;
    const x = Math.round(bounds.x + bounds.width / 2);
    const y = Math.round(bounds.y + bounds.height / 2);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx, y: y + dy }] });
    await cdp.send('Input.dispatchTouchEvent', { type: end, touchPoints: [] });
  };

  await drag('.om-swipe-content', -56, 0, 'touchCancel');
  await expect(page.getByRole('button', { name: 'Show actions' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.om-swipe-content')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await drag('.om-swipe-content', -56, 0);
  await expect(page.getByRole('button', { name: 'Archive' })).toBeVisible();
  await drag('.om-refresh-handle', 0, 75);
  await expect(page.getByText('Revision 1')).toBeVisible();
});

test('sheet handle cycles through snap points with a pointer click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  const sheet = page.getByRole('dialog', { name: 'Filters' });
  const handle = sheet.getByRole('button', { name: 'Resize sheet' });
  const before = (await sheet.boundingBox())!.height;
  await handle.click();
  await expect.poll(async () => (await sheet.boundingBox())!.height).toBeGreaterThan(before);
  await handle.click();
  await expect.poll(async () => (await sheet.boundingBox())!.height).toBeCloseTo(before);
});

test('small sheet snap points keep a nondismissible completion button reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/tests/browser/fixtures/controls.html');
  const trigger = page.getByRole('button', { name: 'Open compact sheet' });
  await trigger.click();
  const sheet = page.getByRole('dialog', { name: 'Compact sheet' });
  const finish = sheet.getByRole('button', { name: 'Finish' });
  await finish.click();
  await expect(sheet).toBeHidden();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(finish).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(sheet).toBeHidden();
});

test('right-swipe trigger remains in the viewport with keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 800 });
  await page.goto('/tests/browser/fixtures/controls.html');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const hide = page.getByRole('button', { name: 'Hide actions' });
  await expect(hide).toBeFocused();
  await expect(hide).toBeInViewport({ ratio: 1 });
  await hide.click();
  await trigger.click();
  await expect(hide).toBeInViewport({ ratio: 1 });
});

test('a sheet drag can restart after its handle disappears in dialog mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  const handle = dialog.getByRole('button', { name: 'Resize sheet' });
  const beginDrag = async () => {
    const bounds = (await handle.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y - 65, { steps: 5 });
    await expect(dialog).toHaveCSS('transition-property', 'none');
  };
  await expect(handle).toBeVisible();
  await beginDrag();
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(handle).toHaveCount(0);
  await page.mouse.up();
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(handle).toBeVisible();
  await expect(dialog).toHaveCSS('transition-property', 'height');
  await beginDrag();
  await page.mouse.up();
});

test('a sideways pointer gesture on the sheet handle does not cycle the snap point', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  const sheet = page.getByRole('dialog', { name: 'Filters' });
  const handle = sheet.getByRole('button', { name: 'Resize sheet' });
  const before = (await sheet.boundingBox())!.height;
  const bounds = (await handle.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 20, y);
  await page.mouse.up();
  await expect(sheet).toHaveCSS('height', `${before}px`);
});

test('centered dialog scrolls to a native form and respects controlled closure', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/tests/browser/fixtures/controls.html');
  await page.getByRole('button', { name: 'Open tall dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Tall dialog' });
  const submit = dialog.getByRole('button', { name: 'Complete tall dialog' });
  await expect(submit).not.toBeInViewport();
  await dialog.hover();
  await page.mouse.wheel(0, 1000);
  await expect(submit).toBeInViewport();
  await submit.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Close requests: 1')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await dialog.getByRole('checkbox', { name: 'Allow close' }).check();
  await submit.click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});
