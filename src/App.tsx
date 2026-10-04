import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { CameraStatusProvider } from './hooks/useCameraStatus';
import About from './pages/About';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Simulator from './pages/Simulator';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-mute">That address does not match a page in OptiFlip.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <CameraStatusProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <ErrorBoundary resetKey={pathname}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </CameraStatusProvider>
    </MotionConfig>
  );
}
