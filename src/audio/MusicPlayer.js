// Headphones music player.
//
//   /public/howls_moving_castle.mp3 ──► <audio> ──► MediaElementSource
//                                             ├─► dry gain ───────────────┐
//                                             └─► low-pass ─► wet gain ───┤─► music gain ─► master
//                                     vinyl crackle loop ─► crackle gain ─┘
//
// Day = dry mix. Night = lo-fi mix (filtered, slower "tape" speed, crackle),
// crossfaded on the same element so the song continues seamlessly.
// If the file is missing or fails to decode, the original synth tracks play.
//
// State is published to subscribers: { status, mode, source, notice }
//   status: 'idle' | 'loading' | 'playing' | 'paused' | 'error'
// 'playing' is only set from the media element's own `playing` event, so the
// UI (floating notes, button states) reflects what is actually audible.
import { getAudio, getNoiseBuffer } from './engine.js';
import { createDayTrack, createNightTrack } from './synthTracks.js';
import { MUSIC } from '../data/site.js';

const FADE = 1.2;

async function fileExists(src) {
  try {
    const res = await fetch(src, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    return res.ok && !type.includes('text/html'); // SPA hosts answer 404s with index.html
  } catch {
    return false;
  }
}

function makeCrackleBuffer(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() < 0.0012 ? Math.random() * 2 - 1 : 0) + (Math.random() * 2 - 1) * 0.004;
  }
  return buf;
}

export class MusicPlayer {
  constructor() {
    this.state = { status: 'idle', mode: 'day', source: null, notice: null };
    this.listeners = new Set();
    this.wantPlaying = false;
    this.el = null;
    this.graph = null;
    this.synth = null;
    this.prepared = null;
    this.pauseTimer = null;
    this.rateTimer = null;
  }

  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  set(patch) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  /** Called on page load: checks the file and starts buffering it (no sound). */
  prepare() {
    if (this.prepared) return this.prepared;
    this.prepared = (async () => {
      if (await fileExists(MUSIC.src)) {
        const el = new Audio();
        el.src = MUSIC.src;
        el.loop = true;
        el.preload = 'auto';
        el.preservesPitch = false; // let the night "tape slow-down" lower the pitch too
        el.mozPreservesPitch = false;
        el.webkitPreservesPitch = false;
        el.addEventListener('playing', () => this.wantPlaying && this.set({ status: 'playing' }));
        el.addEventListener('waiting', () => this.wantPlaying && this.set({ status: 'loading' }));
        el.addEventListener('pause', () => !this.wantPlaying && this.set({ status: 'paused' }));
        el.addEventListener('error', () => this.fallBackToSynth('Could not decode the music file — playing the built-in tune.'));
        this.el = el;
        this.set({ source: 'file' });
      } else {
        this.set({ source: 'synth' });
      }
    })();
    return this.prepared;
  }

  /** Builds the Web Audio graph. Must run inside a user gesture (first play). */
  ensureGraph() {
    if (this.graph) return this.graph;
    const a = getAudio();
    if (!a) return null;
    const { ctx, master } = a;
    const music = ctx.createGain();
    music.gain.value = 0;
    music.connect(master);
    const graph = { ctx, music };

    if (this.el) {
      const src = ctx.createMediaElementSource(this.el);
      const dry = ctx.createGain();
      const wet = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      const warm = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = MUSIC.night.lowpassHz;
      lp.Q.value = 0.8;
      warm.type = 'peaking';
      warm.frequency.value = 220;
      warm.gain.value = 4;
      src.connect(dry).connect(music);
      src.connect(lp).connect(warm).connect(wet).connect(music);

      const crackle = ctx.createBufferSource();
      crackle.buffer = makeCrackleBuffer(ctx);
      crackle.loop = true;
      const crackleGain = ctx.createGain();
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1000;
      crackle.connect(hp).connect(crackleGain).connect(music);
      crackle.start();
      getNoiseBuffer(ctx);

      Object.assign(graph, { dry, wet, crackleGain });
    }
    this.graph = graph;
    if (this.el) this.applyMode(true);
    return graph;
  }

  applyMode(instant = false) {
    const g = this.graph;
    if (!g || !g.dry) return;
    const night = this.state.mode === 'night';
    const t = g.ctx.currentTime;
    const ramp = (param, v) => {
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      if (instant) param.setValueAtTime(v, t);
      else param.linearRampToValueAtTime(v, t + FADE * 1.5);
    };
    ramp(g.dry.gain, night ? 0 : 1);
    ramp(g.wet.gain, night ? 1.25 : 0);
    ramp(g.crackleGain.gain, night ? MUSIC.night.crackle : 0);

    // glide the playback rate like a turntable slowing down / speeding up
    clearInterval(this.rateTimer);
    const target = night ? MUSIC.night.playbackRate : 1;
    if (instant) { this.el.playbackRate = target; return; }
    const start = this.el.playbackRate;
    let i = 0;
    this.rateTimer = setInterval(() => {
      i += 1;
      this.el.playbackRate = start + (target - start) * (i / 20);
      if (i >= 20) clearInterval(this.rateTimer);
    }, 60);
  }

  fadeMusic(to) {
    const g = this.graph;
    if (!g) return;
    const t = g.ctx.currentTime;
    g.music.gain.cancelScheduledValues(t);
    g.music.gain.setValueAtTime(g.music.gain.value, t);
    g.music.gain.linearRampToValueAtTime(to, t + FADE);
  }

  play() {
    this.wantPlaying = true;
    clearTimeout(this.pauseTimer);
    this.set({ status: 'loading', notice: null });
    if (!this.prepared) this.prepare();

    // Fast path: the file check finished during page load, so we can start
    // playback synchronously inside the click handler (required by Safari).
    if (this.state.source) return this.startNow();
    this.prepared.then(() => this.wantPlaying && this.startNow());
  }

  startNow() {
    const g = this.ensureGraph();
    if (!g) { this.set({ status: 'error', notice: 'Web Audio is not supported in this browser.' }); return; }
    this.fadeMusic(MUSIC.volume);
    if (this.state.source === 'file' && this.el) {
      this.el.play().catch((err) => {
        if (err?.name === 'NotAllowedError') {
          this.wantPlaying = false;
          this.set({ status: 'paused', notice: 'Tap the headphones again to start the music.' });
        } else {
          this.fallBackToSynth('Could not play the music file — playing the built-in tune.');
        }
      });
    } else {
      this.startSynth();
    }
  }

  startSynth() {
    const g = this.ensureGraph();
    if (!g) return;
    if (!this.synth) {
      const day = g.ctx.createGain();
      const night = g.ctx.createGain();
      day.connect(g.music);
      night.connect(g.music);
      this.synth = { day: { gain: day, track: createDayTrack(g.ctx, day) }, night: { gain: night, track: createNightTrack(g.ctx, night) }, running: null };
    }
    this.switchSynth();
    this.set({ status: 'playing' });
  }

  switchSynth() {
    const s = this.synth;
    if (!s) return;
    const mode = this.state.mode;
    const other = mode === 'day' ? 'night' : 'day';
    const t = this.graph.ctx.currentTime;
    if (s.running !== mode) {
      s[mode].track.start();
      s[mode].gain.gain.setValueAtTime(0, t);
      s[mode].gain.gain.linearRampToValueAtTime(1, t + FADE);
      if (s.running === other) {
        s[other].gain.gain.linearRampToValueAtTime(0, t + FADE);
        const old = s[other].track;
        setTimeout(() => old.stop(), FADE * 1000 + 100);
      }
      s.running = mode;
    }
  }

  stopSynth() {
    const s = this.synth;
    if (!s || !s.running) return;
    s[s.running].track.stop();
    s.running = null;
  }

  fallBackToSynth(notice) {
    this.el?.pause();
    this.set({ source: 'synth', notice });
    if (this.wantPlaying) this.startSynth();
  }

  pause() {
    this.wantPlaying = false;
    this.set({ status: 'paused' });
    this.fadeMusic(0);
    clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => {
      if (this.wantPlaying) return;
      this.el?.pause(); // keeps currentTime, so the song resumes where it stopped
      this.stopSynth();
    }, FADE * 1000 + 50);
  }

  toggle() {
    if (this.wantPlaying) this.pause();
    else this.play();
  }

  setMode(mode) {
    if (mode === this.state.mode) return;
    this.set({ mode });
    if (this.state.source === 'file') this.applyMode();
    else if (this.wantPlaying) this.switchSynth();
  }

  clearNotice() {
    this.set({ notice: null });
  }
}

export const music = new MusicPlayer();
