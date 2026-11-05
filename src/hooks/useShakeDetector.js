import { useEffect, useRef } from 'react';

// Fires `onShake` when the cursor whips back and forth horizontally:
// `reversals` direction changes, each covering ≥ `minTravel` px at
// ≥ `minSpeed` px/ms, all inside `windowMs`.
export function useShakeDetector(onShake, { reversals = 3, minTravel = 45, minSpeed = 1.1, windowMs = 750, cooldown = 1400 } = {}) {
  const cb = useRef(onShake);
  cb.current = onShake;

  useEffect(() => {
    let lastX = null, lastT = 0, dir = 0, travel = 0, hits = [], coolUntil = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (lastX == null) { lastX = e.clientX; lastT = now; return; }
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      if (dx === 0) return;
      const d = Math.sign(dx);
      const speed = Math.abs(dx) / dt;
      if (d === dir) {
        travel += Math.abs(dx);
      } else {
        if (travel >= minTravel && speed >= minSpeed * 0.5) hits.push(now);
        dir = d;
        travel = Math.abs(dx);
      }
      hits = hits.filter((t) => now - t < windowMs);
      if (hits.length >= reversals && now > coolUntil && speed >= minSpeed * 0.4) {
        hits = [];
        coolUntil = now + cooldown;
        cb.current?.();
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reversals, minTravel, minSpeed, windowMs, cooldown]);
}
