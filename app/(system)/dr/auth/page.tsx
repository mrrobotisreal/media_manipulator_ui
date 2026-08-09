import DrAuthView from '@/components/dr/dr-auth-view';

// /dr/auth — the dedicated Double Raven sign-in page. Lives OUTSIDE the (portal)
// route group so it renders without the authenticated shell and is not wrapped
// by DrAuthGate (which would redirect-loop). Email + password only.
export default function DrAuthPage() {
  return <DrAuthView />;
}
