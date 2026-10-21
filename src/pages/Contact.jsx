import { useState } from 'react';
import LiveChat from '../components/LiveChat.jsx';
import Marquee from '../components/Marquee.jsx';
import { EMAIL, WHATSAPP, whatsappLink } from '../data/contact.js';

// Reasons to get in touch, running under the nav. Only promises we actually
// make (and can keep), so nothing here needs a source.
const PROMISES = [
  '✓ FREE 27-MINUTE STRATEGY CALL',
  '✓ REPLY WITHIN 1 HOUR',
  '✓ CLEAR QUOTE BEFORE ANY WORK STARTS',
  '✓ LIVE IN UNDER 5 WORKING DAYS',
  '✓ NO LOCK-IN CONTRACTS',
  '✓ YOUR DATA STAYS YOURS',
  '✓ NO OBLIGATION, NO PRESSURE',
];

const TILES = [
  { icon: '✉', style: undefined, title: 'Email us', value: EMAIL, href: 'mailto:' + EMAIL },
  {
    icon: '💬',
    style: { background: 'linear-gradient(135deg,#25d366,#128c7e)' },
    title: 'WhatsApp us',
    value: WHATSAPP.display,
    href: whatsappLink(),
    external: true,
  },
  {
    icon: '☎',
    style: { background: 'linear-gradient(135deg,#ff3d8a,#ffb020)' },
    title: 'Call us',
    value: '+44 0000 000000',
  },
  {
    icon: '⏱',
    style: { background: 'linear-gradient(135deg,#00b8a0,#6c3cff)' },
    title: 'Response time',
    value: 'Within 1 hour, every time',
  },
];

export default function Contact() {
  const [status, setStatus] = useState('idle');   // idle | sending | sent | error
  const [error, setError] = useState('');

  // Sends the form to the daysback-enquiry function, which saves it and
  // emails the team. If that fails for any reason, say so and give the email
  // address, so nobody thinks they've been heard when they haven't.
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const url = import.meta.env.VITE_ENQUIRY_URL;
      if (!url) throw new Error('not configured');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, page: window.location.pathname }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'failed');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err.message && err.message.includes('@') ? err.message
        : "Sorry, that didn't send. Please email us at " + EMAIL + '.');
    }
  };

  return (
    <main>
      <div className="imm-strip contact-strip"><Marquee items={PROMISES} /></div>

      <section className="page-hero contact-hero">
        <p className="eyebrow">Get started</p>
        <h1>
          Tell us about <span className="grad">your business</span>
        </h1>
        <p className="hero-sub">
          Book a free 27-minute strategy call: we'll show you exactly where AI can save you
          the most time.
        </p>
      </section>

      <section className="section" style={{ paddingTop: '1.6rem' }}>
        {/* Form on the left, our live AI on the right: ask it anything first,
            or just leave your details. */}
        <div className="contact-split">
          <div className="contact-split-form">
            <p className="eyebrow">Send us a message</p>
          <form className="contact-form" onSubmit={submit} noValidate={false}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Name" required maxLength={100} />
              <input type="email" name="email" placeholder="Email" required maxLength={160} />
            </div>
            <input type="text" name="company" placeholder="Company" maxLength={120} />
            <select name="interest" defaultValue="">
              <option value="" disabled>
                What do you want to automate?
              </option>
              <option>Custom AI Agents</option>
              <option>Workflow Automation</option>
              <option>Voice &amp; Chat Agents</option>
              <option>Internal Ops Copilots</option>
              <option>Not sure yet, help me figure it out</option>
            </select>
            {/* Hidden from people; spam bots fill it in and get quietly ignored. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
            <button type="submit" className="btn btn-primary" disabled={status === 'sending' || status === 'sent'}>
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send Message'}
            </button>
            <p className={status === 'sent' ? 'form-sent show' : 'form-sent'}>
              ✓ Thanks, we'll be in touch within 1 hour.
            </p>
            {status === 'error' && <p className="form-error">{error}</p>}
          </form>
          </div>
          <div className="contact-split-chat">
            <p className="eyebrow">Or ask our AI right now</p>
            <LiveChat compact />
          </div>
        </div>

        <div className="contact-info">
          {TILES.map((tile) => (
            <div className="info-tile" key={tile.title}>
              <div className="card-icon" style={tile.style}>
                {tile.icon}
              </div>
              <h3>{tile.title}</h3>
              <p>{tile.href ? <a href={tile.href} {...(tile.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{tile.value}</a> : tile.value}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
