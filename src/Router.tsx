import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import BlogPage from './pages/blog';
import AboutPage from './pages/about';
// import PricingPage from './pages/pricing';
import HowItWorksPage from './pages/how-it-works';
import PrivacyPolicyPage from './pages/privacy-policy';
import TermsOfServicePage from './pages/terms-of-service';
import TopNav from './components/top-nav';
import Footer from './components/footer';
import VideoCompressionGuide from './pages/blog/video/video-compression-guide';
import ImageOptimizationGuide from './pages/blog/image/image-optimization-guide';
import AudioQualityGuide from './pages/blog/audio/audio-quality-guide';
import TutorialsPage from './pages/tutorials';
import AudioGettingStartedTutorial from './pages/tutorials/audio/getting-started';
import VideoGettingStartedTutorial from './pages/tutorials/video/getting-started';
import ImageGettingStartedTutorial from './pages/tutorials/image/getting-started';
import { trackFirstPartyPageView } from './lib/firstPartyAnalytics';

const RouteAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackFirstPartyPageView(document.title || location.pathname);
  }, [location.pathname, location.search]);

  return null;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <RouteAnalytics />
        <TopNav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/video/video-compression-guide" element={<VideoCompressionGuide />} />
            <Route path="/blog/image/image-optimization-guide" element={<ImageOptimizationGuide />} />
            <Route path="/blog/audio/audio-quality-guide" element={<AudioQualityGuide />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/tutorials/audio/getting-started" element={<AudioGettingStartedTutorial />} />
            <Route path="/tutorials/video/getting-started" element={<VideoGettingStartedTutorial />} />
            <Route path="/tutorials/image/getting-started" element={<ImageGettingStartedTutorial />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            {/* <Route path="/pricing" element={<PricingPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Router;
