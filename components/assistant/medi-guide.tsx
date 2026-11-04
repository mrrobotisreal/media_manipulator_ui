'use client';

/**
 * The Medi guide launcher (MM107 decision 1), mounted once from app/providers.tsx on the public
 * localized pages. AdSense rules: nothing here is in the server HTML (it renders null until the
 * browser has been idle after the first interaction), the button is fixed-position (no layout
 * shift), sits in the inline-end corner above the consent bar's height, and never covers an
 * in-content ad slot (MM89 places units in the document flow, not in the corners). It reads
 * capabilities first and stays hidden while the API says the guide is off.
 */
import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { useLocalization } from '@/i18n/useLocalization';
import { guideAllowedOn } from '@/lib/assistant/guideRoutes';
import { getAssistantCapabilities, guideEnabled } from '@/lib/assistant/api';
import { MEDI_BRAND, MEDI_MARK_SRC } from '@/lib/assistant/brand';
import { trackAssistantOpened } from '@/lib/assistant/useAssistantStream';
import { withAssistantShard } from '@/lib/i18n/ensureShard';
import { cn } from '@/lib/utils';
import type { AssistantCapabilities } from '@/schemas/assistant';

const GuideSheet = dynamic(() => withAssistantShard(() => import('@/components/assistant/guide-sheet')), { ssr: false });

/** Resolves after the first pointer/key/scroll/touch interaction and a following idle period. */
export function afterFirstInteractionIdle(win: Window, cb: () => void): () => void {
  let done = false;
  let idleHandle: number | null = null;
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
  const fire = () => {
    if (done) return;
    done = true;
    cb();
  };
  const onFirst = () => {
    for (const e of events) win.removeEventListener(e, onFirst);
    const ric = (win as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    idleHandle = ric ? ric(fire, { timeout: 2000 }) : win.setTimeout(fire, 300);
  };
  for (const e of events) win.addEventListener(e, onFirst, { passive: true, once: true });
  return () => {
    done = true;
    for (const e of events) win.removeEventListener(e, onFirst);
    if (idleHandle !== null) {
      const cic = (win as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(idleHandle);
      else win.clearTimeout(idleHandle);
    }
  };
}

export interface MediGuideProps {
  /** Test seams. */
  loadCapabilities?: () => Promise<AssistantCapabilities>;
  armImmediately?: boolean;
}

export function MediGuide({ loadCapabilities = getAssistantCapabilities, armImmediately = false }: MediGuideProps) {
  // MM52: translator deployments render no product surfaces beyond the pages themselves.
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') return null;
  return <MediGuideInner loadCapabilities={loadCapabilities} armImmediately={armImmediately} />;
}

function MediGuideInner({ loadCapabilities, armImmediately }: Required<MediGuideProps>) {
  const pathname = usePathname();
  const { dir, t } = useLocalization(['interface']);
  const [armed, setArmed] = React.useState(armImmediately);
  const [caps, setCaps] = React.useState<AssistantCapabilities | null>(null);
  const [open, setOpen] = React.useState(false);
  const allowed = guideAllowedOn(pathname);

  React.useEffect(() => {
    if (armed || typeof window === 'undefined') return;
    return afterFirstInteractionIdle(window, () => setArmed(true));
  }, [armed]);

  React.useEffect(() => {
    if (!armed || caps) return;
    let alive = true;
    void loadCapabilities().then((c) => {
      if (alive) setCaps(c);
    });
    return () => {
      alive = false;
    };
  }, [armed, caps, loadCapabilities]);

  if (!armed || !allowed || !guideEnabled(caps)) return null;

  const side = dir === 'rtl' ? 'left-4' : 'right-4';
  return (
    <>
      {!open ? (
        <button
          type="button"
          data-testid="medi-guide-button"
          onClick={() => {
            setOpen(true);
            trackAssistantOpened('guide', 'button');
          }}
          aria-label={t('interface:mediGuideButton.label', { brand: MEDI_BRAND })}
          aria-haspopup="dialog"
          // bottom-36 on phones clears the compact consent bar (117 px, MM88); bottom-6 from sm up.
          className={cn(
            'fixed bottom-36 z-40 flex size-12 items-center justify-center rounded-full border border-edge bg-surface-1 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-6',
            side,
          )}
        >
          <img src={MEDI_MARK_SRC} alt="" width={28} height={28} />
        </button>
      ) : null}
      {open ? <GuideSheet open={open} onOpenChange={setOpen} capabilities={caps} /> : null}
    </>
  );
}

export default MediGuide;
