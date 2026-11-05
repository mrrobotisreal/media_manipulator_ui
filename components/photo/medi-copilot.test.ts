/**
 * MM108: the Aperture editor's Medi entry points, read from the editor source (the shell needs a
 * decoded photo and WebGL to render, which jsdom has neither of): the toolbar button and the
 * Ctrl/Cmd+J handler exist only behind `photoCopilotOn`, which needs `photo` in the API's copilot
 * surfaces; the panel is a lazy import (nothing in the editor's first load).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));

import { photoCopilotOn } from './editor';

const src = readFileSync(join(__dirname, 'editor.tsx'), 'utf8');
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

describe('Aperture: Medi entry points', () => {
  it('the copilot is on only when the API lists photo as a copilot surface', () => {
    expect(photoCopilotOn(null)).toBe(false);
    expect(photoCopilotOn({ enabled: false })).toBe(false);
    expect(photoCopilotOn(caps([]))).toBe(false);
    expect(photoCopilotOn(caps(['studio']))).toBe(false);
    expect(photoCopilotOn(caps(['photo'], false))).toBe(false);
    expect(photoCopilotOn(caps(['photo', 'studio']))).toBe(true);
  });

  it('toolbar button and Ctrl/Cmd+J are gated on the copilot; both report assistant_opened', () => {
    expect(src).toMatch(/\{copilotOn \? \(\s*<Button[\s\S]*?data-testid="medi-copilot-toggle"/);
    expect(src).toMatch(/e\.key\.toLowerCase\(\) === 'j' && copilotRef\.current/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'photo', entry: 'button' \}/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'photo', entry: 'shortcut' \}/);
  });

  it('the panel is loaded lazily with the assistant shard', () => {
    expect(src).toMatch(/dynamic\(\(\) => withAssistantShard\(\(\) => import\('@\/components\/assistant\/copilot-panel'\)\), \{ ssr: false \}\)/);
    expect(src).not.toMatch(/^import .*copilot-panel/m);
  });

  it('Medi events go through the consent-gated photo tracker', () => {
    expect(src).toMatch(/track=\{photoAssistantTrack\}/);
    expect(src).not.toMatch(/analytics\.track\(EVENTS\.ASSISTANT/);
  });
});
