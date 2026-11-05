import { useRef } from 'react';
import LayerSvg from './LayerSvg.jsx';
import Tree from '../scene/Tree.jsx';
import Bench from '../scene/Bench.jsx';
import Crate from '../scene/Crate.jsx';
import Girl from '../scene/Girl.jsx';
import Tablet from '../scene/Tablet.jsx';
import Papers from '../scene/Papers.jsx';
import Notebook from '../scene/Notebook.jsx';
import IcedLatte from '../scene/IcedLatte.jsx';
import Cat from '../scene/Cat.jsx';
import Yarn from '../scene/Yarn.jsx';
import Lantern from '../scene/Lantern.jsx';
import MusicNotes from '../scene/MusicNotes.jsx';
import { useScene } from '../../context/SceneContext.jsx';
import { useYarnPlay } from '../../hooks/useYarnPlay.js';

// The "hero" depth plane: tree, bench, girl and every interactive prop.
// Paint order matters: back → front.
export default function MainLayer({ pointer }) {
  const { musicPlaying, toggleMusic } = useScene();
  const svgRef = useRef(null);
  const play = useYarnPlay(svgRef);

  return (
    <LayerSvg className="main-layer" ref={svgRef}>
      <Tree />
      <Bench />
      <Crate />
      <Papers />
      <Girl onHeadphones={toggleMusic} />
      <Tablet />
      <Notebook />
      <IcedLatte />
      <Cat pointer={pointer} play={play} />
      <Lantern />
      <Yarn yarn={play.yarn} />
      <MusicNotes active={musicPlaying} x={800} y={404} />
    </LayerSvg>
  );
}
