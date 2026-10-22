import { FAQS } from '../data/faqs.js';
import { Link } from 'react-router-dom';
import Faq from '../components/Faq.jsx';
import CtaBand from '../components/CtaBand.jsx';
import AutomationLibrary from '../components/AutomationLibrary.jsx';
import VoiceDemo from '../components/VoiceDemo.jsx';
import LiveChat from '../components/LiveChat.jsx';
import Timeline from '../components/Timeline.jsx';
import Guarantees from '../components/Guarantees.jsx';

const CORE = [
  {
    n: '01', icon: '◆', title: 'Custom AI Agents', tone: 'violet',
    body: 'Agents trained on your data, tone and rules that handle sales, support, scheduling or research, inside the tools you already use.',
    points: ['Qualify and nurture every lead automatically', 'Research and summarise market intel on demand', 'Run calendars end to end, no back-and-forth'],
    tags: ['Sales', 'Support', 'Scheduling', 'Research'],
  },
  {
    n: '02', icon: '▲', title: 'Workflow Automation', tone: 'pink',
    body: 'Your CRM, inbox, calendar and spreadsheets wired together so repetitive work happens by itself, accurately, every time.',
    points: ['Lead capture, enrichment and routing', 'Quotes, invoices and documents generated for you', 'Data entered once, synced everywhere'],
    tags: ['CRM', 'Invoices', 'Quotes', 'Data sync'],
  },
  {
    n: '03', icon: '●', title: 'Voice & Chat Agents', tone: 'teal',
    body: '24/7 receptionists that answer calls and messages like your best employee: qualifying, booking and following up while you sleep.',
    points: ['Phone agents that answer, qualify and book', 'Website and WhatsApp chat trained on your business', 'SMS and WhatsApp follow-ups that convert'],
    tags: ['Phone', 'WhatsApp', 'Website chat', 'SMS'],
  },
  {
    n: '04', icon: '■', title: 'Internal Ops Copilots', tone: 'sun',
    body: 'Tools that read your business data and act on it: reports written for you, inboxes triaged, dashboards that explain what changed.',
    points: ['Daily and weekly reports, written automatically', 'Inbox triage and priority alerts', 'Dashboards that update and explain themselves'],
    tags: ['Reporting', 'Inbox', 'Dashboards', 'Alerts'],
  },
];

const ALSO = [
  { icon: '💬', title: 'AI website assistant', body: 'A chat on your site that answers questions about your business and books calls, like the one further down this page.' },
  { icon: '📞', title: 'AI voice receptionist', body: 'Picks up every call, day or night, in a natural voice, and books straight into your calendar.' },
  { icon: '📲', title: 'Call systems', body: 'Browser calling for your team with call logs, recordings and inbound calls that ring whoever is free.' },
  { icon: '🎯', title: 'Lead finding & follow-up', body: 'Systems that find businesses that fit, rank them, and follow up so your pipeline never runs dry.' },
  { icon: '📊', title: 'Custom dashboards & CRMs', body: 'One screen for your leads, clients, payments and calls, built around how you actually work.' },
  { icon: '🌐', title: 'Websites that sell', body: 'Fast, interactive sites with the calculators, demos and AI chat that turn visitors into calls.' },
];


export default function Services() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Our services</p>
        <h1>
          Everything we can <span className="grad">automate for you</span>
        </h1>
        <p className="hero-sub">
          Every system is custom-built around your workflows, your tools, and your customers.
        </p>
        <div className="hero-actions svc-hero-actions">
          <Link to="/contact" className="btn btn-primary">Let's Map Your Opportunities</Link>
          <a href="#talk" className="btn btn-ghost" onClick={(e) => {
            e.preventDefault();
            document.getElementById('talk')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>Talk to our AI ↓</a>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <h2 className="sr-only">Our core services</h2>
        <div className="svc-grid">
          {CORE.map((s) => (
            <article className={'card svc-card tone-' + s.tone} data-tilt key={s.title}>
              <div className="svc-top">
                <span className="svc-icon">{s.icon}</span>
                <span className="svc-n">{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p className="svc-body">{s.body}</p>
              <ul className="svc-points">
                {s.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="svc-tags">
                {s.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <p className="eyebrow">Also part of what we do</p>
          <h2>The pieces that tie it all together</h2>
        </div>
        <div className="also-grid">
          {ALSO.map((a) => (
            <div className="card also-card" key={a.title}>
              <span className="also-icon">{a.icon}</span>
              <div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AutomationLibrary />

      <VoiceDemo />

      <LiveChat />

      <section className="section process">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>From idea to deployed agent in under 5 business days</h2>
          <p className="sub">A clear, proven process, so you always know what's happening and what comes next.</p>
        </div>
        <Timeline />
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Common questions</h2>
        </div>
        <Faq items={FAQS} />
      </section>

      <Guarantees />

      <CtaBand heading="Not sure which service fits?">
        Book a free audit call: we'll map your workflows and tell you exactly what to automate first.
      </CtaBand>
    </main>
  );
}
