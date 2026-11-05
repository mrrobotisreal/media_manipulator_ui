/**
 * MM107 client logic: the stream (every SSE event type, refusals, abort), link safety and
 * locale prefixes, action hrefs with presets, where the guide may appear, and the analytics
 * buckets.
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics/consent-bridge', () => ({ canCapture: () => false }));

import { QuotaExceededError } from '@/lib/auth/authedFetch';
import { answerOutcome, failReason, latencyBucket, turnIndexBucket, undoBucket } from './analytics';
import { EDITOR_HREF, editorTeaserFor, guideAllowedOn } from './guideRoutes';
import { actionHref, linkTargetKind, safeSiteHref } from './links';
import { encodeOptions } from './toolOptions/codec';
import { streamAssistantChat, type AssistantChatBody } from './stream';
import type { AssistantStreamEvent } from '@/schemas/assistant';

const sse = (frames: unknown[]) => frames.map((f) => (typeof f === 'string' ? f : `data: ${JSON.stringify(f)}\n\n`)).join('');

function bodyStream(text: string, chunk = 17): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream({
    start(c) {
      for (let i = 0; i < bytes.length; i += chunk) c.enqueue(bytes.slice(i, i + chunk));
      c.close();
    },
  });
}

const guide: AssistantChatBody = { surface: 'guide', locale: 'en-US', page: { path: '/' }, message: { text: 'gif?' } };

async function collect(res: Response | (() => Promise<Response>), body = guide): Promise<{ events: AssistantStreamEvent[]; fetchImpl: ReturnType<typeof vi.fn> }> {
  const events: AssistantStreamEvent[] = [];
  const fetchImpl = vi.fn(typeof res === 'function' ? res : async () => res);
  await streamAssistantChat(body, (e) => events.push(e), undefined, { fetchImpl: fetchImpl as never, visitorHeader: () => ({}) });
  return { events, fetchImpl };
}

describe('streamAssistantChat', () => {
  it('parses every event type in order, drops malformed frames and pings', async () => {
    const text = sse([
      { type: 'meta', conversationId: null, turnId: 't1', model: 'anthropic/claude-haiku-5.5' },
      ': ping\n\n',
      { type: 'tool', name: 'search_help', status: 'running' },
      { type: 'tool', name: 'search_help', status: 'ok' },
      { type: 'delta', text: 'Open ' },
      { type: 'delta', text: 'GIF maker.' },
      'data: {not json}\n\n',
      { type: 'delta' },
      { type: 'action', callId: 'a1', kind: 'open_tool', label: 'Open GIF maker', params: { slug: 'convert-video-to-animated-gif', route: '/tools/convert-video-to-animated-gif' } },
      { type: 'ask', callId: 'q1', question: 'Which?', choices: ['A', 'B'] },
      { type: 'edits', callId: 'e1', summary: 'Grey except red', ops: [{ op: 'grey_except', ranges: ['red'] }] },
      { type: 'usage', inputTokens: 50, outputTokens: 5, cachedTokens: 0, costUsd: 0.0002 },
      { type: 'done', awaiting: 'edit_result', messageId: 'm1' },
    ]);
    const { events, fetchImpl } = await collect(new Response(bodyStream(text), { status: 200 }));
    expect(events.map((e) => e.type)).toEqual(['meta', 'tool', 'tool', 'delta', 'delta', 'action', 'ask', 'edits', 'usage', 'done']);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toMatch(/\/assistant\/chat$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(guide);
    expect(init.headers.Accept).toBe('text/event-stream');
  });

  it('passes the error event through', async () => {
    const { events } = await collect(new Response(bodyStream(sse([{ type: 'meta', conversationId: null, turnId: 't', model: 'm' }, { type: 'error', code: 'upstream', message: 'x' }]))));
    expect(events.at(-1)).toEqual({ type: 'error', code: 'upstream', message: 'x' });
  });

  it('marks the static and out-of-scope answers on done', async () => {
    const { events } = await collect(new Response(bodyStream(sse([{ type: 'done', outcome: 'static' }]))));
    expect(events[0]).toEqual({ type: 'done', outcome: 'static' });
  });

  it.each([
    [429, { error: 'Too many requests.', scope: 'session' }, 'rate_limited'],
    [401, { error: 'sign_in_required' }, 'sign_in_required'],
    [404, { error: 'not_found' }, 'not_found'],
    [503, { error: 'assistant_paused' }, 'assistant_paused'],
    [500, 'oops', 'http_500'],
  ])('turns a pre-stream %i into an error event', async (status, body, code) => {
    const { events } = await collect(new Response(typeof body === 'string' ? body : JSON.stringify(body), { status }));
    expect(events).toEqual([{ type: 'error', code, message: `HTTP ${status}` }]);
  });

  it('turns a quota 429 (authedFetch throws) into the limit code', async () => {
    const { events } = await collect(async () => {
      throw new QuotaExceededError({ error: 'quota_exceeded', metric: 'assistant_turns', limit: 5, used: 5, upgradePath: 'premium' } as never);
    });
    expect(events[0]).toMatchObject({ type: 'error', code: 'limit' });
  });

  it('rejects with AbortError on Stop', async () => {
    const ac = new AbortController();
    const fetchImpl = vi.fn(async (_u: string, init: RequestInit) => {
      ac.abort();
      init.signal?.throwIfAborted();
      return new Response('');
    });
    await expect(streamAssistantChat(guide, () => {}, ac.signal, { fetchImpl: fetchImpl as never, visitorHeader: () => ({}) })).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('sends the visitor id only through the consent-gated header hook', async () => {
    const fetchImpl = vi.fn(async () => new Response(bodyStream(sse([{ type: 'done' }]))));
    await streamAssistantChat(guide, () => {}, undefined, { fetchImpl: fetchImpl as never, visitorHeader: () => ({ 'X-MM-Visitor-ID': 'v' }) });
    expect((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].headers).toMatchObject({ 'X-MM-Visitor-ID': 'v' });
    fetchImpl.mockClear();
    await streamAssistantChat(guide, () => {}, undefined, { fetchImpl: fetchImpl as never });
    expect((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].headers).not.toHaveProperty('X-MM-Visitor-ID');
  });
});

describe('link safety', () => {
  it('keeps site links and prefixes them with the visitor locale', () => {
    expect(safeSiteHref('/tools/compress-video', 'ru-RU')).toBe('/ru/tools/compress-video');
    expect(safeSiteHref('https://www.media-manipulator.com/pricing', 'de-DE')).toBe('/de/pricing');
    expect(safeSiteHref('https://media-manipulator.com/ru/tools?x=1#a', 'en-US')).toBe('/tools?x=1#a');
    expect(safeSiteHref('/tools/compress-video', 'en-US')).toBe('/tools/compress-video');
    expect(safeSiteHref('/es-mx/pricing', 'he-IL')).toBe('/he/pricing');
  });

  it('strips everything outside the site', () => {
    for (const bad of ['https://evil.example/x', '//evil.example/x', 'javascript:alert(1)', 'data:text/html,x', 'mailto:a@b.c', '/api/assistant/chat', '/dr/x', '/embed/content-studio', 'http://media-manipulator.com.evil.io/', '', null]) {
      expect(safeSiteHref(bad as string, 'en-US'), String(bad)).toBeNull();
    }
  });

  it('leaves the editor routes unprefixed', () => {
    expect(safeSiteHref('/photo/new', 'ru-RU')).toBe('/photo/new');
    expect(safeSiteHref('/motion/new', 'fr-FR')).toBe('/motion/new');
  });

  it('classifies link targets', () => {
    expect(linkTargetKind('/ru/pricing')).toBe('pricing');
    expect(linkTargetKind('/tools/compress-video')).toBe('tool');
    expect(linkTargetKind('/photo/new')).toBe('editor');
    expect(linkTargetKind('/tools/content-studio')).toBe('editor');
    expect(linkTargetKind('/de/about')).toBe('page');
  });

  it('builds the locale-prefixed action route with its preset', () => {
    expect(actionHref('open_tool', { slug: 'add-vignette', route: '/tools/add-vignette', preset: 'vintage' }, 'ru-RU')).toBe('/ru/tools/add-vignette?preset=vintage');
    expect(actionHref('open_tool', { slug: 'compress-video' }, 'en-US')).toBe('/tools/compress-video');
    expect(actionHref('open_tool', { slug: 'x', preset: 'bad preset!' }, 'en-US')).toBe('/tools/x');
    expect(actionHref('navigate', { target: '/pricing' }, 'ja-JP')).toBe('/ja/pricing');
    // MM116a: options ride in ?o= (base64url JSON), after any preset, never when empty or too big.
    const o = encodeOptions({ level: 'smallest', crf: 30 });
    expect(actionHref('open_tool', { slug: 'compress-video', options: { level: 'smallest', crf: 30 } }, 'en-US')).toBe(`/tools/compress-video?o=${o}`);
    expect(actionHref('open_tool', { slug: 'compress-video', preset: 'web', options: { level: 'smallest', crf: 30 } }, 'ru-RU')).toBe(`/ru/tools/compress-video?preset=web&o=${o}`);
    expect(actionHref('open_tool', { slug: 'compress-video', options: {} }, 'en-US')).toBe('/tools/compress-video');
    expect(actionHref('open_tool', { slug: 'compress-video', options: [1] }, 'en-US')).toBe('/tools/compress-video');
    expect(actionHref('open_tool', { slug: 'compress-video', options: { pad: 'x'.repeat(4000) } }, 'en-US')).toBe('/tools/compress-video');
    expect(actionHref('navigate', { target: 'https://evil.example' }, 'en-US')).toBeNull();
    expect(actionHref('open_tool', { slug: '../../x' }, 'en-US')).toBeNull();
    expect(actionHref('heal', {}, 'en-US')).toBeNull();
  });
});

describe('where the guide appears', () => {
  it('shows on public pages in every locale', () => {
    for (const p of ['/', '/ru', '/tools/compress-video', '/he/pricing', '/es-mx/tools', '/tools/aperture']) expect(guideAllowedOn(p), p).toBe(true);
  });
  it('hides on the excluded routes', () => {
    for (const p of ['/dr', '/dr/docs', '/embed/content-studio', '/translator', '/ru/translate-guide', '/motion/abc', '/photo/new', '/tools/content-studio', '/de/tools/content-studio', '/r/token', null]) {
      expect(guideAllowedOn(p as string), String(p)).toBe(false);
    }
  });
  it('teases the copilot on editor tool pages only', () => {
    const photo = new Set(['color-pop']);
    expect(editorTeaserFor('/ru/tools/color-pop', photo)).toBe('photo');
    expect(editorTeaserFor('/tools/aperture', photo)).toBe('photo');
    expect(editorTeaserFor('/tools/motion', photo)).toBe('vector');
    expect(editorTeaserFor('/tools/compress-video', photo)).toBeNull();
    expect(EDITOR_HREF.photo).toBe('/photo/new');
  });
});

describe('analytics buckets', () => {
  it('maps numbers and codes onto the catalog enums', () => {
    expect([1, 2, 3, 4, 10, 11].map(turnIndexBucket)).toEqual(['1', '2-3', '2-3', '4-10', '4-10', '11+']);
    expect([999, 1000, 2999, 9999, 29_999, 30_000].map(latencyBucket)).toEqual(['<1s', '1-3s', '1-3s', '3-10s', '10-30s', '30s+']);
    expect([9_999, 10_000, 60_000, 300_000].map(undoBucket)).toEqual(['<10s', '10-60s', '60-300s', '300s+']);
    expect(['upstream', 'tool_limit', 'assistant_paused', 'limit', 'invalid_ops', 'rate_limited', 'sign_in_required', 'aborted', 'http_500'].map(failReason)).toEqual([
      'upstream', 'upstream', 'paused', 'limit', 'invalid_ops', 'rate_limited', 'sign_in', 'aborted', 'error',
    ]);
    const none = { edits: false, action: false, ask: false };
    expect(answerOutcome({}, none)).toBe('text');
    expect(answerOutcome({ outcome: 'static' }, none)).toBe('static');
    expect(answerOutcome({}, { ...none, action: true })).toBe('action');
    expect(answerOutcome({}, { ...none, ask: true, action: true })).toBe('ask');
    expect(answerOutcome({}, { edits: true, ask: true, action: true })).toBe('edits');
  });
});
