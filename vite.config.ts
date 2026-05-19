import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
          if (id.includes('@stripe')) return 'stripe-vendor';
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
