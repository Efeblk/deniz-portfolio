import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from './Modal.jsx';
import Icon from '../ui/Icon.jsx';
import { PROJECTS } from '../../data/projects.js';
import { SITE } from '../../data/site.js';
import { sfxPop } from '../../audio/engine.js';

const num = (i) => String(i + 1).padStart(2, '0');
const slugFromHash = () => (window.location.hash.match(/^#project\/([\w-]+)/) || [])[1] || null;
const clearHash = () => window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);

function ProjectList({ onOpen }) {
  return (
    <motion.div key="list" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
      <p className="modal-lede">Things I've built — tap one to read more.</p>
      <ol className="project-list">
        {PROJECTS.map((p, i) => (
          <motion.li key={p.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
            <button className="project" onClick={() => onOpen(p.slug)} aria-label={`${p.title} — open details`}>
              <span className="project-num">{num(i)}</span>
              <span className="project-body">
                <span className="project-kind">{p.kind}</span>
                <span className="project-title">{p.title}</span>
                <span className="project-summary">{p.summary}</span>
                <span className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</span>
              </span>
              <span className="project-go" aria-hidden="true"><Icon name="arrow" size={22} /></span>
            </button>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function ProjectDetail({ project, index, onBack }) {
  return (
    <motion.article key={project.slug} className="project-detail" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.25 }}>
      <button className="back-btn" onClick={onBack}><Icon name="back" size={18} /> All projects</button>

      <header className="detail-head">
        <span className="detail-num">{num(index)}</span>
        <div>
          <span className="project-kind">{project.kind}</span>
          <p className="detail-tagline">{project.tagline}</p>
        </div>
      </header>
      <div className="tags">{project.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>

      {project.sections.map((sec) => (
        <section key={sec.heading} className="detail-section">
          <h4>{sec.heading}</h4>
          {sec.body && <p>{sec.body}</p>}
          {sec.bullets && (
            <ul className="detail-points">
              {sec.bullets.map(([title, text]) => (
                <li key={title}><b>{title}</b><span>{text}</span></li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <nav className="detail-nav" aria-label="Other projects">
        {PROJECTS.filter((p) => p.slug !== project.slug).map((p) => (
          <a key={p.slug} href={`#project/${p.slug}`} className="tag">{p.title}</a>
        ))}
      </nav>
    </motion.article>
  );
}

// List ↔ detail "sub-pages" inside the tablet. Each project has its own URL
// (#project/<slug>) so it can be linked directly and the browser Back button
// returns to the list.
export default function ProjectsModal({ onClose }) {
  const [slug, setSlug] = useState(slugFromHash);
  const bodyRef = useRef(null);
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? PROJECTS[index] : null;

  useEffect(() => {
    const sync = () => setSlug(slugFromHash());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [slug]);

  const open = useCallback((s) => {
    sfxPop();
    window.history.pushState({ project: s }, '', `#project/${s}`);
    setSlug(s);
  }, []);

  const back = useCallback(() => {
    if (window.history.state?.project) window.history.back();
    else { clearHash(); setSlug(null); }
  }, []);

  const close = useCallback(() => {
    if (window.location.hash) clearHash();
    onClose();
  }, [onClose]);

  return (
    <Modal
      title={project ? project.title : 'Projects'}
      variant="tablet"
      onClose={close}
      onEscape={project ? back : close}
      bodyRef={bodyRef}
      footer={
        <>
          {project?.repo && <a className="chunky-btn" href={project.repo} target="_blank" rel="noreferrer"><Icon name="code" size={18} /> View code</a>}
          <a className="chunky-btn" href={SITE.github} target="_blank" rel="noreferrer"><Icon name="github" size={18} /> GitHub</a>
          <a className="chunky-btn primary" href={SITE.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={18} /> LinkedIn</a>
        </>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {project ? <ProjectDetail key={project.slug} project={project} index={index} onBack={back} /> : <ProjectList key="list" onOpen={open} />}
      </AnimatePresence>
    </Modal>
  );
}
