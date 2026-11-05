import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { C } from './palette.js';

const NOTE_A = 'M0 0 m-7 0 a7 5 -20 1 0 14 0 a7 5 -20 1 0 -14 0 M6 -2 V-30 Q15 -26 18 -16';
const NOTE_B = 'M-12 0 m-6 0 a6 4.5 -20 1 0 12 0 a6 4.5 -20 1 0 -12 0 M14 -4 m-6 0 a6 4.5 -20 1 0 12 0 a6 4.5 -20 1 0 -12 0 M-7 -2 V-28 L19 -32 V-6 M-7 -22 L19 -26';

// Notes drift up from the headphones while music is playing.
export default function MusicNotes({ active, x = 800, y = 400 }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!active) return undefined;
    let n = 0;
    const spawn = () => {
      const id = `${Date.now()}-${n++}`;
      const side = Math.random() < 0.5 ? -1 : 1;
      setNotes((list) => [...list.slice(-10), { id, side, d: Math.random() < 0.5 ? NOTE_A : NOTE_B, drift: 30 + Math.random() * 50, s: 0.7 + Math.random() * 0.5 }]);
    };
    spawn();
    const t = setInterval(spawn, 700);
    return () => clearInterval(t);
  }, [active]);

  return (
    <g transform={`translate(${x} ${y})`} style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {active && notes.map((nt) => (
          <motion.path
            key={nt.id}
            d={nt.d}
            fill={C.cream}
            stroke={C.ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ opacity: 0, x: nt.side * 46, y: 0, scale: nt.s * 0.6, rotate: 0 }}
            animate={{ opacity: [0, 1, 1, 0], x: nt.side * (46 + nt.drift), y: -150, scale: nt.s, rotate: nt.side * 18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            onAnimationComplete={() => setNotes((list) => list.filter((v) => v.id !== nt.id))}
          />
        ))}
      </AnimatePresence>
    </g>
  );
}
