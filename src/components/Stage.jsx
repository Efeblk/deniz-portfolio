import { AnimatePresence, motion, useTransform } from 'framer-motion';
import { useStageFit, STAGE_W, STAGE_H } from '../hooks/useStageFit.js';
import { usePointer } from '../hooks/usePointer.js';
import { useScene } from '../context/SceneContext.jsx';
import SkyLayer from './layers/SkyLayer.jsx';
import FarLayer from './layers/FarLayer.jsx';
import GroundLayer from './layers/GroundLayer.jsx';
import MainLayer from './layers/MainLayer.jsx';
import ForegroundLayer from './layers/ForegroundLayer.jsx';
import LightsLayer from './layers/LightsLayer.jsx';
import FallingLeaves from './effects/FallingLeaves.jsx';
import Fireflies from './effects/Fireflies.jsx';

const AMP_X = 34;
const AMP_Y = 14;

function Parallax({ depth, pointer, children, className = '' }) {
  const x = useTransform(pointer.nx, (v) => -v * AMP_X * depth);
  const y = useTransform(pointer.ny, (v) => -v * AMP_Y * depth);
  return (
    <motion.div className={`plane ${className}`} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

// 2.5D stage: depth-sorted planes that slide at different rates with the
// cursor (or device tilt), all sharing one 1600×900 coordinate system.
export default function Stage() {
  const { scale, left, top } = useStageFit();
  const pointer = usePointer();
  const { night } = useScene();

  return (
    <div className="viewport no-print">
      <div className="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(${left}px, ${top}px) scale(${scale})` }}>
        <Parallax depth={0.06} pointer={pointer}><SkyLayer /></Parallax>
        <Parallax depth={0.18} pointer={pointer}><FarLayer /></Parallax>
        <Parallax depth={0.32} pointer={pointer}><GroundLayer /></Parallax>
        <Parallax depth={0.55} pointer={pointer}>
          <MainLayer pointer={pointer} />
          <AnimatePresence>
            {!night && (
              <motion.div key="leaves" className="fx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
                <FallingLeaves />
              </motion.div>
            )}
          </AnimatePresence>
        </Parallax>
        <Parallax depth={0.95} pointer={pointer}><ForegroundLayer /></Parallax>

        {/* night: multiply shade, then additive lights + fireflies on top */}
        <div className={`night-shade ${night ? 'on' : ''}`} />
        <Parallax depth={0.55} pointer={pointer} className={`lights ${night ? 'on' : ''}`}>
          <LightsLayer />
          <AnimatePresence>
            {night && (
              <motion.div key="flies" className="fx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
                <Fireflies />
              </motion.div>
            )}
          </AnimatePresence>
        </Parallax>
      </div>
      <div className="vignette" />
      <div className="grain" />
    </div>
  );
}
