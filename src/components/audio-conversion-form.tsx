import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { audioConversionSchema } from "@/schemas/audioSchema";
import ConversionOptions from "@/components/conversion-options";
import MediaTrimModal from "@/components/media-trim-modal";
import AdvancedAudioEffects from "@/components/advanced-audio-effects";
import type { ConversionFormData } from "@/schemas/types";
import { useState } from "react";

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
    },
    mode: 'onChange',
  });

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
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
        <ConversionOptions
          fileType="audio"
          control={control}
          onTrimClick={audioUrl ? handleTrimClick : undefined}
          trimStatus={getTrimStatus()}
        />

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
