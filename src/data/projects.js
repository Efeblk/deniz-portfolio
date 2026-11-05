// Fallback / curated project list. At runtime the Projects modal also tries
// to pull public repos from the GitHub API; curated entries always win.
// Edit freely — `featured: true` pins an item to the top.
export const PROJECTS = [
  {
    title: 'Bench Under the Tree',
    description:
      'This portfolio: a 2.5D cel-shaded scene in React + Framer Motion with layered parallax, procedural audio and a cat that watches your cursor.',
    tags: ['React', 'Framer Motion', 'SVG', 'Web Audio'],
    repo: 'https://github.com/tojifushiguroed',
    featured: true,
  },
  {
    title: 'Project Two',
    description: 'Short, punchy description of what it does and why it matters. Replace me in src/data/projects.js.',
    tags: ['Python', 'ML'],
    repo: 'https://github.com/tojifushiguroed',
  },
  {
    title: 'Project Three',
    description: 'What problem it solves, your role, and one number that shows impact.',
    tags: ['TypeScript', 'Node.js'],
    repo: 'https://github.com/tojifushiguroed',
  },
  {
    title: 'Project Four',
    description: 'A side project you are proud of — a game jam entry, a tool, a research prototype.',
    tags: ['C#', 'Unity'],
    repo: 'https://github.com/tojifushiguroed',
  },
];
