// Promises a client can hold us to. Every one of these is a commitment the
// business already makes elsewhere on the site; anything stronger (refunds,
// results guarantees) needs the owner's sign-off before it goes here.
export const GUARANTEES = [
  { icon: '🧾', title: 'Clear quote, no surprises', body: 'A fixed quote before any work starts. No hidden fees, no surprise bills.' },
  { icon: '⚡', title: 'Live in under 5 working days', body: 'Most agents go live within 5 working days, with working demos along the way.' },
  { icon: '🔓', title: 'No lock-in contracts', body: "No long contracts. You stay because it's working, not because you're tied in." },
  { icon: '🔒', title: 'Your data stays yours', body: 'Guardrails, approvals and access controls on every agent. Your business data stays yours.' },
  { icon: '⏱', title: 'Reply within 1 hour', body: 'Message us and a real person gets back to you within the hour.' },
  { icon: '🎯', title: 'Straight answers', body: "If an automation won't pay for itself, we'll tell you before you spend a penny." },
];

export default function Guarantees({ compact = false }) {
  if (compact) {
    return (
      <div className="g-row">
        {GUARANTEES.map((g) => (
          <div className="g-chip" key={g.title}><span>{g.icon}</span>{g.title}</div>
        ))}
      </div>
    );
  }
  return (
    <section className="section guarantees">
      <div className="section-head">
        <p className="eyebrow">Our promises</p>
        <h2>Guarantees you can hold us to</h2>
        <p className="sub">Working with a new partner is a leap. These are the commitments we make to every client, in writing.</p>
      </div>
      <div className="g-grid">
        {GUARANTEES.map((g) => (
          <div className="card g-card" key={g.title}>
            <span className="g-icon">{g.icon}</span>
            <div>
              <h3>{g.title}</h3>
              <p>{g.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
