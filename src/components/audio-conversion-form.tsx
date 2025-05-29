import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { audioConversionSchema } from "@/schemas/audioSchema";
import ConversionOptions from "@/components/conversion-options";
import type { ConversionFormData } from "@/schemas/types";

const AudioConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(audioConversionSchema),
    defaultValues: {
      format: 'mp3' as const,
      bitrate: '192' as const,
      speed: 1,
      volume: 1,
    },
    mode: 'onChange',
  });

  const onSubmitHandler = (data: unknown) => {
    console.log('Audio form submitted with data:', data);
    onSubmit(data as ConversionFormData);
  };

  const onErrorHandler = (errors: Record<string, { message?: string }>) => {
    console.log('Audio form validation errors:', errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
      <ConversionOptions fileType="audio" control={control} />
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
  );
};

export default AudioConversionForm;
