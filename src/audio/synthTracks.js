// Original, procedurally-generated fallback tracks. These play whenever the
// licensed audio files in /public/audio are absent, so the experience always
// has sound. (Melodies here are original compositions, not covers.)
import { getNoiseBuffer, mtof } from './engine.js';

function makeSequencer(ctx, { bpm, loopBeats, events, play }) {
  const spb = 60 / bpm;
  const sorted = [...events].sort((a, b) => a.t - b.t);
  let startTime = 0, idx = 0, loop = 0, timer = null;

  const tick = () => {
    const horizon = ctx.currentTime + 0.25;
    for (;;) {
      const ev = sorted[idx];
      const t = startTime + (loop * loopBeats + ev.t) * spb;
      if (t > horizon) break;
      if (t >= ctx.currentTime - 0.02) play(ev, t, spb, loop);
      idx += 1;
      if (idx >= sorted.length) { idx = 0; loop += 1; }
    }
  };
  return {
    start() { startTime = ctx.currentTime + 0.12; idx = 0; loop = 0; tick(); timer = setInterval(tick, 60); },
    stop() { clearInterval(timer); timer = null; },
  };
}

function makeSpace(ctx, out, { time = 0.33, feedback = 0.32, tone = 2400, wet = 0.35 } = {}) {
  const input = ctx.createGain();
  const dry = ctx.createGain();
  const delay = ctx.createDelay(1.5);
  const fb = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  const wetG = ctx.createGain();
  delay.delayTime.value = time;
  fb.gain.value = feedback;
  lp.type = 'lowpass';
  lp.frequency.value = tone;
  wetG.gain.value = wet;
  input.connect(dry).connect(out);
  input.connect(delay);
  delay.connect(lp).connect(fb).connect(delay);
  lp.connect(wetG).connect(out);
  return input;
}

function voice(ctx, out, t, freq, { type = 'sine', peak = 0.2, attack = 0.005, release = 1, detune = 0 }) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + attack + release + 0.05);
}

/* ------------------------------------------------- Day: music-box waltz --- */
// 3/4, D minor, 16 bars. [bar, beat, midi, beats]
const WALTZ_MELODY = [
  [0, 0, 69, 1], [0, 1, 74, 1], [0, 2, 76, 1],
  [1, 0, 77, 2], [1, 2, 76, 1],
  [2, 0, 74, 1], [2, 1, 70, 1], [2, 2, 74, 1],
  [3, 0, 72, 2], [3, 2, 67, 1],
  [4, 0, 69, 1], [4, 1, 72, 1], [4, 2, 77, 1],
  [5, 0, 74, 2], [5, 2, 77, 1],
  [6, 0, 79, 1], [6, 1, 77, 1], [6, 2, 74, 1],
  [7, 0, 76, 2], [7, 2, 73, 1],
  [8, 0, 69, 1], [8, 1, 74, 1], [8, 2, 77, 1],
  [9, 0, 81, 2], [9, 2, 79, 1],
  [10, 0, 79, 1], [10, 1, 77, 1], [10, 2, 74, 1],
  [11, 0, 76, 1], [11, 1, 72, 1], [11, 2, 76, 1],
  [12, 0, 81, 1], [12, 1, 77, 1], [12, 2, 72, 1],
  [13, 0, 74, 2], [13, 2, 70, 1],
  [14, 0, 69, 1], [14, 1, 73, 1], [14, 2, 76, 1],
  [15, 0, 74, 3],
];
// bass root + chord tones per bar
const WALTZ_CHORDS = [
  [38, [62, 65, 69]], [38, [62, 65, 69]], [43, [62, 67, 70]], [36, [60, 64, 67]],
  [41, [60, 65, 69]], [46, [62, 65, 70]], [43, [62, 67, 70]], [45, [61, 64, 67]],
  [38, [62, 65, 69]], [41, [60, 65, 69]], [43, [62, 67, 70]], [36, [60, 64, 67]],
  [41, [60, 65, 69]], [46, [62, 65, 70]], [45, [61, 64, 67]], [38, [62, 65, 69]],
];

export function createDayTrack(ctx, out) {
  const bus = makeSpace(ctx, out, { time: 0.375, feedback: 0.35, tone: 3000, wet: 0.4 });
  const events = [];
  WALTZ_MELODY.forEach(([bar, beat, m, d]) => events.push({ t: bar * 3 + beat, kind: 'mel', m, d }));
  WALTZ_CHORDS.forEach(([root, chord], bar) => {
    events.push({ t: bar * 3, kind: 'bass', m: root });
    events.push({ t: bar * 3 + 1, kind: 'chord', notes: chord });
    events.push({ t: bar * 3 + 2, kind: 'chord', notes: chord });
  });
  const seq = makeSequencer(ctx, {
    bpm: 112, loopBeats: 48, events,
    play(ev, t, spb, loop) {
      if (ev.kind === 'mel') {
        const oct = loop % 2 === 1 ? 12 : 0; // second pass sparkles an octave up
        const f = mtof(ev.m + oct);
        voice(ctx, bus, t, f, { peak: 0.16, release: 1.4 + ev.d * spb });
        voice(ctx, bus, t, f * 4, { peak: 0.025, release: 0.35 });
        voice(ctx, bus, t, f * 2, { type: 'triangle', peak: 0.03, release: 0.6 });
      } else if (ev.kind === 'bass') {
        voice(ctx, bus, t, mtof(ev.m), { type: 'triangle', peak: 0.17, attack: 0.01, release: 1.6 });
      } else {
        ev.notes.forEach((n) => voice(ctx, bus, t, mtof(n - 12), { type: 'sine', peak: 0.045, attack: 0.01, release: 0.45 }));
      }
    },
  });
  return seq;
}

/* -------------------------------------------------- Night: lo-fi loop --- */
const LOFI_CHORDS = [
  [41, [57, 60, 64, 65]], // Fmaj7
  [40, [55, 59, 62, 64]], // Em7
  [38, [57, 60, 62, 65]], // Dm7
  [36, [55, 59, 60, 64]], // Cmaj7
];
const PENTA = [72, 74, 76, 79, 81, 84];

export function createNightTrack(ctx, out) {
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1900;
  lp.Q.value = 0.4;
  lp.connect(out);
  const bus = makeSpace(ctx, lp, { time: 0.5, feedback: 0.28, tone: 1500, wet: 0.3 });

  // vinyl crackle bed
  const crackleBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const cd = crackleBuf.getChannelData(0);
  for (let i = 0; i < cd.length; i++) {
    cd[i] = (Math.random() < 0.0009 ? (Math.random() * 2 - 1) : 0) + (Math.random() * 2 - 1) * 0.006;
  }
  let crackle = null;
  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.35;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1200;
  crackleGain.connect(hp).connect(out);

  const events = [];
  const swing = (b) => b + 0.08; // push off-beats late
  LOFI_CHORDS.forEach(([root, chord], bar) => {
    const b = bar * 4;
    events.push({ t: b, kind: 'keys', notes: chord, v: 1 });
    events.push({ t: swing(b + 2.5), kind: 'keys', notes: chord, v: 0.55 });
    events.push({ t: b, kind: 'bass', m: root - 0, d: 2.4 });
    events.push({ t: swing(b + 2.5), kind: 'bass', m: root + 7, d: 1.2 });
    events.push({ t: b, kind: 'kick' });
    events.push({ t: swing(b + 2.5), kind: 'kick' });
    events.push({ t: b + 1, kind: 'snare' });
    events.push({ t: b + 3, kind: 'snare' });
    for (let i = 0; i < 8; i++) events.push({ t: i % 2 ? swing(b + i / 2) : b + i / 2, kind: 'hat', v: i % 2 ? 0.6 : 1 });
    if (bar % 2 === 0) {
      events.push({ t: b + 1.5, kind: 'lead', slot: bar });
      events.push({ t: swing(b + 3.5), kind: 'lead', slot: bar + 1 });
    }
  });

  const noise = getNoiseBuffer(ctx);
  const hit = (t, { type, f, q = 1, peak, dur }) => {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const fl = ctx.createBiquadFilter();
    fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(g).connect(lp);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  };

  const seq = makeSequencer(ctx, {
    bpm: 74, loopBeats: 16, events,
    play(ev, t, spb, loop) {
      switch (ev.kind) {
        case 'keys':
          ev.notes.forEach((n, i) => {
            const tt = t + i * 0.012; // slight strum
            voice(ctx, bus, tt, mtof(n), { peak: 0.06 * ev.v, attack: 0.01, release: 2.2, detune: -6 });
            voice(ctx, bus, tt, mtof(n), { peak: 0.04 * ev.v, attack: 0.01, release: 1.8, detune: 7 });
            voice(ctx, bus, tt, mtof(n) * 2, { peak: 0.01 * ev.v, attack: 0.005, release: 0.5 });
          });
          break;
        case 'bass':
          voice(ctx, lp, t, mtof(ev.m - 12), { peak: 0.22, attack: 0.02, release: ev.d * spb });
          break;
        case 'kick': {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.setValueAtTime(115, t);
          o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
          g.gain.setValueAtTime(0.45, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
          o.connect(g).connect(lp); o.start(t); o.stop(t + 0.35);
          break;
        }
        case 'snare':
          hit(t, { type: 'bandpass', f: 1700, q: 0.7, peak: 0.16, dur: 0.2 });
          break;
        case 'hat':
          hit(t, { type: 'highpass', f: 7000, peak: 0.035 * ev.v, dur: 0.045 });
          break;
        case 'lead': {
          // deterministic-but-wandering pentatonic noodle
          const n = PENTA[(ev.slot * 3 + loop * 2) % PENTA.length];
          voice(ctx, bus, t, mtof(n), { type: 'triangle', peak: 0.05, attack: 0.03, release: 1.6 });
          break;
        }
        default:
      }
    },
  });

  return {
    start() {
      crackle = ctx.createBufferSource();
      crackle.buffer = crackleBuf;
      crackle.loop = true;
      crackle.connect(crackleGain);
      crackle.start();
      seq.start();
    },
    stop() {
      seq.stop();
      try { crackle && crackle.stop(); } catch { /* already stopped */ }
      crackle = null;
    },
  };
}
