'use client';

/**
 * MM109: Medi's copilot in Darkroom (ticket decisions 1, 4, 5, 9). The toolbar button, the
 * Cmd/Ctrl+J shortcut and the lazily loaded panel (a right-hand column on desktop, a bottom sheet
 * under 768 px), all behind `studioCopilotOn`: the API must list `studio` as a copilot surface.
 * Never inside the CreaTV embed (design Q2): the editor passes `embedded`, and the component
 * renders nothing there. The adapter reads the store at call time (never during render).
 */
import * as React from 'react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { cn } from '@/lib/utils';
import { analytics, EVENTS } from '@/lib/analytics';
import { MEDI_BRAND, MEDI_MARK_SRC } from '@/lib/assistant/brand';
import { getAssistantCapabilities } from '@/lib/assistant/api';
import { createStudioAdapter } from '@/lib/assistant/adapters/studio';
import { captureJpeg } from '@/lib/assistant/frame';
import { withAssistantShard } from '@/lib/i18n/ensureShard';
import { useStudioStore } from '@/lib/studioStore';
import { useDeriveStudioAsset, type StudioDeriveOperation } from '@/lib/useStudioAsset';
import { grabPreviewCanvas } from '@/lib/studio/frameGrab';
import { captionGenerateBridge, exportDialogBridge, voiceoverBridge } from '@/lib/studio/editorBridges';
import { prefillFromParams } from '@/lib/studio/exportOptions';
import { studioHost } from '@/lib/studio/telemetry';
import type { AssistantCapabilities } from '@/schemas/assistant';
import type { AssistantTrack } from '@/lib/assistant/useAssistantStream';
import { useKeptSessionEnd } from '@/lib/assistant/copilot/kept';
import { flashReveal } from '@/lib/assistant/copilot/reveal';
import { studioRevealBridge } from '@/lib/assistant/copilot/revealBridges';

// Medi's copilot panel, loaded on first open with its i18n shard (nothing in the editor's first load).
const CopilotPanel = dynamic(() => withAssistantShard(() => import('@/components/assistant/copilot-panel')), { ssr: false });

/** Whether the Darkroom copilot answers for this caller (capabilities list `studio` as a copilot surface). */
export const studioCopilotOn = (c: AssistantCapabilities | null): boolean => !!c && c.enabled && c.copilot.enabled && c.copilot.surfaces.includes('studio');

/** Darkroom's `assistant_*` events carry the studio feature context (the site's consent rules apply as everywhere). */
export const studioAssistantTrack: AssistantTrack = (name, props) => analytics.track(name, props as never, { feature: 'studio' });

interface Refs {
  projectId: string;
  caps: AssistantCapabilities | null;
  t: (key: string, vars?: Record<string, unknown>) => string;
  localized: (href: string) => string;
  derive: (assetId: string, op: StudioDeriveOperation) => void;
  /** MM121: anonymous editors get three caption looks. */
  signedIn: boolean;
}

function useStudioAdapter(refs: React.RefObject<Refs | null>) {
  return React.useMemo(
    () =>
      createStudioAdapter({
        store: useStudioStore,
        t: (key, vars) => refs.current?.t(key, vars) ?? key,
        captureFrame: async () => {
          const c = grabPreviewCanvas();
          const caps = refs.current?.caps;
          return c ? captureJpeg(c, caps && caps.enabled ? caps.maxFrameBytes : undefined) : null;
        },
        projectId: () => refs.current?.projectId ?? null,
        signedIn: () => refs.current?.signedIn ?? true,
        onCaptionLookApplied: (lookId) => {
          analytics.track(EVENTS.STUDIO_CAPTION_LOOK_APPLIED, { lookId, source: 'medi', host: studioHost() }, { feature: 'studio' });
        },
        onGenerateCaptions: (language) => {
          captionGenerateBridge.request(language);
        },
        onDeriveAudio: (clipId, operation) => {
          const st = useStudioStore.getState();
          // The named clip's asset, else the first audio clip on the timeline.
          const found = clipId ? st.findClip(clipId) : null;
          const assetId =
            found?.clip.assetId ||
            st.project?.tracks.find((t) => t.kind === 'audio' && t.clips.length)?.clips[0]?.assetId ||
            null;
          if (!assetId || st.assets[assetId]?.asset.mediaKind === 'image') return;
          analytics.track(EVENTS.STUDIO_DERIVE_USED, { op: operation, host: studioHost() }, { feature: 'studio' });
          refs.current?.derive(assetId, operation);
        },
        onVoiceover: (text) => {
          voiceoverBridge.request(text);
        },
        onExport: (params) => {
          // MM118: open the dialog prefilled from Medi's validated params; the user presses Export.
          exportDialogBridge.request(prefillFromParams(params));
        },
        onOpenTool: (p) => {
          const slug = typeof p.slug === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(p.slug) ? p.slug : null;
          if (slug) window.open(refs.current?.localized(`/tools/${slug}`) ?? `/tools/${slug}`, '_blank', 'noopener');
        },
      }),
    [refs],
  );
}

/** Toolbar button + panel host. `embedded` (CreaTV) renders nothing. */
export function useStudioCopilot(projectId: string, embedded: boolean) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const [caps, setCaps] = React.useState<AssistantCapabilities | null>(null);
  const [open, setOpen] = React.useState(false);
  const { derive } = useDeriveStudioAsset();
  useKeptSessionEnd('studio'); // MM113
  const refs = React.useRef<Refs | null>(null);
  React.useEffect(() => {
    refs.current = { projectId, caps, t: (key, vars) => String(t(key, vars as Record<string, unknown>)), localized, derive, signedIn: !!auth && auth.tier !== 'anonymous' };
  });
  const adapter = useStudioAdapter(refs);

  // "Show me" (MM114): select the clip (its inspector opens the section), then flash the control.
  React.useEffect(() => {
    if (embedded) return;
    let cancel: (() => void) | null = null;
    const off = studioRevealBridge.register((target) => {
      cancel?.();
      if (target.clipId) useStudioStore.getState().selectClip(target.clipId);
      cancel = flashReveal(target.keys);
    });
    return () => {
      off();
      cancel?.();
    };
  }, [embedded]);

  // Capabilities (re-read on sign-in: the remaining turns are per user). Off by any failure.
  React.useEffect(() => {
    if (embedded) return;
    let alive = true;
    void getAssistantCapabilities().then((c) => alive && setCaps(c));
    return () => {
      alive = false;
    };
  }, [embedded, signedIn]);

  const on = !embedded && studioCopilotOn(caps);
  const onRef = React.useRef(false);
  React.useEffect(() => {
    onRef.current = on;
  }, [on]);

  // Cmd/Ctrl+J (free in the Darkroom keymap; the keymap's handler ignores modified letters it does not bind).
  React.useEffect(() => {
    if (embedded) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== 'j' || !onRef.current) return;
      e.preventDefault();
      setOpen((o) => {
        if (!o) studioAssistantTrack(EVENTS.ASSISTANT_OPENED, { surface: 'studio', entry: 'shortcut' });
        return !o;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [embedded]);

  const toggle = on ? (
    <Button
      variant={open ? 'secondary' : 'outline'}
      size="sm"
      aria-pressed={open}
      aria-label={t('contentStudio.editor.mediLabel', { brand: MEDI_BRAND })}
      title={t('contentStudio.editor.mediLabel', { brand: MEDI_BRAND })}
      onClick={() => {
        if (!open) studioAssistantTrack(EVENTS.ASSISTANT_OPENED, { surface: 'studio', entry: 'button' });
        setOpen((o) => !o);
      }}
      data-testid="medi-copilot-toggle"
    >
      <img src={MEDI_MARK_SRC} alt="" width={16} height={16} className="mr-1" />
      {t('contentStudio.editor.medi', { brand: MEDI_BRAND })}
    </Button>
  ) : null;

  const panel = on && open ? <StudioCopilotPanel adapter={adapter} caps={caps} signedIn={signedIn} tier={auth?.tier ?? 'anonymous'} onClose={() => setOpen(false)} /> : null;

  return { toggle, panel, open: on && open };
}

function StudioCopilotPanel({
  adapter,
  caps,
  signedIn,
  tier,
  onClose,
}: {
  adapter: ReturnType<typeof createStudioAdapter>;
  caps: AssistantCapabilities | null;
  signedIn: boolean;
  tier: NonNullable<ReturnType<typeof useAuth>>['tier'];
  onClose: () => void;
}) {
  const phone = useMediaQuery('(max-width: 767px)');
  return (
    <aside
      className={cn(
        'flex min-h-0 flex-col border-edge',
        phone ? 'fixed inset-x-0 bottom-0 z-40 h-[70dvh] rounded-t-xl border-t shadow-2xl' : 'h-[640px] w-[360px] shrink-0 rounded-lg border',
      )}
      data-testid="medi-copilot"
    >
      <CopilotPanel adapter={adapter} capabilities={caps} signedIn={signedIn} tier={tier} track={studioAssistantTrack} onClose={onClose} />
    </aside>
  );
}
