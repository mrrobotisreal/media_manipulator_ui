import { describe, expect, it, vi } from 'vitest';
import { CaptionLookApiError, createSavedCaptionLook, deleteSavedCaptionLook, isCaptionLookLimit, listSavedCaptionLooks, updateSavedCaptionLook } from './captionLooksApi';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const style = { fontSizePct: 7, color: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 0.6, position: 'bottom', maxWidthPct: 85, animation: 'bounce', lookId: 'bounce_kids' };

describe('saved caption looks client (MM122)', () => {
  it('lists looks, sanitizing each style and dropping unreadable rows', async () => {
    const f = vi.fn(async () => json(200, { looks: [{ id: 'a', name: 'Mine', style, revision: 2 }, { id: '', style }], limit: 10, used: 1 }));
    const out = await listSavedCaptionLooks(f);
    expect(out.limit).toBe(10);
    expect(out.looks).toHaveLength(1);
    expect(out.looks[0].style.color).toBe('#FFFFFF');
  });

  it('create posts the style without a catalog lookId and returns used', async () => {
    const f = vi.fn(async (_url: string, init?: RequestInit) => {
      const sent = JSON.parse(String(init?.body));
      expect(sent.style.lookId).toBeUndefined();
      expect(sent.name).toBe('x'.repeat(60));
      return json(201, { id: 'n', name: sent.name, style: sent.style, revision: 1, used: 4 });
    });
    const out = await createSavedCaptionLook({ name: 'x'.repeat(80), style: style as never }, f);
    expect(out.used).toBe(4);
  });

  it('the cap refusal is a typed 403', async () => {
    const f = vi.fn(async () => json(403, { error: 'caption_looks_limit', limit: 10, used: 10, upgradePath: 'pro' }));
    const err = await createSavedCaptionLook({ name: 'a', style: style as never }, f).catch((e) => e);
    expect(isCaptionLookLimit(err)).toBe(true);
    expect((err as CaptionLookApiError).body?.upgradePath).toBe('pro');
  });

  it('update sends If-Match; a stale save is a 409', async () => {
    const f = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('If-Match')).toBe('3');
      return json(409, { error: 'revision_conflict', revision: 4 });
    });
    const err = await updateSavedCaptionLook('a', 3, { name: 'b' }, f).catch((e) => e);
    expect((err as CaptionLookApiError).status).toBe(409);
    const d = vi.fn(async () => json(200, { deleted: { objects: 1 } }));
    await deleteSavedCaptionLook('a', d);
    expect(d).toHaveBeenCalledWith(expect.stringContaining('/studio/caption-looks/a'), { method: 'DELETE' });
  });
});
