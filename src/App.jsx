import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Intro from './components/Intro.jsx';
// The homepage carries the 3D engine; loading it on demand keeps the other
// pages light. main.jsx starts fetching it early when you land on the homepage.
const Immersive = lazy(() => import('./pages/Immersive.jsx'));
import Services from './pages/Services.jsx';
import Reviews from './pages/Reviews.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Reply from './pages/Reply.jsx';
import Thanks from './pages/Thanks.jsx';
import Privacy from './pages/Privacy.jsx';
import { Article, InsightsIndex } from './pages/Insights.jsx';
import { useCardTilt, useScrollReveal } from './hooks/useSiteEffects.js';

// Three.js is by far the heaviest thing on the page and it only draws
// decoration. Splitting it out means the text, buttons and layout paint
// immediately and the network animation fades in a moment later, instead of
// everyone waiting on a 600kB download before seeing anything.
const Background = lazy(() => import('./components/Background.jsx'));

const TITLES = {
  '/': 'DaysBack | Get Your Days Back with Custom AI Agents & Automation',
  '/services': 'Services | DaysBack: AI Agents, AI Receptionists & Automation',
  '/reviews': 'Reviews | DaysBack',
  '/about': 'About DaysBack | AI Automation Agency',
  '/contact': 'Contact DaysBack | Book a Free 27-Minute Strategy Call',
  '/thanks': 'Thank you | DaysBack',
  '/privacy': 'Privacy policy | DaysBack',
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

  // Cookie-free visitor stats (no cookies or IPs stored). Sends a "view" for
  // each page and a "leave" with the seconds spent on it. Team pages skipped.
  useEffect(() => {
    const url = import.meta.env.VITE_TRACK_URL;
    if (!url || pathname.startsWith('/reply')) return undefined;
    const send = (data) => {
      const body = JSON.stringify(data);
      try {
        if (navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return;
      } catch { /* fall through */ }
      fetch(url, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body }).catch(() => {});
    };
    let campaign = '';
    try {
      const q = new URLSearchParams(window.location.search);
      campaign = q.get('utm_campaign') || q.get('utm_source') || sessionStorage.getItem('db-utm') || '';
      if (campaign) sessionStorage.setItem('db-utm', campaign);
    } catch { /* storage blocked */ }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    send({ kind: 'view', path: pathname, referrer: document.referrer, tz, campaign });

    let start = Date.now(), active = 0, sent = false;
    const leave = () => {
      if (sent) return;
      sent = true;
      active += document.visibilityState === 'visible' ? Date.now() - start : 0;
      send({ kind: 'leave', path: pathname, seconds: Math.round(active / 1000) });
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') { active += Date.now() - start; leave(); }
    };
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVis);
      leave();
    };
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
        <Route path="/" element={
          // Placeholder as tall as the 3D page while it downloads, so the
          // footer doesn't flash up the screen and jump back down.
          <Suspense fallback={<main className="imm" style={{ minHeight: '3000vh' }} />}><Immersive /></Suspense>
        } />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reply" element={<Reply />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/privacy" element={<Privacy />} />
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
