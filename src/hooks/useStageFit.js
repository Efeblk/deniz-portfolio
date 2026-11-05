import { useEffect, useState } from 'react';

// The whole scene is authored on a fixed 1600×900 "stage". This hook scales it
// to cover the viewport, but never so far that the interactive core
// (x ≈ 380 → 1480) is cropped on narrow / portrait screens.
export const STAGE_W = 1600;
export const STAGE_H = 900;
const CORE_W = 1100;
const FOCUS_X = 930;

export function useStageFit() {
  const [fit, setFit] = useState(() => compute());
  useEffect(() => {
    const onResize = () => setFit(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return fit;
}

function compute() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : STAGE_W;
  const vh = typeof window !== 'undefined' ? window.innerHeight : STAGE_H;
  const cover = Math.max(vw / STAGE_W, vh / STAGE_H);
  const scale = Math.min(cover, vw / CORE_W);
  let left = vw / 2 - FOCUS_X * scale;
  // keep stage edges from showing when we're in cover mode
  left = Math.min(0, Math.max(vw - STAGE_W * scale, left));
  if (STAGE_W * scale < vw) left = (vw - STAGE_W * scale) / 2;
  const top = vh - STAGE_H * scale > 0 ? (vh - STAGE_H * scale) * 0.55 : (vh - STAGE_H * scale) * 0.6;
  return { scale, left, top, vw, vh, portrait: vh > vw };
}
