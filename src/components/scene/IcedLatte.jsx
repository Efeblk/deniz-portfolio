import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { sfxSip, sfxPour } from '../../audio/engine.js';
import { useScene } from '../../context/SceneContext.jsx';

const FULL = 4;
const LIQUID_MAX = 82; // px of liquid when full
const CUP = 'M-27 -100 L27 -100 L20 0 L-20 0Z';
const ICE = [
  { x: -14, r: -12, dy: 0 },
  { x: 4, r: 18, dy: -6 },
  { x: -4, r: 40, dy: 8 },
];

// Clear plastic cup, sitting on the crate at (1238, 700).
// Each click = one sip (level − 1). When empty, the next click refills it.
export default function IcedLatte() {
  const [level, setLevel] = useState(FULL);
  const [bubbles, setBubbles] = useState([]);
  const { activateProp } = useScene();

  const onSip = () => {
    activateProp('latte');
    const text = level > 0 ? (level === 1 ? 'last sip…' : 'sip~') : 'refill!';
    if (level > 0) { sfxSip(); setLevel((l) => l - 1); }
    else { sfxPour(); setLevel(FULL); }
    const id = Date.now();
    setBubbles((b) => [...b, { id, text }]);
    setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), 1300);
  };

  const h = (level / FULL) * LIQUID_MAX;
  const top = -h;

  return (
    <g transform="translate(1238 702)">
      <Hotspot
        label={level > 0 ? `Iced latte — take a sip (${level}/${FULL})` : 'Iced latte — empty! click to refill'}
        onActivate={onSip}
        hitArea={{ x: -34, y: -150, width: 68, height: 156 }}
      >
        <defs>
          <clipPath id="cup-clip"><path d="M-24.5 -97 L24.5 -97 L18 -3 L-18 -3Z" /></clipPath>
          <linearGradient id="latte-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.milk} />
            <stop offset="0.45" stopColor={C.latte} />
            <stop offset="1" stopColor={C.coffee} />
          </linearGradient>
        </defs>
        <ellipse cx="0" cy="2" rx="28" ry="5" fill={C.woodDark} opacity="0.5" />
        <path d={CUP} fill={C.glass} opacity="0.55" />

        <g clipPath="url(#cup-clip)">
          <motion.rect
            x="-30" width="60"
            initial={false}
            animate={{ y: top, height: h }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            fill="url(#latte-grad)"
          />
          {/* swirl */}
          <motion.path
            d="M-20 -10 Q-6 -24 6 -14 Q16 -6 20 -20"
            stroke={C.milk} strokeWidth="3" fill="none" opacity="0.7"
            initial={false}
            animate={{ opacity: level > 1 ? 0.7 : 0 }}
          />
          {/* ice cubes float on the surface, then settle at the bottom */}
          {ICE.map((c, i) => (
            <motion.rect
              key={i}
              width="17" height="17" rx="4"
              x={c.x}
              initial={false}
              animate={{ y: Math.min(-18 - i * 4, top - 6 + c.dy), rotate: c.r + level * 6 }}
              transition={{ type: 'spring', stiffness: 90, damping: 10 }}
              fill="#f4fbfa" stroke={C.ink} strokeWidth="2" opacity="0.92"
            />
          ))}
        </g>

        {/* straw */}
        <path d="M2 -60 L18 -150" stroke={C.ink} strokeWidth="9" strokeLinecap="round" />
        <path d="M2 -60 L18 -150" stroke="#7fc9a1" strokeWidth="5" strokeLinecap="round" />
        <path d="M2 -60 L18 -150" stroke="#f4f1e6" strokeWidth="5" strokeDasharray="5 6" strokeLinecap="butt" />

        {/* cup outline + gloss + condensation */}
        <path d={CUP} fill="none" stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-27 -100 L27 -100" stroke={C.ink} strokeWidth="4" />
        <path d="M-19 -88 L-15 -14" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        {[[12, -70], [16, -40], [-6, -30], [10, -18]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.6" fill="#ffffff" opacity="0.8" />
        ))}
        <rect x="-11" y="-58" width="22" height="16" rx="3" fill={C.cream} stroke={C.ink} strokeWidth="2" />
        <path d="M-5 -50 q5 -7 10 0" stroke={C.leafMid} strokeWidth="2.5" fill="none" />
      </Hotspot>

      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.g
            key={b.id}
            initial={{ opacity: 0, y: -150, scale: 0.6 }}
            animate={{ opacity: 1, y: -190, scale: 1 }}
            exit={{ opacity: 0, y: -210 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: 'none' }}
          >
            <rect x="-38" y="-16" width="76" height="28" rx="6" fill="#fff" stroke={C.ink} strokeWidth="2.5" />
            <text y="4" textAnchor="middle" className="bubble-text">{b.text}</text>
          </motion.g>
        ))}
      </AnimatePresence>
    </g>
  );
}
