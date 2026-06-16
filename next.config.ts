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

const nextConfig: NextConfig = {
  async headers() {
    return [
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
