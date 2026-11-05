/**
 * MM110: Motion's Medi entry points and the Templates menu, read from the editor source (the
 * shell needs a real canvas to render, which jsdom lacks): the toolbar button and Ctrl/Cmd+J
 * exist only behind `vectorCopilotOn` (the API must list `vector`); the panel is a lazy import;
 * the Templates menu ships to everyone (no copilot gate); events use the consent-gated tracker.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));

import { undoTitle, vectorCopilotOn } from './editor';
import { templateMenuOptions, runMenuTemplate } from './templates-menu';
import { createVectorStore } from '@/lib/vector/vectorStore';
import { blankDoc } from '@/lib/vector/projects';

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
const t = (key: string, vars?: Record<string, unknown>) => (vars ? `${key}${JSON.stringify(vars)}` : key);

describe('Motion: Medi entry points', () => {
  it('the copilot is on only when the API lists vector as a copilot surface', () => {
    expect(vectorCopilotOn(null)).toBe(false);
    expect(vectorCopilotOn({ enabled: false })).toBe(false);
    expect(vectorCopilotOn(caps([]))).toBe(false);
    expect(vectorCopilotOn(caps(['photo']))).toBe(false);
    expect(vectorCopilotOn(caps(['vector'], false))).toBe(false);
    expect(vectorCopilotOn(caps(['photo', 'vector']))).toBe(true);
  });

  it('toolbar button and Ctrl/Cmd+J are gated on the copilot; both report assistant_opened', () => {
    expect(src).toMatch(/\{copilotOn \? \(\s*<Button[\s\S]*?data-testid="medi-copilot-toggle"/);
    expect(src).toMatch(/k === 'j' && copilotRef\.current/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'vector', entry: 'button' \}/);
    expect(src).toMatch(/ASSISTANT_OPENED, \{ surface: 'vector', entry: 'shortcut' \}/);
  });

  it('the panel is loaded lazily with the assistant shard; events go through the consent-gated tracker', () => {
    expect(src).toMatch(/dynamic\(\(\) => withAssistantShard\(\(\) => import\('@\/components\/assistant\/copilot-panel'\)\), \{ ssr: false \}\)/);
    expect(src).not.toMatch(/^import .*copilot-panel/m);
    expect(src).toMatch(/track=\{vectorAssistantTrack\}/);
    expect(src).not.toMatch(/analytics\.track\(EVENTS\.ASSISTANT/);
  });

  it('the Templates menu is not behind the copilot gate', () => {
    const i = src.indexOf('<TemplatesMenu');
    expect(i).toBeGreaterThan(0);
    expect(src.slice(Math.max(0, i - 40), i)).not.toMatch(/copilotOn/);
  });

  it('Undo names a Medi edit and a template', () => {
    expect(undoTitle('Undo', 'Medi|Pop the title', t)).toBe('Undo: vector.medi.historyLabel{"brand":"Medi","summary":"Pop the title"}');
    expect(undoTitle('Undo', 'Template|counter', t)).toBe('Undo: vector.templates.counter');
    expect(undoTitle('Undo', 'Move', t)).toBe('Undo');
  });
});

describe('Templates menu', () => {
  it('starts at the playhead with localized placeholder text; logo reveal uses the selection', () => {
    expect(templateMenuOptions('lowerThird', t, 1234.4, [])).toEqual({ at: 1234, text: ['vector.templates.placeholder.name', 'vector.templates.placeholder.role'] });
    expect(templateMenuOptions('bulletReveal', t, 0, []).text).toHaveLength(3);
    expect(templateMenuOptions('logoReveal', t, 0, ['a'])).toEqual({ at: 0, layerIds: ['a'] });
  });

  it('runs as ONE undo step labelled with the template and selects its layers', () => {
    const store = createVectorStore();
    store.getState().load('p', blankDoc(), 'x');
    expect(runMenuTemplate('titlePop', t, store)).toBe(true);
    const s = store.getState();
    expect(s.past).toHaveLength(1);
    expect(s.past[0].label).toBe('Template|titlePop');
    expect(s.selection).toEqual(['title-1']);
    s.undo();
    expect(store.getState().doc!.layers).toEqual([]);
  });
});
