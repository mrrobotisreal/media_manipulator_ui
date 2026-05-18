import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageConversionSchema } from "@/schemas/imageSchema";
import ConversionOptions from "@/components/conversion-options";
import ImageCropModal from "@/components/image-crop-modal";
import InfoTooltip from "@/components/info-tooltip";
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
      ai: {
        enabled: false,
        operation: 'none' as const,
        faceMode: 'blur' as const,
        backgroundModel: 'birefnet-general' as const,
        upscaleScale: 4 as const,
        upscaleModel: 'realesrgan-x4plus' as const,
        textDetect: 'pii' as const,
        textRedaction: 'blackbox' as const,
      },
    },
    mode: 'onChange',
  });
  const metadataMode = useWatch({ control, name: 'metadataMode' });
  const replaceLocationData = useWatch({ control, name: 'gpsOptions.replaceLocationData' });
  const aiOperation = useWatch({ control, name: 'ai.operation' });
  const aiUpscaleScale = useWatch({ control, name: 'ai.upscaleScale' });

  useEffect(() => {
    // Keep ai.enabled in sync with the operation selection so the API can rely
    // on a single boolean to route the job.
    const active = aiOperation && aiOperation !== 'none';
    setValue('ai.enabled', !!active);
    if (active && (aiOperation === 'remove_background' || aiOperation === 'ai_upscale')) {
      // These ops require/prefer PNG output.
      setValue('format', 'png');
    }
  }, [aiOperation, setValue]);

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
          <div>
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              AI Image Tools
              <InfoTooltip
                ariaLabel="About AI Image Tools"
                width="lg"
                content={
                  <div className="space-y-1">
                    <p>One AI operation runs per job, on our local GPU server. The standard ImageMagick pipeline is skipped for that job.</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li><strong>Face Privacy</strong> — detect and obscure faces (blur, pixelate, or black box).</li>
                      <li><strong>Remove Background</strong> — outputs a transparent PNG via rembg + BiRefNet/ISNet/U2Net.</li>
                      <li><strong>AI Upscale</strong> — Real-ESRGAN ncnn Vulkan 2x or 4x.</li>
                      <li><strong>Redact Text / PII</strong> — OCR-based redaction.</li>
                    </ul>
                  </div>
                }
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              AI tools run one operation per conversion. For best results, preview the output before posting sensitive media.
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
                  <option value="face_privacy">Face Blur / Pixelate</option>
                  <option value="remove_background">Remove Background</option>
                  <option value="ai_upscale">AI Upscale</option>
                  <option value="redact_text">Redact Text / PII</option>
                </select>
              </label>
            )}
          />

          {aiOperation === 'face_privacy' && (
            <Controller
              name="ai.faceMode"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">Face Mode</span>
                  <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                    <option value="blur">Blur</option>
                    <option value="pixelate">Pixelate</option>
                    <option value="blackbox">Black Box</option>
                  </select>
                </label>
              )}
            />
          )}

          {aiOperation === 'remove_background' && (
            <>
              <Controller
                name="ai.backgroundModel"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <span className="block text-sm font-medium mb-1 text-card-foreground">Background Model</span>
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                      <option value="birefnet-general">BiRefNet General (recommended)</option>
                      <option value="birefnet-general-lite">BiRefNet General Lite</option>
                      <option value="birefnet-portrait">BiRefNet Portrait</option>
                      <option value="isnet-general-use">ISNet General Use</option>
                      <option value="u2net">U2Net</option>
                      <option value="u2netp">U2Net Lite</option>
                      <option value="u2net_human_seg">U2Net Human Segmentation</option>
                    </select>
                  </label>
                )}
              />
              <p className="text-xs text-muted-foreground">Output is always PNG so transparency is preserved.</p>
            </>
          )}

          {aiOperation === 'ai_upscale' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="ai.upscaleScale"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">Scale</span>
                      <select
                        {...field}
                        value={String(value ?? 4)}
                        onChange={(event) => onChange(Number(event.target.value))}
                        className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                      >
                        <option value="4">4x</option>
                        <option value="2">2x (experimental on some images)</option>
                      </select>
                    </label>
                  )}
                />
                <Controller
                  name="ai.upscaleModel"
                  control={control}
                  render={({ field }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">Model</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="realesrgan-x4plus">realesrgan-x4plus (photos)</option>
                        <option value="realesrgan-x4plus-anime">realesrgan-x4plus-anime</option>
                        <option value="realesr-animevideov3">realesr-animevideov3</option>
                      </select>
                    </label>
                  )}
                />
              </div>
              {aiUpscaleScale === 2 && (
                <p className="text-xs text-muted-foreground">
                  2x AI upscale is available, but 4x is the safest/default model path on this server.
                </p>
              )}
              <p className="text-xs text-muted-foreground">Output is PNG by default.</p>
            </>
          )}

          {aiOperation === 'redact_text' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="ai.textDetect"
                  control={control}
                  render={({ field }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">Detect</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="pii">PII only</option>
                        <option value="all-text">All Text</option>
                      </select>
                    </label>
                  )}
                />
                <Controller
                  name="ai.textRedaction"
                  control={control}
                  render={({ field }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">Redaction Style</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="blackbox">Black Box</option>
                        <option value="blur">Blur</option>
                        <option value="pixelate">Pixelate</option>
                      </select>
                    </label>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                OCR redaction is best effort. Please review output before sharing.
              </p>
            </>
          )}

          {aiOperation && aiOperation !== 'none' && (
            <p className="text-xs text-muted-foreground">
              Format, filters, and other standard image options are skipped when an AI operation is selected.
            </p>
          )}
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-card-foreground flex items-center gap-2">
            Text Overlay
            <InfoTooltip
              ariaLabel="About text overlay"
              width="lg"
              content="Burn a watermark or caption onto the output image. Type the text, then pick size (8–512 px), gravity (corner/edge/center anchor), text and stroke colors, stroke width, and pixel offsets from the anchor. Leave the text empty to skip the overlay."
            />
          </h3>
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
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              Metadata
              <InfoTooltip
                ariaLabel="About image metadata"
                width="lg"
                content={
                  <div className="space-y-1">
                    <p><strong>Keep all metadata</strong> — preserve every EXIF/IPTC/XMP/GPS field from the original.</p>
                    <p><strong>Strip all metadata</strong> — remove camera, GPS, software, and timestamp fields. Recommended before sharing photos online.</p>
                    <p><strong>Custom metadata</strong> — strip first, then rewrite only the fields you supply (title, author, copyright, IPTC keywords, GPS fields, etc.).</p>
                  </div>
                }
              />
            </h3>
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
                <h4 className="font-medium text-card-foreground flex items-center gap-2">
                  GPS / Location Options
                  <InfoTooltip
                    ariaLabel="About GPS / location options"
                    width="lg"
                    content="Remove or replace GPS metadata stored by your camera or phone. You can also strip just the capture direction, GPS timestamp, altitude, or destination fields. Replace mode lets you pin a different latitude/longitude/altitude and optionally round precision for privacy."
                  />
                </h4>
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