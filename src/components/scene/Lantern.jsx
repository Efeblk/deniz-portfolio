import { motion } from 'framer-motion';
import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useScene } from '../../context/SceneContext.jsx';

// Hangs from the long branch at (1015, 250). The whole thing sways gently
// from the rope's anchor point; clicking toggles day ↔ night.
export default function Lantern() {
  const { night, toggleNight } = useScene();
  return (
    <g className="sway-lantern">
      <Hotspot label={night ? 'Lantern — wake the day' : 'Lantern — light up the night'} onActivate={toggleNight} hitArea={{ x: 975, y: 250, width: 80, height: 180 }}>
        <path d="M1015 250 L1015 318" stroke={C.ink} strokeWidth="3" />
        <g stroke={C.ink} strokeWidth="3" strokeLinejoin="round">
          <circle cx="1015" cy="318" r="7" fill="none" />
          {/* cap */}
          <path d="M984 340 L1015 322 L1046 340 L1040 348 L990 348Z" fill="#3d4f4b" />
          {/* glass body */}
          <path d="M992 348 L1038 348 L1034 404 L996 404Z" fill={night ? '#ffd77a' : '#f1e6c2'} style={{ transition: 'fill 1.2s' }} />
          <path d="M1015 348 V404 M992 372 H1038" stroke={C.ink} strokeWidth="2" fill="none" opacity="0.6" />
          {/* flame */}
          <motion.path
            d="M1015 366 Q1023 380 1015 392 Q1007 380 1015 366Z"
            fill={night ? '#ff9a3c' : '#e8c98a'}
            stroke="none"
            animate={night ? { scaleY: [1, 1.15, 0.95, 1.1, 1], opacity: [0.9, 1, 0.85, 1, 0.9] } : { scaleY: 1, opacity: 0.6 }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          {/* base */}
          <path d="M992 404 L1038 404 L1032 414 L998 414Z" fill="#3d4f4b" />
          <circle cx="1015" cy="420" r="4" fill="#3d4f4b" />
        </g>
        {/* little paper tag that hints at interactivity */}
        <g transform="rotate(8 1040 370)">
          <path d="M1038 360 L1052 378" stroke={C.ink} strokeWidth="1.5" />
          <rect x="1044" y="376" width="16" height="24" fill={C.red} stroke={C.ink} strokeWidth="2" />
          <path d="M1048 384 h8 M1052 384 v10 M1048 394 h8" stroke={C.paper} strokeWidth="2" />
        </g>
      </Hotspot>
    </g>
  );
}
