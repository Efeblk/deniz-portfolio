import { useEffect, useState } from 'react';

// Pulls public, non-fork repos for the Projects modal. Silently returns []
// on any failure (rate limit, offline, CSP) so curated data still shows.
export function useGithubRepos(user, enabled) {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!enabled || status !== 'idle') return;
    setStatus('loading');
    const key = `gh-repos:${user}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (cached) { setRepos(cached); setStatus('done'); return; }
    } catch { /* storage unavailable */ }
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const clean = (Array.isArray(list) ? list : [])
          .filter((r) => !r.fork && !r.archived)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 8)
          .map((r) => ({
            title: r.name.replace(/[-_]/g, ' '),
            description: r.description || 'No description yet.',
            tags: [r.language].filter(Boolean),
            repo: r.html_url,
            homepage: r.homepage || null,
            stars: r.stargazers_count,
          }));
        setRepos(clean);
        try { sessionStorage.setItem(key, JSON.stringify(clean)); } catch { /* ignore */ }
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [user, enabled, status]);

  return { repos, status };
}
