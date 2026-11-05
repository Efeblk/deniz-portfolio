import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useScene } from '../../context/SceneContext.jsx';
import { sfxThump } from '../../audio/engine.js';

// Coral notebook with an elastic band, a pen, and a "say hi!" sticky note.
export default function Notebook() {
  const { openModal } = useScene();
  return (
    <Hotspot label="Notebook — Contact me" onActivate={() => { sfxThump(); openModal('contact'); }} hitArea={{ x: 1120, y: 648, width: 104, height: 66 }}>
      <g stroke={C.ink} strokeLinejoin="round">
        {/* sticky note peeking out */}
        <g transform="rotate(-10 1160 690)">
          <rect x="1146" y="656" width="34" height="32" fill="#f7d66b" strokeWidth="2.2" />
          <text x="1163" y="672" textAnchor="middle" className="sticky">say</text>
          <text x="1163" y="683" textAnchor="middle" className="sticky">hi!</text>
        </g>
        <path d="M1128 712 L1128 704 L1204 704 L1204 712Z" fill={C.paper} strokeWidth="2.5" />
        <path d="M1128 704 L1144 684 L1220 684 L1204 704Z" fill="#d4685a" strokeWidth="3" />
        <path d="M1204 704 L1220 684 L1220 692 L1204 712Z" fill="#a84c40" strokeWidth="2.5" />
        <path d="M1182 684 L1166 704" stroke="#2f3c43" strokeWidth="4" />
        <path d="M1150 690 H1176" stroke="#f3c8bf" strokeWidth="2.5" />
        {/* pen */}
        <g transform="rotate(-14 1170 700)">
          <rect x="1136" y="696" width="62" height="7" rx="3" fill="#2f5a50" strokeWidth="2" />
          <path d="M1198 696 L1210 699.5 L1198 703Z" fill={C.cream} strokeWidth="2" />
        </g>
      </g>
    </Hotspot>
  );
}
