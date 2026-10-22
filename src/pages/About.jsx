import { useCallback, useEffect, useRef, useState } from 'react';
import CtaBand from '../components/CtaBand.jsx';
import Guarantees from '../components/Guarantees.jsx';
import { useStepScroll } from '../hooks/useStepScroll.js';

// The values section pins in place while you scroll through it: the page
// stays put and each scroll swaps to the next value, like a dial clicking
// round, then the page carries on once all four have been shown.
function ValuesScroller({ values }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(0.9999, -rect.top / Math.max(1, span)));
      setActive(Math.floor(p * values.length));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [values.length]);

  // Count the number up each time a new value arrives.
  useEffect(() => {
    const target = values[active].stat;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(target); return undefined; }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setN(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, values]);

  // One scroll = one value: the stops sit at the start of each value's share
  // of the pinned track.
  const getStops = useCallback(() => {
    const el = trackRef.current;
    if (!el) return [];
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    return values.map((_, i) => Math.round(top + ((i + 0.04) / values.length) * span));
  }, [values]);
  useStepScroll(getStops);

  const v = values[active];
  return (
    <div className="values-track" ref={trackRef} style={{ height: `${values.length * 70 + (window.innerWidth < 760 ? 0 : 30)}vh` }}>
      <div className="values-pin">
        <div className={'value-step in' + (active % 2 ? ' flip' : '')} key={active}>
          <div className="value-stat">
            <span className="value-num">{v.prefix || ''}{n}{v.unit}</span>
            <span className="value-label">{v.label}</span>
          </div>
          <div className="value-text">
            <span className="value-icon">{v.icon}</span>
            <span className="value-count">{String(active + 1).padStart(2, '0')} / {String(values.length).padStart(2, '0')}</span>
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Each value comes with a number that is a promise we already make elsewhere
// on the site, not a made-up result.
const VALUES = [
  {
    icon: '⚡', title: 'Results over hype', stat: 27, unit: ' min', label: 'free strategy call',
    body: "We measure success in hours saved and revenue won, not buzzwords. In one 27-minute call we'll tell you what's worth automating, and if an automation won't pay for itself, we'll say so.",
  },
  {
    icon: '🔒', title: 'Your data, protected', stat: 100, unit: '%', label: 'of your data stays yours',
    body: 'Every agent is built with guardrails, approvals and access controls. Your business data stays yours.',
  },
  {
    icon: '🤝', title: 'Partners, not vendors', stat: 0, unit: '', label: 'lock-in contracts',
    body: 'We stay after launch: monitoring, fixing anything that drifts, and improving your systems as your business grows. You stay because it works, not because you are tied in.',
  },
  {
    icon: '🚀', title: 'Ship fast, ship right', stat: 5, unit: ' days', prefix: '<', label: 'from first call to live agent',
    body: 'Most agents go live in under 5 working business days. You see working demos as we build, then we sharpen them with real-world feedback.',
  },
];

export default function About() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">About us</p>
        <h1>
          We make AI <span className="grad">actually useful</span> for business
        </h1>
        <p className="hero-sub">
          No hype, no jargon: just automations that save real hours and win real customers.
        </p>
      </section>

      <section className="section">
        <div className="about-grid">
          <div>
            <p className="eyebrow">Our story</p>
            <h2>Built by automators, for businesses that want their time back</h2>
            <p>
              DAYSBACK.SI started with a simple observation: most businesses lose hours every day
              to work a machine should be doing, chasing leads, answering the same questions,
              copying data between tools.
            </p>
            <p>
              We build AI agents that take that work off your plate. Not off-the-shelf
              chatbots, but custom systems designed around how your business actually runs:
              your tools, your customers, your voice.
            </p>
            <p>
              Every project starts with a workflow audit and ends with a system that's live,
              monitored, and improving over time.
            </p>
          </div>
          <div className="about-visual">🤖✨</div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">What we stand for</p>
          <h2>Our values</h2>
        </div>
        <ValuesScroller values={VALUES} />
      </section>

      <Guarantees />

      <CtaBand heading="Let's build something together">
        Tell us about your business and we'll show you what AI can take off your plate.
      </CtaBand>
    </main>
  );
}
