/**
 * Regression (Mitch, 2026-11-05): MM109 wrapped the Darkroom editor body in two plain
 * divs for Medi's side panel, which broke the flex chain focus mode relies on, so the
 * full-page editor sat squashed in the top of the screen. The editor is too heavy to
 * render here, so this pins the wrapper classes in source; the host test below pins
 * "open a project → full page".
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const editor = readFileSync(join(__dirname, 'editor.tsx'), 'utf8');
const host = readFileSync(join(__dirname, 'studio-host.tsx'), 'utf8');

describe('Darkroom full-page layout', () => {
  it('the wrappers around the editor body pass the focus-mode flex fill through', () => {
    expect(editor).toContain("focused && 'flex flex-1 min-h-0'");
    expect(editor).toMatch(/focused \? 'flex min-w-0 flex-1 flex-col'/);
    // The rows inside still claim the space.
    expect(editor).toContain("focused && 'flex-1 min-h-0'");
  });

  it('creating or opening a project enters the full-page editor (not inside the CreaTV embed)', () => {
    expect(host).toMatch(/setOpenProjectId\(id\);\s*if \(!embedded\) enterFocus\(\);/);
    expect(host).toContain('<EntryScreen onOpen={openProject} />');
    expect(host).toMatch(/closeProject[\s\S]*exitFocus\(\)/);
  });
});
