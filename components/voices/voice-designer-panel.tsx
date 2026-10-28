'use client';

import React from 'react';
import { QuotaChip } from '@/components/quota-chip';
import { useVoices } from '@/lib/useVoices';
import { MyVoices } from './my-voices';
import { SpeakPanel } from './speak-panel';
import { VoiceDesigner } from './voice-designer';
import { VoiceToolFrame } from './voice-tool-frame';
import type { VoiceChoice } from './voice-picker';

/**
 * /tools/voice-designer (task `voice_design`, MM78 decision 4): describe → preview (free,
 * 3 per description per hour) → keep (sign-in, one ai_ops) → speak. Anonymous visitors
 * can preview; keeping asks them to sign in first.
 */
export const VoiceDesignerPanel: React.FC = () => (
  <VoiceToolFrame>
    {({ caps, signedIn }) => <DesignerBody caps={caps} signedIn={signedIn} />}
  </VoiceToolFrame>
);

const DesignerBody: React.FC<{ caps: Parameters<typeof VoiceDesigner>[0]['caps']; signedIn: boolean }> = ({ caps, signedIn }) => {
  const voices = useVoices(signedIn);
  const [choice, setChoice] = React.useState<VoiceChoice | null>(null);
  return (
    <div className="space-y-6">
      <QuotaChip metric="ai_ops" />
      <VoiceDesigner caps={caps} signedIn={signedIn} onKept={(v) => setChoice({ kind: 'voice', id: v.id })} />
      {signedIn && voices.data ? (
        <MyVoices list={voices.data} selectedId={choice?.kind === 'voice' ? choice.id : null} onUse={(v) => setChoice({ kind: 'voice', id: v.id })} />
      ) : null}
      <SpeakPanel caps={caps} saved={signedIn ? (voices.data?.voices ?? []) : []} initialChoice={choice} signedIn={signedIn} />
    </div>
  );
};

export default VoiceDesignerPanel;
