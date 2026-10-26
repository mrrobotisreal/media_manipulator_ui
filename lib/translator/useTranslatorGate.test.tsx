import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createFakeTranslatorApi, type MeResult } from './api';
import { useTranslatorGate, type GateAuth } from './useTranslatorGate';

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
