import DrAuthGate from '@/components/dr/dr-auth-gate';
import DrShell from '@/components/dr/dr-shell';

// Everything under (portal) — /dr, /dr/docs, /dr/docs/[slug], /dr/docs/new,
// /dr/demos, /dr/feedback — is gated, then wrapped in the private shell. The
// route group keeps /dr/auth outside this boundary so sign-in renders bare. The
// gate is UX-only; the API (Firebase token + email allowlist) is the real
// enforcement boundary.
export default function DrPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DrAuthGate>
      <DrShell>{children}</DrShell>
    </DrAuthGate>
  );
}
