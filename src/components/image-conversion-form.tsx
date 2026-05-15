import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageConversionSchema } from "@/schemas/imageSchema";
import ConversionOptions from "@/components/conversion-options";
import ImageCropModal from "@/components/image-crop-modal";
import type { ConversionFormData } from "@/schemas/types";
import { useEffect, useState } from "react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const EXIF_TIFF_FIELDS = [
  'ImageDescription', 'Make', 'Model', 'Software', 'Artist', 'Copyright', 'Orientation', 'DateTime',
  'DateTimeOriginal', 'CreateDate', 'ModifyDate', 'SubSecTime', 'SubSecTimeOriginal', 'SubSecTimeDigitized',
  'OffsetTime', 'OffsetTimeOriginal', 'OffsetTimeDigitized', 'ExposureTime', 'FNumber', 'ExposureProgram',
  'ISO', 'SensitivityType', 'RecommendedExposureIndex', 'ExifVersion', 'ShutterSpeedValue', 'ApertureValue',
  'BrightnessValue', 'ExposureCompensation', 'MaxApertureValue', 'SubjectDistance', 'MeteringMode',
  'LightSource', 'Flash', 'FocalLength', 'FocalLengthIn35mmFormat', 'SubjectArea', 'MakerNote',
  'UserComment', 'FlashpixVersion', 'ColorSpace', 'ExifImageWidth', 'ExifImageHeight', 'SensingMethod',
  'FileSource', 'SceneType', 'CustomRendered', 'ExposureMode', 'WhiteBalance', 'DigitalZoomRatio',
  'SceneCaptureType', 'GainControl', 'Contrast', 'Saturation', 'Sharpness', 'SubjectDistanceRange',
  'LensMake', 'LensModel', 'LensSerialNumber', 'CameraOwnerName', 'BodySerialNumber',
];

const GPS_FIELDS = [
  'GPSVersionID', 'GPSLatitudeRef', 'GPSLatitude', 'GPSLongitudeRef', 'GPSLongitude', 'GPSAltitudeRef',
  'GPSAltitude', 'GPSTimeStamp', 'GPSSatellites', 'GPSStatus', 'GPSMeasureMode', 'GPSDOP', 'GPSSpeedRef',
  'GPSSpeed', 'GPSTrackRef', 'GPSTrack', 'GPSImgDirectionRef', 'GPSImgDirection', 'GPSMapDatum',
  'GPSDestLatitudeRef', 'GPSDestLatitude', 'GPSDestLongitudeRef', 'GPSDestLongitude', 'GPSDestBearingRef',
  'GPSDestBearing', 'GPSDestDistanceRef', 'GPSDestDistance', 'GPSProcessingMethod', 'GPSAreaInformation',
  'GPSDateStamp', 'GPSDifferential', 'GPSHPositioningError',
];

const ADVANCED_TAG_PLACEHOLDERS = ['IPTC:Headline', 'IPTC:Caption-Abstract', 'XMP:CreatorTool', 'XMP:Rights', 'MakerNotes:OwnerName'];

const pruneEmptyValues = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(pruneEmptyValues).filter(item => item !== undefined);
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, entryValue]) => [key, pruneEmptyValues(entryValue)] as const)
      .filter(([, entryValue]) => entryValue !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  return value;
};

// Form components for each file type
const ImageConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  imageUrl?: string;
}> = ({ onSubmit, isLoading, imageUrl }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [showAdvancedMetadata, setShowAdvancedMetadata] = useState(false);

  const { control, handleSubmit, setValue, clearErrors, unregister, formState: { errors } } = useForm({
    resolver: zodResolver(imageConversionSchema),
    shouldUnregister: true,
    defaultValues: {
      format: 'jpg' as const,
      quality: 85,
      filter: 'none' as const,
      tint: '#000000',
      textOverlay: {
        text: '',
        size: 48,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
        gravity: 'South' as const,
        font: 'default' as const,
        x: 0,
        y: 0,
      },
      metadataMode: 'keep' as const,
      metadata: {
        title: '',
        author: '',
        description: '',
        copyright: '',
        comment: '',
        keywords: '',
        exifTiff: {},
        gpsLocation: {},
        iptc: {},
        advanced: {},
      },
      gpsOptions: {
        removeLocationData: false,
        replaceLocationData: false,
        roundLocationPrecision: false,
        precisionDecimals: 3,
        removeCaptureDirection: false,
        removeGpsTimestamp: false,
        removeAltitude: false,
        removeDestinationFields: false,
      },
      advancedTags: {},
    },
    mode: 'onChange',
  });
  const metadataMode = useWatch({ control, name: 'metadataMode' });
  const replaceLocationData = useWatch({ control, name: 'gpsOptions.replaceLocationData' });

  useEffect(() => {
    if (metadataMode !== 'custom') {
      clearErrors(['metadata', 'gpsOptions', 'advancedTags']);
      unregister(['metadata', 'gpsOptions', 'advancedTags']);
      setShowAdvancedMetadata(false);
    }
  }, [clearErrors, metadataMode, unregister]);

  const onSubmitHandler = (data: unknown) => {
    const formData = { ...(data as Record<string, unknown>) };

    // Add crop data if it exists
    if (cropArea) {
      formData.crop = cropArea;
    }

    if (formData.metadataMode !== 'custom') {
      delete formData.metadata;
      delete formData.gpsOptions;
      delete formData.advancedTags;
    } else {
      formData.metadata = pruneEmptyValues(formData.metadata);
      formData.gpsOptions = pruneEmptyValues(formData.gpsOptions);
      formData.advancedTags = pruneEmptyValues(formData.advancedTags);
    }

    console.log('Image form submitted with data:', formData);
    onSubmit(formData as ConversionFormData);
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

  const renderTextInput = (name: string, label: string, placeholder?: string) => (
    <Controller
      name={name as never}
      control={control}
      render={({ field }) => (
        <label className="block">
          <span className="block text-sm font-medium mb-1 text-card-foreground">{label}</span>
          <input
            {...field}
            value={typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''}
            placeholder={placeholder}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </label>
      )}
    />
  );

  const renderNumberInput = (name: string, label: string, min?: number, max?: number, step = '1') => (
    <Controller
      name={name as never}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <label className="block">
          <span className="block text-sm font-medium mb-1 text-card-foreground">{label}</span>
          <input
            {...field}
            type="number"
            min={min}
            max={max}
            step={step}
            value={typeof value === 'number' || typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
          />
        </label>
      )}
    />
  );

  const renderCheckbox = (name: string, label: string) => (
    <Controller
      name={name as never}
      control={control}
      render={({ field }) => (
        <label className="flex items-center gap-2 text-sm text-card-foreground">
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
          />
          {label}
        </label>
      )}
    />
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
        <ConversionOptions
          fileType="image"
          control={control}
          onCropClick={imageUrl ? handleCropClick : undefined}
          cropStatus={getCropStatus()}
        />

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-card-foreground">Text Overlay</h3>
          {renderTextInput('textOverlay.text', 'Overlay Text', 'Optional text to draw on the image')}
          <div className="grid grid-cols-2 gap-4">
            {renderNumberInput('textOverlay.size', 'Text Size', 8, 512)}
            <Controller
              name="textOverlay.gravity"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">Position</span>
                  <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                    <option value="NorthWest">Top Left</option>
                    <option value="North">Top</option>
                    <option value="NorthEast">Top Right</option>
                    <option value="West">Left</option>
                    <option value="Center">Center</option>
                    <option value="East">Right</option>
                    <option value="SouthWest">Bottom Left</option>
                    <option value="South">Bottom</option>
                    <option value="SouthEast">Bottom Right</option>
                  </select>
                </label>
              )}
            />
            <Controller
              name="textOverlay.color"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">Text Color</span>
                  <input {...field} type="color" className="w-full p-1 border border-input rounded-lg h-10 bg-input focus:ring-2 focus:ring-ring" />
                </label>
              )}
            />
            <Controller
              name="textOverlay.strokeColor"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">Stroke Color</span>
                  <input {...field} type="color" className="w-full p-1 border border-input rounded-lg h-10 bg-input focus:ring-2 focus:ring-ring" />
                </label>
              )}
            />
            {renderNumberInput('textOverlay.strokeWidth', 'Stroke Width', 0, 32)}
            {renderNumberInput('textOverlay.x', 'X Offset', 0)}
            {renderNumberInput('textOverlay.y', 'Y Offset', 0)}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-card-foreground">Metadata</h3>
            <p className="text-sm text-muted-foreground">Choose whether to keep, strip, or rewrite image metadata.</p>
          </div>
          <Controller
            name="metadataMode"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                <option value="keep">Keep all metadata</option>
                <option value="strip">Strip all metadata</option>
                <option value="custom">Custom metadata</option>
              </select>
            )}
          />

          {metadataMode === 'custom' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTextInput('metadata.title', 'Title')}
                {renderTextInput('metadata.author', 'Artist / Author')}
                {renderTextInput('metadata.description', 'Description')}
                {renderTextInput('metadata.copyright', 'Copyright')}
                {renderTextInput('metadata.comment', 'User Comment')}
                {renderTextInput('metadata.keywords', 'Keywords')}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-card-foreground">GPS / Location Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderCheckbox('gpsOptions.removeLocationData', 'Remove location data')}
                  {renderCheckbox('gpsOptions.replaceLocationData', 'Replace location data')}
                  {renderCheckbox('gpsOptions.roundLocationPrecision', 'Round location precision')}
                  {renderCheckbox('gpsOptions.removeCaptureDirection', 'Remove capture direction / heading')}
                  {renderCheckbox('gpsOptions.removeGpsTimestamp', 'Remove GPS timestamp')}
                  {renderCheckbox('gpsOptions.removeAltitude', 'Remove altitude')}
                  {renderCheckbox('gpsOptions.removeDestinationFields', 'Remove destination fields')}
                </div>
                {replaceLocationData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderNumberInput('gpsOptions.latitude', 'Latitude', -90, 90, '0.000001')}
                    {renderNumberInput('gpsOptions.longitude', 'Longitude', -180, 180, '0.000001')}
                    {renderNumberInput('gpsOptions.altitude', 'Altitude', undefined, undefined, '0.1')}
                    {renderNumberInput('gpsOptions.precisionDecimals', 'Precision Decimals', 0, 8)}
                  </div>
                )}
              </div>

              <details className="border border-border rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-card-foreground">EXIF / TIFF Fields</summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-96 overflow-y-auto pr-1">
                  {EXIF_TIFF_FIELDS.map(field => renderTextInput(`metadata.exifTiff.${field}`, field))}
                </div>
              </details>

              <details className="border border-border rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-card-foreground">GPS / Location Fields</summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-96 overflow-y-auto pr-1">
                  {GPS_FIELDS.map(field => renderTextInput(`metadata.gpsLocation.${field}`, field))}
                </div>
              </details>

              <div className="border border-border rounded-lg p-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedMetadata(!showAdvancedMetadata)}
                  className="text-sm font-medium text-card-foreground hover:text-primary"
                >
                  {showAdvancedMetadata ? 'Hide' : 'Show'} Advanced / Device Metadata
                </button>
                {showAdvancedMetadata && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {ADVANCED_TAG_PLACEHOLDERS.map(tag => renderTextInput(`advancedTags.${tag}`, tag))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">Please fix the following errors:</p>
            <ul className="text-destructive text-sm mt-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {field}: {typeof error?.message === 'string' ? error.message : 'Invalid value'}</li>
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