// Central place for personal links & contact details.
export const SITE = {
  name: 'Elif Deniz Gölboyu',
  shortName: 'Elif Deniz',
  role: 'Computer / Biomedical Engineer',
  email: 'elifdenizgolboyu@gmail.com',
  github: 'https://github.com/tojifushiguroed',
  githubUser: 'tojifushiguroed',
  linkedin: 'https://www.linkedin.com/in/elif-deniz-golboyu/',
  cvPdf: '/cv/Elif_Deniz_Golboyu_CV.pdf',
};

// The headphones play this file from /public. By day it plays as-is; at night
// the same track is routed through a lo-fi chain (low-pass, slower tape speed,
// vinyl crackle). If the file is missing, an original synth tune plays instead.
export const MUSIC = {
  src: '/howls_moving_castle.mp3',
  title: "Howl's Moving Castle",
  volume: 0.7,
  night: { lowpassHz: 1500, playbackRate: 0.93, crackle: 0.22 },
};
