import { REVIEWS } from '../data/reviews.js';

export function GoogleWordmark() {
  return (
    <span className="g-logo">
      <span className="g1">G</span>
      <span className="g2">o</span>
      <span className="g3">o</span>
      <span className="g4">g</span>
      <span className="g1">l</span>
      <span className="g2">e</span>
    </span>
  );
}

export function ReviewsSummary({ children }) {
  return (
    <div className="reviews-summary">
      <div className="g-badge">
        <GoogleWordmark />
        <span className="rating-count">Real reviews from our clients</span>
      </div>
      {children}
    </div>
  );
}

export function ReviewsGrid() {
  return (
    <div className="reviews-grid">
      {REVIEWS.map((r) => (
        <div className="review-card" key={r.name}>
          <div className="review-head">
            <div className="avatar" style={{ background: r.color }}>{r.initials}</div>
            <div className="review-meta">
              <div className="review-name">{r.name}</div>
              <div className="review-date">Google review</div>
            </div>
            <span className="review-g g-logo">
              <span className="g1">G</span>
            </span>
          </div>
          <span className="stars">★★★★★</span>
          <p className="review-text">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
