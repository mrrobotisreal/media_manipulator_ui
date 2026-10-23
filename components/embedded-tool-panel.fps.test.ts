import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The panel is too heavy to mount in jsdom; pin that the ResultPanel call passes the hint.
describe('embedded tool panel passes targetFps to ResultPanel', () => {
  it('wires fpsHint(defaultTask, conversionOptions) into targetFps', () => {
    const src = readFileSync(join(__dirname, 'embedded-tool-panel.tsx'), 'utf8');
    expect(src).toContain("import { fpsHint } from '@/lib/results/videoFps'");
    expect(src).toMatch(/<ResultPanel[\s\S]{0,200}targetFps=\{fpsHint\(defaultTask, conversionOptions\)\}/);
  });
});
