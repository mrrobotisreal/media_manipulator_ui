import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopNav from './components/top-nav';
import Footer from './components/footer';
import MobileAnchorAd from './components/mobile-anchor-ad';
import { trackFirstPartyPageView } from './lib/firstPartyAnalytics';
import { trackGooglePageView } from './lib/gtag';
import { trackMixpanelPageView } from './lib/analytics';
import { applySeoMeta, getSeoForPath } from './lib/seo';

// Lazy-loaded page components — each becomes its own JS chunk so the
// initial bundle ships only enough code for the homepage and shell.
const App = lazy(() => import('./App'));
const BlogPage = lazy(() => import('./pages/blog'));
const VideoCompressionGuide = lazy(
  () => import('./pages/blog/video/video-compression-guide'),
);
const ImageOptimizationGuide = lazy(
  () => import('./pages/blog/image/image-optimization-guide'),
);
const AudioQualityGuide = lazy(
  () => import('./pages/blog/audio/audio-quality-guide'),
);
const AboutPage = lazy(() => import('./pages/about'));
const HowItWorksPage = lazy(() => import('./pages/how-it-works'));
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'));
const TermsOfServicePage = lazy(() => import('./pages/terms-of-service'));
const TutorialsPage = lazy(() => import('./pages/tutorials'));
const AudioGettingStartedTutorial = lazy(
  () => import('./pages/tutorials/audio/getting-started'),
);
const VideoGettingStartedTutorial = lazy(
  () => import('./pages/tutorials/video/getting-started'),
);
const ImageGettingStartedTutorial = lazy(
  () => import('./pages/tutorials/image/getting-started'),
);
const ToolsIndexPage = lazy(() => import('./pages/tools/index'));
const ToolPage = lazy(() => import('./pages/tools/tool-page'));
const NotFoundPage = lazy(() => import('./pages/not-found'));

const RouteAnalytics: React.FC = () => {
  const location = useLocation();
  const isInitialPageviewSentRef = useRef(false);

  useEffect(() => {
    const seo = getSeoForPath(location.pathname);
    applySeoMeta(seo);

    // Wait a frame so document.title reflects the new route before sending.
    const sendPageview = () => {
      const path = `${location.pathname}${location.search}`;
      const title = document.title || seo.title;
      trackFirstPartyPageView(title);
      trackGooglePageView(title, path);
      trackMixpanelPageView(title, path);
    };

    if (!isInitialPageviewSentRef.current) {
      isInitialPageviewSentRef.current = true;
      sendPageview();
      return;
    }

    const raf = requestAnimationFrame(sendPageview);
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.search]);

  return null;
};

const RouteFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[40vh] flex items-center justify-center px-4"
  >
    <div className="flex items-center gap-3 text-card-foreground">
      <span
        aria-hidden="true"
        className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"
      />
      <span
        aria-hidden="true"
        className="w-3 h-3 rounded-full bg-blue-500 animate-pulse [animation-delay:120ms]"
      />
      <span
        aria-hidden="true"
        className="w-3 h-3 rounded-full bg-blue-500 animate-pulse [animation-delay:240ms]"
      />
      <span className="sr-only">Loading…</span>
    </div>
  </div>
);

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <RouteAnalytics />
        <TopNav />
        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route
                path="/blog/video/video-compression-guide"
                element={<VideoCompressionGuide />}
              />
              <Route
                path="/blog/image/image-optimization-guide"
                element={<ImageOptimizationGuide />}
              />
              <Route
                path="/blog/audio/audio-quality-guide"
                element={<AudioQualityGuide />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              <Route
                path="/tutorials/audio/getting-started"
                element={<AudioGettingStartedTutorial />}
              />
              <Route
                path="/tutorials/video/getting-started"
                element={<VideoGettingStartedTutorial />}
              />
              <Route
                path="/tutorials/image/getting-started"
                element={<ImageGettingStartedTutorial />}
              />
              <Route path="/tools" element={<ToolsIndexPage />} />
              <Route path="/tools/:slug" element={<ToolPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              {/* <Route path="/pricing" element={<PricingPage />} /> */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <MobileAnchorAd />
      </div>
    </BrowserRouter>
  );
};

export default Router;
