import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useScene } from '../../context/SceneContext.jsx';

// Tablet propped on a little stand beside her, screen angled toward her.
export default function Tablet() {
  const { openModal, night } = useScene();
  const screen = night ? '#bfe9ff' : '#9fd3dc';
  return (
    <Hotspot label="Tablet — Projects" onActivate={() => openModal('projects')} hitArea={{ x: 880, y: 556, width: 104, height: 92 }}>
      <g transform="rotate(-7 930 640)" stroke={C.ink} strokeLinejoin="round">
        <path d="M948 642 L968 600 L978 642Z" fill="#59646a" strokeWidth="2.5" />
        <path d="M888 642 L972 642 L962 568 L896 566Z" fill="#2f3c43" strokeWidth="3" />
        <path d="M896 634 L964 634 L956 576 L902 574Z" fill={screen} strokeWidth="2" style={{ transition: 'fill 1.2s' }} />
        {/* tiny project tiles on screen */}
        {[[906, 582, C.orange], [926, 582, '#f2c66b'], [946, 582, C.leafLight], [906, 602, '#f4f1e6'], [926, 602, C.red], [946, 602, '#7aa7c7']].map(([x, y, fill], i) => (
          <rect key={i} x={x - (y - 582) * 0.08} y={y} width="15" height="14" rx="2" fill={fill} strokeWidth="1.5" />
        ))}
        <path d="M906 624 H950" stroke="#2f3c43" strokeWidth="2.5" />
        <circle cx="930" cy="638" r="1.6" fill="#8a979d" stroke="none" />
      </g>
    </Hotspot>
  );
}
