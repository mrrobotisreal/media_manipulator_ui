import { describe, expect, it } from 'vitest';
import { createCreatvBackend, createMmBackend } from './studioBackend';
import { buildExportRequest, DEFAULT_EXPORT_CHOICES } from './exportOptions';

// Part 20 embed behaviour: export depth is a backend capability. CreaTV's
// Darkroom API has none of the routes, so it must get the legacy body and an
// empty history without any request.
describe('export depth capability', () => {
  const creatv = createCreatvBackend({
    apiBaseUrl: 'https://api.example',
    scope: { userId: 1, channelId: 2, draftId: 3 },
    getToken: () => 't',
  });

  it('is on for MM and off for CreaTV by default', () => {
    expect(createMmBackend().capabilities.exportDepth).toBe(true);
    expect(creatv.capabilities.exportDepth).toBe(false);
  });

  it('a host can opt in via cs:init capabilities', () => {
    const b = createCreatvBackend({
      apiBaseUrl: 'https://api.example',
      scope: { userId: 1, channelId: 2, draftId: 3 },
      getToken: () => 't',
      capabilities: { exportDepth: true },
    });
    expect(b.capabilities.exportDepth).toBe(true);
  });

  it('CreaTV adaptExport never sees the new fields', () => {
    const req = buildExportRequest({ fileName: 'x', ...DEFAULT_EXPORT_CHOICES, format: 'hevc', resolution: 2160 }, creatv.capabilities.exportDepth);
    const wire = creatv.adaptExport(req) as Record<string, unknown>;
    expect(Object.keys(wire).sort()).toEqual(['channel_id', 'fileName', 'loudness', 'preset', 'user_id']);
  });

  it('CreaTV has no history rows; MM parses the list', () => {
    expect(creatv.parseExports({ exports: [{ id: 'x' }] })).toEqual([]);
    const rows = createMmBackend().parseExports({
      exports: [{ id: 'e', jobId: 'j', format: 'hevc', resolution: 1440, captionsMode: 'sidecar', status: 'running', createdAt: 'now', available: false }],
    });
    expect(rows[0]).toMatchObject({ jobId: 'j', format: 'hevc', resolution: 1440 });
  });
});
