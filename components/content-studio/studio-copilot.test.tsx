/**
 * MM109: Darkroom's Medi entry points. The toolbar button, Cmd/Ctrl+J and the lazy panel exist
 * only behind `studioCopilotOn` (the API lists `studio` as a copilot surface), and never inside
 * the CreaTV embed (design Q2). Read from source where the editor needs a real project + WebGL.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/tools/content-studio', useRouter: () => ({ push: vi.fn() }) }));

import { studioCopilotOn } from './studio-copilot';

const src = readFileSync(join(__dirname, 'studio-copilot.tsx'), 'utf8');
const editorSrc = readFileSync(join(__dirname, 'editor.tsx'), 'utf8');
const embedSrc = readFileSync(join(__dirname, 'embed-host.tsx'), 'utf8');
const caps = (surfaces: string[], enabled = true) => ({
  enabled: true as const,
  guide: { enabled: true },
  copilot: { enabled, surfaces, signedInOnly: true, editSurfaces: surfaces },
  turns: { limit: 5, remaining: 5, resetsAt: '' },
  frames: true,
  maxFrameBytes: 307200,
  maxMessageChars: 4000,
  spendCapReached: false,
});

describe('Darkroom: Medi entry points (MM109)', () => {
  it('the copilot is on only when the API lists studio as a copilot surface', () => {
    expect(studioCopilotOn(null)).toBe(false);
    expect(studioCopilotOn({ enabled: false })).toBe(false);
    expect(studioCopilotOn(caps([]))).toBe(false);
    expect(studioCopilotOn(caps(['photo']))).toBe(false);
    expect(studioCopilotOn(caps(['studio'], false))).toBe(false);
    expect(studioCopilotOn(caps(['photo', 'studio']))).toBe(true);
  });

  it('is hidden inside the CreaTV embed: the embed host passes `embedded`, and the hook renders nothing then', () => {
    expect(embedSrc).toMatch(/<Editor projectId=\{projectId\} embedded /);
    expect(src).toMatch(/const on = !embedded && studioCopilotOn\(caps\)/);
    expect(src).toMatch(/if \(embedded\) return;\s*let alive/);
    expect(editorSrc).toMatch(/useStudioCopilot\(projectId, embedded\)/);
  });

  it('button and Cmd/Ctrl+J are gated on the copilot; both report assistant_opened with surface studio', () => {
    expect(src).toMatch(/const toggle = on \? \(/);
    expect(src).toMatch(/e\.key\.toLowerCase\(\) !== 'j' \|\| !onRef\.current/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'studio', entry: 'button' \}/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'studio', entry: 'shortcut' \}/);
  });

  it('the panel is loaded lazily with the assistant shard', () => {
    expect(src).toMatch(/dynamic\(\(\) => withAssistantShard\(\(\) => import\('@\/components\/assistant\/copilot-panel'\)\), \{ ssr: false \}\)/);
    expect(src).not.toMatch(/^import .*copilot-panel/m);
    expect(editorSrc).not.toMatch(/copilot-panel/);
  });

  it('Ctrl/Cmd+J is free in the Darkroom keymap', async () => {
    const { KEYMAP } = await import('@/lib/studio/keymap');
    expect(KEYMAP.some((b) => b.key === 'j' && (b.mod || b.ctrl))).toBe(false);
  });
});
