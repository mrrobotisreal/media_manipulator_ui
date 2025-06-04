import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videoConversionSchema } from "@/schemas/videoSchema";
import ConversionOptions from "@/components/conversion-options";
import MediaTrimModal from "@/components/media-trim-modal";
import type { ConversionFormData } from "@/schemas/types";
import { useState } from "react";

interface TrimRange {
  startTime: number;
  endTime: number;
}

// Form components for each file type
const VideoConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  videoUrl?: string;
}> = ({ onSubmit, isLoading, videoUrl }) => {
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(videoConversionSchema),
    defaultValues: {
      format: 'mp4' as const,
      quality: 'medium' as const,
      speed: 1,
      preserveAspectRatio: true,
    },
    mode: 'onChange',
  });

  const onSubmitHandler = (data: unknown) => {
    const formData = data as ConversionFormData;

    // Add trim data if it exists
    if (trimRange) {
      (formData as ConversionFormData & { trim?: TrimRange }).trim = trimRange;
    }

    console.log('Video form submitted with data:', formData);
    onSubmit(formData);
  };

  const onErrorHandler = (errors: Record<string, { message?: string }>) => {
    console.log('Video form validation errors:', errors);
  };

  const handleTrimSave = (newTrimRange: TrimRange) => {
    setTrimRange(newTrimRange);
    setValue('trim', newTrimRange);
  };

  const handleTrimClick = () => {
    if (videoUrl) {
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
          fileType="video"
          control={control}
          onTrimClick={videoUrl ? handleTrimClick : undefined}
          trimStatus={getTrimStatus()}
        />
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
      {videoUrl && (
        <MediaTrimModal
          isOpen={showTrimModal}
          onClose={() => setShowTrimModal(false)}
          mediaUrl={videoUrl}
          mediaType="video"
          onTrimSave={handleTrimSave}
          initialTrim={trimRange || undefined}
        />
      )}
    </>
  );
};

export default VideoConversionForm;
