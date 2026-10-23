import {
  Aperture,
  Apple,
  AudioLines,
  Box,
  Calendar,
  Camera,
  Cpu,
  Film,
  FileText,
  File as FileIcon,
  History,
  Image as ImageIcon,
  Layers,
  MapPin,
  Newspaper,
  Palette,
  Panda,
  ShieldCheck,
  Tag,
  Code,
  Package,
  type LucideIcon,
} from 'lucide-react';

/** Lucide icon per category id (no emoji in UI). */
export const categoryIcon: Record<string, LucideIcon> = {
  file: FileIcon,
  image: ImageIcon,
  camera: Camera,
  lens: Aperture,
  gps: MapPin,
  datetime: Calendar,
  color: Palette,
  thumbnail: Layers,
  iptc: Newspaper,
  xmp: Code,
  history: History,
  video: Film,
  audio: AudioLines,
  container: Package,
  apple: Apple,
  png: Box,
  pdf: FileText,
  c2pa: ShieldCheck,
  pano: Panda,
  makernote: Cpu,
  composite: Tag,
  other: Tag,
};

export function iconFor(id: string): LucideIcon {
  return categoryIcon[id] ?? Tag;
}


/** Renders the icon for a category id; keeps icon lookup out of render bodies. */
export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = iconFor(id);
  return <Icon aria-hidden="true" className={className} />;
}
