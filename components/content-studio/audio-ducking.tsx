'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';

/**
 * Project-level auto-ducking controls (editor top bar). Sidechain-style ducking:
 * while a clip on the chosen voice track plays, the other tracks are lowered.
 * The export applies this via sidechaincompress; the preview approximates it
 * with presence-driven gain ramps (preview-surface.tsx).
 */
const AudioDuckingPopover: React.FC = () => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const setAudioDucking = useStudioStore((s) => s.setAudioDucking);

  if (!project) return null;
  const audioTracks = project.tracks.filter((tr) => tr.kind === 'audio');
  const audio = project.audio;
  const enabled = !!audio?.duckingEnabled;
  const amount = audio?.duckAmountDb ?? 9;
  const attack = audio?.duckAttackMs ?? 120;
  const release = audio?.duckReleaseMs ?? 400;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t('contentStudio.audioPanel.button')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <h3 className="text-sm font-semibold text-card-foreground">{t('contentStudio.audioPanel.title')}</h3>
        <p className="text-xs text-muted-foreground mb-3">{t('contentStudio.audioPanel.description')}</p>

        {audioTracks.length === 0 ? (
          <p className="text-xs text-amber-500">{t('contentStudio.audioPanel.noAudioTracks')}</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">{t('contentStudio.audioPanel.enable')}</Label>
              <Switch checked={enabled} onCheckedChange={(on) => setAudioDucking({ duckingEnabled: on })} />
            </div>

            <div>
              <Label className="text-[11px] text-muted-foreground">{t('contentStudio.audioPanel.voiceTrack')}</Label>
              <Select
                value={audio?.duckVoiceTrackId ?? ''}
                onValueChange={(v) => setAudioDucking({ duckVoiceTrackId: v })}
              >
                <SelectTrigger className="h-8 mt-1 text-xs">
                  <SelectValue placeholder={t('contentStudio.audioPanel.selectTrack')} />
                </SelectTrigger>
                <SelectContent>
                  {audioTracks.map((tr) => (
                    <SelectItem key={tr.id} value={tr.id} className="text-xs">
                      A{tr.index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DuckSlider
              label={t('contentStudio.audioPanel.amount')}
              readout={`${amount.toFixed(0)} dB`}
              min={0}
              max={24}
              step={1}
              value={amount}
              onChange={(duckAmountDb) => setAudioDucking({ duckAmountDb })}
            />
            <DuckSlider
              label={t('contentStudio.audioPanel.attack')}
              readout={`${attack.toFixed(0)} ms`}
              min={0}
              max={2000}
              step={10}
              value={attack}
              onChange={(duckAttackMs) => setAudioDucking({ duckAttackMs })}
            />
            <DuckSlider
              label={t('contentStudio.audioPanel.release')}
              readout={`${release.toFixed(0)} ms`}
              min={0}
              max={5000}
              step={50}
              value={release}
              onChange={(duckReleaseMs) => setAudioDucking({ duckReleaseMs })}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const DuckSlider: React.FC<{
  label: string;
  readout: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, readout, min, max, step, value, onChange }) => (
  <div>
    <Label className="text-[11px] text-muted-foreground flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{readout}</span>
    </Label>
    <Slider className="mt-1" min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
  </div>
);

export default AudioDuckingPopover;
