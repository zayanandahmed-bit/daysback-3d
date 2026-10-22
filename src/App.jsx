import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Intro from './components/Intro.jsx';
import Immersive from './pages/Immersive.jsx';
import Services from './pages/Services.jsx';
import Reviews from './pages/Reviews.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Reply from './pages/Reply.jsx';
import Thanks from './pages/Thanks.jsx';
import { Article, InsightsIndex } from './pages/Insights.jsx';
import { useCardTilt, useScrollReveal } from './hooks/useSiteEffects.js';

// Three.js is by far the heaviest thing on the page and it only draws
// decoration. Splitting it out means the text, buttons and layout paint
// immediately and the network animation fades in a moment later, instead of
// everyone waiting on a 600kB download before seeing anything.
const Background = lazy(() => import('./components/Background.jsx'));

const TITLES = {
  '/': 'DaysBack | Custom AI Agents & Automations for Businesses',
  '/services': 'Services | DaysBack: AI Agents, AI Receptionists & Automation',
  '/reviews': 'Reviews | DaysBack',
  '/about': 'About DaysBack | AI Automation Agency',
  '/contact': 'Contact DaysBack | Book a Free 27-Minute Strategy Call',
  '/thanks': 'Thank you | DaysBack',
  '/insights': 'Insights | DaysBack: AI & Automation Guides',
};

export default function App() {
  const { pathname } = useLocation();

  useScrollReveal(pathname);
  useCardTilt(pathname);

  useEffect(() => {
    if (!pathname.startsWith('/insights/')) document.title = TITLES[pathname.replace(/\/$/, '') || '/'] ?? TITLES['/'];
    window.scrollTo(0, 0);
  }, [pathname]);

  // Cookie-free page-view count (no IPs or cookies stored); team pages skipped.
  useEffect(() => {
    const url = import.meta.env.VITE_TRACK_URL;
    if (!url || pathname.startsWith('/reply')) return;
    fetch(url, {
      method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer }),
    }).catch(() => {});
  }, [pathname]);

  return (
    <>
      <Intro />
      {/* The homepage draws its own 3D world, so the decorative background
          is only needed on the other pages. */}
      {pathname !== '/' && (
        <Suspense fallback={null}>
          <Background />
        </Suspense>
      )}
      <Nav />
      <Routes>
        <Route path="/" element={<Immersive />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reply" element={<Reply />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/insights" element={<InsightsIndex />} />
        <Route path="/insights/:slug" element={<Article />} />

        {/* The site used to be plain .html files, so links already out in the
            world (the WhatsApp share, anything indexed) point at those paths.
            Redirect rather than break them. */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/services.html" element={<Navigate to="/services" replace />} />
        <Route path="/reviews.html" element={<Navigate to="/reviews" replace />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/contact.html" element={<Navigate to="/contact" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
