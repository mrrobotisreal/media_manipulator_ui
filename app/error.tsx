'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Route-segment error boundary for the app.
 *
 * Next.js wraps every page (and its nested children) in this boundary but NOT
 * the root layout, so the top nav and footer survive — the user sees a
 * recoverable fallback instead of a blank page when something throws during
 * render or inside an effect.
 *
 * Before this existed there was no error containment anywhere in the tree: a
 * single unhandled throw (e.g. an analytics call firing before its SDK was
 * initialized) unmounted the whole app and blanked the screen. This boundary
 * is the safety net for that entire class of failure.
 *
 * Keep this component dependency-light and defensive — an error boundary that
 * throws is useless.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // Surface the original error for debugging / error reporting.
    console.error('Page render error caught by boundary:', error);
  }, [error]);

  const handleRetry = () => {
    try {
      if (typeof unstable_retry === 'function') {
        unstable_retry();
        return;
      }
    } catch {
      // Fall through to a hard reload below.
    }
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-16 flex flex-col items-center text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-5">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-card-foreground tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 text-muted-foreground max-w-md">
        An unexpected error interrupted this page. Your files were not lost — you can
        try again, and if the problem continues, reload the page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRetry}
          className="bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') window.location.assign('/');
          }}
          className="bg-card border border-border text-card-foreground py-2.5 px-5 rounded-lg hover:bg-muted transition-colors"
        >
          Go to homepage
        </button>
      </div>
    </div>
  );
}
