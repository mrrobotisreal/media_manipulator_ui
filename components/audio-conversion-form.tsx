'use client';

import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Trans } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { audioConversionSchema } from "@/schemas/audioSchema";
import ConversionOptions from "@/components/conversion-options";
import MediaTrimModal from "@/components/media-trim-modal";
import AdvancedAudioEffects from "@/components/advanced-audio-effects";
import InfoTooltip from "@/components/info-tooltip";
import type { ConversionFormData } from "@/schemas/types";
import { useEffect, useState } from "react";
import { useLocalization } from "@/i18n/useLocalization";
import type { AudioFormPresets } from "@/components/embedded-tool-panel";
import { StemFormatSelect, useMediaDuration } from "@/components/stem-format-select";
import { isStemOperation, type StemFormatChoice } from "@/lib/audio/stemFormat";

interface TrimRange {
  startTime: number;
  endTime: number;
}

// Form components for each file type
const AudioConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  audioUrl?: string;
  /** Tool-page preset (embed.preset kind 'audio'). Absent = untouched defaults. */
  presets?: AudioFormPresets;
  /** The chosen file's name and type: the vocal tools' "Same as input" resolves from them (MM81). */
  fileName?: string;
  fileType?: string;
}> = ({ onSubmit, isLoading, audioUrl, presets, fileName, fileType }) => {
  const { t, formatDuration } = useLocalization(['interface', 'error', 'accessibility']);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange | null>(null);

  const fx = presets?.effectDefaults;
  // MM81: vocal stems default to "Same as input" (`auto`, resolved by the API). A preset may
  // still pin a concrete stem format (mp3 / flac / wav).
  const presetStem = presets?.stemFormat;
  const [stemChoice, setStemChoice] = useState<StemFormatChoice>(presetStem ?? 'auto');
  const durationSeconds = useMediaDuration(audioUrl);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(audioConversionSchema),
    defaultValues: {
      format: ((presets?.lockedFormat ?? presets?.defaultFormat) as 'mp3' | undefined) ?? ('mp3' as const),
      bitrate: '192' as const,
      speed: fx?.speed ?? 1,
      volume: fx?.volume ?? 1,
      // Basic Processing defaults
      basicProcessing: {
        normalize: fx?.normalize ?? false,
        amplify: 0,
        fadeIn: 0,
        fadeOut: 0,
        equalizer: {
          enabled: !!fx?.equalizerPreset && fx.equalizerPreset !== 'none',
          preset: fx?.equalizerPreset ?? ('none' as const),
        },
        stereo: {
          pan: 0,
          balance: 0,
          width: 100,
          monoConversion: false,
          channelSwap: false,
        },
      },
      // Time-Based Effects defaults
      timeBasedEffects: {
        reverb: {
          enabled: !!fx?.reverbType && fx.reverbType !== 'none',
          type: fx?.reverbType ?? ('none' as const),
          roomSize: 50,
          damping: 50,
          wetLevel: 30,
          dryLevel: 70,
        },
        delay: {
          enabled: false,
          type: 'none' as const,
          time: 500,
          feedback: 30,
          wetLevel: 25,
        },
        modulation: {
          enabled: false,
          type: 'none' as const,
          rate: 2,
          depth: 50,
          feedback: 20,
        },
      },
      // Restoration defaults
      restoration: {
        noiseReduction: {
          enabled: false,
          type: 'none' as const,
          strength: 50,
          sensitivity: 50,
        },
        deHum: {
          enabled: false,
          frequency: 'auto' as const,
          harmonics: 3,
        },
        declip: {
          enabled: false,
          threshold: 95,
          strength: 50,
        },
        silenceDetection: {
          enabled: false,
          threshold: -50,
          minDuration: 1,
          action: 'mark' as const,
        },
      },
      // Advanced defaults
      advanced: {
        pitchShift: {
          enabled: fx?.pitchSemitones !== undefined,
          semitones: fx?.pitchSemitones ?? 0,
          preserveFormants: true,
        },
        timeStretch: {
          enabled: false,
          factor: 1,
          algorithm: 'pitch' as const,
        },
        spatialAudio: {
          enabled: false,
          type: 'none' as const,
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        spectral: {
          enabled: false,
          type: 'none' as const,
          fftSize: 2048,
        },
      },
      ai: {
        enabled: !!presets?.aiOperation,
        operation: presets?.aiOperation ?? ('none' as const),
      },
    },
    mode: 'onChange',
  });

  const aiOperation = useWatch({ control, name: 'ai.operation' });

  useEffect(() => {
    const active = aiOperation && aiOperation !== 'none';
    setValue('ai.enabled', !!active);
    // MM81: no forced WAV any more. A vocal stem's format comes from the "Output format"
    // select below (default "Same as input"); other AI audio ops keep the selected format.
  }, [aiOperation, setValue]);
  const stemActive = isStemOperation(aiOperation);

  const onSubmitHandler = (data: unknown) => {
    const formData = data as ConversionFormData;
    if (stemActive) {
      // `auto` is not in the converter's format enum, so it is set after validation.
      (formData as unknown as { format: string }).format = stemChoice;
    }

    // Add trim data if it exists
    if (trimRange) {
      (formData as ConversionFormData & { trim?: TrimRange }).trim = trimRange;
    }

    console.log('Audio form submitted with data:', formData);
    onSubmit(formData);
  };

  const onErrorHandler = (errors: Record<string, { message?: string }>) => {
    console.log('Audio form validation errors:', errors);
  };

  const handleTrimSave = (newTrimRange: TrimRange) => {
    setTrimRange(newTrimRange);
    setValue('trim', newTrimRange);
  };

  const handleTrimClick = () => {
    if (audioUrl) {
      setShowTrimModal(true);
    }
  };

  const getTrimStatus = (): string | undefined => {
    if (!trimRange) return undefined;
    const duration = trimRange.endTime - trimRange.startTime;
    return t('interface:audioForm.trimStatus', {
      start: formatDuration(trimRange.startTime),
      end: formatDuration(trimRange.endTime),
      duration: formatDuration(duration),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
        <ConversionOptions
          fileType="audio"
          control={control}
          onTrimClick={audioUrl ? handleTrimClick : undefined}
          trimStatus={getTrimStatus()}
          lockedAudioFormat={presets?.lockedFormat}
          emphasis={presets?.effect === 'speed' || presets?.effect === 'volume' || presets?.effect === 'trim' ? presets.effect : undefined}
        />

        <div className="border border-edge rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              {t('interface:audioForm.ai.title')}
              <InfoTooltip
                ariaLabel={t('accessibility:audioForm.aiTooltip')}
                width="lg"
                content={
                  <div className="space-y-1">
                    <p>{t('interface:audioForm.ai.tooltipIntro')}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li><Trans i18nKey="interface:audioForm.ai.tooltipCleanVoice" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:audioForm.ai.tooltipRemoveNoise" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:audioForm.ai.tooltipIsolateVocals" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:audioForm.ai.tooltipRemoveVocals" components={{ strong: <strong /> }} /></li>
                    </ul>
                  </div>
                }
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('interface:audioForm.ai.intro')}
            </p>
          </div>
          {presets?.hideOperationSelect && presets.aiOperation ? (
            <p className="text-sm text-card-foreground" data-testid="audio-ai-preset-chip">
              <span className="font-medium">{t('interface:audioForm.ai.operationLabel')}</span>{' '}
              <span className="inline-block px-2 py-0.5 bg-card border border-border rounded text-xs">
                {t(`interface:audioForm.ai.operations.${presets.aiOperation}`)}
              </span>
              <span className="sr-only">{t('interface:audioForm.ai.presetLocked')}</span>
            </p>
          ) : (
          <Controller
            name="ai.operation"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:audioForm.ai.operationLabel')}</span>
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="none">{t('interface:audioForm.ai.operations.none')}</option>
                  <option value="clean_voice">{t('interface:audioForm.ai.operations.clean_voice')}</option>
                  <option value="remove_background_noise">{t('interface:audioForm.ai.operations.remove_background_noise')}</option>
                  <option value="isolate_vocals">{t('interface:audioForm.ai.operations.isolate_vocals')}</option>
                  <option value="remove_vocals">{t('interface:audioForm.ai.operations.remove_vocals')}</option>
                </select>
              </label>
            )}
          />
          )}
          {aiOperation && aiOperation !== 'none' && (
            <p className="text-xs text-muted-foreground">
              {t('interface:audioForm.ai.aiActiveNote')}
            </p>
          )}
          {stemActive && (
            <StemFormatSelect
              value={stemChoice}
              onChange={setStemChoice}
              fileName={fileName}
              fileType={fileType}
              durationSeconds={durationSeconds}
            />
          )}
        </div>

        {/* Advanced Audio Effects */}
        <AdvancedAudioEffects control={control} emphasis={presets?.effect} initial={fx} />

        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{t('error:forms.fixErrors')}</p>
            <ul className="text-destructive text-sm mt-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {field}: {error?.message || t('error:forms.invalidValue')}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:bg-surface-3 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('interface:audioForm.converting')}
            </>
          ) : (
            t('interface:audioForm.submit')
          )}
        </button>
      </form>

      {/* Trim Modal */}
      {audioUrl && (
        <MediaTrimModal
          isOpen={showTrimModal}
          onClose={() => setShowTrimModal(false)}
          mediaUrl={audioUrl}
          mediaType="audio"
          onTrimSave={handleTrimSave}
          initialTrim={trimRange || undefined}
        />
      )}
    </>
  );
};

export default AudioConversionForm;
