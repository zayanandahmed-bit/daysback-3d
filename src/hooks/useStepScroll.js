import { useEffect } from 'react';

// Makes one scroll gesture move exactly one step between fixed positions on
// the page (a wheel notch, or a trackpad swipe including its momentum, or a
// touch swipe). getStops returns the scroll Y of every step, top to bottom.
// Outside the first and last step, scrolling behaves normally.
export function useStepScroll(getStops, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    let lastWheel = 0, lastStep = 0, acc = 0, stepping = false, touchY = null;

    const target = (dir) => {
      const ys = getStops();
      if (!ys.length) return null;
      const y = window.scrollY;
      const lead = window.innerHeight * 0.5;
      if (y < ys[0] - lead || y > ys[ys.length - 1] + lead) return null;   // not in the stepped area
      const next = dir > 0 ? ys.find((v) => v > y + 4) : [...ys].reverse().find((v) => v < y - 4);
      return next === undefined ? null : next;                             // past either end: normal scroll
    };
    const step = (dir) => {
      const to = target(dir);
      if (to === null) return;
      stepping = true;
      lastStep = performance.now();
      window.scrollTo({ top: to, behavior: 'smooth' });
      setTimeout(() => { stepping = false; }, 700);
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (target(Math.sign(dy)) === null) { acc = 0; return; }
      e.preventDefault();
      if (stepping) { acc = 0; return; }
      // Trackpad momentum after a swipe counts as the same swipe, briefly.
      if (now - lastStep < 1100 && gap < 180) { acc = 0; return; }
      if (gap > 180) acc = 0;
      acc += dy;
      if (Math.abs(acc) >= 40) { acc = 0; step(Math.sign(dy)); }
    };
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      if (target(Math.sign(dy) || 1) !== null) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (touchY === null) return;
      const dy = touchY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
      touchY = null;
      if (Math.abs(dy) > 30 && !stepping) step(Math.sign(dy));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [getStops, enabled]);
}
