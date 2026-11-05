import { memo } from 'react';
import LayerSvg from './LayerSvg.jsx';
import { C } from '../scene/palette.js';
import { swash, rng } from '../scene/shapes.js';

const CLOUDS = [
  // x, y, len, thick, angle, seed, tone
  [-150, 120, 520, 46, -18, 3, 'cloud'],
  [180, 300, 380, 30, -24, 5, 'cloud'],
  [520, 60, 460, 38, -14, 7, 'cloud'],
  [880, 210, 560, 52, -20, 11, 'cloud'],
  [1180, 80, 420, 34, -26, 13, 'cloud'],
  [1260, 380, 380, 28, -16, 17, 'cloud'],
  [960, 420, 260, 18, -12, 19, 'cloudHi'],
  [1340, 170, 300, 20, -22, 23, 'cloudHi'],
  [640, 150, 280, 16, -16, 29, 'cloudHi'],
  [40, 210, 260, 16, -20, 31, 'cloudHi'],
  [1480, 300, 360, 30, -30, 37, 'cloud'],
];

const STARS = (() => {
  const r = rng(99);
  return Array.from({ length: 46 }, () => ({ x: -100 + r() * 1800, y: -200 + r() * 620, s: 0.5 + r() * 1.2, d: (r() * 4).toFixed(2) }));
})();

const Star = ({ x, y, s, d }) => (
  <path
    className="twinkle"
    style={{ animationDelay: `${d}s` }}
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6Z"
    fill="#fdf6d8"
  />
);

function SkyLayer() {
  return (
    <LayerSvg>
      <defs>
        <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyTop} />
          <stop offset="0.55" stopColor={C.sky} />
          <stop offset="1" stopColor={C.skyLow} />
        </linearGradient>
        <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.nightTop} />
          <stop offset="0.6" stopColor={C.night} />
          <stop offset="1" stopColor={C.nightLow} />
        </linearGradient>
        <radialGradient id="moon-glow">
          <stop offset="0" stopColor="#fff6cf" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6cf" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-600" y="-900" width="2800" height="1700" fill="url(#sky-day)" />
      <rect className="night-only" x="-600" y="-900" width="2800" height="1700" fill="url(#sky-night)" />

      <g className="night-only">
        {STARS.map((s, i) => <Star key={i} {...s} />)}
        <circle cx="1330" cy="110" r="120" fill="url(#moon-glow)" />
        <path d="M1360 60 A54 54 0 1 0 1376 160 A44 44 0 1 1 1360 60Z" fill="#fbf1c9" stroke={C.ink} strokeWidth="3" />
      </g>

      <g className="clouds">
        {CLOUDS.map(([x, y, len, thick, ang, seed, tone], i) => (
          <path key={i} d={swash(x, y, len, thick, ang, seed)} fill={C[tone]} opacity={tone === 'cloud' ? 0.85 : 0.9} />
        ))}
      </g>
    </LayerSvg>
  );
}

export default memo(SkyLayer);
