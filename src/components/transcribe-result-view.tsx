import { AlertTriangle, AudioLines, FileText, Sparkles, ShieldCheck, Languages } from 'lucide-react';
import type { TranscribeResult, AnalysisResult } from '@/lib/useTranscribeResult';

interface TranscribeResultViewProps {
  result: TranscribeResult | null | undefined;
  analysis: AnalysisResult | null | undefined;
  isLoading: boolean;
  isAnalysisLoading: boolean;
}

const formatSecondsToClock = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const safetyBadgeClasses = (rating?: string) => {
  switch ((rating || '').toLowerCase()) {
    case 'unsafe':
      return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
    case 'moderate':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
    case 'safe':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const TranscribeResultView: React.FC<TranscribeResultViewProps> = ({ result, analysis, isLoading, isAnalysisLoading }) => {
  if (isLoading && !result) {
    return <p className="text-card-foreground">Loading transcript result...</p>;
  }
  if (!result) {
    return <p className="text-muted-foreground">No transcript result is available for this job.</p>;
  }

  const showTranscript = result.hasSpeech && (result.transcriptText || (result.segments && result.segments.length > 0));
  const reviewing = analysis?.transcriptReview;

  return (
    <div className="w-full max-w-4xl space-y-4 overflow-y-auto max-h-[calc(100vh-14rem)] pr-2">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-background rounded-lg border p-3">
        <div className="flex items-center gap-3 text-card-foreground">
          <AudioLines className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-semibold">Transcription complete</p>
            <p className="text-xs text-muted-foreground">
              Output format: <span className="uppercase">{result.format}</span>
              {result.language && (
                <>
                  {' • '}
                  Language: {result.language}
                </>
              )}
              {result.durationSeconds ? ` • Duration: ${formatSecondsToClock(result.durationSeconds)}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!result.hasAudio && (
            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              No audio stream
            </span>
          )}
          {result.hasAudio && !result.hasSpeech && (
            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              No recognizable speech
            </span>
          )}
        </div>
      </header>

      {!showTranscript ? (
        <section className="bg-background border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Nothing to transcribe
          </h3>
          <p className="text-sm text-muted-foreground">
            {result.message || 'No transcript could be generated for this file.'}
          </p>
          {result.audioDescription && (
            <p className="text-sm text-card-foreground bg-muted/40 rounded-md p-2">
              {result.audioDescription}
            </p>
          )}
        </section>
      ) : (
        <section className="bg-background border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Transcript ({result.segments?.length ?? result.segmentCount} segments)
          </h3>
          {result.segments && result.segments.length > 0 ? (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {result.segments.map(segment => (
                <div key={segment.id} className="text-sm bg-muted/30 rounded-md p-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    {formatSecondsToClock(segment.start)} → {formatSecondsToClock(segment.end)}
                  </div>
                  <div className="text-card-foreground whitespace-pre-wrap">{segment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-card-foreground bg-muted/30 rounded-md p-3 max-h-[40vh] overflow-y-auto">
              {result.transcriptText}
            </pre>
          )}
        </section>
      )}

      <section className="bg-background border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI summary & safety review
        </h3>
        {isAnalysisLoading && !analysis && (
          <p className="text-sm text-muted-foreground">Running summary and safety review in the background...</p>
        )}
        {analysis?.error && (
          <p className="text-sm text-destructive">Analysis error: {analysis.error}</p>
        )}
        {reviewing ? (
          <div className="space-y-2 text-sm">
            {typeof reviewing.summary === 'string' && reviewing.summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Summary</p>
                <p className="text-card-foreground">{reviewing.summary}</p>
              </div>
            )}
            {typeof reviewing.extended_summary === 'string' && reviewing.extended_summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Extended summary</p>
                <p className="text-card-foreground">{reviewing.extended_summary}</p>
              </div>
            )}
            {Array.isArray(reviewing.main_topics) && reviewing.main_topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reviewing.main_topics.map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-muted rounded text-xs text-card-foreground">
                    {topic}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              {reviewing.content_safety && (
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${safetyBadgeClasses(reviewing.content_safety.rating)}`}>
                  <ShieldCheck className="w-3 h-3" />
                  Safety: {reviewing.content_safety.rating || 'unknown'}
                </span>
              )}
              {typeof reviewing.harmful_content === 'boolean' && (
                <span className={`text-xs px-2 py-1 rounded-full ${reviewing.harmful_content ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {reviewing.harmful_content ? 'Potentially harmful content detected' : 'No harmful content flagged'}
                </span>
              )}
              {typeof reviewing.sentiment_label === 'string' && reviewing.sentiment_label && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-card-foreground">
                  Sentiment: {reviewing.sentiment_label}
                </span>
              )}
              {typeof reviewing.language === 'string' && reviewing.language && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-card-foreground flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {reviewing.language}
                </span>
              )}
            </div>
            {reviewing.content_safety?.concerns && (
              <p className="text-xs text-muted-foreground italic">
                Notes: {reviewing.content_safety.concerns}
              </p>
            )}
            {Array.isArray(reviewing.harmful_content_reasons) && reviewing.harmful_content_reasons.length > 0 && (
              <ul className="text-xs text-muted-foreground list-disc pl-5">
                {reviewing.harmful_content_reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          !isAnalysisLoading && !analysis?.error && (
            <p className="text-sm text-muted-foreground">
              {analysis?.audioDescription || 'Summary and safety review will appear here once the analysis job finishes.'}
            </p>
          )
        )}
      </section>
    </div>
  );
};

export default TranscribeResultView;
