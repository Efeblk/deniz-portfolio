import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useScene } from '../../context/SceneContext.jsx';
import { sfxPaper } from '../../audio/engine.js';

// A clipped stack of pages (the CV) leaning on the backrest.
export default function Papers() {
  const { openModal } = useScene();
  return (
    <Hotspot label="Papers — CV" onActivate={() => { sfxPaper(); openModal('cv'); }} hitArea={{ x: 990, y: 540, width: 96, height: 108 }}>
      <g stroke={C.ink} strokeLinejoin="round">
        <path d="M1002 644 L1080 644 L1084 560 L1010 556Z" fill={C.paperShade} strokeWidth="2.5" transform="rotate(5 1040 644)" />
        <path d="M998 644 L1076 644 L1078 558 L1004 556Z" fill="#efeadb" strokeWidth="2.5" transform="rotate(-3 1040 644)" />
        <g transform="rotate(2 1040 644)">
          <path d="M1000 644 L1078 644 L1080 556 L1004 554Z" fill={C.paper} strokeWidth="3" />
          <text x="1014" y="576" className="paper-cv">CV</text>
          <path d="M1014 586 H1066 M1014 596 H1060 M1014 606 H1068 M1014 616 H1050 M1014 626 H1062" stroke="#9aa39c" strokeWidth="2.2" />
          <rect x="1048" y="566" width="20" height="14" rx="2" fill={C.leafLight} strokeWidth="1.8" />
          {/* binder clip */}
          <path d="M1030 548 L1052 548 L1050 562 L1032 562Z" fill="#2f3c43" strokeWidth="2.2" />
          <path d="M1034 548 Q1032 536 1040 534 M1048 548 Q1050 536 1042 534" fill="none" stroke="#6f7c82" strokeWidth="2.2" />
        </g>
      </g>
    </Hotspot>
  );
}
