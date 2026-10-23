import { Fingerprint, History, IdCard, MapPin, type LucideIcon } from 'lucide-react';
import type { PrivacyClass } from '@/lib/metadata/types';

export const PRIVACY_ICON: Record<PrivacyClass, LucideIcon> = {
  location: MapPin,
  identity: IdCard,
  device: Fingerprint,
  history: History,
};
