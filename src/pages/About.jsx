import { useEffect, useRef, useState } from 'react';
import CtaBand from '../components/CtaBand.jsx';

function ValueStep({ value, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value.stat); return undefined; }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      setN(Math.round(value.stat * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value.stat]);

  return (
    <div ref={ref} className={'value-step' + (seen ? ' in' : '') + (index % 2 ? ' flip' : '')}>
      <div className="value-stat">
        <span className="value-num">{value.prefix || ''}{n}{value.unit}</span>
        <span className="value-label">{value.label}</span>
      </div>
      <div className="value-text">
        <span className="value-icon">{value.icon}</span>
        <span className="value-count">{String(index + 1).padStart(2, '0')} / 04</span>
        <h3>{value.title}</h3>
        <p>{value.body}</p>
      </div>
    </div>
  );
}

// Each value comes with a number that is a promise we already make elsewhere
// on the site, not a made-up result.
const VALUES = [
  {
    icon: '⚡', title: 'Results over hype', stat: 20, unit: ' min', label: 'free strategy call',
    body: "We measure success in hours saved and revenue won, not buzzwords. In one 20-minute call we'll tell you what's worth automating, and if an automation won't pay for itself, we'll say so.",
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
        {/* One value per screen: each slides in as you scroll to it, and its
            number counts up when it arrives. */}
        <div className="values-steps">
          {VALUES.map((v, i) => <ValueStep key={v.title} value={v} index={i} />)}
        </div>
      </section>

      <CtaBand heading="Let's build something together">
        Tell us about your business and we'll show you what AI can take off your plate.
      </CtaBand>
    </main>
  );
}
