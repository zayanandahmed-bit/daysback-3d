import { Fragment } from 'react';

// The CSS scrolls the track by exactly half its width, so it holds two
// identical halves. Each half repeats the list enough times to be wider than
// any screen (otherwise wide monitors see the end of the strip before it
// loops). REPS is even so every half has a multiple of 4 spans and the
// nth-child(4n+…) colours line up across the loop. The spans stay direct
// children of the track, so no wrapper elements here.
const REPS = 4;

export default function Marquee({ items }) {
  const half = Array.from({ length: REPS }, () => items).flat();
  return (
    <section className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${32 * REPS}s` }}>
        {[...half, ...half].map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span>{item}</span>
            <span>•</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
