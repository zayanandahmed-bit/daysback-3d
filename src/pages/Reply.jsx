import { useEffect, useState } from 'react';

const SENDER_KEY = 'daysback-reply-from';

function template(name) {
  const first = (name || '').split(' ')[0] || 'there';
  return `Hi ${first},

Thanks for getting in touch with DaysBack.

[Answer / what we can do for them]

The quickest next step is a free 27-minute strategy call, where we map where your business is losing time and money and what we'd build to fix it. Here are a few times that work for us:

- [Day, time]
- [Day, time]
- [Day, time]

Reply with whichever suits you and we'll send the invite.`;
}

// Team-only page, opened from the "New enquiry" email. The token in the link
// is checked server side, so the page does nothing for anyone else.
export default function Reply() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '';
  const t = params.get('t') || '';
  const api = import.meta.env.VITE_REPLY_URL;

  const [lead, setLead] = useState(null);
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState(() => {
    try { return localStorage.getItem(SENDER_KEY) || ''; } catch { return ''; }
  });
  const [status, setStatus] = useState('loading'); // loading | ready | sending | sent | bad
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Reply | DAYSBACK.SI';
    let meta = document.querySelector('meta[name=robots]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex';
    (async () => {
      try {
        const res = await fetch(`${api}?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}`);
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || 'failed');
        setLead(out); setMessage(template(out.name)); setStatus('ready');
      } catch (e) { setError(e.message || 'failed'); setStatus('bad'); }
    })();
  }, []);

  const send = async (e) => {
    e.preventDefault();
    setStatus('sending'); setError('');
    try {
      try { localStorage.setItem(SENDER_KEY, from); } catch { /* ignore */ }
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, t, message, from }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'failed');
      setStatus('sent');
    } catch (err) { setError(err.message || 'failed'); setStatus('ready'); }
  };

  return (
    <main className="section reply-page">
      <div className="section-head">
        <p className="eyebrow">Team only</p>
        <h2>Reply to enquiry</h2>
      </div>
      {status === 'loading' && <p className="sub">Loading…</p>}
      {status === 'bad' && <p className="sub">{error}</p>}
      {status === 'sent' && (
        <p className="form-note ok">Sent to {lead.email} in the DaysBack template. The team has been BCC'd.</p>
      )}
      {(status === 'ready' || status === 'sending') && lead && (
        <form className="contact-form reply-form" onSubmit={send}>
          <p className="reply-to">
            <strong>{lead.name}</strong> &lt;{lead.email}&gt;
            {lead.company ? ' · ' + lead.company : ''}{lead.interest ? ' · ' + lead.interest : ''}
          </p>
          <label>Your name (signs the email)
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Zayan" maxLength={60} />
          </label>
          <label>Message
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={14} required />
          </label>
          {error && <p className="form-note err">{error}</p>}
          <button className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send reply'}
          </button>
        </form>
      )}
    </main>
  );
}
