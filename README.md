# Elif Deniz Gölboyu — interactive portfolio

A 2.5D, cel-shaded scene: a girl reading *The Count of Monte Cristo* on a bench
under a big tree, with a cat, a lantern and an iced latte. Everything on the bench
is the navigation.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
```

## Interactions

| Object           | Action                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| Tablet           | Projects list → click a row for its detail page (`#project/<slug>`, Back button works) |
| Papers           | CV modal + **Download PDF** (falls back to print-to-PDF)                      |
| Notebook         | Contact form, pre-filled, to elifdenizgolboyu@gmail.com                       |
| Headphones       | Play/pause `public/howls_moving_castle.mp3`; notes float only while audio is actually playing |
| Iced latte       | Sip sound + ice clink; 4 sips until empty, then refill                        |
| Ball of yarn     | Drag, throw or tap it — it bounces and rolls; the cat chases and bats it      |
| Cat              | Watches the cursor (or the yarn while playing); click for hearts; wiggle the mouse → paw swipe |
| Lantern          | Day ↔ night: dark shade, fireflies replace leaves, tablet lights her face, music crossfades to lo-fi |

Clicking the tablet, papers, notebook or latte makes her glance at it first.
All of them are keyboard-accessible (Tab + Enter) and also listed in the ☰ guide.

## Make it yours

- `src/data/site.js` — name, links, email, music paths
- `src/data/projects.js` — curated projects
- `src/data/cv.js` — CV content
- `public/cv/Elif_Deniz_Golboyu_CV.pdf` — your PDF
- `public/howls_moving_castle.mp3` — the headphones track (not committed; add it yourself). Night mode plays the same file through a lo-fi filter; settings in `MUSIC` in `src/data/site.js`. If the file is missing, an original synth tune plays.
- `.env` → `VITE_FORMSPREE_ENDPOINT=…` to send the form without opening a mail app
- `ASSETS.md` — how to replace the SVG drawings with painted layers

## Structure

```
src/
  App.jsx                    providers, modals, intro
  context/SceneContext.jsx   night / music / modal / tooltip state
  hooks/                     stage fit, pointer + tilt, shake detector, yarn + cat physics
  audio/                     Web Audio engine (SFX), synth fallback tracks, music player (file + lo-fi night chain)
  components/
    Stage.jsx                parallax planes + night shade + lights
    layers/                  Sky, Far, Ground, Main, Foreground, Lights (all 1600×900)
    scene/                   Tree, Bench, Crate, Girl, Tablet, Papers, Notebook, IcedLatte, Cat, Yarn, Lantern, MusicNotes
    effects/                 FallingLeaves, Fireflies (CSS-only)
    modals/                  Modal shell + Projects / CV / Contact
    ui/                      Hotspot, Hud, Tooltip, Intro, Icon
```
