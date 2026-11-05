import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

// Global pointer as motion values (no React re-renders on move).
// nx / ny are normalised to -1…1 and spring-smoothed for parallax.
let shared = null;

export function usePointer() {
  const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const y = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const nxRaw = useMotionValue(0);
  const nyRaw = useMotionValue(0);
  const nx = useSpring(nxRaw, { stiffness: 50, damping: 18, mass: 0.8 });
  const ny = useSpring(nyRaw, { stiffness: 50, damping: 18, mass: 0.8 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      nxRaw.set((e.clientX / window.innerWidth) * 2 - 1);
      nyRaw.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    // gentle drift from device tilt on phones
    const onTilt = (e) => {
      if (e.gamma == null) return;
      nxRaw.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      nyRaw.set(Math.max(-1, Math.min(1, (e.beta - 40) / 25)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onTilt, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, [x, y, nxRaw, nyRaw]);

  shared = { x, y, nx, ny };
  return shared;
}

export const getPointer = () => shared;
