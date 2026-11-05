import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from './Modal.jsx';
import Icon from '../ui/Icon.jsx';
import { SITE } from '../../data/site.js';

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const DEFAULT_MESSAGE = `Hi Elif,

I came across your portfolio (and your cat) and would love to talk about a potential opportunity — a role / a project / a collaboration at [company].

Could we set up a quick call this week?

Best,
`;

// Sends via Formspree when VITE_FORMSPREE_ENDPOINT is set; otherwise opens
// the visitor's mail client pre-addressed to SITE.email.
export default function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Hello from your portfolio', message: DEFAULT_MESSAGE });
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const body = `${form.message}${form.name}\n${form.email}`;
    if (!ENDPOINT) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
      setState('sent');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _replyto: form.email, _subject: form.subject }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <Modal title="Say hi!" variant="notebook" onClose={onClose}>
      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div key="sent" className="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="plane" initial={{ x: -60, y: 30, rotate: -20 }} animate={{ x: 60, y: -30, rotate: 10 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
              <Icon name="send" size={54} />
            </motion.div>
            <p className="hand big">Thank you, {form.name || 'friend'}!</p>
            <p className="hand">{ENDPOINT ? "Your note is on its way — I'll reply soon." : 'Your mail app should open with everything filled in.'}</p>
            <button className="chunky-btn" onClick={() => setState('idle')}>Write another</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="contact-form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="hand to">To: <b>{SITE.email}</b></p>
            <div className="field-row">
              <label>Your name<input required value={form.name} onChange={set('name')} placeholder="Jane Doe" autoComplete="name" /></label>
              <label>Your email<input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" autoComplete="email" /></label>
            </div>
            <label>Subject<input value={form.subject} onChange={set('subject')} /></label>
            <label>Message<textarea rows={8} value={form.message} onChange={set('message')} /></label>
            {state === 'error' && <p className="error">Something went wrong — you can also email me directly at {SITE.email}.</p>}
            <div className="modal-actions inline">
              <button type="submit" className="chunky-btn primary" disabled={state === 'sending'}>
                <Icon name="send" size={18} /> {state === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
