import { motion, useTransform } from 'framer-motion';
import { C } from './palette.js';
import { GROUND_Y, YARN_R } from '../../hooks/useYarnPlay.js';
import { useScene } from '../../context/SceneContext.jsx';

const PINK = '#d95f74';
const PINK_DARK = '#a8435a';
const PINK_LIGHT = '#f39aa8';

// Draggable ball of yarn. Physics live in useYarnPlay; this only draws it.
export default function Yarn({ yarn }) {
  const { setHint } = useScene();
  // shadow shrinks + fades as the ball rises off the grass
  const lift = useTransform(yarn.y, (y) => Math.min(1, Math.max(0, (GROUND_Y - y) / 300)));
  const shadowRx = useTransform(lift, (l) => 24 * (1 - l * 0.6));
  const shadowOpacity = useTransform(lift, (l) => 0.55 * (1 - l * 0.8));

  return (
    <g>
      <motion.ellipse cx={yarn.x} cy={GROUND_Y + YARN_R - 2} rx={shadowRx} ry="6" fill={C.grassDeep} style={{ opacity: shadowOpacity }} />
      <motion.g
        className={`hotspot yarn ${yarn.dragging ? 'dragging' : ''}`}
        style={{ x: yarn.x, y: yarn.y }}
        role="button"
        tabIndex={0}
        aria-label="Ball of yarn — drag or throw it for the cat"
        onPointerDown={yarn.onPointerDown}
        onPointerEnter={() => setHint('Ball of yarn — drag me!')}
        onPointerLeave={() => setHint(null)}
        onFocus={() => setHint('Ball of yarn — press Enter to toss')}
        onBlur={() => setHint(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); yarn.toss(); }
        }}
      >
        {/* generous invisible grab area */}
        <circle r={YARN_R + 16} fill="transparent" />
        {/* loose strand */}
        <path d="M12 14 Q26 30 40 24 Q54 18 64 28" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M12 14 Q26 30 40 24 Q54 18 64 28" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" />
        <motion.g style={{ rotate: yarn.rot }}>
          <circle r={YARN_R} fill={PINK} stroke={C.ink} strokeWidth="3" />
          <path d="M-20 0 A20 20 0 0 0 4 19.6 A20 20 0 0 1 -20 0Z" fill={PINK_DARK} opacity="0.55" />
          <g fill="none" stroke={PINK_DARK} strokeWidth="2" strokeLinecap="round">
            <path d="M-14 -12 Q0 -4 14 -14" />
            <path d="M-18 -2 Q0 8 18 -4" />
            <path d="M-12 12 Q2 16 12 10" />
            <path d="M-6 -18 Q6 0 -2 19" />
          </g>
          <path d="M-9 -13 Q-2 -17 6 -15" stroke={PINK_LIGHT} strokeWidth="3" fill="none" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </g>
  );
}
