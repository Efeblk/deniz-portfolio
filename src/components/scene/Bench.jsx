import { memo } from 'react';
import { C } from './palette.js';

// Slatted wooden bench, seat from x=610..1090. Seat top: y≈622 (back) → 648 (front).
function Bench() {
  const s = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round' };
  return (
    <g className="bench">
      <ellipse cx="850" cy="770" rx="290" ry="24" fill={C.grassDeep} opacity="0.55" />
      {/* back legs */}
      <rect x="640" y="520" width="16" height="230" fill={C.woodDark} {...s} />
      <rect x="1044" y="520" width="16" height="230" fill={C.woodDark} {...s} />
      {/* backrest slats */}
      {[518, 556].map((y) => (
        <g key={y}>
          <rect x="620" y={y} width="460" height="28" rx="4" fill={C.wood} {...s} />
          <rect x="626" y={y + 18} width="448" height="7" fill={C.woodDark} opacity="0.55" />
          <path d={`M640 ${y + 8} H760`} stroke={C.woodLight} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {/* seat top + front face */}
      <path d="M600 648 L620 622 L1080 622 L1100 648Z" fill={C.woodLight} {...s} />
      <path d="M620 630 H1080 M612 639 H1090" stroke={C.wood} strokeWidth="2.5" />
      <rect x="600" y="648" width="500" height="20" fill={C.wood} {...s} />
      <rect x="604" y="660" width="492" height="6" fill={C.woodDark} opacity="0.5" />
      {/* front legs */}
      <rect x="620" y="668" width="20" height="92" fill={C.wood} {...s} />
      <rect x="1060" y="668" width="20" height="92" fill={C.wood} {...s} />
      <rect x="630" y="668" width="8" height="90" fill={C.woodDark} opacity="0.45" />
      <rect x="1070" y="668" width="8" height="90" fill={C.woodDark} opacity="0.45" />
    </g>
  );
}

export default memo(Bench);
