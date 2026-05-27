import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdfConversionSchema } from "@/schemas/pdfSchema";
import type { ConversionFormData } from "@/schemas/types";
import InfoTooltip from "@/components/info-tooltip";
import { useLocalization } from "@/i18n/useLocalization";

export interface PdfFormPresets {
  /** Default output image format. */
  defaultOutputFormat?: 'jpg' | 'png';
  /** Lock the output format select to the default (exact pdf-to-jpg/png tools). */
  lockOutputFormat?: boolean;
  /** Default page selection. */
  defaultPageSelection?: 'all' | 'first';
  /** Default render DPI. */
  defaultDpi?: number;
}

const DPI_CHOICES = [100, 150, 200, 300];

/**
 * Form for the PDF -> image direction (pdf-to-jpg, pdf-to-png, and the
 * pdf-converter hub when a PDF is uploaded). Submits a payload the backend's
 * document pathway understands: { format, pageSelection, dpi, quality }.
 */
const PdfConversionForm: React.FC<{
  onSubmit: (data: ConversionFormData) => void;
  isLoading: boolean;
  presets?: PdfFormPresets;
}> = ({ onSubmit, isLoading, presets }) => {
  const { t } = useLocalization(['interface', 'accessibility']);
  const lockFormat = Boolean(presets?.lockOutputFormat);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(pdfConversionSchema),
    defaultValues: {
      format: presets?.defaultOutputFormat ?? 'jpg',
      pageSelection: presets?.defaultPageSelection ?? 'all',
      dpi: presets?.defaultDpi ?? 150,
      quality: 90,
    },
    mode: 'onChange',
  });

  const format = useWatch({ control, name: 'format' });

  const onSubmitHandler = (data: unknown) => {
    onSubmit(data as ConversionFormData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('interface:pdfForm.outputFormat.label')}
            <InfoTooltip
              ariaLabel={t('accessibility:pdfForm.outputFormatTooltip')}
              content={t('interface:pdfForm.outputFormat.tooltip')}
            />
          </label>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={lockFormat}
                aria-disabled={lockFormat}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            )}
          />
          {lockFormat && (
            <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {t('interface:pdfForm.outputFormat.locked', { format: String(format).toUpperCase() })}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('interface:pdfForm.dpi.label')}
            <InfoTooltip
              ariaLabel={t('accessibility:pdfForm.dpiTooltip')}
              content={t('interface:pdfForm.dpi.tooltip')}
            />
          </label>
          <Controller
            name="dpi"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <select
                {...field}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
              >
                {DPI_CHOICES.map((d) => (
                  <option key={d} value={d}>{d} DPI</option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium mb-2 text-card-foreground flex items-center gap-2">
          {t('interface:pdfForm.pages.label')}
          <InfoTooltip
            ariaLabel={t('accessibility:pdfForm.pagesTooltip')}
            content={t('interface:pdfForm.pages.tooltip')}
          />
        </span>
        <Controller
          name="pageSelection"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-card-foreground">
                <input
                  type="radio"
                  checked={field.value === 'all'}
                  onChange={() => field.onChange('all')}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">{t('interface:pdfForm.pages.all')}</span>
                  <span className="block text-xs text-muted-foreground">{t('interface:pdfForm.pages.allHint')}</span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-card-foreground">
                <input
                  type="radio"
                  checked={field.value === 'first'}
                  onChange={() => field.onChange('first')}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">{t('interface:pdfForm.pages.first')}</span>
                  <span className="block text-xs text-muted-foreground">{t('interface:pdfForm.pages.firstHint')}</span>
                </span>
              </label>
            </div>
          )}
        />
      </div>

      {format === 'jpg' && (
        <div className="max-w-xs">
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('interface:pdfForm.quality.label')}
            <InfoTooltip
              ariaLabel={t('accessibility:pdfForm.qualityTooltip')}
              content={t('interface:pdfForm.quality.tooltip')}
            />
          </label>
          <Controller
            name="quality"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                min="1"
                max="100"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
              />
            )}
          />
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
            {t('interface:pdfForm.converting')}
          </>
        ) : (
          t('interface:pdfForm.submit')
        )}
      </button>
    </form>
  );
};

export default PdfConversionForm;
