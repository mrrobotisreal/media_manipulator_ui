'use client';

/**
 * Medi's thumbs (guide since MM107, copilots since MM113): one up/down per stored answer, signed-in
 * only (the message id exists only then). The POST is a TanStack `useMutation`; the rating shows
 * at once and the analytics event fires once per answer. A failed POST is silent (feedback is
 * best-effort and never blocks the editor), but the thanks line only stays when it landed or is
 * still in flight.
 */
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { useLocalization } from '@/i18n/useLocalization';
import { EVENTS } from '@/lib/analytics/events';
import type { AssistantSurfaceProp } from '@/lib/analytics/events';
import { sendAssistantFeedback } from '@/lib/assistant/api';
import type { AssistantTrack } from '@/lib/assistant/useAssistantStream';

export interface MessageFeedbackProps {
  messageId: string;
  surface: AssistantSurfaceProp;
  track: AssistantTrack;
}

export default function MessageFeedback({ messageId, surface, track }: MessageFeedbackProps) {
  const { t } = useLocalization(['interface']);
  const [rated, setRated] = React.useState<'up' | 'down' | null>(null);
  const send = useMutation({ mutationFn: (rating: 'up' | 'down') => sendAssistantFeedback(messageId, rating) });
  const rate = (rating: 'up' | 'down') => {
    if (rated) return;
    setRated(rating);
    track(EVENTS.ASSISTANT_FEEDBACK_GIVEN, { surface, rating });
    send.mutate(rating);
  };
  return (
    <div className="flex items-center gap-1 text-muted-foreground" data-testid="medi-feedback">
      {rated ? (
        <span className="text-xs">{t('assistant.guide.thanks')}</span>
      ) : (
        <>
          <button type="button" className="rounded p-2 hover:bg-accent hover:text-foreground" aria-label={t('assistant.guide.helpful')} title={t('assistant.guide.helpful')} onClick={() => rate('up')}>
            <ThumbsUp className="size-3.5" />
          </button>
          <button type="button" className="rounded p-2 hover:bg-accent hover:text-foreground" aria-label={t('assistant.guide.notHelpful')} title={t('assistant.guide.notHelpful')} onClick={() => rate('down')}>
            <ThumbsDown className="size-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
