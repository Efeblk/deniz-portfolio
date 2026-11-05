import { memo } from 'react';
import { C } from './palette.js';

// Wooden crate used as a side table. Top surface: y 690..712, x 1118..1268.
function Crate() {
  const s = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round' };
  return (
    <g>
      <ellipse cx="1200" cy="800" rx="110" ry="16" fill={C.grassDeep} opacity="0.55" />
      <path d="M1118 712 L1138 690 L1268 690 L1250 712Z" fill={C.woodLight} {...s} />
      <path d="M1250 712 L1268 690 L1268 776 L1250 798Z" fill={C.woodDark} {...s} />
      <rect x="1118" y="712" width="132" height="86" fill={C.wood} {...s} />
      <path d="M1118 740 H1250 M1118 770 H1250" stroke={C.ink} strokeWidth="2.5" />
      <path d="M1126 726 H1180 M1126 756 H1160" stroke={C.woodLight} strokeWidth="3" strokeLinecap="round" />
      <rect x="1166" y="746" width="34" height="14" rx="3" fill={C.woodDark} stroke={C.ink} strokeWidth="2" />
    </g>
  );
}

export default memo(Crate);
