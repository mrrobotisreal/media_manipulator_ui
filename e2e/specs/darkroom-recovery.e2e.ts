import { expect, test } from '@playwright/test';
import {
  clips,
  createProject,
  expectEditorLoaded,
  expectSaved,
  fixture,
  importMedia,
  openRecent,
  openStudio,
  snapshotState,
  splitFirstClip,
  uniqueProjectName,
} from '../helpers';

/**
 * Crash recovery (part 08): edit while the network is down so the save cannot
 * land, snapshot the browser's storage (IndexedDB holds the local draft), close
 * the whole context mid-edit, then reopen in a fresh context seeded with that
 * storage and expect the recovery prompt. Timing note: the local draft is
 * written on a short debounce, hence the settle wait before the snapshot.
 */
test('killing the browser mid-edit offers recovery, and recovering restores the edit', async ({ browser }) => {
  const name = uniqueProjectName('e2e-recover');

  const first = await browser.newContext();
  const page = await first.newPage();
  await openStudio(page);
  await createProject(page, name, /16:9/);
  await importMedia(page, [fixture('clipA.mp4')]);
  await page.getByRole('button', { name: 'Add to timeline' }).first().click();
  await expect(clips(page)).toHaveCount(1);
  await expectSaved(page);

  // Edit offline: the PUT cannot reach the server, so only the local draft has it.
  await first.setOffline(true);
  await splitFirstClip(page);
  await expect(clips(page)).toHaveCount(2);
  await page.waitForTimeout(4_000);

  const state = await snapshotState(first);
  await first.close(); // the "crash"

  const second = await browser.newContext({ storageState: state });
  const page2 = await second.newPage();
  await openStudio(page2);
  await openRecent(page2, name);

  const prompt = page2.getByRole('heading', { name: /Recover unsaved changes\?|Unsaved changes from an older session/ });
  await expect(prompt).toBeVisible();
  await page2.getByRole('button', { name: /Recover/ }).click();
  await expectEditorLoaded(page2);
  await expect(clips(page2)).toHaveCount(2);
  await expectSaved(page2);
  await second.close();
});
