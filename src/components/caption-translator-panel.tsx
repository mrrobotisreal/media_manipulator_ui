import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, Languages, X } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import useCaptionTranslatorTool, {
  type CaptionFormat,
} from '@/lib/useCaptionTranslatorTool';

/**
 * CaptionTranslatorPanel handles the bespoke "upload a .srt or .vtt file
 * and translate it" workflow. Unlike the media tools, this one accepts
 * text-based caption files and POSTs to the dedicated /api/tools/caption-
 * translator endpoint, so we don't reuse SpecializedToolShell (which is
 * configured for video/audio/image uploads).
 */

interface LanguageOption {
  code: string;
  label: string;
}

// A curated subset of the BCP-47 list the caption translator backend
// validates against. These are the languages most users actually request;
// custom entries can still be typed in if you support them server-side.
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English (en)' },
  { code: 'es', label: 'Spanish (es)' },
  { code: 'pt-BR', label: 'Portuguese (Brazil) (pt-BR)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal) (pt-PT)' },
  { code: 'fr', label: 'French (fr)' },
  { code: 'de', label: 'German (de)' },
  { code: 'it', label: 'Italian (it)' },
  { code: 'nl', label: 'Dutch (nl)' },
  { code: 'sv', label: 'Swedish (sv)' },
  { code: 'fi', label: 'Finnish (fi)' },
  { code: 'no', label: 'Norwegian (no)' },
  { code: 'da', label: 'Danish (da)' },
  { code: 'pl', label: 'Polish (pl)' },
  { code: 'cs', label: 'Czech (cs)' },
  { code: 'ru', label: 'Russian (ru)' },
  { code: 'uk', label: 'Ukrainian (uk)' },
  { code: 'tr', label: 'Turkish (tr)' },
  { code: 'el', label: 'Greek (el)' },
  { code: 'ar', label: 'Arabic (ar)' },
  { code: 'he', label: 'Hebrew (he)' },
  { code: 'hi', label: 'Hindi (hi)' },
  { code: 'ja', label: 'Japanese (ja)' },
  { code: 'ko', label: 'Korean (ko)' },
  { code: 'zh-Hans', label: 'Chinese (Simplified) (zh-Hans)' },
  { code: 'zh-Hant', label: 'Chinese (Traditional) (zh-Hant)' },
  { code: 'vi', label: 'Vietnamese (vi)' },
  { code: 'id', label: 'Indonesian (id)' },
  { code: 'th', label: 'Thai (th)' },
  { code: 'ro', label: 'Romanian (ro)' },
  { code: 'hu', label: 'Hungarian (hu)' },
];

const CaptionTranslatorPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputFormat, setInputFormat] = useState<CaptionFormat>('srt');
  const [outputFormat, setOutputFormat] = useState<CaptionFormat | 'same'>('same');
  const [sourceLanguage, setSourceLanguage] = useState<string>('auto');
  const [targetLanguage, setTargetLanguage] = useState<string>('es');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, uploadProgress } = useCaptionTranslatorTool((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });
  const { data: jobStatus } = useGetJobStatus(conversionJob);
  const { downloadFile } = useDownloadFile();

  useEffect(() => {
    if (jobStatus) {
      setConversionJob((prev) => (prev ? { ...prev, ...jobStatus } : prev));
    }
  }, [jobStatus]);

  const detectFormatFromFile = (f: File): CaptionFormat => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    return ext === 'vtt' || ext === 'webvtt' ? 'vtt' : 'srt';
  };

  const handleFile = (f: File) => {
    setFile(f);
    setConversionJob(null);
    setInputFormat(detectFormatFromFile(f));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const resolvedOutput: CaptionFormat = outputFormat === 'same' ? inputFormat : outputFormat;
    mutate({
      file,
      options: {
        inputFormat,
        outputFormat: resolvedOutput,
        sourceLanguage,
        targetLanguage,
      },
    });
  };

  const handleDownload = async () => {
    if (!conversionJob?.id || !file) return;
    try {
      const blob = await downloadFile(conversionJob.id);
      const resolvedOutput: CaptionFormat = outputFormat === 'same' ? inputFormat : outputFormat;
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const fileName = `${baseName}_${targetLanguage}.${resolvedOutput}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Caption translator download failed', err);
    }
  };

  const isProcessing = isPending || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-card-foreground mb-1">Drop your .srt or .vtt file here</p>
          <p className="text-sm text-muted-foreground mb-4">
            Files are processed on our own server and deleted within 24 hours. We do not send your captions to third-party AI providers.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select caption file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt,text/vtt,application/x-subrip"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="min-w-0">
              <p className="font-medium text-card-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB · {inputFormat.toUpperCase()}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setConversionJob(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Source language</label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                <option value="auto">Auto-detect (recommended)</option>
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Target language</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Output format</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as CaptionFormat | 'same')}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              <option value="same">Same as input ({inputFormat.toUpperCase()})</option>
              <option value="srt">SRT (SubRip)</option>
              <option value="vtt">VTT (WebVTT)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Cue timing and ordering are preserved exactly — only the cue text is translated.
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !targetLanguage}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Languages className="w-4 h-4" />
            {isProcessing ? 'Translating…' : 'Translate captions'}
          </button>

          {isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {uploadProgress > 0 && uploadProgress < 100
                  ? `Uploading ${uploadProgress}%`
                  : 'Translating with local AI model…'}{' '}
                {conversionJob?.progress ? `· ${conversionJob.progress}%` : ''}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${conversionJob?.progress || uploadProgress || 0}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => void handleDownload()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download translated captions
            </button>
          )}
          {conversionJob?.status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {conversionJob.error || 'Translation failed. Try a smaller file or a different target language.'}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CaptionTranslatorPanel;
