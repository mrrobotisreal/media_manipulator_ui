'use client';

import React from 'react';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useVoicesCapabilities } from '@/lib/useVoices';
import type { VoicesCapabilities } from '@/lib/voices/voicesApi';
import { VoicesUnavailable } from './warming-up';
import { VoiceNote } from './shared';

/**
 * What every voices tool page renders around its panel (MM78 decision 9): feature-detect
 * with GET /api/voices/capabilities, show the honest "not available" state when the
 * engine is off or unreachable, and the honesty note (watermark, permission, no
 * training, our own servers) above every form.
 *
 * `allowWhenDisabled` lets the voice changer keep its shifter: rubberband needs no
 * voice engine, so it works with `enabled: false`.
 */
export interface VoiceToolContext {
  caps: VoicesCapabilities;
  signedIn: boolean;
}

/** Capabilities to fall back on when the endpoint itself cannot be read (shifter only). */
const OFFLINE_CAPS: VoicesCapabilities = {
  enabled: false,
  warm: false,
  engines: {},
  languages: [],
  designLanguages: [],
  presets: [],
  shiftPresets: [],
  signedIn: false,
  limits: { voicesSaved: 0, voicesMaxSeconds: 0, voicesConvert: false, voicesConvertMaxSeconds: 0, textMaxChars: 0 },
  tier: 'anonymous',
};

export const VoiceToolFrame: React.FC<{
  allowWhenDisabled?: boolean;
  children: (ctx: VoiceToolContext) => React.ReactNode;
}> = ({ allowWhenDisabled, children }) => {
  const { t } = useLocalization('interface');
  const auth = useAuth();
  const caps = useVoicesCapabilities();
  if (caps.isPending || auth?.loading) return <PanelLoading variant="inline" label={t('voiceTools.loading')} />;
  const data = caps.data ?? null;
  const enabled = !!data?.enabled;
  // The API's `signedIn` is what it will enforce; the auth context covers the moment
  // between sign-in and the capabilities refetch.
  const signedIn = !!auth?.user || !!data?.signedIn;
  if (!enabled && !allowWhenDisabled) return <VoicesUnavailable />;
  return (
    <div className="space-y-5">
      <VoiceNote>{t('voiceTools.honesty')}</VoiceNote>
      {!enabled ? <VoicesUnavailable shiftStillWorks /> : null}
      {children({ caps: data ?? OFFLINE_CAPS, signedIn })}
    </div>
  );
};

export default VoiceToolFrame;
