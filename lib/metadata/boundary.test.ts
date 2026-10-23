import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('lib/metadata import boundary', () => {
  it('imports nothing from components/ or React', () => {
    const files = readdirSync(__dirname).filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && !/^use[A-Z]/.test(f)); // hooks (MM11 useMetadataAnalytics) are the React seam
    expect(files.length).toBeGreaterThan(5);
    for (const f of files) {
      const imports = [...readFileSync(join(__dirname, f), 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
      for (const spec of imports) {
        expect(spec, `${f} imports ${spec}`).not.toMatch(/^@\/components|^react($|\/)|^react-dom|^next\//);
      }
    }
  });
});
