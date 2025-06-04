import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageConversionSchema } from "@/schemas/imageSchema";
import ConversionOptions from "@/components/conversion-options";
import ImageCropModal from "@/components/image-crop-modal";
import type { ConversionFormData } from "@/schemas/types";
import { useState } from "react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Form components for each file type
const ImageConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  imageUrl?: string;
}> = ({ onSubmit, isLoading, imageUrl }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(imageConversionSchema),
    defaultValues: {
      format: 'jpg' as const,
      quality: 85,
      filter: 'none' as const,
      tint: '#000000',
    },
    mode: 'onChange',
  });

  const onSubmitHandler = (data: unknown) => {
    const formData = data as ConversionFormData;

    // Add crop data if it exists
    if (cropArea) {
      (formData as ConversionFormData & { crop?: CropArea }).crop = cropArea;
    }

    console.log('Image form submitted with data:', formData);
    onSubmit(formData);
  };

  const onErrorHandler = (errors: Record<string, { message?: string }>) => {
    console.log('Image form validation errors:', errors);
  };

  const handleCropSave = (newCropArea: CropArea) => {
    setCropArea(newCropArea);
    setValue('crop', newCropArea);
  };

  const handleCropClick = () => {
    if (imageUrl) {
      setShowCropModal(true);
    }
  };

  const getCropStatus = (): string | undefined => {
    if (!cropArea) return undefined;
    return `Crop area: ${cropArea.width}×${cropArea.height} pixels at (${cropArea.x}, ${cropArea.y})`;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
        <ConversionOptions
          fileType="image"
          control={control}
          onCropClick={imageUrl ? handleCropClick : undefined}
          cropStatus={getCropStatus()}
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

      {/* Crop Modal */}
      {imageUrl && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={imageUrl}
          onCropSave={handleCropSave}
          initialCrop={cropArea || undefined}
        />
      )}
    </>
  );
};

export default ImageConversionForm;