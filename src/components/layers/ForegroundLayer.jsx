import { memo } from 'react';
import LayerSvg from './LayerSvg.jsx';
import { C } from '../scene/palette.js';
import { scallop, tuft, scatter, LEAF } from '../scene/shapes.js';

const Bush = ({ blobs, seed }) => (
  <g stroke={C.ink} strokeWidth="3" strokeLinejoin="round">
    {blobs.map(([x, y, rx, ry], i) => <path key={`d${i}`} d={scallop(x, y, rx, ry, 10, seed + i)} fill={C.leafDark} />)}
    {blobs.map(([x, y, rx, ry], i) => (
      <path key={`m${i}`} d={scallop(x - rx * 0.12, y - ry * 0.14, rx * 0.8, ry * 0.72, 9, seed + 20 + i)} fill={C.leafMid} stroke="none" />
    ))}
    {blobs.map(([x, y, rx, ry], i) => (
      <path key={`l${i}`} d={scallop(x - rx * 0.3, y - ry * 0.38, rx * 0.42, ry * 0.34, 7, seed + 40 + i)} fill={C.leafLight} stroke="none" />
    ))}
    {scatter(14, blobs[0][0] - 120, blobs[0][1] - 120, blobs[0][0] + 120, blobs[0][1] + 40, seed).map((p, i) => (
      <path key={`f${i}`} d={LEAF} transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.s * 0.7})`} fill={C.leafHi} stroke="none" />
    ))}
  </g>
);

function ForegroundLayer() {
  return (
    <LayerSvg>
      <Bush seed={300} blobs={[[-30, 900, 190, 130], [130, 960, 150, 100], [-120, 780, 120, 110]]} />
      <Bush seed={400} blobs={[[1640, 860, 200, 150], [1480, 960, 170, 100], [1720, 720, 120, 120]]} />
      {[[300, 905, 120, 70, 1, -0.3], [520, 915, 90, 50, 2, 0.2], [1240, 910, 120, 64, 3, 0.3], [760, 925, 70, 40, 4, 0]].map(([x, y, w, h, s, lean]) => (
        <path key={s} d={tuft(x, y, w, h, 8, s + 70, lean)} fill={C.grassDeep} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </LayerSvg>
  );
}

export default memo(ForegroundLayer);
