import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import CtaBand from '../components/CtaBand.jsx';
import { ARTICLES } from '../data/articles.js';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function InsightsIndex() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Insights</p>
        <h1>
          Guides to getting your <span className="grad">days back</span>
        </h1>
        <p className="hero-sub">Plain-English guides to AI and automation for small businesses.</p>
      </section>
      <section className="section insights-grid" style={{ paddingTop: '2rem' }}>
        {ARTICLES.map((a) => (
          <Link to={`/insights/${a.slug}`} className="insight-card" key={a.slug}>
            <span className="insight-meta">{a.read}</span>
            <h2>{a.title}</h2>
            <p>{a.description}</p>
            <span className="card-link">Read the guide →</span>
          </Link>
        ))}
      </section>
      <CtaBand heading="Want this done for you?">Book a free 27-minute strategy call.</CtaBand>
    </main>
  );
}

export function Article() {
  const { slug } = useParams();
  const a = ARTICLES.find((x) => x.slug === slug);
  useEffect(() => { if (a) document.title = `${a.title} | DaysBack`; }, [a]);
  if (!a) return <Navigate to="/insights" replace />;
  const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <main>
      <article className="section article">
        <Link to="/insights" className="article-back">← All guides</Link>
        <h1>{a.title}</h1>
        <p className="insight-meta">{fmt(a.date)} · {a.read} · DaysBack</p>
        {a.body.map(([kind, content], i) => {
          if (kind === 'h2') return <h2 key={i}>{content}</h2>;
          if (kind === 'ul') return <ul key={i}>{content.map((t) => <li key={t}>{t}</li>)}</ul>;
          return <p key={i}>{content}</p>;
        })}
        <div className="article-more">
          <h3>More guides</h3>
          {more.map((m) => <Link key={m.slug} to={`/insights/${m.slug}`}>{m.title} →</Link>)}
        </div>
      </article>
      <CtaBand heading="Ready to get your DaysBack?">Book a free 27-minute strategy call.</CtaBand>
    </main>
  );
}
