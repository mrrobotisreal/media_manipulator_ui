'use client';

import { FileText, Captions, Braces, Subtitles } from 'lucide-react';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import type { TranscribeFormData, TranscribeOutputFormat } from '@/lib/useTranscribeFile';
import InfoTooltip from '@/components/info-tooltip';
import { useLocalization } from '@/i18n/useLocalization';

interface TranscribeFormProps {
  mediaKind: 'video' | 'audio';
  isLoading: boolean;
  onSubmit: (data: TranscribeFormData) => void;
  /** Optional preselected output format. Useful for the /tools/srt-generator
   *  page which always wants SRT chosen by default. */
  defaultFormat?: TranscribeOutputFormat;
}

const FORMAT_ICONS: Record<TranscribeOutputFormat, React.ReactNode> = {
  vtt: <Captions className="w-4 h-4" />,
  srt: <Subtitles className="w-4 h-4" />,
  txt: <FileText className="w-4 h-4" />,
  json: <Braces className="w-4 h-4" />,
};

const FORMAT_VALUES: TranscribeOutputFormat[] = ['vtt', 'srt', 'txt', 'json'];

const TranscribeForm: React.FC<TranscribeFormProps> = ({ mediaKind, isLoading, onSubmit, defaultFormat }) => {
  const { t } = useLocalization(['interface', 'accessibility']);
  const [format, setFormat] = useState<TranscribeOutputFormat>(defaultFormat ?? 'vtt');
  const [language, setLanguage] = useState<string>('');

  const mediaKindLabel = t(`interface:transcribeForm.mediaKind.${mediaKind}`);

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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="font-semibold text-card-foreground mb-1 flex items-center gap-2">
            {t('interface:transcribeForm.outputFormatTitle')}
            <InfoTooltip
              ariaLabel={t('accessibility:transcribeForm.formatTooltip')}
              width="lg"
              content={
                <div className="space-y-1">
                  <p><Trans i18nKey="interface:transcribeForm.formatTooltip.vtt" components={{ strong: <strong /> }} /></p>
                  <p><Trans i18nKey="interface:transcribeForm.formatTooltip.txt" components={{ strong: <strong /> }} /></p>
                  <p><Trans i18nKey="interface:transcribeForm.formatTooltip.json" components={{ strong: <strong /> }} /></p>
                </div>
              }
            />
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {t('interface:transcribeForm.intro', { mediaKind: mediaKindLabel })}
          </p>
          <div className="grid gap-2 gl-radio-group" role="radiogroup">
            {FORMAT_VALUES.map((value) => (
              <label key={value} className="gl-radio">
                <input
                  className="gl-radio__input mt-1"
                  type="radio"
                  name="transcribe-format"
                  value={value}
                  checked={format === value}
                  onChange={() => setFormat(value)}
                />
                <span className="gl-radio__circle"></span>
                <div>
                  <span className="gl-radio__content">
                    <div className="flex items-center gap-2 font-medium text-card-foreground">
                      {FORMAT_ICONS[value]}
                      <span className="gl-radio__title">{t(`interface:transcribeForm.format.${value}.label`)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground gl-radio__desc">
                      {t(`interface:transcribeForm.format.${value}.description`)}
                    </p>
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('interface:transcribeForm.languageLabel')}
            <InfoTooltip
              ariaLabel={t('accessibility:transcribeForm.languageTooltip')}
              content={t('interface:transcribeForm.languageTooltip')}
            />
          </label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder={t('interface:transcribeForm.languagePlaceholder')}
            maxLength={10}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('interface:transcribeForm.languageHint')}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              {t('interface:transcribeForm.transcribing')}
            </>
          ) : (
            t('interface:transcribeForm.submit')
          )}
        </button>
      </form>
    </>
  );
};

export default TranscribeForm;
