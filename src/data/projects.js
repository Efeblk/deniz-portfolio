// Projects shown on the tablet. Each row opens a detail page (#project/<slug>).
// The in-depth text expands your one-line summaries; add your own role,
// results and links where marked.
export const PROJECTS = [
  {
    slug: 's-bell',
    title: 'S-BELL Autonomous Mobile Robot',
    kind: 'Capstone project',
    tagline: 'A mobile robot that maps an unknown space, knows where it is, and drives itself to a goal.',
    summary: 'Capstone project. Autonomous navigation using ROS 2, SLAM Toolbox, Nav2, Docker, and ESP32.',
    tags: ['ROS 2', 'SLAM Toolbox', 'Nav2', 'Docker', 'ESP32'],
    sections: [
      {
        heading: 'Overview',
        body: 'S-BELL is my capstone project: an autonomous mobile robot built on ROS 2. Placed in a space it has never seen, it builds a map, localises itself inside that map and plans collision-free routes to the goals it is given.',
      },
      {
        heading: 'How it works',
        bullets: [
          ['Mapping & localisation', 'SLAM Toolbox builds a 2D occupancy-grid map from the robot’s sensor data while continuously estimating its position on that map.'],
          ['Navigation', 'Nav2 plans a global path to the goal, follows it with a local controller that avoids obstacles, and falls back on recovery behaviours when the robot gets stuck.'],
          ['Hardware layer', 'An ESP32 microcontroller handles the low-level motor and sensor I/O and bridges it to the ROS 2 stack.'],
          ['Reproducible setup', 'The ROS 2 workspace runs in Docker containers, so the same environment builds and runs on development machines and on the robot.'],
        ],
      },
    ],
    repo: null, // add the repository URL to show a "View code" button
  },
  {
    slug: 'long-distance-lover',
    title: 'Long Distance Lover',
    kind: 'Web app',
    tagline: 'A web app for couples who live apart: keep track of the relationship and plan the next date.',
    summary: 'A custom web application built with React and Tailwind for relationship tracking and date planning.',
    tags: ['React', 'Tailwind CSS'],
    sections: [
      {
        heading: 'Overview',
        body: 'Long Distance Lover is a custom web application for relationship tracking and date planning, designed for couples who spend much of their time in different places.',
      },
      {
        heading: 'What it does',
        bullets: [
          ['Relationship tracking', 'Keeps the couple’s shared milestones and moments together in one place.'],
          ['Date planning', 'Helps plan upcoming dates, so the next time together is always on the calendar.'],
          ['Interface', 'Built from React components and styled with Tailwind’s utility classes for a responsive layout that works on phones and desktops.'],
        ],
      },
    ],
    repo: null,
  },
  {
    slug: 'highway-env-rl',
    title: 'Highway-env RL',
    kind: 'Machine learning',
    tagline: 'Teaching agents to drive in simulated traffic with deep reinforcement learning.',
    summary: 'Trained reinforcement learning models (PPO and SAC) for autonomous driving simulations.',
    tags: ['Python', 'Reinforcement Learning', 'PPO', 'SAC', 'highway-env'],
    sections: [
      {
        heading: 'Overview',
        body: 'I trained reinforcement learning agents to drive in highway-env, a simulation environment of traffic scenarios such as multi-lane highways, merges and intersections. Instead of following hand-written rules, the agent learns its driving behaviour from rewards given for progress, speed and safety.',
      },
      {
        heading: 'Algorithms',
        bullets: [
          ['PPO (Proximal Policy Optimization)', 'An on-policy policy-gradient method that clips each update, which keeps training stable.'],
          ['SAC (Soft Actor-Critic)', 'An off-policy actor-critic method that maximises reward and policy entropy at the same time, which encourages exploration and reuses past experience efficiently.'],
          ['Why both', 'Training an on-policy and an off-policy algorithm on the same driving tasks shows how each one trades stability against sample efficiency.'],
        ],
      },
    ],
    repo: null,
  },
  {
    slug: 'embedded-health-monitor',
    title: 'Embedded Health Monitor',
    kind: 'Embedded / biomedical',
    tagline: 'A small Arduino device that measures body temperature and pulse and shows them live.',
    summary: 'Arduino-based system integrating temperature and pulse sensors with a C++ firmware and LCD visualization.',
    tags: ['Arduino', 'C++', 'Sensors', 'LCD'],
    sections: [
      {
        heading: 'Overview',
        body: 'An Arduino-based vital-signs monitor that brings together a temperature sensor and a pulse sensor, custom C++ firmware and an LCD that shows the readings in real time. It sits where my two fields meet: embedded software and biomedical measurement.',
      },
      {
        heading: 'How it works',
        bullets: [
          ['Sensing', 'The temperature and pulse sensors are read continuously by the microcontroller.'],
          ['Firmware', 'C++ firmware samples the sensors, turns the raw pulse signal into a heart-rate reading and converts the temperature data into °C.'],
          ['Visualisation', 'Readings are written to the LCD so they can be checked at a glance, with no computer attached.'],
        ],
      },
    ],
    repo: null,
  },
];
