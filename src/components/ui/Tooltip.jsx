import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { useScene } from '../../context/SceneContext.jsx';

// Cursor-following label for whichever scene object is hovered/focused.
export default function Tooltip() {
  const { hint } = useScene();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const onMove = (e) => { x.set(e.clientX + 18); y.set(e.clientY + 20); };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div className="tooltip no-print" style={{ x, y }} aria-live="polite">
      <AnimatePresence>
        {hint && (
          <motion.span
            key={hint}
            initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            {hint}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
