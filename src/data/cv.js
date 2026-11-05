// CV content rendered inside the "papers" modal.
export const CV = {
  headline: 'Computer / Biomedical Engineer',
  location: null, // e.g. 'Sheffield, UK' — shown next to the headline when set
  summary:
    'Interdisciplinary engineer combining software development, robotics, and biomedical applications, biomaterial sciences.',
  experience: [
    {
      role: 'Data Engineer Intern',
      org: 'OneDataLake',
      points: ['Managed real-time data pipelines and ETL/ELT processes using Python and SQL.'],
    },
    {
      role: 'IT & SAP Developer Intern',
      org: 'Zorlu Energy',
      points: ['SAP HANA migration and functional testing.'],
    },
    {
      role: 'Monitoring & DevOps Intern',
      org: 'Veribox Technology',
      points: ['Linux-based system configuration and CI/CD pipelines.'],
    },
    {
      role: 'FirstTech Intern',
      org: 'Intertech / DenizBank',
      points: [],
    },
  ],
  education: [
    { degree: 'MSc Biomedical Engineering', org: 'University of Sheffield', period: 'Present' },
    { degree: 'BSc Computer Engineering', org: 'Bahçeşehir University', note: 'Graduated early, in 3.5 years' },
    { degree: 'Software Engineering Training', org: '42 Istanbul' },
  ],
  skills: {
    Software: ['Python', 'SQL', 'C++', 'JavaScript', 'React', 'Tailwind CSS'],
    'Robotics & Embedded': ['ROS 2', 'SLAM Toolbox', 'Nav2', 'ESP32', 'Arduino'],
    'Data & DevOps': ['ETL / ELT', 'Docker', 'Linux', 'CI/CD', 'SAP HANA'],
    'Machine Learning': ['Reinforcement Learning', 'PPO', 'SAC'],
  },
  languages: [], // e.g. ['Turkish — native', 'English — fluent']
};
