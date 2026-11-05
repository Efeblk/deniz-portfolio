import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { useScene } from '../../context/SceneContext.jsx';
import { SITE } from '../../data/site.js';

function SquareBtn({ icon, label, onClick, active }) {
  return (
    <motion.button
      className={`sq-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      whileHover={{ y: -2 }}
      whileTap={{ y: 2, boxShadow: '0 0 0 var(--ink)' }}
    >
      <Icon name={icon} />
    </motion.button>
  );
}

const GUIDE = [
  ['tablet', 'Tablet', 'Projects', 'projects'],
  ['paper', 'Papers', 'CV', 'cv'],
  ['pen', 'Notebook', 'Contact', 'contact'],
];

// Corner UI in the style of the reference shots: chunky white squares
// with an ink outline and a hard offset shadow.
export default function Hud() {
  const { night, toggleNight, musicOn, toggleMusic, openModal } = useScene();
  const [open, setOpen] = useState(false);

  return (
    <div className="hud no-print">
      <div className="name-tag">
        <span className="name">{SITE.shortName}</span>
        <span className="role">{SITE.role}</span>
      </div>

      <div className="hud-top">
        <SquareBtn icon={open ? 'close' : 'menu'} label={open ? 'Close guide' : 'Open guide'} onClick={() => setOpen((o) => !o)} active={open} />
        <AnimatePresence>
          {open && (
            <motion.nav
              className="guide"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            >
              <p className="guide-title">Everything on the bench is clickable</p>
              {GUIDE.map(([icon, obj, what, modal]) => (
                <button key={modal} className="guide-row" onClick={() => { setOpen(false); openModal(modal); }}>
                  <Icon name={icon} size={18} /> <b>{obj}</b> <span>{what}</span>
                </button>
              ))}
              <button className="guide-row" onClick={toggleMusic}><Icon name="note" size={18} /> <b>Headphones</b> <span>{musicOn ? 'Pause' : 'Play'} music</span></button>
              <button className="guide-row" onClick={toggleNight}><Icon name={night ? 'sun' : 'moon'} size={18} /> <b>Lantern</b> <span>{night ? 'Day' : 'Night'} mode</span></button>
              <p className="guide-foot">The latte has 4 sips. The cat watches your cursor — wiggle it fast.</p>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <div className="hud-bottom">
        <SquareBtn icon={musicOn ? 'note' : 'mute'} label={musicOn ? 'Pause music' : 'Play music'} onClick={toggleMusic} active={musicOn} />
        <SquareBtn icon={night ? 'sun' : 'moon'} label={night ? 'Switch to day' : 'Switch to night'} onClick={toggleNight} active={night} />
      </div>
    </div>
  );
}
