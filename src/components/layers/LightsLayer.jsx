import { memo } from 'react';
import LayerSvg from './LayerSvg.jsx';

// Additive light pools that sit *above* the night shade (mix-blend: screen).
// The tablet's cool glow lifts her face out of the dark; the lantern pools warm light.
function LightsLayer() {
  return (
    <LayerSvg className="lights-layer">
      <defs>
        <radialGradient id="glow-lantern">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ffb054" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-tablet">
          <stop offset="0" stopColor="#c8f0ff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#7fc8ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5aa8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-face">
          <stop offset="0" stopColor="#d4efff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#9fd6ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#bfe7ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="1015" cy="380" r="300" fill="url(#glow-lantern)" className="flicker" />
      <ellipse cx="930" cy="600" rx="150" ry="120" fill="url(#glow-tablet)" />
      <ellipse cx="808" cy="430" rx="95" ry="90" fill="url(#glow-face)" />
      <ellipse cx="858" cy="500" rx="110" ry="80" fill="url(#glow-tablet)" opacity="0.55" />
    </LayerSvg>
  );
}

export default memo(LightsLayer);
