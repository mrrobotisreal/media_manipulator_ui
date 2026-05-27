import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Trans } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageConversionSchema } from "@/schemas/imageSchema";
import ConversionOptions from "@/components/conversion-options";
import ImageCropModal from "@/components/image-crop-modal";
import InfoTooltip from "@/components/info-tooltip";
import FaceSelectionOverlay from "@/components/face-selection-overlay";
import RemoveObjectOverlay, { type RemoveObjectRectangle } from "@/components/remove-object-overlay";
import useDetectFaces, { type FaceDetectionResponse } from "@/lib/useDetectFaces";
import type { ConversionFormData } from "@/schemas/types";
import type { ImageFormPresets } from "@/components/embedded-tool-panel";
import { useEffect, useState } from "react";
import { useLocalization } from "@/i18n/useLocalization";

type FaceSelectionMode = 'all' | 'only_selected' | 'all_except_selected';

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
  file?: File;
  /** Tool-page preset/lock configuration (embedded SEO landing pages). */
  presets?: ImageFormPresets;
}> = ({ onSubmit, isLoading, imageUrl, file, presets }) => {
  const { t } = useLocalization(['interface', 'error', 'accessibility']);
  const lockedFormat = presets?.lockedOutputFormat;
  const lockedAIOperation = Boolean(presets?.lockedAIImageOperation);
  const initialFormat = lockedFormat ?? presets?.defaultOutputFormat ?? 'jpg';
  const initialAIOperation = presets?.defaultAIImageOperation ?? 'none';
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [showAdvancedMetadata, setShowAdvancedMetadata] = useState(false);
  const [faceDetection, setFaceDetection] = useState<FaceDetectionResponse | null>(null);
  const [selectedFaceIds, setSelectedFaceIds] = useState<string[]>([]);
  const [faceSelectionMode, setFaceSelectionMode] = useState<FaceSelectionMode>('all');
  const [faceDetectError, setFaceDetectError] = useState<string | null>(null);
  const [removeObjectRects, setRemoveObjectRects] = useState<RemoveObjectRectangle[]>([]);
  const [removeObjectError, setRemoveObjectError] = useState<string | null>(null);
  // React Query returns a new mutation-result object every render; only the
  // method references are stable. Destructure them so useEffect deps don't
  // churn and trigger an infinite re-render loop.
  const {
    mutateAsync: detectFacesAsync,
    reset: resetDetectFaces,
    isPending: isDetectingFaces,
  } = useDetectFaces();

  const { control, handleSubmit, setValue, clearErrors, unregister, formState: { errors } } = useForm({
    resolver: zodResolver(imageConversionSchema),
    shouldUnregister: true,
    defaultValues: {
      format: initialFormat,
      quality: presets?.defaultQuality ?? 85,
      width: presets?.defaultWidth,
      height: presets?.defaultHeight,
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
        enabled: initialAIOperation !== 'none',
        operation: initialAIOperation,
        faceMode: 'blur' as const,
        backgroundModel: 'birefnet-general' as const,
        upscaleScale: 4 as const,
        upscaleModel: 'realesrgan-x4plus' as const,
        textDetect: 'pii' as const,
        textRedaction: 'blackbox' as const,
        faceSelection: {
          sessionId: undefined,
          selectionMode: 'all' as const,
          selectedFaceIds: [] as string[],
        },
      },
    },
    mode: 'onChange',
  });
  const metadataMode = useWatch({ control, name: 'metadataMode' });
  const replaceLocationData = useWatch({ control, name: 'gpsOptions.replaceLocationData' });
  const aiOperation = useWatch({ control, name: 'ai.operation' });
  const aiUpscaleScale = useWatch({ control, name: 'ai.upscaleScale' });
  const selectedFormat = useWatch({ control, name: 'format' });
  // Image -> PDF ignores AI, text overlay, and metadata editing, so hide those
  // sections when the output is a PDF to keep the form focused.
  const showImageEditing = selectedFormat !== 'pdf';

  useEffect(() => {
    // Keep ai.enabled in sync with the operation selection so the API can rely
    // on a single boolean to route the job.
    const active = aiOperation && aiOperation !== 'none';
    setValue('ai.enabled', !!active);
    if (active && (aiOperation === 'remove_background' || aiOperation === 'ai_upscale')) {
      // These ops require/prefer PNG output.
      setValue('format', 'png');
    }
    if (aiOperation !== 'face_privacy') {
      // Drop any in-flight face selection if the user switches to another op
      // so we don't accidentally send a stale session to /upload. Use
      // functional / conditional setters so a no-op (already cleared) does
      // NOT create a fresh array/object reference and trigger a re-render
      // loop.
      setFaceDetection((prev) => (prev === null ? prev : null));
      setSelectedFaceIds((prev) => (prev.length === 0 ? prev : []));
      setFaceSelectionMode((prev) => (prev === 'all' ? prev : 'all'));
      setFaceDetectError((prev) => (prev === null ? prev : null));
      resetDetectFaces();
    }
    if (aiOperation !== 'remove_object') {
      // Clear any in-progress rectangles when switching away so a different
      // op doesn't accidentally inherit them, and use the conditional-setter
      // trick to avoid a re-render loop.
      setRemoveObjectRects((prev) => (prev.length === 0 ? prev : []));
      setRemoveObjectError((prev) => (prev === null ? prev : null));
    }
  }, [aiOperation, setValue, resetDetectFaces]);

  useEffect(() => {
    // The detect session is bound to the exact bytes of the chosen file. If
    // the user picks a different file, force them to re-detect. Conditional
    // setters avoid spurious re-renders when the state is already clean.
    setFaceDetection((prev) => (prev === null ? prev : null));
    setSelectedFaceIds((prev) => (prev.length === 0 ? prev : []));
    setFaceDetectError((prev) => (prev === null ? prev : null));
    resetDetectFaces();
    // Rectangles target a specific image, so reset them when the file changes
    // too.
    setRemoveObjectRects((prev) => (prev.length === 0 ? prev : []));
    setRemoveObjectError((prev) => (prev === null ? prev : null));
  }, [file, resetDetectFaces]);

  useEffect(() => {
    if (metadataMode !== 'custom') {
      clearErrors(['metadata', 'gpsOptions', 'advancedTags']);
      unregister(['metadata', 'gpsOptions', 'advancedTags']);
      setShowAdvancedMetadata(false);
    }
  }, [clearErrors, metadataMode, unregister]);

  const handleDetectFaces = async () => {
    if (!file) {
      setFaceDetectError('Choose an image first.');
      return;
    }
    setFaceDetectError(null);
    try {
      const result = await detectFacesAsync(file);
      setFaceDetection(result);
      setSelectedFaceIds([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Face detection failed';
      setFaceDetectError(message);
      setFaceDetection(null);
    }
  };

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

    // Only attach faceSelection for face_privacy. For non-"all" selection
    // modes we require a session ID so the backend can reuse the same boxes
    // the user just confirmed in the overlay.
    const ai = formData.ai as Record<string, unknown> | undefined;
    if (ai && ai.operation === 'face_privacy') {
      const selection = {
        sessionId: faceDetection?.faceDetectionSessionId,
        selectionMode: faceSelectionMode,
        selectedFaceIds,
      };
      if (faceSelectionMode !== 'all' && !selection.sessionId) {
        setFaceDetectError('Detect faces first to use selected-face mode.');
        return;
      }
      ai.faceSelection = selection;
    } else if (ai) {
      delete ai.faceSelection;
    }

    // remove_object: require at least one rectangle and ship the normalized
    // coordinates only (drop the UI-only id field so the backend payload is
    // clean).
    if (ai && ai.operation === 'remove_object') {
      if (removeObjectRects.length === 0) {
        setRemoveObjectError('Draw at least one rectangle over the object you want to remove.');
        return;
      }
      setRemoveObjectError(null);
      ai.removeObjectMask = {
        rectangles: removeObjectRects.map(({ x, y, width, height }) => ({ x, y, width, height })),
      };
    } else if (ai) {
      delete ai.removeObjectMask;
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
    return t('interface:imageForm.cropStatus', {
      width: cropArea.width,
      height: cropArea.height,
      x: cropArea.x,
      y: cropArea.y,
    });
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
          lockedFormat={lockedFormat}
          emphasizeResize={presets?.emphasizeResize}
        />

        {showImageEditing && (
        <>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              {t('interface:imageForm.ai.title')}
              <InfoTooltip
                ariaLabel={t('accessibility:imageForm.aiTooltip')}
                width="lg"
                content={
                  <div className="space-y-1">
                    <p>{t('interface:imageForm.ai.tooltipIntro')}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li><Trans i18nKey="interface:imageForm.ai.tooltipFacePrivacy" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:imageForm.ai.tooltipRemoveBackground" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:imageForm.ai.tooltipAiUpscale" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:imageForm.ai.tooltipRedactText" components={{ strong: <strong /> }} /></li>
                      <li><Trans i18nKey="interface:imageForm.ai.tooltipRemoveObject" components={{ strong: <strong /> }} /></li>
                    </ul>
                  </div>
                }
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('interface:imageForm.ai.intro')}
            </p>
          </div>
          <Controller
            name="ai.operation"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.operationLabel')}</span>
                <select
                  {...field}
                  disabled={lockedAIOperation}
                  aria-disabled={lockedAIOperation}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="none">{t('interface:imageForm.ai.operations.none')}</option>
                  <option value="face_privacy">{t('interface:imageForm.ai.operations.face_privacy')}</option>
                  <option value="remove_background">{t('interface:imageForm.ai.operations.remove_background')}</option>
                  <option value="ai_upscale">{t('interface:imageForm.ai.operations.ai_upscale')}</option>
                  <option value="redact_text">{t('interface:imageForm.ai.operations.redact_text')}</option>
                  <option value="remove_object">{t('interface:imageForm.ai.operations.remove_object')}</option>
                </select>
                {lockedAIOperation && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {t('interface:imageForm.ai.operationLocked')}
                  </span>
                )}
              </label>
            )}
          />

          {aiOperation === 'face_privacy' && (
            <div className="space-y-4">
              <Controller
                name="ai.faceMode"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.faceMode.label')}</span>
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                      <option value="blur">{t('interface:imageForm.ai.faceMode.blur')}</option>
                      <option value="pixelate">{t('interface:imageForm.ai.faceMode.pixelate')}</option>
                      <option value="blackbox">{t('interface:imageForm.ai.faceMode.blackbox')}</option>
                    </select>
                  </label>
                )}
              />

              <div className="border border-border rounded-lg p-3 space-y-3 bg-card/50">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-card-foreground flex items-center gap-2">
                    {t('interface:imageForm.ai.selectiveFaces.title')}
                    <InfoTooltip
                      ariaLabel={t('accessibility:imageForm.selectiveFacesTooltip')}
                      width="lg"
                      content={
                        <div className="space-y-1">
                          <p>{t('interface:imageForm.ai.selectiveFaces.tooltipDefault')}</p>
                          <p><Trans i18nKey="interface:imageForm.ai.selectiveFaces.tooltipDetect" components={{ strong: <strong /> }} /></p>
                          <p className="text-xs">{t('interface:imageForm.ai.selectiveFaces.tooltipExpire')}</p>
                        </div>
                      }
                    />
                  </h4>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.selectiveFaces.selectionModeLabel')}</span>
                  <select
                    value={faceSelectionMode}
                    onChange={(event) => setFaceSelectionMode(event.target.value as FaceSelectionMode)}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">{t('interface:imageForm.ai.selectiveFaces.selectionMode.all')}</option>
                    <option value="only_selected">{t('interface:imageForm.ai.selectiveFaces.selectionMode.only_selected')}</option>
                    <option value="all_except_selected">{t('interface:imageForm.ai.selectiveFaces.selectionMode.all_except_selected')}</option>
                  </select>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDetectFaces}
                    disabled={!file || isDetectingFaces}
                    className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDetectingFaces ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {t('interface:imageForm.ai.selectiveFaces.detecting')}
                      </>
                    ) : (
                      faceDetection ? t('interface:imageForm.ai.selectiveFaces.reDetect') : t('interface:imageForm.ai.selectiveFaces.detect')
                    )}
                  </button>
                  {faceDetection && faceDetection.faces.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedFaceIds(faceDetection.faces.map((f) => f.id))}
                        className="px-2 py-1 text-xs rounded-md border border-input bg-input text-card-foreground hover:bg-muted"
                      >
                        {t('interface:imageForm.ai.selectiveFaces.selectAll')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFaceIds([])}
                        className="px-2 py-1 text-xs rounded-md border border-input bg-input text-card-foreground hover:bg-muted"
                      >
                        {t('interface:imageForm.ai.selectiveFaces.clearSelection')}
                      </button>
                    </>
                  )}
                </div>

                {!file && (
                  <p className="text-xs text-muted-foreground">{t('interface:imageForm.ai.selectiveFaces.chooseFile')}</p>
                )}
                {faceDetectError && (
                  <p className="text-xs text-destructive">{faceDetectError}</p>
                )}
                {faceDetection && faceDetection.faces.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t('interface:imageForm.ai.selectiveFaces.noFaces')}
                  </p>
                )}
                {faceDetection && faceDetection.faces.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {t('interface:imageForm.ai.selectiveFaces.detected', { count: faceDetection.faces.length, selected: selectedFaceIds.length })}
                    </p>
                    {imageUrl && (
                      <FaceSelectionOverlay
                        imageUrl={imageUrl}
                        faces={faceDetection.faces}
                        selectedFaceIds={selectedFaceIds}
                        onToggleFace={(id) =>
                          setSelectedFaceIds((prev) =>
                            prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id],
                          )
                        }
                      />
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('interface:imageForm.ai.selectiveFaces.defaultNote')}
                </p>
              </div>
            </div>
          )}

          {aiOperation === 'remove_background' && (
            <>
              <Controller
                name="ai.backgroundModel"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.background.modelLabel')}</span>
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                      <option value="birefnet-general">{t('interface:imageForm.ai.background.models.birefnet-general')}</option>
                      <option value="birefnet-general-lite">{t('interface:imageForm.ai.background.models.birefnet-general-lite')}</option>
                      <option value="birefnet-portrait">{t('interface:imageForm.ai.background.models.birefnet-portrait')}</option>
                      <option value="isnet-general-use">{t('interface:imageForm.ai.background.models.isnet-general-use')}</option>
                      <option value="u2net">{t('interface:imageForm.ai.background.models.u2net')}</option>
                      <option value="u2netp">{t('interface:imageForm.ai.background.models.u2netp')}</option>
                      <option value="u2net_human_seg">{t('interface:imageForm.ai.background.models.u2net_human_seg')}</option>
                    </select>
                  </label>
                )}
              />
              <p className="text-xs text-muted-foreground">{t('interface:imageForm.ai.background.pngNote')}</p>
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
                      <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.upscale.scaleLabel')}</span>
                      <select
                        {...field}
                        value={String(value ?? 4)}
                        onChange={(event) => onChange(Number(event.target.value))}
                        className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                      >
                        <option value="4">{t('interface:imageForm.ai.upscale.scale4x')}</option>
                        <option value="2">{t('interface:imageForm.ai.upscale.scale2x')}</option>
                      </select>
                    </label>
                  )}
                />
                <Controller
                  name="ai.upscaleModel"
                  control={control}
                  render={({ field }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.upscale.modelLabel')}</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="realesrgan-x4plus">{t('interface:imageForm.ai.upscale.models.realesrgan-x4plus')}</option>
                        <option value="realesrgan-x4plus-anime">{t('interface:imageForm.ai.upscale.models.realesrgan-x4plus-anime')}</option>
                        <option value="realesr-animevideov3">{t('interface:imageForm.ai.upscale.models.realesr-animevideov3')}</option>
                      </select>
                    </label>
                  )}
                />
              </div>
              {aiUpscaleScale === 2 && (
                <p className="text-xs text-muted-foreground">
                  {t('interface:imageForm.ai.upscale.experimentalNote')}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{t('interface:imageForm.ai.upscale.pngNote')}</p>
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
                      <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.redact.detectLabel')}</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="pii">{t('interface:imageForm.ai.redact.detect.pii')}</option>
                        <option value="all-text">{t('interface:imageForm.ai.redact.detect.all-text')}</option>
                      </select>
                    </label>
                  )}
                />
                <Controller
                  name="ai.textRedaction"
                  control={control}
                  render={({ field }) => (
                    <label className="block">
                      <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.ai.redact.redactionLabel')}</span>
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                        <option value="blackbox">{t('interface:imageForm.ai.redact.redaction.blackbox')}</option>
                        <option value="blur">{t('interface:imageForm.ai.redact.redaction.blur')}</option>
                        <option value="pixelate">{t('interface:imageForm.ai.redact.redaction.pixelate')}</option>
                      </select>
                    </label>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('interface:imageForm.ai.redact.ocrNote')}
              </p>
            </>
          )}

          {aiOperation === 'remove_object' && (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-card/50">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-card-foreground flex items-center gap-2">
                  {t('interface:imageForm.ai.removeObject.title')}
                  <InfoTooltip
                    ariaLabel={t('accessibility:imageForm.removeObjectTooltip')}
                    width="lg"
                    content={
                      <div className="space-y-1">
                        <p>{t('interface:imageForm.ai.removeObject.tooltipDraw')}</p>
                        <p>{t('interface:imageForm.ai.removeObject.tooltipResult')}</p>
                        <p className="text-xs">{t('interface:imageForm.ai.removeObject.tooltipTip')}</p>
                      </div>
                    }
                  />
                </h4>
                {removeObjectRects.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRemoveObjectRects([])}
                    className="px-2 py-1 text-xs rounded-md border border-input bg-input text-card-foreground hover:bg-muted"
                  >
                    {t('interface:imageForm.ai.removeObject.clearAll')}
                  </button>
                )}
              </div>
              {imageUrl ? (
                <RemoveObjectOverlay
                  imageUrl={imageUrl}
                  rectangles={removeObjectRects}
                  onChange={setRemoveObjectRects}
                />
              ) : (
                <p className="text-xs text-muted-foreground">{t('interface:imageForm.ai.removeObject.chooseFile')}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {removeObjectRects.length === 0
                  ? t('interface:imageForm.ai.removeObject.atLeastOne')
                  : t('interface:imageForm.ai.removeObject.readyToInpaint', { count: removeObjectRects.length })}
              </p>
              {removeObjectError && (
                <p className="text-xs text-destructive">{removeObjectError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {t('interface:imageForm.ai.removeObject.formatNote')}
              </p>
            </div>
          )}

          {aiOperation && aiOperation !== 'none' && (
            <p className="text-xs text-muted-foreground">
              {t('interface:imageForm.ai.aiActiveNote')}
            </p>
          )}
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-card-foreground flex items-center gap-2">
            {t('interface:imageForm.textOverlay.title')}
            <InfoTooltip
              ariaLabel={t('interface:imageForm.textOverlay.tooltipAria')}
              width="lg"
              content={t('interface:imageForm.textOverlay.tooltip')}
            />
          </h3>
          {renderTextInput('textOverlay.text', t('interface:imageForm.textOverlay.overlayText'), t('interface:imageForm.textOverlay.overlayPlaceholder'))}
          <div className="grid grid-cols-2 gap-4">
            {renderNumberInput('textOverlay.size', t('interface:imageForm.textOverlay.size'), 8, 512)}
            <Controller
              name="textOverlay.gravity"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.textOverlay.position')}</span>
                  <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                    <option value="NorthWest">{t('interface:imageForm.textOverlay.gravity.NorthWest')}</option>
                    <option value="North">{t('interface:imageForm.textOverlay.gravity.North')}</option>
                    <option value="NorthEast">{t('interface:imageForm.textOverlay.gravity.NorthEast')}</option>
                    <option value="West">{t('interface:imageForm.textOverlay.gravity.West')}</option>
                    <option value="Center">{t('interface:imageForm.textOverlay.gravity.Center')}</option>
                    <option value="East">{t('interface:imageForm.textOverlay.gravity.East')}</option>
                    <option value="SouthWest">{t('interface:imageForm.textOverlay.gravity.SouthWest')}</option>
                    <option value="South">{t('interface:imageForm.textOverlay.gravity.South')}</option>
                    <option value="SouthEast">{t('interface:imageForm.textOverlay.gravity.SouthEast')}</option>
                  </select>
                </label>
              )}
            />
            <Controller
              name="textOverlay.color"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.textOverlay.textColor')}</span>
                  <input {...field} type="color" className="w-full p-1 border border-input rounded-lg h-10 bg-input focus:ring-2 focus:ring-ring" />
                </label>
              )}
            />
            <Controller
              name="textOverlay.strokeColor"
              control={control}
              render={({ field }) => (
                <label className="block">
                  <span className="block text-sm font-medium mb-1 text-card-foreground">{t('interface:imageForm.textOverlay.strokeColor')}</span>
                  <input {...field} type="color" className="w-full p-1 border border-input rounded-lg h-10 bg-input focus:ring-2 focus:ring-ring" />
                </label>
              )}
            />
            {renderNumberInput('textOverlay.strokeWidth', t('interface:imageForm.textOverlay.strokeWidth'), 0, 32)}
            {renderNumberInput('textOverlay.x', t('interface:imageForm.textOverlay.xOffset'), 0)}
            {renderNumberInput('textOverlay.y', t('interface:imageForm.textOverlay.yOffset'), 0)}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              {t('interface:imageForm.metadata.title')}
              <InfoTooltip
                ariaLabel={t('accessibility:imageForm.metadataTooltip')}
                width="lg"
                content={
                  <div className="space-y-1">
                    <p><Trans i18nKey="interface:imageForm.metadata.tooltipKeep" components={{ strong: <strong /> }} /></p>
                    <p><Trans i18nKey="interface:imageForm.metadata.tooltipStrip" components={{ strong: <strong /> }} /></p>
                    <p><Trans i18nKey="interface:imageForm.metadata.tooltipCustom" components={{ strong: <strong /> }} /></p>
                  </div>
                }
              />
            </h3>
            <p className="text-sm text-muted-foreground">{t('interface:imageForm.metadata.intro')}</p>
          </div>
          <Controller
            name="metadataMode"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                <option value="keep">{t('interface:imageForm.metadata.modes.keep')}</option>
                <option value="strip">{t('interface:imageForm.metadata.modes.strip')}</option>
                <option value="custom">{t('interface:imageForm.metadata.modes.custom')}</option>
              </select>
            )}
          />

          {metadataMode === 'custom' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTextInput('metadata.title', t('interface:imageForm.metadata.fields.title'))}
                {renderTextInput('metadata.author', t('interface:imageForm.metadata.fields.author'))}
                {renderTextInput('metadata.description', t('interface:imageForm.metadata.fields.description'))}
                {renderTextInput('metadata.copyright', t('interface:imageForm.metadata.fields.copyright'))}
                {renderTextInput('metadata.comment', t('interface:imageForm.metadata.fields.comment'))}
                {renderTextInput('metadata.keywords', t('interface:imageForm.metadata.fields.keywords'))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-card-foreground flex items-center gap-2">
                  {t('interface:imageForm.metadata.gps.title')}
                  <InfoTooltip
                    ariaLabel={t('interface:imageForm.metadata.gps.tooltipAria')}
                    width="lg"
                    content={t('interface:imageForm.metadata.gps.tooltip')}
                  />
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderCheckbox('gpsOptions.removeLocationData', t('interface:imageForm.metadata.gps.removeLocationData'))}
                  {renderCheckbox('gpsOptions.replaceLocationData', t('interface:imageForm.metadata.gps.replaceLocationData'))}
                  {renderCheckbox('gpsOptions.roundLocationPrecision', t('interface:imageForm.metadata.gps.roundPrecision'))}
                  {renderCheckbox('gpsOptions.removeCaptureDirection', t('interface:imageForm.metadata.gps.removeCaptureDirection'))}
                  {renderCheckbox('gpsOptions.removeGpsTimestamp', t('interface:imageForm.metadata.gps.removeTimestamp'))}
                  {renderCheckbox('gpsOptions.removeAltitude', t('interface:imageForm.metadata.gps.removeAltitude'))}
                  {renderCheckbox('gpsOptions.removeDestinationFields', t('interface:imageForm.metadata.gps.removeDestination'))}
                </div>
                {replaceLocationData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderNumberInput('gpsOptions.latitude', t('interface:imageForm.metadata.gps.latitude'), -90, 90, '0.000001')}
                    {renderNumberInput('gpsOptions.longitude', t('interface:imageForm.metadata.gps.longitude'), -180, 180, '0.000001')}
                    {renderNumberInput('gpsOptions.altitude', t('interface:imageForm.metadata.gps.altitude'), undefined, undefined, '0.1')}
                    {renderNumberInput('gpsOptions.precisionDecimals', t('interface:imageForm.metadata.gps.precisionDecimals'), 0, 8)}
                  </div>
                )}
              </div>

              <details className="border border-border rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-card-foreground">{t('interface:imageForm.metadata.exifFields')}</summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-96 overflow-y-auto pr-1">
                  {EXIF_TIFF_FIELDS.map(field => renderTextInput(`metadata.exifTiff.${field}`, field))}
                </div>
              </details>

              <details className="border border-border rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-card-foreground">{t('interface:imageForm.metadata.gpsFields')}</summary>
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
                  {showAdvancedMetadata ? t('interface:imageForm.metadata.hideAdvanced') : t('interface:imageForm.metadata.showAdvanced')}
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
        </>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{t('error:forms.fixErrors')}</p>
            <ul className="text-destructive text-sm mt-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {field}: {typeof error?.message === 'string' ? error.message : t('error:forms.invalidValue')}</li>
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
              {t('interface:imageForm.converting')}
            </>
          ) : (
            t('interface:imageForm.submit')
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