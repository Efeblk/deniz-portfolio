import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useShakeDetector } from '../../hooks/useShakeDetector.js';
import { sfxWhoosh, sfxPop } from '../../audio/engine.js';

const ink = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' };

// Orange tabby. Watches the cursor; once you touch the ball of yarn it trots
// over (little hops), faces it and bats it around. Still loves being petted.
// Position / hop / focus come from useYarnPlay as motion values.
export default function Cat({ pointer, play, groundY = 800 }) {
  const { cat, yarn, stageToClient } = play;
  const headRef = useRef(null);
  const rot = useMotionValue(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const headRot = useSpring(rot, { stiffness: 120, damping: 14 });
  const pupilX = useSpring(px, { stiffness: 300, damping: 20 });
  const pupilY = useSpring(py, { stiffness: 300, damping: 20 });
  const [shake, setShake] = useState(0);
  const [hearts, setHearts] = useState([]);
  const facingRef = useRef(cat.facing);
  facingRef.current = cat.facing;
  const swipe = shake + cat.bat; // shake-swipes and yarn-bats share one paw animation

  // Look at the yarn while playing, otherwise at the cursor.
  useEffect(() => {
    if (!pointer) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = headRef.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const target = cat.focus.get() > 0.5
        ? stageToClient(yarn.x.get(), yarn.y.get())
        : { x: pointer.x.get(), y: pointer.y.get() };
      const dx = (target.x - cx) * facingRef.current; // local (possibly mirrored) space
      const dy = target.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 220);
      rot.set(Math.max(-20, Math.min(20, (dx / dist) * 20 * reach)));
      px.set((dx / dist) * 3.6 * reach);
      py.set((dy / dist) * 3.2 * reach);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const subs = [pointer.x, pointer.y, yarn.x, yarn.y, cat.x, cat.focus].map((mv) => mv.on('change', schedule));
    schedule();
    return () => { subs.forEach((u) => u()); cancelAnimationFrame(raf); };
  }, [pointer, yarn, cat, stageToClient, rot, px, py]);

  useShakeDetector(() => {
    sfxWhoosh();
    setShake((s) => s + 1);
  });

  useEffect(() => { if (cat.bat) sfxWhoosh(); }, [cat.bat]);

  const pet = () => {
    sfxPop();
    const id = Date.now();
    setHearts((h) => [...h, id]);
    setTimeout(() => setHearts((h) => h.filter((v) => v !== id)), 1200);
  };

  return (
    <g transform={`translate(0 ${groundY})`}>
      <motion.ellipse cx={cat.x} cy="2" rx="58" ry="10" fill={C.grassDeep} opacity="0.6" />
      <motion.g style={{ x: cat.x, y: cat.hop }}>
      <g transform={`scale(${cat.facing} 1)`}>
      <Hotspot label="Cat — pet me (or throw the yarn!)" onActivate={pet} lift={2} hitArea={{ x: -50, y: -185, width: 130, height: 190 }}>
        {/* tail */}
        <motion.g style={{ originX: 0, originY: 1 }} animate={{ rotate: [0, 12, -4, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
          <path d="M22 -8 Q72 -8 68 -52 Q64 -84 44 -88" fill="none" stroke={C.ink} strokeWidth="17" strokeLinecap="round" />
          <path d="M22 -8 Q72 -8 68 -52 Q64 -84 44 -88" fill="none" stroke={C.cat} strokeWidth="11" strokeLinecap="round" />
          <path d="M62 -26 l9 -3 M67 -48 l9 0 M60 -74 l8 4" stroke={C.catStripe} strokeWidth="3.5" strokeLinecap="round" />
        </motion.g>

        {/* body */}
        <path d="M-36 0 Q-46 -40 -30 -70 Q-16 -88 0 -88 Q16 -88 30 -70 Q46 -40 36 0Z" fill={C.cat} {...ink} />
        <path d="M14 -84 Q30 -76 34 -60 Q44 -36 36 0 L18 0 Q30 -40 14 -84Z" fill={C.catShade} />
        <path d="M-15 -72 Q0 -52 15 -72 Q20 -40 0 -18 Q-20 -40 -15 -72Z" fill={C.catCream} />
        <path d="M-34 -30 l10 2 M-36 -46 l10 3 M32 -32 l-9 3" stroke={C.catStripe} strokeWidth="3.5" strokeLinecap="round" />

        {/* resting paw */}
        <path d="M-24 -2 Q-26 -30 -18 -42 L-6 -42 Q-4 -20 -6 -2Z" fill={C.cat} {...ink} />
        <ellipse cx="-15" cy="-3" rx="11" ry="6" fill={C.catCream} {...ink} strokeWidth="2.5" />

        {/* swiping paw */}
        <motion.g
          key={swipe}
          style={{ originX: 0.5, originY: 0 }}
          initial={{ rotate: 0 }}
          animate={swipe ? { rotate: [0, -150, -110, -160, 0], y: [0, -6, -4, -6, 0] } : { rotate: 0 }}
          transition={{ duration: 0.75, times: [0, 0.25, 0.45, 0.65, 1], ease: 'easeOut' }}
        >
          <path d="M6 -42 Q4 -20 6 -2 L24 -2 Q26 -30 18 -42Z" fill={C.cat} {...ink} />
          <ellipse cx="15" cy="-3" rx="11" ry="6" fill={C.catCream} {...ink} strokeWidth="2.5" />
          <path d="M10 -6 v4 M15 -7 v5 M20 -6 v4" stroke={C.ink} strokeWidth="1.6" />
        </motion.g>
        <AnimatePresence>
          {swipe > 0 && (
            <motion.g key={`fx${swipe}`} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <path d="M30 -110 Q60 -100 64 -70 M38 -122 Q74 -110 78 -78 M24 -98 Q46 -90 50 -66" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
              <text x="58" y="-128" className="cat-fx">!</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* head (tracks cursor) */}
        <motion.g ref={headRef} style={{ rotate: headRot, originX: 0.5, originY: 0.85 }}>
          <path d="M-38 -112 Q-40 -142 -24 -152 L-28 -180 L-6 -158 Q0 -160 6 -158 L28 -180 L24 -152 Q40 -142 38 -112 Q36 -84 0 -82 Q-36 -84 -38 -112Z" fill={C.cat} {...ink} />
          <path d="M-24 -156 L-25 -171 L-12 -158Z M24 -156 L25 -171 L12 -158Z" fill="#f2a7a0" />
          <path d="M-8 -152 l2 10 M0 -154 v11 M8 -152 l-2 10" stroke={C.catStripe} strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="0" cy="-100" rx="16" ry="10" fill={C.catCream} />
          {[-15, 15].map((ex) => (
            <g key={ex} transform={`translate(${ex} -120)`}>
              <motion.g animate={swipe ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.6 }} key={`e${swipe}`}>
                <ellipse rx="8.5" ry="9" fill={C.catEye} {...ink} strokeWidth="2.5" />
                <motion.ellipse rx="2.8" ry="6.5" fill="#1c2424" style={{ x: pupilX, y: pupilY }} />
                <circle cx="-3" cy="-3.5" r="1.8" fill="#fff" />
              </motion.g>
            </g>
          ))}
          <path d="M-4 -108 L4 -108 L0 -103Z" fill="#e57f86" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M0 -103 Q-3 -97 -7 -99 M0 -103 Q3 -97 7 -99" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M-18 -104 L-40 -108 M-18 -100 L-40 -98 M18 -104 L40 -108 M18 -100 L40 -98" stroke={C.ink} strokeWidth="1.5" opacity="0.75" />
        </motion.g>
      </Hotspot>
      </g>

      <AnimatePresence>
        {hearts.map((id) => (
          <motion.path
            key={id}
            d="M0 -6 C-6 -14 -18 -6 0 8 C18 -6 6 -14 0 -6Z"
            fill={C.red} stroke={C.ink} strokeWidth="2"
            initial={{ opacity: 0, x: 0, y: -170, scale: 0.4 }}
            animate={{ opacity: 1, y: -230, x: 18, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </AnimatePresence>
      </motion.g>
    </g>
  );
}
