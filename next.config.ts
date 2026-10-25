import type { NextConfig } from "next";

// Origins allowed to frame the chromeless /embed/* routes (CreaTV's Darkroom).
// Override via EMBED_FRAME_ANCESTORS for staging/preview — accepts space- OR
// comma-separated origins (normalized to the space-delimited CSP syntax).
const EMBED_FRAME_ANCESTORS = (
  process.env.EMBED_FRAME_ANCESTORS ||
  "https://creatv.io https://www.creatv.io http://localhost:8080"
)
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean)
  .join(" ");

// MM52 translator deployments (design docs/design/TRANSLATOR_WORKBENCH.md §2.6,
// §2.7). Production never sets either variable. They are defined under `env`
// so `process.env.NEXT_PUBLIC_DEPLOY_ROLE` is inlined as a literal ('' when
// unset) in EVERY bundle: Next only inlines NEXT_PUBLIC_* vars that exist at
// build time, and an un-inlined reference would keep the guarded
// `lib/translator` require in the production client chunks. Both are read at
// BUILD time, so changing them on a Vercel branch needs a redeploy.
const DEPLOY_ROLE = process.env.NEXT_PUBLIC_DEPLOY_ROLE ?? '';
const TRANSLATOR_LOCALE = process.env.NEXT_PUBLIC_TRANSLATOR_LOCALE ?? '';
const IS_TRANSLATOR_DEPLOYMENT = DEPLOY_ROLE === 'translator';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOY_ROLE: DEPLOY_ROLE,
    NEXT_PUBLIC_TRANSLATOR_LOCALE: TRANSLATOR_LOCALE,
  },
  async headers() {
    return [
      // Translator deployments must never be indexed. Vercel omits its own
      // preview X-Robots-Tag on branch-assigned custom domains (research §3),
      // so set it on every response. Absent from production builds.
      ...(IS_TRANSLATOR_DEPLOYMENT
        ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
        : []),
      {
        // Let CreaTV frame the embedded Content Studio editor. Scoped to
        // /embed/* only — the rest of the site keeps its default framing
        // policy (and no global X-Frame-Options is set, so nothing blocks it).
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${EMBED_FRAME_ANCESTORS};`,
          },
        ],
      },
      {
        // The self-destroying cleanup worker (public/sw.js) must never be
        // served from a cache, so the browser's update check always re-fetches
        // it and replaces the stale Vite/Workbox worker left in returning
        // visitors' browsers. See public/sw.js for the full story.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          // Allow the worker to claim the root scope (it registered at '/').
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default nextConfig;
