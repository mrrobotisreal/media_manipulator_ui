import { expect, test } from '@playwright/test';
import {
  clips,
  createProject,
  expectSaved,
  fixture,
  importMedia,
  openRecent,
  openStudio,
  splitFirstClip,
  uniqueProjectName,
} from '../helpers';

/**
 * The whole editor journey, in order, against a real stack:
 * create (canvas preset) -> batch import -> edit (split, transition, keyframe,
 * title) -> Saved -> reload -> project intact -> export -> Exports panel ->
 * download. One serial describe sharing one page, because each step builds on
 * the previous one's project; a failed step skips the rest on purpose.
 */
test.describe.serial('Darkroom journey', () => {
  const projectName = uniqueProjectName();
  let clipCountAfterEdits = 0;

  test('create a project with a canvas preset', async ({ page }) => {
    await openStudio(page);
    await createProject(page, projectName, /9:16/);
    await expect(page.getByText(projectName).first()).toBeVisible();
    await expectSaved(page);
  });

  test('batch-import media and place it on the timeline', async ({ page }) => {
    await openStudio(page);
    await openRecent(page, projectName);
    await importMedia(page, [fixture('clipA.mp4'), fixture('clipB.mp4'), fixture('tone.wav')]);

    const add = page.getByRole('button', { name: 'Add to timeline' });
    await add.nth(0).click();
    await add.nth(1).click();
    await expect(clips(page)).toHaveCount(2);
    await expectSaved(page);
  });

  test('edit: split, transition, keyframe, title', async ({ page }) => {
    await openStudio(page);
    await openRecent(page, projectName);
    await expect(clips(page)).toHaveCount(2);

    await test.step('split', async () => {
      await splitFirstClip(page);
    });

    await test.step('transition (needs a clip with a predecessor)', async () => {
      await clips(page).nth(1).click();
      await page.getByText('Transition', { exact: true }).first().click(); // open the inspector section
      const picker = page.getByText('Type', { exact: true }).locator('xpath=following::*[@role="combobox"][1]');
      await picker.click();
      await page.getByRole('option', { name: 'Cross dissolve' }).click();
      await expect(picker).toContainText('Cross dissolve');
    });

    await test.step('keyframe (position X)', async () => {
      await clips(page).first().click();
      await page.getByText('Motion', { exact: true }).first().click();
      await page.getByTitle('Toggle keyframing for this property').first().click();
      await expect(page.getByTitle('Add or remove a keyframe at the playhead').first()).toBeVisible();
    });

    await test.step('title clip', async () => {
      const before = await clips(page).count();
      await page.getByTitle(/Add a title clip at the playhead/).click();
      await expect(clips(page)).toHaveCount(before + 1);
    });

    clipCountAfterEdits = await clips(page).count();
    expect(clipCountAfterEdits).toBeGreaterThanOrEqual(4);
    await expectSaved(page);
  });

  test('reload: the project is intact', async ({ page }) => {
    await openStudio(page);
    await openRecent(page, projectName);
    await expect(clips(page)).toHaveCount(clipCountAfterEdits);
    await expectSaved(page);
    // A clean reload after a Saved state must not offer crash recovery.
    await expect(page.getByRole('heading', { name: 'Recover unsaved changes?' })).toHaveCount(0);
  });

  test('export to completion, see it in Exports, and download it', async ({ page }) => {
    await openStudio(page);
    await openRecent(page, projectName);

    await page.getByRole('button', { name: 'Export MP4' }).click();
    const dialog = page.getByRole('dialog', { name: /Export/ });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Start export' }).click();
    await expect(dialog.getByText('Your export is ready.')).toBeVisible({
      timeout: Number(process.env.E2E_EXPORT_TIMEOUT_MS || 600_000),
    });

    const downloadPromise = page.waitForEvent('download');
    await dialog.getByRole('link', { name: /Download/ }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.(mp4|mov|m4v)$/i);
    const path = await download.path();
    expect(path).toBeTruthy();
    const { statSync } = await import('node:fs');
    expect(statSync(path!).size).toBeGreaterThan(1_000);

    await page.keyboard.press('Escape');

    // The persistent Exports panel (export depth) lists the render.
    await page.getByRole('button', { name: 'Exports' }).click();
    const panel = page.getByRole('dialog', { name: 'Exports' });
    await expect(panel).toBeVisible();
    await expect(panel.getByText('Done').first()).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Download' }).first()).toBeVisible();
  });
});
