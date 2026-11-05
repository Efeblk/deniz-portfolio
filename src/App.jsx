import { AnimatePresence, MotionConfig } from 'framer-motion';
import { SceneProvider, useScene } from './context/SceneContext.jsx';
import Stage from './components/Stage.jsx';
import Hud from './components/ui/Hud.jsx';
import Tooltip from './components/ui/Tooltip.jsx';
import Intro from './components/ui/Intro.jsx';
import ProjectsModal from './components/modals/ProjectsModal.jsx';
import CVModal from './components/modals/CVModal.jsx';
import ContactModal from './components/modals/ContactModal.jsx';

function Experience() {
  const { modal, closeModal, entered } = useScene();
  return (
    <main className="app">
      <Stage />
      <Hud />
      <Tooltip />
      <AnimatePresence>
        {modal === 'projects' && <ProjectsModal key="projects" onClose={closeModal} />}
        {modal === 'cv' && <CVModal key="cv" onClose={closeModal} />}
        {modal === 'contact' && <ContactModal key="contact" onClose={closeModal} />}
      </AnimatePresence>
      <AnimatePresence>{!entered && <Intro key="intro" />}</AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SceneProvider>
        <Experience />
      </SceneProvider>
    </MotionConfig>
  );
}
