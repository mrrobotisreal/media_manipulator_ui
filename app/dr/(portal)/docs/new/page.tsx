import { Hammer } from 'lucide-react';
import DrComingSoon from '@/components/dr/dr-coming-soon';

// /dr/docs/new — placeholder for the future in-portal document editor. The "Go
// Back" button returns to wherever the user came from (falling back to the docs
// list when there is no history).
export default function DrNewDocPage() {
  return (
    <DrComingSoon
      icon={<Hammer className="size-6 text-primary" />}
      title="DR+MM Doc Editor IDE is coming soon!"
      description="You'll be able to author and edit partner documents right here. For now, documents are seeded and managed on the backend."
      goBackFallbackHref="/dr/docs"
    />
  );
}
