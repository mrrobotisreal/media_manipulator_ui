import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['MMIcon.webp', 'MMOpenGraph.jpg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Media Manipulator',
        short_name: 'Media Manipulator',
        description:
          'Free online tools for converting, compressing, transcribing, and editing images, videos, and audio files.',
        theme_color: '#0a0e1a',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/MMIcon.webp', sizes: '192x192', type: 'image/webp', purpose: 'any' },
          { src: '/MMIcon.webp', sizes: '512x512', type: 'image/webp', purpose: 'any' },
          { src: '/MMIcon.webp', sizes: '512x512', type: 'image/webp', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Static shell — HTML, JS, CSS, fonts, icons — cached for offline. The
        // prerender script emits per-route HTML in dist/<route>/index.html;
        // we only want to precache the root index.html so we don't ship 30+
        // route HTMLs into the SW precache manifest.
        globPatterns: ['**/*.{js,css,webp,jpg,png,svg,woff,woff2,ttf}', 'index.html'],
        globIgnores: ['**/*/index.html'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/],
        runtimeCaching: [
          {
            // Conversion API — never cache. If offline, the conversion just fails fast.
            urlPattern: /^https:\/\/api\.media-manipulator\.com\/api\/.*/,
            handler: 'NetworkOnly',
          },
          {
            // First-party analytics endpoint — never cache.
            urlPattern: /^https:\/\/analytics\.media-manipulator\.com\/.*/,
            handler: 'NetworkOnly',
          },
          {
            // AdSense, GA, and Funding Choices scripts — never cache.
            urlPattern:
              /^https:\/\/(pagead2\.googlesyndication|www\.googletagmanager|fundingchoicesmessages\.google)\.com\/.*/,
            handler: 'NetworkOnly',
          },
          {
            // S3 presigned URLs for upload/download — never cache.
            urlPattern: /^https:\/\/.*\.s3[.-].*amazonaws\.com\/.*/,
            handler: 'NetworkOnly',
          },
          {
            // Same-origin static assets — cache-first with revalidation.
            urlPattern: /\.(?:js|css|woff2?|ttf|webp|png|jpg|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'mm-static-assets' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-router')) return 'react-vendor';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('firebase/')) return 'firebase-vendor';
          if (id.includes('mixpanel-browser')) return 'analytics-vendor';
          if (id.includes('web-vitals')) return 'analytics-vendor';
          if (id.includes('@radix-ui') || id.includes('lucide-react')) return 'ui-vendor';
          if (id.includes('@tanstack/react-query')) return 'query-vendor';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) {
            return 'form-vendor';
          }
          return undefined;
        },
      },
    },
  },
})
