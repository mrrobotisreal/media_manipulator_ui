'use client';

import React from 'react';
import { Headphones, SlidersHorizontal, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { editSummary } from '@/lib/studio/telemetry';
import { STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import { getMeterSource } from '@/lib/studio/audioBus';
import {
  AUDIO_PRESETS,
  defaultCompressor,
  FLAT_EQ,
  matchingPreset,
  presetById,
  presetEffects,
} from '@/lib/studio/audioPresets';
import { audioBearingTracks, faderPosToGain, formatDb, gainToFaderPos, masterGainOf, trackLabel } from '@/lib/studio/mixerMath';
import type { StudioTrack, StudioTrackCompressor, StudioTrackEffects } from '@/lib/studioTypes';
import { useUndoGesture } from './useUndoGesture';

/**
 * Mixer drawer (Darkroom v3 part 19): one channel strip per audio-bearing
 * track + the master strip. Every control edits the SAME store state the
 * timeline's track header uses (mute/solo are the part-18 toggles; gain/pan/
 * effects are EDL v3 track fields; master is audio.masterGain), so the two
 * surfaces can never disagree. Drags are single undo gestures and count once
 * toward `mixerAdjustments`.
 */

const METER_FLOOR = -60;
const METER_HZ = 20;

/** Counts ONE mixerAdjustments per committed drag/edit (not per tick). */
function useMixerGesture() {
  const gesture = useUndoGesture();
  const touched = React.useRef(false);
  return {
    change: () => {
      gesture.begin();
      touched.current = true;
    },
    commit: () => {
      gesture.end();
      if (touched.current) {
        touched.current = false;
        editSummary.increment('mixerAdjustments');
        editSummary.increment('uiInvocations');
      }
    },
  };
}

/** Stereo peak meter, painted imperatively at ~20 Hz (no React renders). */
const Meter: React.FC<{ trackId: string | 'master' }> = ({ trackId }) => {
  const lRef = React.useRef<HTMLDivElement>(null);
  const rRef = React.useRef<HTMLDivElement>(null);
  const hold = React.useRef({ l: METER_FLOOR, r: METER_FLOOR });
  React.useEffect(() => {
    let raf = 0;
    let last = 0;
    const paint = (el: HTMLDivElement | null, db: number) => {
      if (!el) return;
      const pct = Math.max(0, Math.min(1, (db - METER_FLOOR) / -METER_FLOOR)) * 100;
      el.style.height = `${pct}%`;
      el.style.background = db > -3 ? '#ef4444' : db > -12 ? '#f59e0b' : '#22c55e';
    };
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (ts - last < 1000 / METER_HZ) return;
      last = ts;
      const src = getMeterSource();
      const r = src ? (trackId === 'master' ? src.master() : src.track(trackId)) : null;
      const l = r?.l ?? METER_FLOOR;
      const rr = r?.r ?? METER_FLOOR;
      // Fast attack, ~1.5 dB/tick decay: a readable peak ballistic.
      hold.current.l = Math.max(METER_FLOOR, l > hold.current.l ? l : hold.current.l - 1.5);
      hold.current.r = Math.max(METER_FLOOR, rr > hold.current.r ? rr : hold.current.r - 1.5);
      paint(lRef.current, hold.current.l);
      paint(rRef.current, hold.current.r);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trackId]);
  return (
    <div className="flex h-full w-3 gap-px rounded-sm bg-surface-0 p-px" aria-hidden="true" data-testid={`meter-${trackId}`}>
      <div className="relative flex-1 overflow-hidden rounded-[1px] bg-white/5">
        <div ref={lRef} className="absolute bottom-0 left-0 right-0" style={{ height: 0 }} />
      </div>
      <div className="relative flex-1 overflow-hidden rounded-[1px] bg-white/5">
        <div ref={rRef} className="absolute bottom-0 left-0 right-0" style={{ height: 0 }} />
      </div>
    </div>
  );
};

/** Vertical dB fader: position -> linear gain via the dB curve; dbl-click = 0 dB. */
const Fader: React.FC<{ gain: number; label: string; onGain: (g: number) => void }> = ({ gain, label, onGain }) => {
  const g = useMixerGesture();
  return (
    <div className="h-full" onDoubleClick={() => { g.change(); onGain(1); g.commit(); }}>
      <Slider
        orientation="vertical"
        min={0}
        max={1000}
        step={1}
        aria-label={label}
        value={[Math.round(gainToFaderPos(gain) * 1000)]}
        onValueChange={(v) => {
          g.change();
          onGain(faderPosToGain((v[0] ?? 0) / 1000));
        }}
        onValueCommit={g.commit}
        className="h-full min-h-0"
      />
    </div>
  );
};

const PanControl: React.FC<{ pan: number; label: string; onPan: (p: number) => void }> = ({ pan, label, onPan }) => {
  const g = useMixerGesture();
  const r = STUDIO_V3_RANGES.trackPan;
  const txt = Math.abs(pan) < 0.005 ? 'C' : `${pan < 0 ? 'L' : 'R'}${Math.round(Math.abs(pan) * 100)}`;
  return (
    <div className="w-full" onDoubleClick={() => { g.change(); onPan(0); g.commit(); }}>
      <Slider
        min={r.min * 100}
        max={r.max * 100}
        step={1}
        aria-label={label}
        value={[Math.round(pan * 100)]}
        onValueChange={(v) => {
          g.change();
          onPan((v[0] ?? 0) / 100);
        }}
        onValueCommit={g.commit}
      />
      <div className="mt-0.5 text-center text-[10px] tabular-nums text-muted-foreground">{txt}</div>
    </div>
  );
};

const MixSlider: React.FC<{
  label: string;
  readout: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, readout, min, max, step, value, onChange }) => {
  const g = useMixerGesture();
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{readout}</span>
      </div>
      <Slider
        className="mt-1"
        min={min}
        max={max}
        step={step}
        aria-label={label}
        value={[value]}
        onValueChange={(v) => {
          g.change();
          onChange(v[0] ?? value);
        }}
        onValueCommit={g.commit}
      />
    </div>
  );
};

/** Track FX popover: 3-band EQ + compressor + presets (applied, then still editable). */
const TrackFx: React.FC<{ track: StudioTrack }> = ({ track }) => {
  const { t } = useLocalization('interface');
  const setTrackEffects = useStudioStore((s) => s.setTrackEffects);
  const fx = track.effects;
  const eq = fx?.eq ?? FLAT_EQ;
  const comp = fx?.compressor;
  const active = !!fx;
  const preset = matchingPreset(fx);
  const reg = STUDIO_V3_RANGES.compressor;
  const eqR = STUDIO_V3_RANGES.eqGainDb;
  const patch = (next: StudioTrackEffects) => setTrackEffects(track.id, next);
  const setComp = (c: Partial<StudioTrackCompressor>) =>
    patch({ eq: fx?.eq, compressor: { ...(comp ?? defaultCompressor()), ...c } });
  const gesture = useMixerGesture();
  const onPreset = (id: string) => {
    const p = presetById(id);
    if (!p) return;
    gesture.change();
    patch(presetEffects(p));
    gesture.commit();
  };
  const reset = () => {
    gesture.change();
    setTrackEffects(track.id, undefined);
    gesture.commit();
  };
  const eqRow = (key: 'lowGainDb' | 'midGainDb' | 'highGainDb', label: string) => (
    <MixSlider
      key={key}
      label={label}
      readout={`${eq[key] > 0 ? '+' : ''}${eq[key].toFixed(1)} dB`}
      min={eqR.min}
      max={eqR.max}
      step={eqR.step}
      value={eq[key]}
      onChange={(v) => patch({ eq: { ...eq, [key]: v }, compressor: comp })}
    />
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'outline'}
          size="sm"
          className="h-6 w-full px-1 text-[10px]"
          title={t('contentStudio.mixer.fx')}
          aria-label={t('contentStudio.mixer.fx')}
        >
          <SlidersHorizontal className="mr-1 h-3 w-3" />
          FX
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-72 space-y-3" data-testid="mixer-fx">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-card-foreground">{t('contentStudio.mixer.fxTitle')}</h3>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={reset} disabled={!active}>
            {t('contentStudio.mixer.reset')}
          </Button>
        </div>
        <Select value={preset ?? ''} onValueChange={onPreset}>
          <SelectTrigger className="h-8 text-xs" aria-label={t('contentStudio.mixer.presets')}>
            <SelectValue placeholder={t('contentStudio.mixer.presetPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {AUDIO_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                {t(`contentStudio.mixer.preset.${p.id}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">EQ</div>
          {eqRow('lowGainDb', t('contentStudio.mixer.eqLow'))}
          {eqRow('midGainDb', t('contentStudio.mixer.eqMid'))}
          {eqRow('highGainDb', t('contentStudio.mixer.eqHigh'))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>{t('contentStudio.mixer.compressor')}</span>
            {comp ? (
              <button
                type="button"
                className="normal-case text-[11px] text-primary hover:underline"
                onClick={() => {
                  gesture.change();
                  patch({ eq: fx?.eq });
                  gesture.commit();
                }}
              >
                {t('contentStudio.mixer.compOff')}
              </button>
            ) : (
              <button
                type="button"
                className="normal-case text-[11px] text-primary hover:underline"
                onClick={() => {
                  gesture.change();
                  setComp({});
                  gesture.commit();
                }}
              >
                {t('contentStudio.mixer.compOn')}
              </button>
            )}
          </div>
          {comp ? (
            <>
              <MixSlider label={t('contentStudio.mixer.threshold')} readout={`${comp.thresholdDb.toFixed(0)} dB`} {...reg.thresholdDb} value={comp.thresholdDb} onChange={(v) => setComp({ thresholdDb: v })} />
              <MixSlider label={t('contentStudio.mixer.ratio')} readout={`${comp.ratio.toFixed(1)}:1`} {...reg.ratio} value={comp.ratio} onChange={(v) => setComp({ ratio: v })} />
              <MixSlider label={t('contentStudio.mixer.attack')} readout={`${comp.attackMs.toFixed(0)} ms`} {...reg.attackMs} value={comp.attackMs} onChange={(v) => setComp({ attackMs: v })} />
              <MixSlider label={t('contentStudio.mixer.release')} readout={`${comp.releaseMs.toFixed(0)} ms`} {...reg.releaseMs} value={comp.releaseMs} onChange={(v) => setComp({ releaseMs: v })} />
              <MixSlider label={t('contentStudio.mixer.makeup')} readout={`+${comp.makeupDb.toFixed(1)} dB`} {...reg.makeupDb} value={comp.makeupDb} onChange={(v) => setComp({ makeupDb: v })} />
            </>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const stripBtn = (on: boolean, tone: string) =>
  `flex h-6 w-6 items-center justify-center rounded border text-[11px] transition-colors ${
    on ? `border-current bg-surface-3 ${tone}` : 'border-edge text-muted-foreground hover:text-foreground'
  }`;

const ChannelStrip: React.FC<{ track: StudioTrack }> = ({ track }) => {
  const { t } = useLocalization('interface');
  const setTrackGain = useStudioStore((s) => s.setTrackGain);
  const setTrackPan = useStudioStore((s) => s.setTrackPan);
  const toggleTrackMute = useStudioStore((s) => s.toggleTrackMute);
  const toggleTrackSolo = useStudioStore((s) => s.toggleTrackSolo);
  const gain = track.gain ?? 1;
  const label = trackLabel(track);
  const counted = (fn: () => void) => () => {
    fn();
    editSummary.increment('trackControlChanges');
    editSummary.increment('uiInvocations');
  };
  return (
    <div
      className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-md border border-edge bg-surface-2 p-2"
      data-testid={`strip-${track.id}`}
    >
      <div className="w-full truncate text-center text-[11px] font-medium text-foreground" title={label}>
        {label}
      </div>
      <PanControl pan={track.pan ?? 0} label={`${label} ${t('contentStudio.mixer.pan')}`} onPan={(p) => setTrackPan(track.id, p)} />
      <div className="flex h-32 items-stretch gap-2">
        <Fader gain={gain} label={`${label} ${t('contentStudio.mixer.fader')}`} onGain={(g) => setTrackGain(track.id, g)} />
        <Meter trackId={track.id} />
      </div>
      <div className="text-[10px] tabular-nums text-muted-foreground">{formatDb(gain)} dB</div>
      <div className="flex gap-1">
        <button
          type="button"
          className={stripBtn(track.muted, 'text-destructive')}
          aria-pressed={track.muted}
          title={t('contentStudio.timeline.mute')}
          onClick={counted(() => toggleTrackMute(track.id))}
        >
          <VolumeX className="h-3 w-3" />
        </button>
        {track.kind === 'audio' ? (
          <button
            type="button"
            className={stripBtn(!!track.solo, 'text-primary')}
            aria-pressed={!!track.solo}
            title={track.solo ? t('contentStudio.timeline.unsolo') : t('contentStudio.timeline.solo')}
            onClick={counted(() => toggleTrackSolo(track.id))}
          >
            <Headphones className="h-3 w-3" />
          </button>
        ) : null}
      </div>
      <TrackFx track={track} />
    </div>
  );
};

const MasterStrip: React.FC = () => {
  const { t } = useLocalization('interface');
  const gain = useStudioStore((s) => masterGainOf(s.project?.audio));
  const setMasterGain = useStudioStore((s) => s.setMasterGain);
  return (
    <div
      className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-md border border-primary/40 bg-surface-2 p-2"
      data-testid="strip-master"
    >
      <div className="text-[11px] font-semibold text-foreground">{t('contentStudio.mixer.master')}</div>
      <div className="h-[22px]" />
      <div className="flex h-32 items-stretch gap-2">
        <Fader gain={gain} label={t('contentStudio.mixer.masterFader')} onGain={setMasterGain} />
        <Meter trackId="master" />
      </div>
      <div className="text-[10px] tabular-nums text-muted-foreground">{formatDb(gain)} dB</div>
    </div>
  );
};

const Mixer: React.FC = () => {
  const { t } = useLocalization('interface');
  const open = useStudioStore((s) => s.mixerOpen);
  const tracks = useStudioStore((s) => s.project?.tracks);
  const assets = useStudioStore((s) => s.assets);
  const strips = React.useMemo(() => audioBearingTracks(tracks ?? [], assets), [tracks, assets]);
  if (!open) return null;
  return (
    <section
      aria-label={t('contentStudio.mixer.title')}
      className="rounded-lg border border-border bg-card p-3"
      data-testid="mixer-drawer"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t('contentStudio.mixer.title')}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {strips.length === 0 ? (
          <p className="self-center px-2 text-xs text-muted-foreground">{t('contentStudio.mixer.empty')}</p>
        ) : (
          strips.map((tr) => <ChannelStrip key={tr.id} track={tr} />)
        )}
        <div className="ml-auto" />
        <MasterStrip />
      </div>
    </section>
  );
};

export default Mixer;
