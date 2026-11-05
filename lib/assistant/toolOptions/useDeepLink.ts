'use client';

import { createContext, useContext, useMemo } from 'react';

import { OPTIONS_PARAM, decodeOptions, type OptionValues } from './codec';
import { optionsSpecFor, type OptionsSpecInput } from './schemas';

/**
 * MM116a: the validated `?o=` options of the current tool page, or undefined. Read once from
 * `window.location` (the panel is `ssr:false`, so it only ever runs in the browser, and a
 * static tool page never needs `searchParams`). An invalid, oversized or unknown-field link
 * yields undefined: the page simply opens as it always did.
 */
export function readDeepLinkOptions(search: string, input: OptionsSpecInput): OptionValues | undefined {
  const raw = new URLSearchParams(search).get(OPTIONS_PARAM);
  if (!raw) return undefined;
  const res = decodeOptions(raw, optionsSpecFor(input));
  return res.ok && Object.keys(res.options).length > 0 ? res.options : undefined;
}

export function useDeepLinkOptions(input: OptionsSpecInput): OptionValues | undefined {
  const key = JSON.stringify(input);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => (typeof window === 'undefined' ? undefined : readDeepLinkOptions(window.location.search, input)), [key]);
}

/** The validated options the hosting EmbeddedToolPanel read; focused panels without a presets prop read it here. */
export const DeepLinkContext = createContext<OptionValues | undefined>(undefined);
export const useDeepLinkContext = () => useContext(DeepLinkContext);
