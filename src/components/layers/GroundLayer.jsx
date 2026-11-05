import { memo } from 'react';
import LayerSvg from './LayerSvg.jsx';
import { C } from '../scene/palette.js';
import { swash, chunk, tuft, scatter } from '../scene/shapes.js';

const STONES = [
  // cx, cy, rx, ry
  [960, 875, 80, 26], [900, 822, 62, 20], [948, 782, 48, 15], [905, 752, 38, 11],
];

const FLOWERS = scatter(26, -100, 600, 1700, 880, 42).filter((p) => p.x < 560 || p.x > 1280 || p.y > 820);

function GroundLayer() {
  return (
    <LayerSvg>
      <path d="M-600 560 Q-200 540 200 552 Q700 566 1100 548 Q1500 532 2200 556 L2200 1600 L-600 1600Z" fill={C.grass} stroke={C.ink} strokeWidth="3" />

      {/* painted tonal patches */}
      {[
        [-200, 640, 700, 40, 2, 4, 'grassDark'], [700, 600, 600, 26, -1, 6, 'grassDark'], [1150, 700, 700, 50, 3, 8, 'grassDark'],
        [-100, 800, 600, 56, -3, 10, 'grassDeep'], [300, 590, 380, 14, 1, 12, 'grassLight'], [1250, 600, 420, 16, -2, 14, 'grassLight'],
        [1000, 860, 700, 60, 2, 16, 'grassDark'], [120, 720, 360, 18, -2, 18, 'grassLight'],
      ].map(([x, y, len, th, ang, seed, tone]) => (
        <path key={seed} d={swash(x, y, len, th, ang, seed, 0.35)} fill={C[tone]} />
      ))}

      {/* stepping-stone path */}
      {STONES.map(([cx, cy, rx, ry], i) => (
        <g key={i} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round">
          <path d={chunk(cx + 3, cy + ry * 0.45, rx, ry, 8, 50 + i, 0.22)} fill={C.stoneShade} />
          <path d={chunk(cx, cy, rx, ry, 8, 50 + i, 0.22)} fill={C.stone} />
        </g>
      ))}

      {/* grass tufts */}
      {[[200, 700, 60, 30, 1], [640, 610, 50, 22, 2], [1300, 640, 60, 26, 3], [1500, 760, 80, 34, 4], [60, 820, 70, 34, 5], [1180, 850, 70, 30, 6]].map(([x, y, w, h, s]) => (
        <path key={s} d={tuft(x, y, w, h, 6, s)} fill={C.grassLight} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />
      ))}

      {/* tiny flowers */}
      {FLOWERS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <circle r="4.5" fill={i % 3 ? '#f4f1e6' : '#f2c66b'} stroke={C.ink} strokeWidth="1.5" />
          <circle r="1.6" fill={C.orange} />
        </g>
      ))}
    </LayerSvg>
  );
}

export default memo(GroundLayer);
