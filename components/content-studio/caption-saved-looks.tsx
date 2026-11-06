'use client';

import React from 'react';
import { Lock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalization } from '@/i18n/useLocalization';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { publishLimitRefusal } from '@/lib/auth/quotaBus';
import { captionLookCountBucket } from '@/lib/studio/captions/analytics';
import type { CaptionLook } from '@/lib/studio/captions/captionLooks';
import {
  CAPTION_LOOK_NAME_MAX,
  CaptionLookApiError,
  isCaptionLookLimit,
  useCreateSavedCaptionLook,
  useDeleteSavedCaptionLook,
  useSavedCaptionLooks,
  type SavedCaptionLook,
} from '@/lib/studio/captions/captionLooksApi';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { studioHost } from '@/lib/studio/telemetry';
import type { StudioCaptionStyle } from '@/lib/studioTypes';
import { cn } from '@/lib/utils';
import CaptionLookPreview from './caption-look-preview';

/**
 * Saved caption looks (MM122 decision 4): the account's own looks under the catalog, and "Save
 * look" for the current style. Premium saves 10, Pro unlimited; anonymous and free see the lock
 * (sign-in / the Premium interstitial). The 11th save on Premium is refused by the server (403
 * caption_looks_limit), which authedFetch routes to the interstitial (offering Pro); a Save at a
 * known cap opens it without a request. Hidden in the CreaTV embed (no MM plan there).
 */
const CaptionSavedLooks: React.FC<{ style: StudioCaptionStyle; onApply: (style: StudioCaptionStyle) => void }> = ({ style, onApply }) => {
  const { t } = useLocalization('interface');
  const auth = useAuth();
  const backend = useStudioBackend();
  const available = backend.capabilities.captionLooks === true;
  const signedIn = !!auth && auth.tier !== 'anonymous';
  const cap = auth?.limits?.captionLooksSaved ?? 0;
  const canSave = signedIn && cap !== 0;
  const list = useSavedCaptionLooks(available && canSave);
  const create = useCreateSavedCaptionLook();
  const remove = useDeleteSavedCaptionLook();
  const [naming, setNaming] = React.useState(false);
  const [name, setName] = React.useState('');

  if (!available) return null;
  const looks = list.data?.looks ?? [];
  const limit = list.data?.limit ?? cap;
  const used = list.data?.used ?? looks.length;
  const atCap = limit >= 0 && used >= limit;

  const limitHit = (l: number) => {
    analytics.track(EVENTS.STUDIO_CAPTION_LOOK_LIMIT_HIT, { tier: auth?.tier ?? 'anonymous', limit: Math.max(0, l), host: studioHost() }, { feature: 'studio' });
  };
  const startSave = () => {
    if (!signedIn) {
      auth?.openAuth({ intent: 'signup', source: 'studio_caption_look_save' });
      return;
    }
    if (!canSave || atCap) {
      limitHit(limit);
      publishLimitRefusal({ error: 'caption_looks_limit', limit: Math.max(0, limit), used, fromClick: true, upgradePath: auth?.tier === 'premium' ? 'pro' : 'premium' });
      return;
    }
    setName('');
    setNaming(true);
  };
  const save = async () => {
    const n = name.trim();
    if (!n) return;
    try {
      const out = await create.mutateAsync({ name: n, style });
      setNaming(false);
      toast.success(t('contentStudio.captions.savedLookSaved'));
      analytics.track(EVENTS.STUDIO_CAPTION_LOOK_SAVED, { tier: auth?.tier ?? 'free', count: captionLookCountBucket(out.used), host: studioHost() }, { feature: 'studio' });
    } catch (e) {
      if (isCaptionLookLimit(e)) {
        // authedFetch already opened the interstitial for the 403.
        setNaming(false);
        limitHit(typeof e.body?.limit === 'number' ? e.body.limit : limit);
        return;
      }
      toast.error(t((e as CaptionLookApiError).status === 409 ? 'contentStudio.captions.savedLookConflict' : 'contentStudio.captions.savedLookFailed'));
    }
  };
  const apply = (l: SavedCaptionLook) => {
    onApply(l.style);
    analytics.track(EVENTS.STUDIO_CAPTION_LOOK_APPLIED, { lookId: 'saved', source: 'ui', host: studioHost() }, { feature: 'studio' });
  };

  return (
    <section className="space-y-2 border-t border-border pt-3 mb-3" aria-labelledby="caption-saved-looks-label" data-testid="caption-saved-looks">
      <div className="flex items-center justify-between">
        <Label id="caption-saved-looks-label" className="text-xs font-semibold">{t('contentStudio.captions.savedLooks')}</Label>
        {canSave && list.data && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {limit < 0 ? t('contentStudio.captions.savedLookCountUnlimited', { used }) : t('contentStudio.captions.savedLookCount', { used, limit })}
          </span>
        )}
      </div>
      {canSave && looks.length > 0 && (
        <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="caption-saved-looks-label">
          {looks.map((l) => (
            <div key={l.id} className="relative group">
              <button
                type="button"
                onClick={() => apply(l)}
                className={cn('w-full text-left rounded-md border border-border p-1 hover:border-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                aria-label={l.name}
                data-testid={`saved-look-${l.id}`}
              >
                <CaptionLookPreview look={{ id: 'minimal', anon: true, style: l.style } as CaptionLook} label={l.name} />
                <span className="mt-1 block truncate text-[10px] leading-tight">{l.name}</span>
              </button>
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={`${t('contentStudio.captions.savedLookDelete')}: ${l.name}`}
                onClick={() => remove.mutate(l.id)}
              >
                <Trash2 className="w-3 h-3" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
      {canSave && list.data && looks.length === 0 && <p className="text-[10px] text-muted-foreground">{t('contentStudio.captions.savedLooksEmpty')}</p>}
      {naming ? (
        <form
          className="flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Input
            autoFocus
            className="h-7 text-xs"
            maxLength={CAPTION_LOOK_NAME_MAX}
            value={name}
            placeholder={t('contentStudio.captions.saveLookName')}
            aria-label={t('contentStudio.captions.saveLookName')}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" size="sm" className="h-7 text-xs" disabled={!name.trim() || create.isPending}>
            {t('contentStudio.captions.saveLookConfirm')}
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setNaming(false)}>
            {t('contentStudio.captions.saveLookCancel')}
          </Button>
        </form>
      ) : (
        <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={startSave} data-testid="caption-save-look">
          {canSave ? <Plus className="w-3.5 h-3.5 mr-1" aria-hidden /> : <Lock className="w-3.5 h-3.5 mr-1" aria-hidden />}
          {t('contentStudio.captions.saveLook')}
        </Button>
      )}
      {!canSave && (
        <p className="text-[10px] text-muted-foreground">
          {t(signedIn ? 'contentStudio.captions.saveLookLocked' : 'contentStudio.captions.saveLookSignIn')}
        </p>
      )}
    </section>
  );
};

export default CaptionSavedLooks;
