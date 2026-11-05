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
import Lantern from '../scene/Lantern.jsx';
import MusicNotes from '../scene/MusicNotes.jsx';
import { useScene } from '../../context/SceneContext.jsx';

// The "hero" depth plane: tree, bench, girl and every interactive prop.
// Paint order matters: back → front.
export default function MainLayer({ pointer }) {
  const { musicOn, toggleMusic } = useScene();
  return (
    <LayerSvg className="main-layer">
      <Tree />
      <Bench />
      <Crate />
      <Papers />
      <Girl onHeadphones={toggleMusic} />
      <Tablet />
      <Notebook />
      <IcedLatte />
      <Cat pointer={pointer} />
      <Lantern />
      <MusicNotes active={musicOn} x={800} y={404} />
    </LayerSvg>
  );
}
