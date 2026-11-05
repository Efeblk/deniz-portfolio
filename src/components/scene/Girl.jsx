import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hotspot from '../ui/Hotspot.jsx';
import { C } from './palette.js';
import { useScene } from '../../context/SceneContext.jsx';

const ink = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' };

function Eye({ x, lookUp, blink }) {
  // lookUp: glance at the visitor; otherwise eyes are lowered to the book
  const irisY = lookUp ? -1 : 2.6;
  return (
    <g transform={`translate(${x} -214)`}>
      <motion.g animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.08 }} style={{ originY: 0.5 }}>
        <path d="M-10 0 Q0 -7 10 0 Q0 6.5 -10 0Z" fill="#fffdf6" />
        <motion.g animate={{ y: irisY }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
          <circle r="5.4" fill={C.eye} />
          <path d="M-5.4 0 A5.4 5.4 0 0 1 5.4 0Z" fill={C.eyeDark} />
          <circle r="2.3" fill="#132b22" />
          <circle cx="-1.8" cy="-1.8" r="1.4" fill="#fff" />
        </motion.g>
        {/* lowered upper lid when reading */}
        <motion.path
          d="M-11 0 Q0 -8 11 -0.5 L11 -9 L-11 -9Z"
          fill={C.skin}
          animate={{ y: lookUp ? -5 : 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        />
        <motion.path
          d="M-11.5 0.5 Q0 -8 11.5 -0.5"
          fill="none" stroke={C.ink} strokeWidth="2.8" strokeLinecap="round"
          animate={{ y: lookUp ? -3.5 : 1.2 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        />
      </motion.g>
    </g>
  );
}

export default function Girl({ onHeadphones }) {
  const { musicOn, night } = useScene();
  const [blink, setBlink] = useState(false);
  const [lookUp, setLookUp] = useState(false);
  const [hovered, setHovered] = useState(false);

  // blink every few seconds; glance up from the book now and then
  useEffect(() => {
    let alive = true;
    let t1, t2;
    const blinkLoop = () => {
      t1 = setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 130);
        blinkLoop();
      }, 2200 + Math.random() * 3000);
    };
    const glanceLoop = () => {
      t2 = setTimeout(() => {
        if (!alive) return;
        setLookUp(true);
        setTimeout(() => alive && setLookUp(false), 1800);
        glanceLoop();
      }, 7000 + Math.random() * 6000);
    };
    blinkLoop();
    glanceLoop();
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const looking = lookUp || hovered;

  return (
    <g transform="translate(800 640)" className="girl">
      {/* soft breathing */}
      <motion.g animate={{ y: [0, -1.5, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
        <g onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} style={{ pointerEvents: 'auto' }}>
          {/* back hair mass */}
          <path d="M-44 -250 Q-74 -200 -68 -140 Q-64 -104 -72 -72 Q-52 -60 -32 -72 L32 -72 Q52 -60 72 -72 Q64 -104 68 -140 Q74 -200 44 -250 Q0 -282 -44 -250Z" fill={C.hairDark} {...ink} />

          {/* legs + shoes */}
          <path d="M-46 18 L-22 18 L-25 104 L-41 104Z" fill={C.tights} {...ink} />
          <path d="M18 18 L42 18 L41 104 L25 104Z" fill={C.tights} {...ink} />
          <path d="M-47 98 Q-52 120 -38 122 L-16 122 Q-12 110 -22 98Z" fill={C.shoe} {...ink} />
          <path d="M22 98 Q12 110 16 122 L38 122 Q52 120 47 98Z" fill={C.shoe} {...ink} />
          <path d="M-48 116 H-14 M15 116 H49" stroke="#f4f1e6" strokeWidth="3.5" />

          {/* skirt over the lap */}
          <path d="M-40 -64 L40 -64 Q54 -20 62 26 Q30 36 0 30 Q-30 36 -62 26 Q-54 -20 -40 -64Z" fill={C.skirt} {...ink} />
          <path d="M14 -64 Q30 -10 34 32 Q50 30 62 26 Q54 -20 40 -64Z" fill={C.skirtShade} />
          <path d="M-20 -40 L-26 28 M0 -40 V30 M20 -40 L26 28" stroke={C.ink} strokeWidth="2" opacity="0.55" />

          {/* cardigan torso */}
          <path d="M-50 -160 Q-58 -110 -45 -60 L45 -60 Q58 -110 50 -160 Q30 -172 0 -170 Q-30 -172 -50 -160Z" fill={C.cardigan} {...ink} />
          <path d="M18 -168 Q40 -168 50 -160 Q58 -110 45 -60 L22 -60 Q30 -110 18 -168Z" fill={C.cardiganShade} />
          <path d="M-15 -169 L0 -128 L15 -169Z" fill={C.shirt} {...ink} strokeWidth="2.5" />

          {/* upper arms */}
          <path d="M-50 -160 Q-72 -144 -72 -102 Q-72 -80 -64 -66 L-48 -70 Q-52 -104 -46 -136Z" fill={C.cardigan} {...ink} />
          <path d="M50 -160 Q72 -144 72 -102 Q72 -80 64 -66 L48 -70 Q52 -104 46 -136Z" fill={C.cardiganShade} {...ink} />

          {/* neck */}
          <path d="M-10 -188 L10 -188 L11 -164 L-11 -164Z" fill={C.skin} {...ink} strokeWidth="2.5" />
          <path d="M-10 -184 Q0 -176 10 -184 L10 -176 Q0 -170 -10 -176Z" fill={C.skinShade} />

          {/* head — tilts toward the book, bobs to the music */}
          <motion.g
            style={{ originX: 0.5, originY: 1 }}
            animate={musicOn ? { rotate: [-3, 2, -3] } : { rotate: looking ? 0 : -2 }}
            transition={musicOn ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
          >
            <path d="M-33 -236 Q-35 -200 -22 -188 Q-10 -176 0 -176 Q10 -176 22 -188 Q35 -200 33 -236 Q0 -262 -33 -236Z" fill={C.skin} {...ink} />
            <ellipse cx="-21" cy="-199" rx="6" ry="3" fill={C.blush} opacity="0.75" />
            <ellipse cx="21" cy="-199" rx="6" ry="3" fill={C.blush} opacity="0.75" />
            <Eye x={-14} lookUp={looking} blink={blink} />
            <Eye x={14} lookUp={looking} blink={blink} />
            <path d="M-23 -227 Q-15 -232 -6 -228 M6 -228 Q15 -232 23 -227" stroke={C.hairDark} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M1 -206 Q3 -201 -0.5 -199" stroke={C.skinShade} strokeWidth="2" fill="none" strokeLinecap="round" />
            <motion.path
              d={looking ? 'M-5 -191 Q0 -186 5 -191' : 'M-4 -190 Q0 -188 4 -190'}
              stroke="#a5554d" strokeWidth="2.2" fill="none" strokeLinecap="round"
            />
            {/* bangs */}
            <path d="M-38 -230 Q-42 -264 -8 -270 Q32 -272 40 -232 L34 -220 L29 -233 L21 -219 L13 -235 L3 -221 L-6 -237 L-15 -221 L-22 -235 L-31 -220Z" fill={C.hair} {...ink} />
            <path d="M-26 -254 Q-2 -264 22 -255" stroke={C.hairLight} strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* long locks falling over the shoulders */}
            <path d="M-37 -238 Q-48 -192 -46 -150 Q-44 -118 -56 -92 Q-36 -94 -30 -128 Q-24 -172 -26 -214Z" fill={C.hair} {...ink} />
            <path d="M37 -238 Q48 -192 46 -150 Q44 -118 56 -92 Q36 -94 30 -128 Q24 -172 26 -214Z" fill={C.hair} {...ink} />
            <path d="M-40 -180 Q-40 -150 -46 -120 M40 -180 Q40 -150 46 -120" stroke={C.hairDark} strokeWidth="2" fill="none" />

            {/* over-ear headphones — click to play / pause music */}
            <Hotspot label={musicOn ? 'Headphones — pause music' : 'Headphones — play music'} onActivate={onHeadphones} lift={6} hitArea={{ x: -60, y: -292, width: 120, height: 104 }}>
              <path d="M-41 -226 Q-46 -280 0 -284 Q46 -280 41 -226" fill="none" stroke={C.ink} strokeWidth="11" strokeLinecap="round" />
              <path d="M-41 -226 Q-46 -280 0 -284 Q46 -280 41 -226" fill="none" stroke={C.cream} strokeWidth="5.5" strokeLinecap="round" />
              {[-1, 1].map((side) => (
                <g key={side} transform={`translate(${side * 40} -218)`}>
                  <rect x="-12" y="-27" width="24" height="54" rx="12" fill={C.cream} {...ink} />
                  <rect x={side < 0 ? -12 : 2} y="-22" width="10" height="44" rx="5" fill={C.creamShade} />
                  <rect x="-6" y="-17" width="12" height="34" rx="6" fill={C.orange} {...ink} strokeWidth="2.2" />
                  {musicOn && <circle r="2.5" cy="-8" fill="#7ef0b5" />}
                </g>
              ))}
            </Hotspot>
          </motion.g>

          {/* forearms reaching to the book */}
          <path d="M-70 -76 Q-74 -98 -60 -114 L-44 -104 Q-54 -90 -50 -70Z" fill={C.cardigan} {...ink} />
          <path d="M70 -76 Q74 -98 60 -114 L44 -104 Q54 -90 50 -70Z" fill={C.cardiganShade} {...ink} />

          {/* The Count of Monte Cristo */}
          <g>
            <path d="M-60 -160 Q-30 -171 0 -154 Q30 -171 60 -160 L60 -155 Q30 -165 0 -150 Q-30 -165 -60 -155Z" fill={C.paper} {...ink} strokeWidth="2" />
            <path d="M-64 -158 L-3 -150 L-3 -95 L-60 -102Z" fill={C.bookRedDark} {...ink} />
            <path d="M3 -150 L64 -158 L60 -102 L3 -95Z" fill={C.bookRed} {...ink} />
            <rect x="-3" y="-151" width="6" height="57" fill="#561c26" stroke={C.ink} strokeWidth="2" />
            <path d="M-56 -150 L-10 -144 L-10 -102 L-53 -107Z" fill="none" stroke={C.gold} strokeWidth="1.2" opacity="0.8" />
            <g transform="translate(33 -128) rotate(-4)">
              <path d="M-24 -21 L24 -21 L23 23 L-23 23Z" fill="none" stroke={C.gold} strokeWidth="1.2" />
              <text y="-10" textAnchor="middle" className="book-title">THE COUNT</text>
              <text y="-1" textAnchor="middle" className="book-title">OF MONTE</text>
              <text y="8" textAnchor="middle" className="book-title big">CRISTO</text>
              <text y="18" textAnchor="middle" className="book-author">A. DUMAS</text>
            </g>
          </g>

          {/* hands gripping the covers */}
          <path d="M-64 -116 Q-70 -104 -60 -96 Q-50 -94 -48 -104 Q-50 -116 -58 -118Z" fill={C.skin} {...ink} strokeWidth="2.5" />
          <path d="M64 -116 Q70 -104 60 -96 Q50 -94 48 -104 Q50 -116 58 -118Z" fill={C.skin} {...ink} strokeWidth="2.5" />
        </g>
      </motion.g>
    </g>
  );
}
