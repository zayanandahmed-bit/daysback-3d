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
      {REVIEWS.map((text) => (
        <div className="review-card" key={text}>
          <div className="review-head">
            <div className="avatar" style={{ background: '#4285F4' }}>G</div>
            <div className="review-meta">
              <div className="review-name">Google review</div>
              <div className="review-date">Google Business profile</div>
            </div>
          </div>
          <span className="stars">★★★★★</span>
          <p className="review-text">&ldquo;{text}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}
