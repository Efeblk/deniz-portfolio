// Shared Web Audio context + small synthesized sound effects.
// Everything here is generated in code, so the site works with zero audio assets.

let ctx = null;
let master = null;
let sfxBus = null;
let noise = null;

export function getAudio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.8;
    sfxBus.connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return { ctx, master, sfxBus };
}

export function getNoiseBuffer(c) {
  if (noise && noise.sampleRate === c.sampleRate) return noise;
  const len = c.sampleRate * 2;
  noise = c.createBuffer(1, len, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const rand = (a, b) => a + Math.random() * (b - a);

function env(gainNode, t, peak, attack, release) {
  const g = gainNode.gain;
  g.cancelScheduledValues(t);
  g.setValueAtTime(0.0001, t);
  g.linearRampToValueAtTime(peak, t + attack);
  g.exponentialRampToValueAtTime(0.0001, t + attack + release);
}

function noiseBurst(c, out, t, { dur = 0.3, type = 'bandpass', f0 = 1000, f1 = f0, q = 1, peak = 0.3, attack = 0.01 }) {
  const src = c.createBufferSource();
  src.buffer = getNoiseBuffer(c);
  const filt = c.createBiquadFilter();
  filt.type = type;
  filt.Q.value = q;
  filt.frequency.setValueAtTime(f0, t);
  filt.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = c.createGain();
  env(g, t, peak, attack, dur);
  src.connect(filt).connect(g).connect(out);
  src.start(t, Math.random());
  src.stop(t + attack + dur + 0.05);
  return g;
}

function ping(c, out, t, freq, { peak = 0.2, release = 0.25, type = 'sine' } = {}) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  const g = c.createGain();
  env(g, t, peak, 0.002, release);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + release + 0.05);
}

/* ---------------------------------------------------------------- SFX --- */

export function sfxIceClink(delay = 0) {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t0 = c.currentTime + delay;
  const hits = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < hits; i++) {
    const t = t0 + i * rand(0.04, 0.09);
    const f = rand(2300, 4200);
    ping(c, out, t, f, { peak: rand(0.08, 0.16), release: rand(0.12, 0.3) });
    ping(c, out, t, f * 2.71, { peak: 0.03, release: 0.08 });
  }
}

export function sfxSip() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  // slurp: band-passed noise, amplitude-wobbled for bubbles
  const g = noiseBurst(c, out, t, { dur: 0.42, f0: 1400, f1: 380, q: 3.5, peak: 0.35, attack: 0.04 });
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 26;
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain).connect(g.gain);
  lfo.start(t);
  lfo.stop(t + 0.5);
  sfxIceClink(0.32);
}

export function sfxPour() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  noiseBurst(c, out, t, { dur: 0.9, f0: 500, f1: 1600, q: 2, peak: 0.22, attack: 0.08 });
  sfxIceClink(0.15);
  sfxIceClink(0.55);
}

export function sfxPaper() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  for (let i = 0; i < 4; i++) {
    noiseBurst(c, out, t + i * rand(0.035, 0.07), {
      dur: rand(0.04, 0.09), type: 'highpass', f0: rand(2500, 5000), q: 0.7, peak: rand(0.08, 0.16), attack: 0.004,
    });
  }
}

export function sfxThump() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.12);
  const g = c.createGain();
  env(g, t, 0.3, 0.004, 0.16);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.25);
  sfxPaper();
}

export function sfxLantern() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  ping(c, out, t, 1320, { peak: 0.08, release: 0.5, type: 'triangle' });
  ping(c, out, t + 0.06, 1980, { peak: 0.05, release: 0.7 });
  noiseBurst(c, out, t, { dur: 0.05, type: 'highpass', f0: 3000, peak: 0.1, attack: 0.002 });
}

export function sfxWhoosh() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  noiseBurst(c, out, c.currentTime, { dur: 0.22, f0: 600, f1: 3200, q: 1.2, peak: 0.18, attack: 0.03 });
}

export function sfxPop() {
  const a = getAudio();
  if (!a) return;
  const { ctx: c, sfxBus: out } = a;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.frequency.setValueAtTime(520, t);
  o.frequency.exponentialRampToValueAtTime(980, t + 0.07);
  const g = c.createGain();
  env(g, t, 0.12, 0.004, 0.1);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.2);
}
