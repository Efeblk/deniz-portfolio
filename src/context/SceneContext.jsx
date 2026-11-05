import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { music } from '../audio/MusicPlayer.js';
import { getAudio, sfxLantern } from '../audio/engine.js';

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [night, setNight] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [modal, setModal] = useState(null); // 'projects' | 'cv' | 'contact' | null
  const [hint, setHint] = useState(null); // label shown in the cursor tooltip
  const [entered, setEntered] = useState(false);

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
    setMusicOn((on) => {
      if (on) music.pause();
      else music.play(night ? 'night' : 'day');
      return !on;
    });
  }, [night]);

  const enter = useCallback((withMusic) => {
    getAudio(); // unlock audio on the first gesture
    setEntered(true);
    if (withMusic) {
      music.play('day');
      setMusicOn(true);
    }
  }, []);

  const value = useMemo(
    () => ({ night, toggleNight, musicOn, toggleMusic, modal, openModal: setModal, closeModal: () => setModal(null), hint, setHint, entered, enter }),
    [night, toggleNight, musicOn, toggleMusic, modal, hint, entered, enter]
  );
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export const useScene = () => useContext(SceneContext);
