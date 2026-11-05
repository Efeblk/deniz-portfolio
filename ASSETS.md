# Layered asset guide (2.5D)

The scene is drawn as code (SVG) so it works with zero image files, but every
layer is built so you can swap it for **painted art** later without touching logic.

## 1. One canvas, many planes

All layers share a **1600 × 900** stage (`src/hooks/useStageFit.js`). Export every
painted layer at that size (or 3200 × 1800 @2x) as a transparent PNG/WebP, so the
pixels line up with the existing hit-areas.

| Plane | Depth | File (suggested)          | Contents                                 |
| ----- | ----- | ------------------------- | ---------------------------------------- |
| 0     | 0.06  | `01-sky.webp`             | gradient + brush clouds (opaque)         |
| 1     | 0.18  | `02-far-town.webp`        | hills, town, water tower, poles          |
| 2     | 0.32  | `03-ground.webp`          | grass, path stones, flowers              |
| 3     | 0.55  | `04-main-static.webp`     | tree, bench, crate (non-interactive)     |
| 3     | 0.55  | `props/*.webp`            | **one file per interactive prop**        |
| 4     | 0.95  | `05-foreground.webp`      | bushes + grass framing the bottom        |
| fx    | —     | night shade (CSS) + `06-lights.webp` (screen blend) |

Paint ~150 px of **bleed** past every edge: planes slide up to ±32 px with
parallax, and narrow screens show extra sky/ground above/below the stage.

## 2. Interactive props = separate sprites

Anything that animates or is clickable must be its own image, positioned at its
stage coordinates, wrapped in `<Hotspot>` (`src/components/ui/Hotspot.jsx`):

```jsx
<Hotspot label="Tablet — Projects" onActivate={() => openModal('projects')}>
  <image href="/art/props/tablet.webp" x="880" y="556" width="104" height="92" />
</Hotspot>
```

Split these further into parts so code can move them:

- **girl/** `body`, `head`, `eyes-open`, `eyes-down`, `eyes-closed`, `headphones`, `hair-front`
- **cat/** `body`, `tail` (pivot at base), `head` (pivot at neck), `paw` (pivot at shoulder), `pupil`
- **latte/** `cup-back`, `liquid` (masked to cup), `ice-1..3`, `cup-front` (gloss + outline), `straw`
- **lantern/** `lantern-off`, `lantern-on`, `glow` (screen blend)

## 3. Painting the cel look

- One **ink colour** (`#22302f`) for all outlines, 3 px at 1×. Slightly wobbly lines.
- Exactly **two tones per material**: base + one hard-edged shadow (light from upper-left). No soft gradients except sky and glows.
- Foliage: dark silhouette → mid clusters → lit tops → small leaf "flecks" (see `Tree.jsx`).
- Palette lives in `src/components/scene/palette.js`; sample from it for paint-overs.
- Night is **not** a separate painting: a blue multiply shade + additive glows do it. Only paint lit windows / lantern-on as night variants.

## 4. Performance budget

- WebP, ≤ 400 KB per full layer, props ≤ 60 KB.
- `loading="eager"` for planes 0–3; preload the main plane.
- Keep animations to `transform`/`opacity` (already the case for leaves & fireflies).
