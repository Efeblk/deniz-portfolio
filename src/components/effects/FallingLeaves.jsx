import { memo } from 'react';
import { rng, LEAF } from '../scene/shapes.js';
import { C } from '../scene/palette.js';

const COLORS = [C.leafLight, C.leafHi, C.leafMid, '#d9b45a', '#e08a4a'];
const LEAVES = (() => {
  const r = rng(2024);
  return Array.from({ length: 18 }, (_, i) => ({
    left: -80 + r() * 1180,
    top: 80 + r() * 220,
    dur: 8 + r() * 7,
    delay: -r() * 15,
    drift: 120 + r() * 260,
    sway: 22 + r() * 30,
    spin: (r() < 0.5 ? -1 : 1) * (360 + r() * 540),
    size: 14 + r() * 12,
    color: COLORS[i % COLORS.length],
  }));
})();

// Pure-CSS falling leaves (transform-only animations → GPU friendly).
function FallingLeaves() {
  return (
    <div className="leaves" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{ left: l.left, top: l.top, '--dur': `${l.dur}s`, '--delay': `${l.delay}s`, '--drift': `${l.drift}px`, '--sway': `${l.sway}px`, '--spin': `${l.spin}deg` }}
        >
          <span className="leaf-sway">
            <svg width={l.size} height={l.size} viewBox="-10 -11 20 22">
              <path d={LEAF} fill={l.color} stroke={C.ink} strokeWidth="1.6" />
              <path d="M0 -8 V9" stroke={C.ink} strokeWidth="1.2" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

export default memo(FallingLeaves);
