import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { audioConversionSchema } from "@/schemas/audioSchema";
import ConversionOptions from "@/components/conversion-options";
import MediaTrimModal from "@/components/media-trim-modal";
import AdvancedAudioEffects from "@/components/advanced-audio-effects";
import AdBanner from "@/components/ad-banner";
import InfoTooltip from "@/components/info-tooltip";
import type { ConversionFormData } from "@/schemas/types";
import { useEffect, useState } from "react";

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrimStatus = (): string | undefined => {
    if (!trimRange) return undefined;
    const duration = trimRange.endTime - trimRange.startTime;
    return `Trim: ${formatTime(trimRange.startTime)} - ${formatTime(trimRange.endTime)} (${formatTime(duration)})`;
  };

  return (
    <>
      <AdBanner
        adSlot="6671038874"
        adFormat="banner"
        adPosition="audio_form_top"
        className="mb-4"
        style={{ minHeight: '60px' }}
        isFlashMock={true}
        utmMedium="audio_form_banner"
        utmCampaign="creatv_launch_promo"
        linkURL="https://www.creatv.io/auth"
        creativeAssetSrc="https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev/CreaTV_VideoAd_FullBanner.gif"
        creativeAssetAlt="Come check out CreaTV! Where ideas are brought to life."
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
              AI Audio Tools
              <InfoTooltip
                ariaLabel="About AI Audio Tools"
                width="lg"
                content={
                  <div className="space-y-1">
                    <p>One AI operation runs per job, on our local GPU server. The standard FFmpeg processing chain is skipped for that job.</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li><strong>Clean Voice</strong> — DeepFilterNet denoise + broadcast polish chain (high/low pass, loudness, limiter).</li>
                      <li><strong>Remove Background Noise</strong> — DeepFilterNet denoise without the polish chain.</li>
                      <li><strong>Isolate Vocals</strong> — Demucs htdemucs vocal stem (defaults to lossless WAV).</li>
                      <li><strong>Remove Vocals / Karaoke</strong> — Demucs instrumental stem.</li>
                    </ul>
                  </div>
                }
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              AI audio tools run as GPU jobs and may take longer than basic conversion.
            </p>
          </div>
          <Controller
            name="ai.operation"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="block text-sm font-medium mb-1 text-card-foreground">Operation</span>
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="none">None (standard conversion)</option>
                  <option value="clean_voice">Clean Voice</option>
                  <option value="remove_background_noise">Remove Background Noise</option>
                  <option value="isolate_vocals">Isolate Vocals</option>
                  <option value="remove_vocals">Remove Vocals / Karaoke</option>
                </select>
              </label>
            )}
          />
          {aiOperation && aiOperation !== 'none' && (
            <p className="text-xs text-muted-foreground">
              Bitrate, EQ, and other standard audio options are skipped when an AI operation is selected.
            </p>
          )}
        </div>

        {/* Advanced Audio Effects */}
        <AdvancedAudioEffects control={control} />

        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">Please fix the following errors:</p>
            <ul className="text-destructive text-sm mt-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {field}: {error?.message || 'Invalid value'}</li>
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
              Converting...
            </>
          ) : (
            'Convert File'
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
