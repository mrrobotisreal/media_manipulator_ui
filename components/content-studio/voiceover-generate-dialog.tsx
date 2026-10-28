'use client';

import React from 'react';
import { AudioLines } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useAuth } from '@/lib/auth/AuthProvider';
import { publishQuotaRefund } from '@/lib/auth/quotaBus';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { editSummary } from '@/lib/studio/telemetry';
import {
  readVoiceoverJob,
  startVoiceover,
  type VoiceoverInput,
  type VoiceoverJobState,
} from '@/lib/studio/voiceoverGenerate';
import { useVoices, useVoicesCapabilities } from '@/lib/useVoices';
import { trackVoiceGenerated } from '@/lib/voices/analytics';
import { VoicePicker, type VoiceChoice } from '@/components/voices/voice-picker';
import { presetLanguages } from '@/components/voices/speak-panel';
import { VoicesSignInPrompt, VoicesUnavailable, WarmingUp } from '@/components/voices/warming-up';
import {
  BUTTON_PRIMARY,
  FIELD,
  LABEL,
  Spinner,
  VoiceError,
  VoiceNote,
  useDefaultVoiceLanguage,
  useLanguageName,
  useVoiceErrorMessage,
} from '@/components/voices/shared';
import { useStudioProjectAssetsRefresh } from './voiceover-generate-assets';

/**
 * Darkroom "Generate voiceover" (MM79, design VOICES.md §4.5). Pick a saved voice
 * (signed in) or a preset, type the text (MM78 live counter against the tier cap),
 * pick a language, Generate. The API renders through the voices service and ingests the
 * WAV as an audio asset of this project; when the job completes the asset is fetched,
 * selected in the bin and placed at the playhead where Generate was pressed (the same
 * placement a recorded voiceover gets). Errors use the MM78 code map. Loaded lazily
 * with the panels shard (voiceTools.*), so it adds nothing to the editor's first load.
 */
export interface VoiceoverGenerateDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The new asset id, once it is in the bin (the bin selects it). */
  onAssetReady: (assetId: string) => void;
  /** Test seam: the job poll interval. */
  pollMs?: number;
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'starting' }
  | { kind: 'running'; jobId: string; progress: number }
  | { kind: 'error'; message: string };

const VoiceoverGenerateDialog: React.FC<VoiceoverGenerateDialogProps> = ({ projectId, open, onOpenChange, onAssetReady, pollMs = 2000 }) => {
  const { t } = useLocalization('interface');
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const backend = useStudioBackend();
  const caps = useVoicesCapabilities();
  const voices = useVoices(open && signedIn);
  const languageName = useLanguageName();
  const errorMessage = useVoiceErrorMessage();
  const refreshAssets = useStudioProjectAssetsRefresh(projectId);
  const id = React.useId();

  const [choice, setChoice] = React.useState<VoiceChoice | null>(null);
  const [text, setText] = React.useState('');
  const [language, setLanguage] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>({ kind: 'idle' });
  const playheadRef = React.useRef(0);

  const capabilities = caps.data;
  const saved = signedIn ? (voices.data?.voices ?? []) : [];
  const presets = capabilities?.presets ?? [];
  const fallback: VoiceChoice | null = saved[0]
    ? { kind: 'voice', id: saved[0].id }
    : presets[0]
      ? { kind: 'preset', id: presets[0].id }
      : null;
  // A stale pick (a saved voice while signed out) falls back.
  const effective = choice && (choice.kind === 'preset' || signedIn) ? choice : fallback;
  const languages = capabilities ? (effective?.kind === 'preset' ? presetLanguages(capabilities, effective.id) : capabilities.languages) : [];
  const defaultLanguage = useDefaultVoiceLanguage(languages);
  const lang = language && languages.includes(language) ? language : defaultLanguage;

  const max = capabilities?.limits.textMaxChars ?? 0;
  const used = [...text.trim()].length;
  const over = used > max;
  const running = phase.kind === 'running' || phase.kind === 'starting';
  const canGenerate = !!capabilities?.enabled && !!effective && used > 0 && !over && max > 0 && !running;

  // Poll the job; on completion bring the asset into the bin and place it.
  React.useEffect(() => {
    if (phase.kind !== 'running') return;
    let stopped = false;
    const jobId = phase.jobId;
    const finish = async (job: VoiceoverJobState) => {
      if (job.status === 'failed') {
        publishQuotaRefund();
        setPhase({ kind: 'error', message: job.error || t('voiceTools.result.failed') });
        return;
      }
      trackVoiceGenerated(jobId, {
        tool: 'voice_tts',
        resultSeconds: job.resultSeconds,
        language: lang,
        source: 'darkroom',
      });
      const assetId = job.assetId;
      if (!assetId) {
        setPhase({ kind: 'error', message: t('voiceTools.darkroom.noAsset') });
        return;
      }
      await refreshAssets();
      if (useStudioStore.getState().assets[assetId]) {
        useStudioStore.getState().placeAssetAtPlayhead(assetId, playheadRef.current);
      }
      editSummary.increment('voiceoversRecorded');
      onAssetReady(assetId);
      toast.success(t('voiceTools.darkroom.added'));
      setPhase({ kind: 'idle' });
      setText('');
      onOpenChange(false);
    };
    const tick = async () => {
      if (stopped) return;
      try {
        const job = await readVoiceoverJob(backend, jobId);
        if (stopped) return;
        if (job.status === 'completed' || job.status === 'failed') {
          stopped = true;
          await finish(job);
          return;
        }
        setPhase((p) => (p.kind === 'running' && p.jobId === jobId && p.progress !== job.progress ? { ...p, progress: job.progress } : p));
      } catch {
        // transient; the next tick retries
      }
    };
    void tick();
    const timer = setInterval(() => void tick(), pollMs);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.kind === 'running' ? phase.jobId : null]);

  const generate = async () => {
    if (!effective || !canGenerate) return;
    playheadRef.current = useStudioStore.getState().playhead;
    const input: VoiceoverInput =
      effective.kind === 'voice'
        ? { voiceId: effective.id, text: text.trim(), language: lang }
        : { preset: effective.id, text: text.trim(), language: lang };
    setPhase({ kind: 'starting' });
    try {
      const res = await startVoiceover(backend, projectId, input);
      setPhase({ kind: 'running', jobId: res.jobId, progress: 0 });
    } catch (err) {
      setPhase({ kind: 'error', message: errorMessage(err) });
    }
  };

  const body = () => {
    if (caps.isPending) {
      return (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          {t('voiceTools.loading')}
        </p>
      );
    }
    if (!capabilities?.enabled) return <VoicesUnavailable />;
    return (
      <div className="space-y-4">
        <VoicePicker
          saved={saved}
          presets={presets}
          value={effective}
          onChange={setChoice}
          showSaved={signedIn}
          disabled={running}
        />
        {!signedIn ? (
          <div data-testid="voiceover-signin">
            <VoiceNote>{t('voiceTools.darkroom.presetsOnly')}</VoiceNote>
            <div className="mt-2">
              <VoicesSignInPrompt source="darkroom_voiceover" />
            </div>
          </div>
        ) : null}
        <div>
          <label htmlFor={`${id}-text`} className={LABEL}>
            {t('voiceTools.speak.textLabel')}
          </label>
          <textarea
            id={`${id}-text`}
            className={`${FIELD} min-h-28`}
            value={text}
            disabled={running}
            placeholder={t('voiceTools.darkroom.placeholder')}
            aria-describedby={`${id}-counter`}
            aria-invalid={over || undefined}
            onChange={(e) => setText(e.target.value)}
          />
          <p
            id={`${id}-counter`}
            aria-live="polite"
            data-testid="voiceover-counter"
            className={`mt-1 text-xs tabular-nums ${over ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {t('voiceTools.speak.counter', { used, max })}
            {over ? ` · ${t('voiceTools.speak.overLimit', { max })}` : ''}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-lang`} className={LABEL}>
            {t('voiceTools.speak.languageLabel')}
          </label>
          <select id={`${id}-lang`} className={FIELD} value={lang} disabled={running} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((l) => (
              <option key={l} value={l}>
                {languageName(l)}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className={`${BUTTON_PRIMARY} w-full`} disabled={!canGenerate} onClick={() => void generate()}>
          {running ? <Spinner /> : <AudioLines aria-hidden="true" className="size-4" />}
          {running
            ? phase.kind === 'running' && phase.progress > 0
              ? `${t('voiceTools.speak.generating')} ${phase.progress}%`
              : t('voiceTools.speak.generating')
            : t('voiceTools.darkroom.generate')}
        </button>
        <WarmingUp warm={capabilities.warm} inFlight={running} />
        <VoiceError message={phase.kind === 'error' ? phase.message : null} />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (running ? undefined : onOpenChange(next))}>
      <DialogContent className="sm:max-w-lg" data-testid="voiceover-dialog">
        <DialogHeader>
          <DialogTitle>{t('voiceTools.darkroom.title')}</DialogTitle>
          <DialogDescription>{t('voiceTools.darkroom.description')}</DialogDescription>
        </DialogHeader>
        {body()}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceoverGenerateDialog;
