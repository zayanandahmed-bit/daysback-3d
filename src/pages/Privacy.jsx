import { Link } from 'react-router-dom';
import { EMAIL } from '../data/contact.js';

// Plain-English privacy notice (UK GDPR). Keep it in step with what the site
// actually does: the contact form, the AI chat, cookie-free visitor stats.
const UPDATED = '22 October 2026';

export default function Privacy() {
  return (
    <main>
      <article className="section article">
        <h1>Privacy policy</h1>
        <p className="insight-meta">Last updated {UPDATED}</p>
        <p>This explains what DaysBack collects when you use daysback.si, why, and what you can ask us to do with it. If anything is unclear, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

        <h2>Who we are</h2>
        <p>DaysBack (daysback.si) builds AI and automation for businesses. We are responsible for the personal information described here. Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Contact form:</strong> your name, email, company (if given), what you want to automate, and the page you sent it from.</li>
          <li><strong>Emails with us:</strong> whatever you write to us, and our replies.</li>
          <li><strong>AI chat on the site:</strong> the messages you type are sent to our AI provider to write a reply. We don't keep a copy on our servers; your browser keeps the conversation until you close the tab. Please don't share sensitive information in the chat.</li>
          <li><strong>Visitor statistics:</strong> which pages are viewed, how long for, the type of device and browser, the site you came from, and your device's time zone. We don't use cookies for this and we don't store IP addresses: a visitor is counted with a code that changes every day, so we can't follow you from one day to the next.</li>
        </ul>

        <h2>Why we use it</h2>
        <ul>
          <li>To reply to your enquiry and arrange a strategy call, because you asked us to (steps before a possible contract) and in our legitimate interest in responding to people who contact us.</li>
          <li>To understand which parts of the site are useful and fix what isn't, in our legitimate interest in running a good website. These stats are anonymous counts.</li>
        </ul>
        <p>We don't sell your information, and we don't use it for advertising.</p>

        <h2>Who handles it for us</h2>
        <ul>
          <li><strong>Supabase:</strong> stores enquiries and visitor stats (servers in South Korea).</li>
          <li><strong>Hostinger:</strong> our email and domain.</li>
          <li><strong>GitHub Pages:</strong> hosts the website.</li>
          <li><strong>Anthropic:</strong> powers the AI chat assistant.</li>
        </ul>
        <p>Some of these providers process data outside the UK. Where they do, we rely on the safeguards the law requires, such as the providers' standard data protection terms.</p>

        <h2>How long we keep it</h2>
        <p>Enquiries and emails: up to 24 months after our last contact, unless you become a client, in which case we keep what we need for the work and our records. Visitor statistics: up to 24 months.</p>

        <h2>Your rights</h2>
        <p>You can ask us to see, correct or delete your information, to stop using it, or to send you a copy. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we'll respond within one month. If you're unhappy with how we handle your data, you can complain to the Information Commissioner's Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>

        <h2>Cookies</h2>
        <p>The site doesn't set tracking or advertising cookies. Your browser keeps a little information for the current visit only (such as your chat conversation), which is cleared when you close the tab.</p>

        <p style={{ marginTop: '2rem' }}><Link to="/contact" className="article-back">Contact us →</Link></p>
      </article>
    </main>
  );
}
