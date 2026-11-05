import { memo } from 'react';
import { rng } from '../scene/shapes.js';

const FLIES = (() => {
  const r = rng(777);
  return Array.from({ length: 30 }, () => ({
    left: -50 + r() * 1700,
    top: 300 + r() * 560,
    dx: (r() - 0.5) * 160,
    dy: (r() - 0.5) * 120,
    dur: 6 + r() * 8,
    blink: 1.8 + r() * 2.6,
    delay: -r() * 10,
    size: 4 + r() * 5,
  }));
})();

// Glowing fireflies drifting & pulsing (CSS only).
function Fireflies() {
  return (
    <div className="fireflies" aria-hidden="true">
      {FLIES.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: f.left, top: f.top, width: f.size, height: f.size, '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--dur': `${f.dur}s`, '--blink': `${f.blink}s`, '--delay': `${f.delay}s` }}
        />
      ))}
    </div>
  );
}

export default memo(Fireflies);
