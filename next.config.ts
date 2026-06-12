import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
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
