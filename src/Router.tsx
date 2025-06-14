import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BlogPage from './pages/blog';
import AboutPage from './pages/about';
import HowItWorksPage from './pages/how-it-works';
import PrivacyPolicyPage from './pages/privacy-policy';
import TermsOfServicePage from './pages/terms-of-service';
import TopNav from './components/top-nav';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <TopNav />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogPage />} />
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
