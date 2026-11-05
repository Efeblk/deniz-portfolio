import Modal from './Modal.jsx';
import Icon from '../ui/Icon.jsx';
import { CV } from '../../data/cv.js';
import { SITE } from '../../data/site.js';

// Uses the real PDF from /public/cv if present; otherwise prints this sheet
// (the browser's "Save as PDF" gives the visitor a clean copy).
async function downloadCv() {
  try {
    const res = await fetch(SITE.cvPdf, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    if (res.ok && type.includes('pdf')) {
      const a = document.createElement('a');
      a.href = SITE.cvPdf;
      a.download = SITE.cvPdf.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
  } catch { /* fall through to print */ }
  window.print();
}

export default function CVModal({ onClose }) {
  return (
    <Modal
      title="Curriculum Vitae"
      variant="paper"
      onClose={onClose}
      footer={
        <>
          <a className="chunky-btn" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <button className="chunky-btn primary" onClick={downloadCv}><Icon name="download" size={18} /> Download PDF</button>
        </>
      }
    >
      <div className="cv">
        <div className="cv-top">
          <div>
            <h3 className="cv-name">{SITE.name}</h3>
            <p className="cv-headline">{[CV.headline, CV.location].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="cv-links">
            <a href={SITE.github} target="_blank" rel="noreferrer">github.com/{SITE.githubUser}</a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/elif-deniz-golboyu</a>
          </div>
        </div>
        <p className="cv-summary">{CV.summary}</p>

        <h4>Experience</h4>
        {CV.experience.map((e) => (
          <div key={e.role + e.org} className="cv-item">
            <div className="cv-row"><b>{e.role}</b> — {e.org}{e.period && <span className="cv-period">{e.period}</span>}</div>
            {e.points.length > 0 && <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
          </div>
        ))}

        <h4>Education</h4>
        {CV.education.map((e) => (
          <div key={e.degree} className="cv-item">
            <div className="cv-row"><b>{e.degree}</b> — {e.org}{e.period && <span className="cv-period">{e.period}</span>}</div>
            {e.note && <p className="cv-note">{e.note}</p>}
          </div>
        ))}

        <h4>Skills</h4>
        <div className="cv-skills">
          {Object.entries(CV.skills).map(([group, items]) => (
            <div key={group}><b>{group}</b><div className="tags">{items.map((s) => <span key={s} className="tag">{s}</span>)}</div></div>
          ))}
        </div>

        {CV.languages.length > 0 && (
          <>
            <h4>Languages</h4>
            <p>{CV.languages.join(' · ')}</p>
          </>
        )}
      </div>
    </Modal>
  );
}
