'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import {
  DEFAULT_STUDIO_PREFERENCES,
  loadStudioPreferences,
  saveStudioPreferences,
  type StudioPreferences,
} from '@/lib/studio/preferences';
import { editSummary } from '@/lib/studio/telemetry';

const RANGE = STUDIO_V3_RANGES.transitionDurationSeconds;

/**
 * Editor preferences dialog (part 14): default transition/crossfade durations,
 * persisted to localStorage (lib/studio/preferences.ts) and applied whenever a
 * transition is inserted. Reachable from the editor header; reads storage on
 * open (not at render) so SSR markup never depends on client storage.
 */
const PreferencesDialog: React.FC = () => {
  const { t } = useLocalization('interface');
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<StudioPreferences>(DEFAULT_STUDIO_PREFERENCES);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setPrefs(loadStudioPreferences());
      editSummary.increment('uiInvocations');
    }
  };

  const update = (patch: Partial<StudioPreferences>) => {
    setPrefs(saveStudioPreferences(patch));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title={t('contentStudio.preferences.open')}>
          <Settings2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('contentStudio.preferences.title')}</DialogTitle>
          <DialogDescription>{t('contentStudio.preferences.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <DurationField
            label={t('contentStudio.preferences.defaultVideoTransition')}
            value={prefs.defaultVideoTransitionSeconds}
            onChange={(v) => update({ defaultVideoTransitionSeconds: v })}
          />
          <DurationField
            label={t('contentStudio.preferences.defaultAudioCrossfade')}
            value={prefs.defaultAudioCrossfadeSeconds}
            onChange={(v) => update({ defaultAudioCrossfadeSeconds: v })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DurationField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => {
  const { t } = useLocalization('interface');
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            className="h-7 w-20 text-xs px-1.5 text-right"
            min={RANGE.min}
            max={RANGE.max}
            step={RANGE.step}
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (Number.isFinite(v)) onChange(v);
            }}
          />
          <span className="text-xs text-muted-foreground">{t('contentStudio.preferences.seconds')}</span>
        </div>
      </div>
      <Slider
        className="mt-2"
        min={RANGE.min}
        max={RANGE.max}
        step={RANGE.step}
        value={[value]}
        onValueChange={(v) => {
          if (typeof v[0] === 'number') onChange(v[0]);
        }}
      />
    </div>
  );
};

export default PreferencesDialog;
