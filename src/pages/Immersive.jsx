import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createWorld } from '../immersive/world.js';
import { AUTOMATIONS } from '../components/AutomationLibrary.jsx';
import LeakCalculator from '../components/LeakCalculator.jsx';
import VoiceDemo from '../components/VoiceDemo.jsx';
import LiveChat from '../components/LiveChat.jsx';
import ChatPlayback from '../immersive/ChatPlayback.jsx';
import Marquee from '../components/Marquee.jsx';

const INTEGRATIONS = ['GMAIL', 'HUBSPOT', 'SALESFORCE', 'WHATSAPP', 'SLACK', 'NOTION', 'STRIPE', 'CALENDLY', 'GOOGLE SHEETS'];

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
  voice: [0.72, 0.785],
  demo: [0.8, 0.845],
  chat: [0.865, 0.915],
  cta: [0.955, 1.01],
};
const FADE = 0.025;
const SCROLL_SCREENS = 30;   // how long the journey is, in screen heights

const fadeFor = ([a, b], p) =>
  Math.max(0, Math.min(1, (p - (a - FADE)) / FADE, ((b + FADE) - p) / FADE));

export default function Immersive() {
  const canvasRef = useRef(null);
  const spacerRef = useRef(null);
  const panelRefs = useRef({});
  const tipRef = useRef(null);
  const barRef = useRef(null);
  const layerRef = useRef(null);
  const coverRef = useRef(null);
  const [service, setService] = useState(null);
  const [auto, setAuto] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const rawForStopRef = useRef(() => 0);

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

    // Scroll is mapped onto the journey with a pause at every checkpoint:
    // each stop gets its own stretch of scroll where the camera holds still,
    // and between stops the camera eases out and back in. So it comes to rest
    // on every scene and automation without the page ever moving by itself.
    const HOLD = { hero: 0.8, leak: 1.6, services: 1.6, voice: 1.6, chat: 4.2, chat2: 1.6, out: 1.2 };
    const TRAVEL = 30;                          // scroll units per whole journey of movement
    const stopsList = world.checkpoints();
    const knots = [];
    let acc = 0;
    stopsList.forEach((st, i) => {
      const hold = HOLD[st.id] ?? 0.65;         // each automation node gets a short pause
      knots.push({ ...st, a: acc, b: acc + hold });
      acc += hold;
      if (i < stopsList.length - 1) acc += (stopsList[i + 1].p - st.p) * TRAVEL;
    });
    knots.forEach((k) => { k.a /= acc; k.b /= acc; });
    const toJourney = (r) => {
      for (let i = 0; i < knots.length; i++) {
        const k = knots[i];
        if (r <= k.b) {
          if (r >= k.a || i === 0) return k.p;
          const prev = knots[i - 1];
          const u = (r - prev.b) / (k.a - prev.b);
          return prev.p + (k.p - prev.p) * (u * u * (3 - 2 * u));
        }
      }
      return 1;
    };
    const demoKnot = knots.find((k) => k.id === 'chat');
    rawForStopRef.current = (id) => { const k = knots.find((x) => x.id === id); return k ? (k.a + k.b) / 2 : 0; };

    let target = 0, current = 0, frame = 0, alive = true, lastT = performance.now(), lastDemo = -1;
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
      // jumping with every notch of the wheel. Time-based, so it feels the
      // same on 60 Hz and 120 Hz screens.
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      current += (target - current) * (1 - Math.exp(-dt * 5.5));
      if (Math.abs(target - current) < 0.00002) current = target;
      const journey = toJourney(current);
      world.update(journey);
      Object.entries(PANELS).forEach(([key, range]) => {
        const el = panelRefs.current[key];
        if (!el) return;
        const o = fadeFor(range, journey);
        el.style.opacity = o.toFixed(3);
        // Offset via a variable: some panels also centre themselves with transform.
        el.style.setProperty('--imm-y', ((1 - o) * 26).toFixed(1) + 'px');
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
      if (coverRef.current) {
        // Plain page on the opening screen, and again at the closing
        // call-to-action, so nothing from the 3D world sits behind either.
        const c = Math.max(0, 1 - current / 0.03, Math.min(1, (journey - 0.94) / 0.025));
        coverRef.current.style.opacity = c.toFixed(3);
        coverRef.current.style.visibility = c < 0.005 ? 'hidden' : 'visible';
      }
      // The scripted chat plays as you scroll through its stop: one message
      // per step. State only changes when the step does, not every frame.
      if (demoKnot) {
        const step = Math.max(0, Math.min(1, (current - demoKnot.a) / (demoKnot.b - demoKnot.a)));
        const q = Math.round(step * 200) / 200;
        if (q !== lastDemo) { lastDemo = q; setDemoStep(q); }
      }
    };
    // The text panels sit above the 3D canvas and some are big. Scrolling
    // over one must still fly the camera, not scroll the panel or stall, so
    // wheel turns anywhere on the layer go straight to the page.
    const layer = layerRef.current;
    // In the automation chain, one scroll gesture moves exactly one node:
    // a mouse-wheel notch or a trackpad swipe (with all its momentum) takes
    // you to the next automation and no further. Outside the chain, scrolling
    // is normal.
    const spacer = spacerRef.current;
    const yFor = (r) => spacer.offsetTop + r * (spacer.offsetHeight - window.innerHeight);
    const autoYs = () => knots.filter((k) => k.id.startsWith('auto')).map((k) => yFor((k.a + k.b) / 2));
    let lastWheel = 0, lastStep = 0, wheelAcc = 0, stepping = false;
    const stepTarget = (dir) => {
      const ys = autoYs();
      const y = window.scrollY;
      const lead = window.innerHeight * 0.6;
      if (y < ys[0] - lead || y > ys[ys.length - 1] + lead) return null;     // not in the chain
      const next = dir > 0 ? ys.find((v) => v > y + 4) : [...ys].reverse().find((v) => v < y - 4);
      return next === undefined ? null : next;                               // past either end: scroll on normally
    };
    const step = (dir) => {
      const to = stepTarget(dir);
      if (to === null) return false;
      stepping = true;
      lastStep = performance.now();
      window.scrollTo({ top: to, behavior: 'smooth' });
      setTimeout(() => { stepping = false; }, 700);
      return true;
    };
    const onWheel = (e) => {
      if (e.ctrlKey) return;                                // pinch-zoom on trackpads
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (stepTarget(Math.sign(dy)) !== null) {
        e.preventDefault();
        if (stepping) { wheelAcc = 0; return; }                  // still gliding to the last node
        // Trackpad momentum keeps sending events after a swipe. Treat that
        // tail as part of the same swipe (so one swipe = one node), but only
        // for a moment: if you keep scrolling, it moves on again.
        if (now - lastStep < 1100 && gap < 180) { wheelAcc = 0; return; }
        if (gap > 180) wheelAcc = 0;
        wheelAcc += dy;
        if (Math.abs(wheelAcc) >= 40) { wheelAcc = 0; step(Math.sign(dy)); }
        return;
      }
      wheelAcc = 0;
      // Over a text panel, wheel turns still fly the camera rather than
      // being swallowed by the panel.
      if (layer.contains(e.target)) {
        e.preventDefault();
        window.scrollBy({ top: dy, behavior: 'instant' });
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // Same for a swipe on a touch screen.
    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      if (stepTarget(Math.sign(dy) || 1) !== null) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (touchY === null) return;
      const dy = touchY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
      touchY = null;
      if (Math.abs(dy) > 30 && !stepping) step(Math.sign(dy));
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    loop();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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

  const jump = (stopId) => {
    const el = spacerRef.current;
    const r = rawForStopRef.current(stopId);
    window.scrollTo({ top: el.offsetTop + r * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
  };

  const a = AUTOMATIONS[auto];
  const reg = (k) => (el) => { panelRefs.current[k] = el; };

  return (
    <main className="imm">
      <canvas ref={canvasRef} className="imm-canvas" />
      {/* Plain page behind the opening text: the 3D world only appears once
          you scroll or press "Start the tour". */}
      <div className="imm-cover" ref={coverRef} />
      <div className="imm-bar"><span ref={barRef} /></div>
      {/* Tools we connect, running along under the nav for the whole flight. */}
      <div className="imm-strip"><Marquee items={INTEGRATIONS} /></div>
      <div className="imm-tip" ref={tipRef} />

      <div className="imm-layer" ref={layerRef}>
        <section className="imm-panel imm-hero" ref={reg('hero')}>
          <p className="eyebrow">AI Automation Studio</p>
          <h1>We find where your business leaks money and wastes days, then we build the AI that fixes it and <span className="grad">gets your DaysBack</span></h1>
          <p className="imm-sub">Somewhere in your business, time and money are slipping away, and you're probably too close to see it. At DaysBack, we look at how you actually operate, find the gaps, and build bespoke AI solutions around them so that you focus on growth while our solutions do the heavy-lifting for you.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => jump('leak')}>Start the tour ↓</button>
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

        <section className="imm-panel imm-side imm-left imm-tall" ref={reg('demo')}>
          <ChatPlayback step={demoStep} />
        </section>

        <section className="imm-panel imm-side imm-right imm-tall" ref={reg('chat')}>
          <LiveChat />
        </section>

        <section className="imm-panel imm-cta" ref={reg('cta')}>
          <div className="cta-band">
            <h2>Ready to get your DaysBack and generate revenue?</h2>
            <p>Book a 20-minute strategy call.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Let's Map Your Opportunities</Link>
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

      {/* The scroll track: its length sets how slow the flight feels. */}
      <div ref={spacerRef} className="imm-track" style={{ height: SCROLL_SCREENS * 100 + 'vh' }} aria-hidden="true" />
    </main>
  );
}
