import { Loader2, FileText, Captions, Braces } from 'lucide-react';
import { useState } from 'react';
import type { TranscribeFormData, TranscribeOutputFormat } from '@/lib/useTranscribeFile';
import AdBanner from './ad-banner';
import InfoTooltip from '@/components/info-tooltip';

interface TranscribeFormProps {
  mediaKind: 'video' | 'audio';
  isLoading: boolean;
  onSubmit: (data: TranscribeFormData) => void;
}

const formatOptions: { value: TranscribeOutputFormat; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'vtt',
    label: 'Captions (VTT)',
    description: 'Time-coded subtitles for video players and accessibility tools.',
    icon: <Captions className="w-4 h-4" />,
  },
  {
    value: 'txt',
    label: 'Plain Text',
    description: 'Continuous transcript text suitable for reading or further editing.',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    value: 'json',
    label: 'Structured JSON',
    description: 'Segmented transcript with timing data for downstream processing.',
    icon: <Braces className="w-4 h-4" />,
  },
];

const TranscribeForm: React.FC<TranscribeFormProps> = ({ mediaKind, isLoading, onSubmit }) => {
  const [format, setFormat] = useState<TranscribeOutputFormat>('vtt');
  const [language, setLanguage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mode: 'transcribe',
      format,
      language: language.trim() || undefined,
    });
  };

  return (
    <>
      <AdBanner
        adSlot="6671038874"
        adFormat="banner"
        adPosition="transcribe_form_top"
        className="mb-4"
        style={{ minHeight: '60px' }}
        isFlashMock={true}
        utmMedium="transcribe_form_banner"
        utmCampaign="creatv_launch_promo"
        linkURL="https://www.creatv.io/auth"
        creativeAssetSrc="https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev/CreaTV_VideoAd_FullBanner.gif"
        creativeAssetAlt="Come check out CreaTV! Where ideas are brought to life."
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="font-semibold text-card-foreground mb-1 flex items-center gap-2">
            Transcript Output Format
            <InfoTooltip
              ariaLabel="About transcript output format"
              width="lg"
              content={
                <div className="space-y-1">
                  <p><strong>VTT</strong> — time-coded captions/subtitles for HTML5 video players and accessibility tools.</p>
                  <p><strong>Plain text</strong> — continuous transcript text for reading or further editing.</p>
                  <p><strong>Structured JSON</strong> — segmented transcript with timing data for downstream pipelines.</p>
                </div>
              }
            />
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            We transcribe the {mediaKind} on our own GPU server using whisper-ctranslate2.
            A summary and safety review run automatically once the transcript is ready.
          </p>
          <div className="grid gap-2">
            {formatOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  format === option.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-input hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="transcribe-format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={() => setFormat(option.value)}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-card-foreground">
                    {option.icon}
                    {option.label}
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Language hint (optional)
            <InfoTooltip
              ariaLabel="About language hint"
              content="BCP-47 short code (e.g. en, es, ja, de, fr). Leave blank to let whisper auto-detect the spoken language. Providing the correct hint can improve transcript accuracy for short clips."
            />
          </label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g. en, es, ja (leave blank to auto-detect)"
            maxLength={10}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">
            BCP-47 short code. Leave blank to let whisper auto-detect the spoken language.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Transcribing...
            </>
          ) : (
            'Transcribe File'
          )}
        </button>
      </form>
    </>
  );
};

export default TranscribeForm;
