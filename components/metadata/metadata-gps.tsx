'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { extractCoordinates, formatCoordinates } from '@/lib/metadata/format';
import type { MetadataEntry } from '@/lib/metadata/types';
import { project, WORLD_OUTLINE_PATH, WORLD_VIEWBOX } from './world-outline';

export function openStreetMapUrl(lat: number, lon: number): string {
  const la = lat.toFixed(6);
  const lo = lon.toFixed(6);
  return `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=15/${la}/${lo}`;
}

const display = (entries: readonly MetadataEntry[], tag: string): string | undefined => {
  const e = entries.find((x) => x.tag === tag && (x.group === 'GPS' || x.group === 'Composite')) ??
    entries.find((x) => x.tag === tag);
  if (!e || e.value === null || typeof e.value === 'object') return undefined;
  return String(e.value);
};

/**
 * Location summary for the `gps` category. The locator is an inline SVG drawn
 * from a constant outline: no tile, image, font or network request of any kind.
 * The OpenStreetMap link only navigates when clicked.
 */
export function MetadataGps({ entries }: { entries: readonly MetadataEntry[] }) {
  const { t } = useLocalization('interface');
  const coords = extractCoordinates(entries);
  if (!coords) return null;
  const { decimal, dms } = formatCoordinates(coords.lat, coords.lon);
  const { x, y } = project(coords.lat, coords.lon);
  const altitude = display(entries, 'GPSAltitude');
  const direction = display(entries, 'GPSImgDirection');
  const speed = display(entries, 'GPSSpeed');

  return (
    <div data-testid="metadata-gps" className="mb-4 grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
      <svg
        role="img"
        aria-label={t('metadata.gps.map', { lat: coords.lat.toFixed(4), lon: coords.lon.toFixed(4) })}
        viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
        className="w-full rounded-md border border-edge bg-surface-2"
      >
        <g stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.4" className="text-foreground">
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line key={lat} x1="0" x2="360" y1={90 - lat} y2={90 - lat} />
          ))}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
            <line key={lon} y1="0" y2="180" x1={lon + 180} x2={lon + 180} />
          ))}
        </g>
        <path d={WORLD_OUTLINE_PATH} className="fill-surface-3 stroke-edge-strong" strokeWidth="0.5" />
        <circle cx={x} cy={y} r="7" className="fill-primary" fillOpacity="0.25" />
        <circle cx={x} cy={y} r="2.6" className="fill-primary stroke-background" strokeWidth="0.8" data-testid="gps-dot" />
      </svg>
      <div className="min-w-0 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0 space-y-1">
            <Stat orientation="inline" label={t('metadata.gps.decimal')} value={decimal} wrap />
            <Stat orientation="inline" label={t('metadata.gps.dms')} value={dms} wrap />
          </div>
        </div>
        {altitude || direction || speed ? (
          <div className="grid grid-cols-3 gap-3">
            {altitude ? <Stat label={t('metadata.gps.altitude')} value={altitude} wrap /> : null}
            {direction ? <Stat label={t('metadata.gps.direction')} value={direction} wrap /> : null}
            {speed ? <Stat label={t('metadata.gps.speed')} value={speed} wrap /> : null}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">{t('metadata.gps.privacy')}</p>
        <a
          href={openStreetMapUrl(coords.lat, coords.lon)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-2 hover:underline"
        >
          <ExternalLink aria-hidden="true" className="size-3.5" />
          {t('metadata.gps.openMap')}
        </a>
        <p className="text-xs text-muted-foreground">{t('metadata.gps.openMapHint')}</p>
      </div>
    </div>
  );
}
