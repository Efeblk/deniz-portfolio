import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { music } from '../audio/MusicPlayer.js';
import { getAudio, sfxLantern } from '../audio/engine.js';

const SceneContext = createContext(null);

// Where each prop sits on the 1600×900 stage. The girl's eyes glance here
// when the prop is clicked.
export const PROP_POS = {
  tablet: { x: 930, y: 602 },
  papers: { x: 1040, y: 598 },
  notebook: { x: 1172, y: 694 },
  latte: { x: 1238, y: 640 },
};
const GLANCE_MS = 1300;
const OPEN_DELAY_MS = 380; // let the glance read before the modal covers the scene

const initialHashProject = () => {
  const m = typeof window !== 'undefined' && window.location.hash.match(/^#project\/([\w-]+)/);
  return m ? m[1] : null;
};

export function SceneProvider({ children }) {
  const [night, setNight] = useState(false);
  const [musicState, setMusicState] = useState(music.state);
  const [modal, setModal] = useState(() => (initialHashProject() ? 'projects' : null));
  const [hint, setHint] = useState(null);
  const [entered, setEntered] = useState(false);
  const [gaze, setGaze] = useState(null); // { x, y, id } on the stage, or null
  const gazeTimer = useRef(null);
  const openTimer = useRef(null);

  useEffect(() => {
    music.prepare();
    return music.subscribe(setMusicState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = night ? 'night' : 'day';
    music.setMode(night ? 'night' : 'day');
  }, [night]);

  const toggleNight = useCallback(() => {
    sfxLantern();
    setHint(null);
    setNight((n) => !n);
  }, []);

  const toggleMusic = useCallback(() => {
    getAudio();
    music.toggle();
  }, []);

  const glanceAt = useCallback((prop) => {
    const pos = PROP_POS[prop];
    if (!pos) return;
    clearTimeout(gazeTimer.current);
    setGaze({ ...pos, id: Date.now() });
    gazeTimer.current = setTimeout(() => setGaze(null), GLANCE_MS);
  }, []);

  /** Click on a prop: she glances at it, then its modal opens. */
  const activateProp = useCallback((prop, modalName) => {
    glanceAt(prop);
    if (!modalName) return;
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setModal(modalName), OPEN_DELAY_MS);
  }, [glanceAt]);

  const enter = useCallback((withMusic) => {
    getAudio(); // unlock audio on the first gesture
    setEntered(true);
    if (withMusic) music.play();
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const musicOn = musicState.status === 'playing' || musicState.status === 'loading';

  const value = useMemo(
    () => ({
      night, toggleNight,
      musicOn, musicPlaying: musicState.status === 'playing', musicState, toggleMusic,
      modal, openModal: setModal, closeModal,
      hint, setHint,
      entered, enter,
      gaze, glanceAt, activateProp,
    }),
    [night, toggleNight, musicOn, musicState, toggleMusic, modal, closeModal, hint, entered, enter, gaze, glanceAt, activateProp]
  );
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export const useScene = () => useContext(SceneContext);
