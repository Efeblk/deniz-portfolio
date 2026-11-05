import { motion } from 'framer-motion';
import Modal from './Modal.jsx';
import Icon from '../ui/Icon.jsx';
import { PROJECTS } from '../../data/projects.js';
import { SITE } from '../../data/site.js';
import { useGithubRepos } from '../../hooks/useGithubRepos.js';

export default function ProjectsModal({ onClose }) {
  const { repos, status } = useGithubRepos(SITE.githubUser, true);
  const curatedUrls = new Set(PROJECTS.map((p) => p.repo));
  const list = [
    ...PROJECTS.filter((p) => p.featured),
    ...PROJECTS.filter((p) => !p.featured),
    ...repos.filter((r) => !curatedUrls.has(r.repo)),
  ];

  return (
    <Modal
      title="Projects"
      variant="tablet"
      onClose={onClose}
      footer={
        <>
          <a className="chunky-btn" href={SITE.github} target="_blank" rel="noreferrer"><Icon name="github" size={18} /> GitHub</a>
          <a className="chunky-btn primary" href={SITE.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={18} /> LinkedIn</a>
        </>
      }
    >
      <p className="modal-lede">
        Things I've built. {status === 'loading' && <span className="muted">Fetching more from GitHub…</span>}
      </p>
      <ol className="project-list">
        {list.map((p, i) => (
          <motion.li
            key={p.repo + p.title}
            className="project"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.05 }}
          >
            <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="project-body">
              <h3>{p.title}{p.stars > 0 && <span className="stars"><Icon name="star" size={13} /> {p.stars}</span>}</h3>
              <p>{p.description}</p>
              <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div className="project-links">
              <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`}><Icon name="github" size={18} /></a>
              {p.homepage && <a href={p.homepage} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`}><Icon name="external" size={18} /></a>}
            </div>
          </motion.li>
        ))}
      </ol>
    </Modal>
  );
}
