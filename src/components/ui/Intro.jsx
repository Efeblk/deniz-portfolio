import { motion } from 'framer-motion';
import { useScene } from '../../context/SceneContext.jsx';
import { SITE } from '../../data/site.js';

const LETTERS = SITE.shortName.toUpperCase().split('');

// Title card. The first click also unlocks Web Audio (browsers require a gesture).
export default function Intro() {
  const { enter } = useScene();
  return (
    <motion.div
      className="intro no-print"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="intro-inner">
        <h1 className="block-title" aria-label={SITE.name}>
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              className={ch === ' ' ? 'gap' : 'block'}
              initial={{ y: -60, opacity: 0, rotate: -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 380, damping: 16 }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p className="intro-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          {SITE.role} · a quiet bench under a big tree
        </motion.p>
        <motion.div className="intro-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <button className="chunky-btn primary" onClick={() => enter(true)}>Enter with music ♪</button>
          <button className="chunky-btn" onClick={() => enter(false)}>Enter quietly</button>
        </motion.div>
        <motion.p className="intro-hint" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.5 }}>
          headphones recommended · click things on the bench
        </motion.p>
      </div>
    </motion.div>
  );
}
