import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Trans } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { audioConversionSchema } from "@/schemas/audioSchema";
import ConversionOptions from "@/components/conversion-options";
import MediaTrimModal from "@/components/media-trim-modal";
import AdvancedAudioEffects from "@/components/advanced-audio-effects";
import AdBanner from "@/components/ad-banner";
import InfoTooltip from "@/components/info-tooltip";
import type { ConversionFormData } from "@/schemas/types";
import { useEffect, useState } from "react";
import { useLocalization } from "@/i18n/useLocalization";

interface TrimRange {
  startTime: number;
  endTime: number;
}

// Form components for each file type
const AudioConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  audioUrl?: string;
}> = ({ onSubmit, isLoading, audioUrl }) => {
  const { t, formatDuration } = useLocalization(['interface', 'error', 'accessibility']);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(audioConversionSchema),
    defaultValues: {
      format: 'mp3' as const,
      bitrate: '192' as const,
      speed: 1,
      volume: 1,
      // Basic Processing defaults
      basicProcessing: {
        normalize: false,
        amplify: 0,
        fadeIn: 0,
        fadeOut: 0,
        equalizer: {
          enabled: false,
          preset: 'none' as const,
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
          enabled: false,
          type: 'none' as const,
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
          enabled: false,
          semitones: 0,
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
        enabled: false,
        operation: 'none' as const,
      },
    },
    mode: 'onChange',
  });

  const aiOperation = useWatch({ control, name: 'ai.operation' });

  useEffect(() => {
    const active = aiOperation && aiOperation !== 'none';
    setValue('ai.enabled', !!active);
    // Stems should be lossless by default. Other AI audio ops keep the
    // user-selected format.
    if (active && (aiOperation === 'isolate_vocals' || aiOperation === 'remove_vocals')) {
      setValue('format', 'wav');
    }
  }, [aiOperation, setValue]);

  const onSubmitHandler = (data: unknown) => {
    const formData = data as ConversionFormData;

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
      <AdBanner
        adSlot="mm_audio_form_banner"
        adFormat="banner"
        adPosition="audio_form_top"
        className="mb-4"
        utmMedium="audio_form_banner"
      />
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
        <ConversionOptions
          fileType="audio"
          control={control}
          onTrimClick={audioUrl ? handleTrimClick : undefined}
          trimStatus={getTrimStatus()}
        />

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
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
          {aiOperation && aiOperation !== 'none' && (
            <p className="text-xs text-muted-foreground">
              {t('interface:audioForm.ai.aiActiveNote')}
            </p>
          )}
        </div>

        {/* Advanced Audio Effects */}
        <AdvancedAudioEffects control={control} />

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
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
