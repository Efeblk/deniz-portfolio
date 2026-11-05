// Two-deck music player (day / night) with crossfades.
// Each deck prefers the audio file from /public/audio and falls back to the
// procedural synth track if the file is missing or fails to load.
import { getAudio } from './engine.js';
import { createDayTrack, createNightTrack } from './synthTracks.js';
import { MUSIC } from '../data/site.js';

const FADE = 1.6;
const VOLUME = 0.55;

async function fileExists(src) {
  try {
    const res = await fetch(src, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    return res.ok && !type.includes('text/html'); // SPA fallbacks return index.html
  } catch {
    return false;
  }
}

class Deck {
  constructor(mode) {
    this.mode = mode;
    this.gain = null;
    this.el = null;
    this.synth = null;
    this.source = 'none';
    this.ready = null;
  }

  async init() {
    if (this.ready) return this.ready;
    this.ready = (async () => {
      const a = getAudio();
      if (!a) return;
      const { ctx, master } = a;
      this.gain = ctx.createGain();
      this.gain.gain.value = 0;
      this.gain.connect(master);
      const { src } = MUSIC[this.mode];
      if (await fileExists(src)) {
        const el = new Audio(src);
        el.loop = true;
        el.preload = 'auto';
        el.crossOrigin = 'anonymous';
        ctx.createMediaElementSource(el).connect(this.gain);
        this.el = el;
        this.source = 'file';
      } else {
        this.synth = this.mode === 'day' ? createDayTrack(ctx, this.gain) : createNightTrack(ctx, this.gain);
        this.source = 'synth';
      }
    })();
    return this.ready;
  }

  async fadeIn() {
    await this.init();
    const a = getAudio();
    if (!a || !this.gain) return;
    const { ctx } = a;
    clearTimeout(this.stopTimer);
    if (this.el) {
      try { await this.el.play(); } catch { /* autoplay blocked until gesture */ }
    } else if (this.synth && !this.synthRunning) {
      this.synth.start();
      this.synthRunning = true;
    }
    const g = this.gain.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(VOLUME, ctx.currentTime + FADE);
  }

  fadeOut() {
    const a = getAudio();
    if (!a || !this.gain) return;
    const { ctx } = a;
    const g = this.gain.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + FADE);
    clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      if (this.el) this.el.pause();
      if (this.synth && this.synthRunning) { this.synth.stop(); this.synthRunning = false; }
    }, FADE * 1000 + 100);
  }
}

export class MusicPlayer {
  constructor() {
    this.decks = { day: new Deck('day'), night: new Deck('night') };
    this.mode = 'day';
    this.playing = false;
  }

  play(mode = this.mode) {
    this.mode = mode;
    this.playing = true;
    this.decks[mode].fadeIn();
    this.decks[mode === 'day' ? 'night' : 'day'].fadeOut();
  }

  pause() {
    this.playing = false;
    this.decks.day.fadeOut();
    this.decks.night.fadeOut();
  }

  setMode(mode) {
    if (mode === this.mode) return;
    this.mode = mode;
    if (this.playing) this.play(mode);
  }
}

export const music = new MusicPlayer();
