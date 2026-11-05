import { memo } from 'react';
import { C } from './palette.js';
import { scallop, scatter, LEAF } from './shapes.js';

const TRUNK = `M250 742 Q320 730 330 690 L345 520 Q352 420 332 332 Q300 252 236 196 L262 178
  Q330 232 370 290 Q382 222 366 150 L396 146 Q410 230 404 292 Q520 238 700 220 Q870 206 1040 238
  L1042 258 Q870 234 714 250 Q545 268 432 342 Q418 432 428 520 L442 690 Q452 728 524 744
  Q440 752 390 748 Q330 754 250 742Z`;

const TRUNK_SHADE = `M404 292 Q520 238 700 220 L706 236 Q545 262 432 342 Q418 432 428 520 L442 690
  Q452 728 524 744 Q470 748 430 746 Q414 700 410 600 L400 470 Q398 380 404 292Z`;

// [cx, cy, rx, ry, seed]
const BACK = [[110, 130, 270, 170, 1], [430, 70, 310, 170, 2], [770, 100, 290, 150, 3], [1020, 160, 200, 110, 4], [-80, 270, 210, 150, 5], [600, 200, 210, 90, 6], [-160, 60, 240, 190, 7]];
const MID = [[150, 100, 230, 140, 11], [430, 40, 270, 140, 12], [740, 70, 250, 120, 13], [990, 130, 160, 86, 14], [30, 240, 170, 110, 15], [590, 160, 170, 80, 16], [-140, 40, 200, 150, 17]];
const LIGHT = [[100, 40, 175, 100, 21], [380, -10, 210, 100, 22], [670, 20, 185, 90, 23], [940, 96, 110, 56, 24], [-150, 0, 140, 100, 25]];
const DABS = scatter(60, -200, -80, 1100, 280, 77);

function Tree() {
  return (
    <g className="tree">
      {/* cel shadow pooled on the grass */}
      <ellipse cx="560" cy="760" rx="560" ry="42" fill={C.grassDeep} opacity="0.55" />

      <path d={TRUNK} fill={C.bark} stroke={C.ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d={TRUNK_SHADE} fill={C.barkDark} />
      <path d="M352 560 Q356 470 350 400 M362 650 Q366 610 364 580 M690 228 Q800 222 900 226" stroke={C.barkLight} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M380 470 q8 -16 0 -32 M392 600 q-8 -14 2 -28 M560 246 q20 -8 38 -4" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* canopy: dark outline mass → mid tones → sun-lit tops → leaf flecks */}
      <g stroke={C.ink} strokeWidth="3.5" strokeLinejoin="round">
        {BACK.map(([x, y, rx, ry, s]) => <path key={s} d={scallop(x, y, rx, ry, 11, s)} fill={C.leafDark} />)}
      </g>
      <g>
        {MID.map(([x, y, rx, ry, s]) => <path key={s} d={scallop(x, y, rx, ry, 10, s)} fill={C.leafMid} />)}
        {LIGHT.map(([x, y, rx, ry, s]) => <path key={s} d={scallop(x, y, rx, ry, 9, s)} fill={C.leafLight} />)}
        {DABS.map((p, i) => (
          <path key={i} d={LEAF} transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.s})`} fill={i % 4 ? C.leafHi : C.leafDark} opacity={i % 4 ? 0.9 : 0.7} />
        ))}
      </g>
    </g>
  );
}

export default memo(Tree);
