import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createWorld } from '../immersive/world.js';
import { AUTOMATIONS } from '../components/AutomationLibrary.jsx';
import LeakCalculator from '../components/LeakCalculator.jsx';
import VoiceDemo from '../components/VoiceDemo.jsx';
import LiveChat from '../components/LiveChat.jsx';

const SERVICES = [
  {
    icon: '◆', title: 'Custom AI Agents',
    short: 'Agents for sales, support, scheduling and research, trained on your data and rules.',
    body: 'Purpose-built agents that handle sales, support, scheduling or research, trained on your data, your tone and your rules. They plug into the tools you already use and start working from day one.',
    points: ['Sales agents that qualify and nurture leads', 'Research agents that gather and summarise intel', 'Scheduling agents that run calendars end to end'],
  },
  {
    icon: '▲', title: 'Workflow Automation',
    short: 'Your CRM, inbox, calendar and spreadsheets working together, hands-free.',
    body: 'We connect your CRM, inbox, calendar and spreadsheets into automations that remove repetitive manual work: lead routing, quote generation and data syncing, all hands-free.',
    points: ['Lead capture, enrichment and routing', 'Invoices, quotes and documents generated for you', 'Data entered once, synced everywhere'],
  },
  {
    icon: '●', title: 'Voice & Chat Agents',
    short: '24/7 receptionists that answer calls and messages and book appointments.',
    body: 'AI receptionists and support bots that answer calls, qualify leads and book appointments while you sleep, on your website, phone line, WhatsApp and SMS.',
    points: ['Phone agents that answer, qualify and book', 'Website chat trained on your products and FAQs', 'WhatsApp and SMS follow-ups that convert'],
  },
  {
    icon: '■', title: 'Internal Ops Copilots',
    short: 'Reports, inbox triage and dashboards that update and explain themselves.',
    body: 'Internal tools that summarise, report and act on your business data automatically: daily reports, inbox triage and dashboards that update and explain themselves.',
    points: ['Daily and weekly reports, written for you', 'Inbox triage and priority alerts', 'Dashboards that explain what changed'],
  },
];

// Scroll ranges (0-1) where each text panel is on screen. They line up with
// the camera stations in world.js, so the words arrive with the scene.
const PANELS = {
  hero: [0, 0.06],
  leak: [0.155, 0.255],
  services: [0.33, 0.47],
  autos: [0.5, 0.7],
  voice: [0.735, 0.81],
  chat: [0.835, 0.91],
  cta: [0.955, 1.01],
};
const FADE = 0.025;
const SCROLL_SCREENS = 12;   // how long the journey is, in screen heights

const fadeFor = ([a, b], p) =>
  Math.max(0, Math.min(1, (p - (a - FADE)) / FADE, ((b + FADE) - p) / FADE));

export default function Immersive() {
  const canvasRef = useRef(null);
  const spacerRef = useRef(null);
  const panelRefs = useRef({});
  const tipRef = useRef(null);
  const barRef = useRef(null);
  const [service, setService] = useState(null);
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('imm-mode');
    const world = createWorld(canvasRef.current, {
      services: SERVICES,
      automations: AUTOMATIONS,
      onHover: (h) => {
        const tip = tipRef.current;
        if (!tip) return;
        if (!h) { tip.style.opacity = '0'; return; }
        tip.textContent = h.kind === 'service' ? SERVICES[h.index].title + ' · click to explore'
          : AUTOMATIONS[h.index].title + ' · click for details';
        tip.style.opacity = '1';
        tip.style.transform = `translate(${h.x + 16}px, ${h.y + 18}px)`;
      },
      onSelect: (kind, index) => {
        if (kind === 'service') setService(index);
        if ((kind === 'automation' || kind === 'autoFocus') && index >= 0) setAuto(index);
      },
    });

    let target = 0, current = 0, frame = 0, alive = true;
    const measure = () => {
      const el = spacerRef.current;
      const max = el.offsetHeight - window.innerHeight;
      target = Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / Math.max(1, max)));
    };
    const loop = () => {
      if (!alive) return;
      frame = requestAnimationFrame(loop);
      if (document.hidden) return;
      // Ease towards the scroll position so the camera glides instead of
      // jumping with every notch of the wheel.
      current += (target - current) * 0.075;
      if (Math.abs(target - current) < 0.00005) current = target;
      world.update(current);
      Object.entries(PANELS).forEach(([key, range]) => {
        const el = panelRefs.current[key];
        if (!el) return;
        const o = fadeFor(range, current);
        el.style.opacity = o.toFixed(3);
        // Offset via a variable: some panels also centre themselves with transform.
        el.style.setProperty('--imm-y', ((1 - o) * 26).toFixed(1) + 'px');
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    loop();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      world.dispose();
      document.documentElement.classList.remove('imm-mode');
    };
  }, []);

  useEffect(() => {
    if (service === null) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setService(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [service]);

  const jump = (p) => {
    const el = spacerRef.current;
    window.scrollTo({ top: el.offsetTop + p * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
  };

  const a = AUTOMATIONS[auto];
  const reg = (k) => (el) => { panelRefs.current[k] = el; };

  return (
    <main className="imm">
      <canvas ref={canvasRef} className="imm-canvas" />
      <div className="imm-bar"><span ref={barRef} /></div>
      <div className="imm-tip" ref={tipRef} />

      <div className="imm-layer">
        <section className="imm-panel imm-hero" ref={reg('hero')}>
          <p className="eyebrow">AI Automation Studio</p>
          <h1>We find where your business leaks money and wastes days, then we build the AI that fixes it and <span className="grad">gets your days back</span></h1>
          <p className="imm-sub">Scroll to fly through what we do. Hover and click anything that glows.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => jump(PANELS.leak[0] + 0.03)}>Start the tour ↓</button>
            <Link to="/contact" className="btn btn-ghost imm-ghost">Book a Free Strategy Call</Link>
          </div>
        </section>

        <section className="imm-panel imm-wide" ref={reg('leak')}>
          <LeakCalculator />
        </section>

        <section className="imm-panel imm-side imm-left" ref={reg('services')}>
          <p className="eyebrow">What we build</p>
          <h2>AI systems built around your business</h2>
          <p className="imm-sub">Hover a card to bring it closer. Click it to see what it does.</p>
          <div className="imm-pills">
            {SERVICES.map((s, i) => <button key={s.title} type="button" onClick={() => setService(i)}>{s.icon} {s.title}</button>)}
          </div>
        </section>

        <section className="imm-panel imm-side imm-right" ref={reg('autos')}>
          <p className="eyebrow">Automations we build · {auto + 1} of {AUTOMATIONS.length}</p>
          <div className="imm-auto">
            <h2>{a.icon} {a.title}</h2>
            <ol className="flow">
              {a.steps.map((s, i) => (
                <li key={s} className="done">
                  <span className="flow-dot">{i + 1}</span><span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="lib-facts">
              <div><span>What you get</span>{a.saves}</div>
              <div><span>Why it's hard to DIY</span>{a.hard}</div>
            </div>
          </div>
          <p className="imm-hint">Keep scrolling to travel down the chain, or click any glowing node.</p>
        </section>

        <section className="imm-panel imm-side imm-left imm-tall" ref={reg('voice')}>
          <VoiceDemo />
        </section>

        <section className="imm-panel imm-side imm-right imm-tall" ref={reg('chat')}>
          <LiveChat />
        </section>

        <section className="imm-panel imm-hero" ref={reg('cta')}>
          <p className="eyebrow">That's the whole picture</p>
          <h2>Ready to get your DaysBack and generate revenue?</h2>
          <p className="imm-sub">Audit, design, build, deploy. Most agents go live in under 5 working business days. Book a 20-minute strategy call.</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">Let's Map Your Opportunities</Link>
            <button type="button" className="btn btn-ghost imm-ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↺ Fly again</button>
          </div>
        </section>
      </div>

      {service !== null && (
        <div className="imm-modal" onClick={() => setService(null)}>
          <div className="imm-modal-card" role="dialog" aria-label={SERVICES[service].title} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="imm-close" onClick={() => setService(null)} aria-label="Close">✕</button>
            <div className="imm-modal-icon">{SERVICES[service].icon}</div>
            <h2>{SERVICES[service].title}</h2>
            <p>{SERVICES[service].body}</p>
            <ul>{SERVICES[service].points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">Build this for my business</Link>
              <button type="button" className="btn btn-ghost" onClick={() => setService((service + 1) % SERVICES.length)}>Next →</button>
            </div>
          </div>
        </div>
      )}

      <div ref={spacerRef} style={{ height: SCROLL_SCREENS * 100 + 'vh' }} aria-hidden="true" />
    </main>
  );
}
