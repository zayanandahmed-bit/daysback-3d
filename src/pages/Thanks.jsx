import { Link } from 'react-router-dom';
import Guarantees from '../components/Guarantees.jsx';

// Where the contact form sends people after a successful message. Its own URL
// so Google Ads / Analytics can count it as a lead.
export default function Thanks() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Message received</p>
        <h1>
          Thank you, we'll be in touch <span className="grad">within 1 hour</span>
        </h1>
        <p className="hero-sub">
          Check your inbox: we've sent you a confirmation. One of the team will reply personally
          with a time for your free 27-minute strategy call.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/services" className="btn btn-primary">See what we build</Link>
          <Link to="/" className="btn btn-ghost">Back to home</Link>
        </div>
      </section>
      <Guarantees compact />
    </main>
  );
}
