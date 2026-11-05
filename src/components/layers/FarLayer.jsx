import { memo } from 'react';
import LayerSvg from './LayerSvg.jsx';
import { C } from '../scene/palette.js';
import { scallop } from '../scene/shapes.js';

// Low-poly town on the hills: front face + darker side face + roof cap
// gives the 2.5D "diorama" read from the reference screenshots.
function Building({ x, base, w, h, depth = 26, color = C.townA, roof = '#d9ded4', windows = [3, 2], seed = 0 }) {
  const [cols, rows] = windows;
  const top = base - h;
  const winW = (w - 16) / cols - 8;
  const winH = Math.min(18, (h - 24) / rows - 10);
  const wins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 3 + seed) % 3 !== 0;
      wins.push({ x: x + 12 + c * (winW + 8), y: top + 14 + r * (winH + 12), lit });
    }
  }
  return (
    <g stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round">
      <path d={`M${x + w} ${top} l${depth} ${-depth * 0.45} v${h} l${-depth} ${depth * 0.45}Z`} fill={C.townShade} />
      <path d={`M${x} ${top} l${depth} ${-depth * 0.45} h${w} l${-depth} ${depth * 0.45}Z`} fill={roof} />
      <rect x={x} y={top} width={w} height={h} fill={color} />
      {wins.map((wn, i) => (
        <g key={i}>
          <rect x={wn.x} y={wn.y} width={winW} height={winH} fill="#5d7a75" strokeWidth="2" />
          {wn.lit && <rect className="night-only" x={wn.x} y={wn.y} width={winW} height={winH} fill="#ffd77a" strokeWidth="2" />}
        </g>
      ))}
    </g>
  );
}

function WaterTower({ x, base }) {
  return (
    <g stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round">
      <path d={`M${x - 26} ${base} L${x - 18} ${base - 70} M${x + 26} ${base} L${x + 18} ${base - 70} M${x - 22} ${base - 30} L${x + 22} ${base - 30}`} fill="none" />
      <rect x={x - 34} y={base - 130} width="68" height="62" rx="10" fill="#6fae7c" />
      <path d={`M${x - 34} ${base - 112} h68`} fill="none" />
      <path d={`M${x - 38} ${base - 130} Q${x} ${base - 160} ${x + 38} ${base - 130}Z`} fill="#8fcf98" />
      <rect x={x - 14} y={base - 104} width="28" height="12" fill="#f1efe2" strokeWidth="2" />
    </g>
  );
}

function Pole({ x, base, h = 190 }) {
  return (
    <g stroke={C.ink} strokeWidth="2.5" fill="#8f9c94">
      <rect x={x - 5} y={base - h} width="10" height={h} />
      <rect x={x - 26} y={base - h + 18} width="52" height="6" />
      <rect x={x - 18} y={base - h + 40} width="36" height="5" />
    </g>
  );
}

function FarLayer() {
  return (
    <LayerSvg>
      {/* hills */}
      <path d="M-500 520 Q-200 420 120 470 Q420 520 700 455 Q1000 395 1300 455 Q1550 500 2100 430 L2100 700 L-500 700Z" fill={C.hillFar} stroke={C.ink} strokeWidth="3" />
      {[ [1260, 470, 90, 34, 4], [1480, 452, 110, 40, 6], [80, 470, 120, 40, 8], [-120, 490, 100, 36, 9], [1690, 455, 120, 46, 12] ].map(([x, y, rx, ry, s]) => (
        <path key={s} d={scallop(x, y, rx, ry, 8, s)} fill={C.hillMid} stroke={C.ink} strokeWidth="2.5" />
      ))}

      {/* right-hand town */}
      <g>
        <WaterTower x={1420} base={478} />
        <Building x={1180} base={520} w={110} h={120} color={C.townA} windows={[3, 3]} seed={1} />
        <Building x={1310} base={530} w={90} h={78} color={C.townC} roof="#e7b9a8" windows={[2, 2]} seed={2} />
        <Building x={1450} base={515} w={150} h={150} color={C.townB} windows={[4, 4]} seed={3} />
        <Building x={1620} base={525} w={120} h={96} color={C.townC} roof="#b7c7bf" windows={[3, 2]} seed={4} />
        <Pole x={1300} base={540} />
        <Pole x={1560} base={540} h={170} />
        <path d="M1274 362 Q1430 400 1534 380 M1274 384 Q1430 420 1542 398 M1534 380 Q1650 400 1800 370" fill="none" stroke={C.ink} strokeWidth="1.6" opacity="0.8" />
      </g>

      {/* left-hand town (mostly behind the tree) */}
      <g>
        <Building x={-180} base={525} w={140} h={140} color={C.townB} windows={[3, 4]} seed={5} />
        <Building x={-20} base={530} w={100} h={90} color={C.townA} windows={[2, 2]} seed={6} />
        <Building x={110} base={535} w={90} h={64} color={C.townC} roof="#e7b9a8" windows={[2, 1]} seed={7} />
      </g>
    </LayerSvg>
  );
}

export default memo(FarLayer);
