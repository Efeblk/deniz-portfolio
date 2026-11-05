import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import { sfxPop } from '../../audio/engine.js';

// Shared modal shell. `variant` skins it as the object it came from:
// 'tablet' (dark bezel), 'paper' (CV sheet), 'notebook' (ruled + spiral).
export default function Modal({ title, variant = 'paper', onClose, onEscape, children, footer, bodyRef }) {
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    return () => lastFocus.current?.focus?.({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (onEscape || onClose)();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onEscape]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal-card modal-${variant}`}
        initial={{ y: 60, scale: 0.86, rotate: -3, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
        exit={{ y: 40, scale: 0.9, rotate: 2, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" onClick={() => { sfxPop(); onClose(); }} aria-label="Close">
          <Icon name="close" size={26} />
        </button>
        <header className="modal-head">
          <h2>{title}</h2>
        </header>
        <div className="modal-body" ref={bodyRef}>{children}</div>
        {footer && <footer className="modal-actions">{footer}</footer>}
      </motion.section>
    </motion.div>
  );
}
