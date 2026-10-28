'use client';

import React from 'react';
import { Repeat, SlidersHorizontal } from 'lucide-react';
import { QuotaChip } from '@/components/quota-chip';
import { Segmented } from '@/components/darkroom/segmented';
import { useLocalization } from '@/i18n/useLocalization';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import { useConvertVoice, useShiftVoice, useVoices } from '@/lib/useVoices';
import type { VoicesCapabilities } from '@/lib/voices/voicesApi';
import { VoiceJobResult, jobFromStart } from './voice-job-result';
import { VoicePicker, type VoiceChoice } from './voice-picker';
import { VoiceRecorderPanel, type VoiceClip } from './voice-recorder-panel';
import { DEFAULT_SHIFT, VoiceShifter, type ShiftSettings } from './voice-shifter';
import { VoiceToolFrame } from './voice-tool-frame';
import { VoicesSignInPrompt, VoicesUnavailable, VoicesUpgradeHint, WarmingUp } from './warming-up';
import { BUTTON_PRIMARY, Spinner, VoiceError, VoiceNote, useVoiceErrorMessage } from './shared';

/**
 * /tools/voice-changer (task `voice_convert`, MM78 decision 4): upload or record speech,
 * then either **Shift** (rubberband, instant, one `ops`, works for everyone and with the
 * voice engine off) or **Convert to a saved voice or a preset** (AI, one `ai_ops`; needs an
 * account and a plan with `voicesConvert`, else a sign-in prompt / upgrade hint before
 * anything is uploaded). Both results open the MM02 audio A/B compare against the input.
 */
type Mode = 'shift' | 'convert';

export const VoiceChangerPanel: React.FC = () => (
  <VoiceToolFrame allowWhenDisabled>{({ caps, signedIn }) => <ChangerBody caps={caps} signedIn={signedIn} />}</VoiceToolFrame>
);

export const ChangerBody: React.FC<{ caps: VoicesCapabilities; signedIn: boolean }> = ({ caps, signedIn }) => {
  const { t } = useLocalization('interface');
  const errorMessage = useVoiceErrorMessage();
  const groupId = React.useId();
  const [mode, setMode] = React.useState<Mode>('shift');
  const [clip, setClip] = React.useState<VoiceClip | null>(null);
  const [shift, setShift] = React.useState<ShiftSettings>(DEFAULT_SHIFT);
  const [target, setTarget] = React.useState<VoiceChoice | null>(null);
  const [job, setJob] = React.useState<ConversionJob | null>(null);
  const [original, setOriginal] = React.useState<File | null>(null);
  const [jobTask, setJobTask] = React.useState<'voice_shift' | 'voice_convert'>('voice_shift');
  // voice_generated (MM79): convert to a preset reports the language the API used (en
  // unless the preset needs another; the panel sends none), a saved voice / shift none.
  const [jobLanguage, setJobLanguage] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);
  const shiftMutation = useShiftVoice();
  const convertMutation = useConvertVoice();
  const voices = useVoices(signedIn && mode === 'convert');
  const pending = shiftMutation.isPending || convertMutation.isPending;
  const running = !!job && job.status !== 'completed' && job.status !== 'failed';

  const saved = voices.data?.voices ?? [];
  const effectiveTarget: VoiceChoice | null =
    target ?? (saved[0] ? { kind: 'voice', id: saved[0].id } : caps.presets[0] ? { kind: 'preset', id: caps.presets[0].id } : null);
  // What may convert: engine on, signed in, the plan includes it.
  const convertBlock: 'unavailable' | 'signin' | 'plan' | null = !caps.enabled
    ? 'unavailable'
    : !signedIn
      ? 'signin'
      : !caps.limits.voicesConvert
        ? 'plan'
        : null;

  const onStarted = (res: { jobId: string; tool: string }) => {
    setOriginal(clip?.file ?? null);
    setJobTask(res.tool === 'voice_convert' ? 'voice_convert' : 'voice_shift');
    setJobLanguage(res.tool === 'voice_convert' && effectiveTarget?.kind === 'preset' ? 'en' : undefined);
    setJob(jobFromStart(res.jobId, clip?.file));
  };
  const onError = (err: unknown) => setError(errorMessage(err));

  const run = () => {
    if (!clip || pending || running) return;
    setError(null);
    setJob(null);
    if (mode === 'shift') {
      shiftMutation.mutate(
        { input: clip.file, semitones: shift.semitones, formant: shift.formant, preset: shift.preset ?? undefined },
        { onSuccess: onStarted, onError },
      );
      return;
    }
    if (convertBlock || !effectiveTarget) return;
    convertMutation.mutate(
      {
        input: clip.file,
        target: effectiveTarget.kind === 'voice' ? { voiceId: effectiveTarget.id } : { preset: effectiveTarget.id },
      },
      { onSuccess: onStarted, onError },
    );
  };

  const canRun = !!clip && !pending && !running && (mode === 'shift' || (!convertBlock && !!effectiveTarget));

  return (
    <div className="space-y-5">
      <QuotaChip metric={mode === 'shift' ? 'ops' : 'ai_ops'} busy={pending || running} />
      <VoiceRecorderPanel
        gate="none"
        clip={clip}
        onClip={(c) => {
          setClip(c);
          setJob(null);
        }}
        disabled={pending}
      />
      <Segmented<Mode>
        name={`${groupId}-mode`}
        label={t('voiceTools.changer.modeLabel')}
        value={mode}
        onValueChange={(m) => {
          setMode(m);
          setError(null);
        }}
        options={[
          { value: 'shift', label: t('voiceTools.changer.modes.shift'), icon: <SlidersHorizontal aria-hidden="true" className="size-4" /> },
          { value: 'convert', label: t('voiceTools.changer.modes.convert'), icon: <Repeat aria-hidden="true" className="size-4" /> },
        ]}
      />
      {mode === 'shift' ? (
        <>
          <VoiceNote>{t('voiceTools.changer.shiftHint')}</VoiceNote>
          <VoiceShifter value={shift} onChange={setShift} disabled={pending} />
        </>
      ) : (
        <>
          <VoiceNote>{t('voiceTools.changer.convertHint')}</VoiceNote>
          {convertBlock === 'unavailable' ? (
            <VoicesUnavailable />
          ) : convertBlock === 'signin' ? (
            <VoicesSignInPrompt source="voice_changer_convert" />
          ) : convertBlock === 'plan' ? (
            <VoicesUpgradeHint message={t('voiceTools.changer.convertNotInPlan')} />
          ) : (
            <VoicePicker
              saved={saved}
              presets={caps.presets}
              value={effectiveTarget}
              onChange={setTarget}
              label={t('voiceTools.changer.targetLabel')}
              disabled={pending}
            />
          )}
        </>
      )}
      <button type="button" className={`${BUTTON_PRIMARY} w-full`} disabled={!canRun} onClick={run}>
        {pending ? <Spinner /> : mode === 'shift' ? <SlidersHorizontal aria-hidden="true" className="size-4" /> : <Repeat aria-hidden="true" className="size-4" />}
        {mode === 'shift'
          ? pending
            ? t('voiceTools.shifter.shifting')
            : t('voiceTools.shifter.shift')
          : pending
            ? t('voiceTools.changer.converting')
            : t('voiceTools.changer.convert')}
      </button>
      {mode === 'convert' ? <WarmingUp warm={caps.warm} inFlight={pending || running} /> : null}
      <VoiceError message={error} />
      {job ? (
        <VoiceJobResult
          job={job}
          setJob={setJob}
          task={jobTask}
          language={jobLanguage}
          original={original}
          fallbackFileName={`${(original?.name ?? 'recording').replace(/\.[^.]+$/, '')}_voice.mp3`}
          onRunAnother={() => setJob(null)}
        />
      ) : null}
    </div>
  );
};

export default VoiceChangerPanel;
