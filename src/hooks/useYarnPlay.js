import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue } from 'framer-motion';

// Stage-space constants (1600×900).
export const YARN_R = 20;
export const GROUND_Y = 792; // yarn centre when resting on the grass
const MIN_X = 110;
const MAX_X = 1490;
const GRAVITY = 0.75; // px / frame²
const CAT_MIN = 110;
const CAT_MAX = 1480;
const REACH = 62; // where the cat stops, measured from the yarn's centre
const PLAY_MS = 9000; // the cat keeps playing this long after you last touched the yarn

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * One rAF loop drives both the yarn (drag, throw, bounce, roll) and the cat
 * (walk to the yarn, face it, bat it). Everything is a motion value, so
 * nothing re-renders per frame; React state only changes when the cat flips
 * direction or swings its paw.
 */
export function useYarnPlay(svgRef, { yarnStart = { x: 700, y: GROUND_Y }, catStart = 545 } = {}) {
  const yarnX = useMotionValue(yarnStart.x);
  const yarnY = useMotionValue(yarnStart.y);
  const yarnRot = useMotionValue(0);
  const catX = useMotionValue(catStart);
  const catHop = useMotionValue(0);
  const catFocus = useMotionValue(0); // 1 = watching the yarn, 0 = watching the cursor
  const [facing, setFacing] = useState(1);
  const [bat, setBat] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sim = useRef({
    vx: 0, vy: 0, dragging: false, lastUser: -Infinity, nextBat: 0, pendingHit: 0,
    hop: 0, facing: 1, grab: null, samples: [], moved: 0,
  });

  /* ------------------------------------------- coordinate conversion --- */
  const clientToStage = useCallback((cx, cy) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!m) return { x: cx, y: cy };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }, [svgRef]);

  const stageToClient = useCallback((x, y) => {
    const m = svgRef.current?.getScreenCTM();
    if (!m) return { x, y };
    const p = new DOMPoint(x, y).matrixTransform(m);
    return { x: p.x, y: p.y };
  }, [svgRef]);

  /* ---------------------------------------------------------- dragging --- */
  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const s = sim.current;
    const p = clientToStage(e.clientX, e.clientY);
    s.dragging = true;
    s.grab = { dx: p.x - yarnX.get(), dy: p.y - yarnY.get() };
    s.samples = [{ x: yarnX.get(), y: yarnY.get(), t: performance.now() }];
    s.moved = 0;
    s.vx = 0;
    s.vy = 0;
    s.lastUser = performance.now();
    setDragging(true);

    const onMove = (ev) => {
      const q = clientToStage(ev.clientX, ev.clientY);
      const nx = clamp(q.x - s.grab.dx, MIN_X, MAX_X);
      const ny = clamp(q.y - s.grab.dy, -120, GROUND_Y);
      s.moved += Math.hypot(nx - yarnX.get(), ny - yarnY.get());
      yarnRot.set(yarnRot.get() + (nx - yarnX.get()) * 1.6);
      yarnX.set(nx);
      yarnY.set(ny);
      const now = performance.now();
      s.samples.push({ x: nx, y: ny, t: now });
      s.samples = s.samples.filter((smp) => now - smp.t < 90);
      s.lastUser = now;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      s.dragging = false;
      setDragging(false);
      const now = performance.now();
      s.lastUser = now;
      if (s.moved < 4) {
        // a tap = a little toss
        s.vx = (Math.random() - 0.5) * 8;
        s.vy = -11;
        return;
      }
      const first = s.samples[0];
      const last = s.samples[s.samples.length - 1];
      const dt = Math.max(16, last.t - first.t);
      s.vx = clamp(((last.x - first.x) / dt) * 16.7, -26, 26);
      s.vy = clamp(((last.y - first.y) / dt) * 16.7, -26, 26);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, [clientToStage, yarnX, yarnY, yarnRot]);

  /** Keyboard / programmatic toss. */
  const toss = useCallback(() => {
    const s = sim.current;
    s.vx = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 6);
    s.vy = -13;
    s.lastUser = performance.now();
  }, []);

  /* --------------------------------------------------------- the loop --- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(3, (now - last) / 16.7);
      last = now;
      const s = sim.current;

      // yarn physics
      if (!s.dragging) {
        let x = yarnX.get();
        let y = yarnY.get();
        s.vy += GRAVITY * dt;
        x += s.vx * dt;
        y += s.vy * dt;
        if (y >= GROUND_Y) {
          y = GROUND_Y;
          s.vy = s.vy > 2.5 ? -s.vy * 0.45 : 0;
          s.vx *= Math.pow(0.95, dt); // rolling friction
          if (Math.abs(s.vx) < 0.05) s.vx = 0;
        } else {
          s.vx *= Math.pow(0.995, dt);
        }
        if (x < MIN_X || x > MAX_X) {
          x = clamp(x, MIN_X, MAX_X);
          s.vx = -s.vx * 0.6;
        }
        if (s.vx || y !== yarnY.get()) {
          yarnRot.set(yarnRot.get() + ((s.vx * dt) / YARN_R) * (180 / Math.PI));
          yarnX.set(x);
          yarnY.set(y);
        }
      }

      // cat behaviour
      const yx = yarnX.get();
      const yy = yarnY.get();
      const active = s.dragging || now - s.lastUser < PLAY_MS;
      catFocus.set(active ? 1 : 0);
      let moving = false;
      if (active) {
        const cx = catX.get();
        const side = Math.abs(yx - cx) > 14 ? Math.sign(yx - cx) : s.facing;
        if (side !== s.facing) { s.facing = side; setFacing(side); }
        const target = clamp(yx - side * REACH, CAT_MIN, CAT_MAX);
        const dx = target - cx;
        if (Math.abs(dx) > 8) {
          const speed = Math.min(6.5, 1.4 + Math.abs(dx) * 0.05);
          catX.set(clamp(cx + Math.sign(dx) * speed * dt, CAT_MIN, CAT_MAX));
          moving = true;
        }
        const dist = Math.abs(yx - catX.get());
        const reachable = s.dragging ? yy > GROUND_Y - 260 : yy > GROUND_Y - 150;
        if (!moving && dist < REACH + 34 && reachable && now > s.nextBat) {
          setBat((b) => b + 1);
          s.nextBat = now + 1000 + Math.random() * 800;
          s.pendingHit = now + 190; // paw connects ~190 ms into the swing
        }
      }
      if (s.pendingHit && now >= s.pendingHit) {
        s.pendingHit = 0;
        if (!s.dragging && Math.abs(yx - catX.get()) < REACH + 40 && yy > GROUND_Y - 70) {
          s.vx = s.facing * (5 + Math.random() * 5);
          s.vy = -(5 + Math.random() * 5);
        }
      }

      // little hops while trotting
      if (moving) {
        s.hop += 0.34 * dt;
        catHop.set(-Math.abs(Math.sin(s.hop)) * 10);
      } else if (catHop.get() !== 0) {
        s.hop = 0;
        const h = catHop.get() * 0.7;
        catHop.set(Math.abs(h) < 0.2 ? 0 : h);
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [yarnX, yarnY, yarnRot, catX, catHop, catFocus]);

  return {
    yarn: { x: yarnX, y: yarnY, rot: yarnRot, dragging, onPointerDown, toss },
    cat: { x: catX, hop: catHop, focus: catFocus, facing, bat },
    stageToClient,
  };
}
