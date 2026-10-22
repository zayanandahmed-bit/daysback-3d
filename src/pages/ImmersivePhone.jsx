import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createWorld } from '../immersive/world.js';
import { AUTOMATIONS } from '../components/AutomationLibrary.jsx';
import LeakCalculator from '../components/LeakCalculator.jsx';
import VoiceDemo from '../components/VoiceDemo.jsx';
import LiveChat from '../components/LiveChat.jsx';
import ChatPlayback from '../immersive/ChatPlayback.jsx';
import Marquee from '../components/Marquee.jsx';
import Guarantees from '../components/Guarantees.jsx';
import { INTEGRATIONS, SERVICES } from '../data/home.js';

// The homepage on phones. Same 3D world as on desktop, but as a moving
// background behind ordinary sections you scroll through normally: on a small
// screen, fading text boxes over a 30-screen fly-through were too easy to
// swipe past and too cramped to read. Each section has a camera stop; the
// camera glides between them as the section comes up the screen.
export default function ImmersivePhone() {
  const canvasRef = useRef(null);
  const coverRef = useRef(null);
  const carouselRef = useRef(null);
  const activeRef = useRef(0);
  const [service, setService] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('imm-mode', 'imm-phone-mode');
    const world = createWorld(canvasRef.current, { services: SERVICES, automations: AUTOMATIONS, onHover: () => {}, onSelect: () => {} });
    const stops = Object.fromEntries(world.checkpoints().map((c) => [c.id, c.p]));
    const autoStop = (i) => stops['auto' + i] ?? stops.auto0;

    // Each [data-stop] section pins a camera position at its centre; between
    // two sections the camera eases from one to the next.
    const anchors = () => [...document.querySelectorAll('.imp [data-stop]')].map((el) => {
      const r = el.getBoundingClientRect();
      const id = el.dataset.stop;
      return { y: r.top + window.scrollY + r.height / 2, p: id === 'autos' ? autoStop(activeRef.current) : stops[id] ?? 0 };
    });
    const journeyAt = () => {
      const a = anchors();
      const yc = window.scrollY + window.innerHeight / 2;
      if (yc <= a[0].y) return a[0].p;
      for (let i = 0; i < a.length - 1; i++) {
        if (yc < a[i + 1].y) {
          const u = (yc - a[i].y) / Math.max(1, a[i + 1].y - a[i].y);
          return a[i].p + (a[i + 1].p - a[i].p) * (u * u * (3 - 2 * u));
        }
      }
      return a[a.length - 1].p;
    };

    let current = 0, frame = 0, alive = true, lastT = performance.now();
    const loop = () => {
      if (!alive) return;
      frame = requestAnimationFrame(loop);
      if (document.hidden) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const target = journeyAt();
      current += (target - current) * (1 - Math.exp(-dt * 4));
      world.update(current);
      // Plain page behind the opening screen; the world fades in as you scroll.
      if (coverRef.current) {
        const c = Math.max(0, Math.min(1, 1 - window.scrollY / (window.innerHeight * 0.55)));
        coverRef.current.style.opacity = c.toFixed(3);
      }
    };
    loop();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      world.dispose();
      document.documentElement.classList.remove('imm-mode', 'imm-phone-mode');
    };
  }, []);

  // Swiping the automation cards moves the camera to that node in the chain.
  const onCards = () => {
    const el = carouselRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== activeRef.current) { activeRef.current = i; setActive(i); }
  };
  const goCard = (i) => {
    const el = carouselRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    if (service === null) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setService(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [service]);

  return (
    <main className="imm imp">
      <canvas ref={canvasRef} className="imm-canvas" />
      <div className="imm-cover" ref={coverRef} />
      <div className="imp-strip"><Marquee items={INTEGRATIONS} /></div>

      <section className="imp-hero" data-stop="hero">
        <p className="eyebrow">AI Automation Studio</p>
        <h1>We find where your business leaks money and wastes days, then build the AI that fixes it and <span className="grad">gets your DaysBack</span></h1>
        <p className="imp-sub">Somewhere in your business, time and money are slipping away. We look at how you actually operate, find the gaps, and build bespoke AI around them, so you focus on growth while it does the heavy lifting.</p>
        <div className="imp-actions">
          <Link to="/contact" className="btn btn-primary">Let's Map Your Opportunities</Link>
          <a href="#imp-leak" className="btn btn-ghost imm-ghost">See what you're losing ↓</a>
        </div>
      </section>

      <div className="imp-window" aria-hidden="true" />

      <section className="imp-card imp-leak" id="imp-leak" data-stop="leak">
        <LeakCalculator />
      </section>

      <div className="imp-window" aria-hidden="true" />

      <section className="imp-card" data-stop="services">
        <p className="eyebrow">What we build</p>
        <h2>AI systems built around your business</h2>
        <p className="imp-sub">No templates, no off-the-shelf bots. Tap one to see what it does.</p>
        <div className="imp-services">
          {SERVICES.map((s, i) => (
            <button key={s.title} type="button" className="imp-svc" onClick={() => setService(i)}>
              <span className="imp-svc-icon">{s.icon}</span>
              <span><b>{s.title}</b><small>{s.short}</small></span>
              <span className="imp-arrow" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </section>

      <div className="imp-window" aria-hidden="true" />

      <section className="imp-autos" data-stop="autos">
        <div className="imp-autos-head">
          <p className="eyebrow">Automations we build</p>
          <h2>Ideas you'll recognise from your own business</h2>
          <p className="imp-sub">Swipe through. Each one is simple to describe and fiddly to build, which is where we come in.</p>
        </div>
        <div className="imp-carousel" ref={carouselRef} onScroll={onCards}>
          {AUTOMATIONS.map((a, i) => (
            <article className="imp-auto" key={a.id} aria-roledescription="slide" aria-label={`${i + 1} of ${AUTOMATIONS.length}: ${a.title}`}>
              <span className="imp-auto-n">{i + 1} / {AUTOMATIONS.length} · {a.cat}</span>
              <h3>{a.icon} {a.title}</h3>
              <ol className="flow">
                {a.steps.map((s, k) => (
                  <li key={s} className="done"><span className="flow-dot">{k + 1}</span><span>{s}</span></li>
                ))}
              </ol>
              <div className="imp-auto-get"><span>What you get</span>{a.saves}</div>
            </article>
          ))}
        </div>
        <div className="imp-dots" role="tablist" aria-label="Choose an automation">
          {AUTOMATIONS.map((a, i) => (
            <button key={a.id} type="button" role="tab" aria-selected={i === active} aria-label={a.title}
              className={i === active ? 'on' : ''} onClick={() => goCard(i)} />
          ))}
        </div>
      </section>

      <div className="imp-window" aria-hidden="true" />

      <section className="imp-card imp-tight" data-stop="voice">
        <VoiceDemo />
      </section>

      <div className="imp-window imp-window-sm" aria-hidden="true" />

      <section className="imp-card imp-tight" data-stop="chat">
        <ChatPlayback />
      </section>

      <div className="imp-window imp-window-sm" aria-hidden="true" />

      <section className="imp-card imp-tight" data-stop="chat2">
        <LiveChat />
      </section>

      <div className="imp-window imp-window-sm" aria-hidden="true" />

      <section className="imp-card imp-cta" data-stop="out">
        <p className="eyebrow imm-g-eyebrow">Our promises to you</p>
        <Guarantees compact />
        <div className="cta-band">
          <h2>Ready to get your DaysBack and Generate Revenue?</h2>
          <p>Book a 27-minute strategy call.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Let's Map Your Opportunities</Link>
        </div>
      </section>

      {service !== null && (
        <div className="imm-modal" onClick={() => setService(null)}>
          <div className="imm-modal-card" role="dialog" aria-modal="true" aria-label={SERVICES[service].title} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="imm-close" onClick={() => setService(null)} aria-label="Close">✕</button>
            <div className="imm-modal-icon">{SERVICES[service].icon}</div>
            <h2>{SERVICES[service].title}</h2>
            <p>{SERVICES[service].body}</p>
            <ul>{SERVICES[service].points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">Let's Map Your Opportunities</Link>
              <button type="button" className="btn btn-ghost" onClick={() => setService((service + 1) % SERVICES.length)}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
