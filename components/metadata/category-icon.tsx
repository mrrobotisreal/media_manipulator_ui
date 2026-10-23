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



/** Renders the icon for a category id. */
export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = categoryIcon[id] ?? Tag;
  return <Icon aria-hidden="true" className={className} />;
}
