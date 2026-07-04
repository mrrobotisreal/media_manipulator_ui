import { MessageSquare } from 'lucide-react';
import DrComingSoon from '@/components/dr/dr-coming-soon';

// /dr/feedback — coming-soon placeholder.
export default function DrFeedbackPage() {
  return (
    <DrComingSoon
      icon={<MessageSquare className="size-6 text-primary" />}
      title="The Communication/Feedback feature is coming soon!"
      description="A shared space for notes, questions, and feedback between Double Raven and Media Manipulator."
      homeHref="/dr"
    />
  );
}
