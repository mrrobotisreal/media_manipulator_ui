import { Presentation } from 'lucide-react';
import DrComingSoon from '@/components/dr/dr-coming-soon';

// /dr/demos — coming-soon placeholder.
export default function DrDemosPage() {
  return (
    <DrComingSoon
      icon={<Presentation className="size-6 text-primary" />}
      title="The Demos feature is coming soon!"
      description="Product walkthroughs and prototype demonstrations will live here."
      homeHref="/dr"
    />
  );
}
