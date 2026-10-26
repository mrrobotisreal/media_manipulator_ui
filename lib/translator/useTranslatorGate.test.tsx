import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createFakeTranslatorApi, type MeResult } from './api';
import { GATE_CACHE_PREFIX, GATE_CACHE_TTL_MS, sessionGateCache, useTranslatorGate, type GateAuth } from './useTranslatorGate';

afterEach(() => window.sessionStorage.clear());

const signedIn: GateAuth = { loading: false, user: { uid: 'u1' }, emailVerified: true };

function gate(me: MeResult, opts: { auth?: GateAuth | null; locale?: string | null; token?: string | null } = {}) {
  const api = createFakeTranslatorApi({ me });
  const getIdToken = vi.fn(async () => (opts.token === undefined ? 'id-token' : opts.token));
  const auth = opts.auth === undefined ? signedIn : opts.auth;
  const locale = opts.locale === undefined ? 'ar-SA' : opts.locale;
  const hook = renderHook(() => useTranslatorGate({ api, auth, locale, getIdToken }));
  return { api, getIdToken, ...hook };
}

describe('useTranslatorGate (design §2.8)', () => {
  it('allowed for this locale -> allowed, with the token sent to /me', async () => {
    const { result, api } = gate({ status: 'allowed', email: 't@x.io', locale: 'ar-SA' });
    await waitFor(() => expect(result.current.state).toEqual({ kind: 'allowed', email: 't@x.io', locale: 'ar-SA' }));
    expect(api.calls.me).toEqual(['id-token']);
  });

  it('allowed but for another locale -> denied (wrong_locale)', async () => {
    const { result } = gate({ status: 'allowed', email: 't@x.io', locale: 'de-DE' });
    await waitFor(() => expect(result.current.state).toEqual({ kind: 'denied', reason: 'wrong_locale' }));
  });

  it('unverified -> unverified (the notice)', async () => {
    const { result } = gate({ status: 'unverified' });
    await waitFor(() => expect(result.current.state.kind).toBe('unverified'));
  });

  it.each<[string, MeResult]>([
    ['not_allowlisted', { status: 'not_allowlisted' }],
    ['wrong_locale', { status: 'wrong_locale' }],
    ['unauthorized', { status: 'unauthorized' }],
    ['error', { status: 'error', detail: 'HTTP 404' }],
  ])('%s -> denied (plain site)', async (_name, me) => {
    const { result } = gate(me);
    await waitFor(() => expect(result.current.state.kind).toBe('denied'));
  });

  it('signed out -> signed_out without calling /me', async () => {
    const { result, api } = gate({ status: 'allowed', email: 'e', locale: 'ar-SA' }, { auth: { loading: false, user: null, emailVerified: null } });
    await waitFor(() => expect(result.current.state.kind).toBe('signed_out'));
    expect(api.calls.me).toEqual([]);
  });

  it('no AuthProvider or no armed locale -> denied without calling /me', async () => {
    const a = gate({ status: 'allowed', email: 'e', locale: 'ar-SA' }, { auth: null });
    await waitFor(() => expect(a.result.current.state).toEqual({ kind: 'denied', reason: 'no_auth' }));
    const b = gate({ status: 'allowed', email: 'e', locale: 'ar-SA' }, { locale: null });
    await waitFor(() => expect(b.result.current.state).toEqual({ kind: 'denied', reason: 'not_armed' }));
    expect(a.api.calls.me.length + b.api.calls.me.length).toBe(0);
  });

  it('recheck() asks /me again (after "I\'ve verified")', async () => {
    const { result, api } = gate({ status: 'unverified' });
    await waitFor(() => expect(result.current.state.kind).toBe('unverified'));
    api.setMe({ status: 'allowed', email: 'e', locale: 'ar-SA' });
    act(() => result.current.recheck());
    await waitFor(() => expect(result.current.state.kind).toBe('allowed'));
    expect(api.calls.me).toHaveLength(2);
  });
});

describe('MM56 /me session cache (dry-run defect 2)', () => {
  it('stores only an allowed answer, keyed by locale, with the uid', async () => {
    const { result } = gate({ status: 'allowed', email: 't@x.io', locale: 'ar-SA' });
    await waitFor(() => expect(result.current.state.kind).toBe('allowed'));
    const raw = JSON.parse(window.sessionStorage.getItem(`${GATE_CACHE_PREFIX}ar-SA`)!);
    expect(raw).toMatchObject({ uid: 'u1', email: 't@x.io' });
  });

  it('a fresh entry renders allowed on the first render, and /me is still asked', async () => {
    sessionGateCache().write('ar-SA', { uid: 'u1', email: 't@x.io', at: Date.now() });
    const { result, api } = gate({ status: 'allowed', email: 't@x.io', locale: 'ar-SA' });
    expect(result.current.state).toEqual({ kind: 'allowed', email: 't@x.io', locale: 'ar-SA' });
    await waitFor(() => expect(api.calls.me).toEqual(['id-token']));
  });

  it.each<[string, MeResult]>([
    ['not_allowlisted', { status: 'not_allowlisted' }],
    ['unverified', { status: 'unverified' }],
    ['unauthorized', { status: 'unauthorized' }],
    ['error', { status: 'error', detail: 'HTTP 500' }],
    ['another locale', { status: 'allowed', email: 'e', locale: 'de-DE' }],
  ])('a cached allow is revoked by %s: state leaves allowed, entry removed', async (_n, me) => {
    sessionGateCache().write('ar-SA', { uid: 'u1', email: 't@x.io', at: Date.now() });
    const { result } = gate(me);
    await waitFor(() => expect(result.current.state.kind).not.toBe('allowed'));
    expect(window.sessionStorage.getItem(`${GATE_CACHE_PREFIX}ar-SA`)).toBeNull();
  });

  it('ignores an expired entry, another uid, and junk', () => {
    const c = sessionGateCache();
    const now = 10_000_000;
    c.write('ar-SA', { uid: 'u1', email: 'e', at: now - GATE_CACHE_TTL_MS - 1 });
    expect(c.read('ar-SA', 'u1', now)).toBeNull();
    c.write('ar-SA', { uid: 'u1', email: 'e', at: now });
    expect(c.read('ar-SA', 'u2', now)).toBeNull();
    expect(c.read('ar-SA', 'u1', now)?.email).toBe('e');
    expect(c.read('ar-SA', null, now)?.uid).toBe('u1');
    window.sessionStorage.setItem(`${GATE_CACHE_PREFIX}ar-SA`, '{not json');
    expect(c.read('ar-SA', 'u1', now)).toBeNull();
  });

  it('while auth restores, a cached entry shows the panel; a signed-out answer clears it', async () => {
    sessionGateCache().write('ar-SA', { uid: 'u1', email: 't@x.io', at: Date.now() });
    const api = createFakeTranslatorApi({ me: { status: 'allowed', email: 't@x.io', locale: 'ar-SA' } });
    let auth: GateAuth = { loading: true, user: null, emailVerified: null };
    const getIdToken = async () => 'tok';
    const hook = renderHook(() => useTranslatorGate({ api, auth, locale: 'ar-SA', getIdToken }));
    expect(hook.result.current.state.kind).toBe('allowed');
    auth = { loading: false, user: null, emailVerified: null };
    hook.rerender();
    await waitFor(() => expect(hook.result.current.state.kind).toBe('signed_out'));
    expect(window.sessionStorage.getItem(`${GATE_CACHE_PREFIX}ar-SA`)).toBeNull();
  });
});

