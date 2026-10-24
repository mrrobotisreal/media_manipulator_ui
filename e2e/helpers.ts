import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { join } from 'node:path';

/**
 * Shared selectors and flows for the Darkroom journey specs. Selectors are
 * role/label/title based on the en-US strings (i18n/locales/en-us/interface/tools.json),
 * not CSS classes; the one test id is `timeline-clip`. User-visible copy says
 * Darkroom; routes and identifiers keep `studio`.
 */

export const FIXTURES = join(__dirname, 'fixtures');
export const fixture = (name: 'clipA.mp4' | 'clipB.mp4' | 'tone.wav') => join(FIXTURES, name);

export const STUDIO_PATH = '/tools/content-studio';

/** A unique project name per run so recents never collide across runs. */
export function uniqueProjectName(prefix = 'e2e'): string {
  return `${prefix}-${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Dismiss a consent banner if one shows (best effort; analytics is not under test). */
export async function dismissConsent(page: Page): Promise<void> {
  const decline = page.getByRole('button', { name: /^(reject|decline|necessary only|reject all)/i }).first();
  if (await decline.isVisible({ timeout: 1500 }).catch(() => false)) await decline.click().catch(() => undefined);
}

export async function openStudio(page: Page): Promise<void> {
  await page.goto(STUDIO_PATH);
  await dismissConsent(page);
  await expect(page.getByRole('heading', { name: 'New project' })).toBeVisible({ timeout: 60_000 });
}

/** Create a project from the entry screen with a canvas preset (the Resolution select). */
export async function createProject(page: Page, name: string, preset: string | RegExp = /9:16/): Promise<void> {
  await page.getByLabel('Project name').fill(name);
  await page.getByRole('combobox', { name: 'Resolution' }).click();
  await page.getByRole('option', { name: preset }).click();
  await page.getByRole('button', { name: 'Create project' }).click();
  await expectEditorLoaded(page);
}

/**
 * The editor is up when its undo control exists. Deliberately agnostic about the
 * renderer: WebGL and the canvas fallback both mount the same chrome, so this
 * assertion holds either way.
 */
export async function expectEditorLoaded(page: Page): Promise<void> {
  await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible({ timeout: 90_000 });
}

export function clips(page: Page): Locator {
  return page.getByTestId('timeline-clip');
}

/** The always-visible save indicator reads exactly "Saved" once the PUT lands. */
export async function expectSaved(page: Page): Promise<void> {
  await expect(page.getByText('Saved', { exact: true })).toBeVisible({ timeout: 60_000 });
}

/** Import fixtures through the media bin's file input and wait until each is usable. */
export async function importMedia(page: Page, files: string[]): Promise<void> {
  const before = await page.getByRole('button', { name: 'Add to timeline' }).count();
  await page.locator('input[type="file"]').first().setInputFiles(files);
  // Upload -> probe -> proxy build; a row's add button enables when its status is ready.
  await expect(page.getByRole('button', { name: 'Add to timeline' })).toHaveCount(before + files.length, { timeout: 180_000 });
  await expect(page.getByRole('button', { name: 'Add to timeline' }).and(page.locator(':enabled'))).toHaveCount(before + files.length, {
    timeout: 240_000,
  });
}

/** Move the playhead off 0 and into the first clip (frame-step), then split there. */
export async function splitFirstClip(page: Page): Promise<void> {
  const before = await clips(page).count();
  await clips(page).first().click();
  for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ControlOrMeta+K');
  await expect(clips(page)).toHaveCount(before + 1);
}

/** Open a recent project from the entry screen by name. */
export async function openRecent(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name: new RegExp(name) }).click();
  await expectEditorLoaded(page);
}

/** Persist cookies, localStorage AND IndexedDB (crash-recovery drafts live there). */
export async function snapshotState(context: BrowserContext) {
  return context.storageState({ indexedDB: true });
}
