import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BlogPage from './pages/blog';
import AboutPage from './pages/about';
import HowItWorksPage from './pages/how-it-works';
import PrivacyPolicyPage from './pages/privacy-policy';
import TermsOfServicePage from './pages/terms-of-service';
import TopNav from './components/top-nav';
import VideoCompressionGuide from './pages/blog/video/video-compression-guide';
import ImageOptimizationGuide from './pages/blog/image/image-optimization-guide';
import AudioQualityGuide from './pages/blog/audio/audio-quality-guide';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <TopNav />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/video/video-compression-guide" element={<VideoCompressionGuide />} />
          <Route path="/blog/image/image-optimization-guide" element={<ImageOptimizationGuide />} />
          <Route path="/blog/audio/audio-quality-guide" element={<AudioQualityGuide />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
