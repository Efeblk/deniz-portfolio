import { motion } from 'framer-motion';
import { useScene } from '../../context/SceneContext.jsx';

// Wraps any SVG prop to make it an accessible, hoverable, clickable object.
// - keyboard: Tab to focus, Enter/Space to activate
// - hover: lifts slightly + shows a cursor tooltip via scene context
export default function Hotspot({ label, onActivate, children, lift = 5, className = '', hitArea, ...rest }) {
  const { setHint } = useScene();
  const activate = (e) => {
    e?.stopPropagation?.();
    onActivate?.(e);
  };
  return (
    <motion.g
      className={`hotspot ${className}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      whileHover={{ y: -lift }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      onPointerEnter={() => setHint(label)}
      onPointerLeave={() => setHint(null)}
      onFocus={() => setHint(label)}
      onBlur={() => setHint(null)}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(e);
        }
      }}
      {...rest}
    >
      {/* invisible, generous hit target so small props are easy to click/tap */}
      {hitArea && <rect {...hitArea} fill="transparent" />}
      {children}
    </motion.g>
  );
}
