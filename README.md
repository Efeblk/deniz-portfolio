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
| Tablet           | Projects modal (curated list + live public repos from GitHub), GitHub/LinkedIn |
| Papers           | CV modal + **Download PDF** (falls back to print-to-PDF)                      |
| Notebook         | Contact form, pre-filled, to elifdenizgolboyu@gmail.com                       |
| Headphones       | Play/pause music; floating notes; she bobs to the beat                        |
| Iced latte       | Sip sound + ice clink; 4 sips until empty, then refill                        |
| Cat              | Head & pupils follow the cursor; whip the mouse back and forth → paw swipe    |
| Lantern          | Day ↔ night: dark shade, fireflies replace leaves, tablet lights her face, music crossfades to lo-fi |

All of them are keyboard-accessible (Tab + Enter) and also listed in the ☰ guide.

## Make it yours

- `src/data/site.js` — name, links, email, music paths
- `src/data/projects.js` — curated projects
- `src/data/cv.js` — CV content
- `public/cv/Elif_Deniz_Golboyu_CV.pdf` — your PDF
- `public/audio/` — your licensed music (see README there)
- `.env` → `VITE_FORMSPREE_ENDPOINT=…` to send the form without opening a mail app
- `ASSETS.md` — how to replace the SVG drawings with painted layers

## Structure

```
src/
  App.jsx                    providers, modals, intro
  context/SceneContext.jsx   night / music / modal / tooltip state
  hooks/                     stage fit, pointer + tilt, shake detector, GitHub repos
  audio/                     Web Audio engine (SFX), synth fallback tracks, 2-deck music player
  components/
    Stage.jsx                parallax planes + night shade + lights
    layers/                  Sky, Far, Ground, Main, Foreground, Lights (all 1600×900)
    scene/                   Tree, Bench, Crate, Girl, Tablet, Papers, Notebook, IcedLatte, Cat, Lantern, MusicNotes
    effects/                 FallingLeaves, Fireflies (CSS-only)
    modals/                  Modal shell + Projects / CV / Contact
    ui/                      Hotspot, Hud, Tooltip, Intro, Icon
```
