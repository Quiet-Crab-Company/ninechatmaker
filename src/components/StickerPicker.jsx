import React from 'react';

// Premium high-quality reaction stickers represented as SVGs
export const STICKERS = {
  smile: {
    code: ':smile:',
    label: 'Smile',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <radialGradient id="smileGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="70%" stopColor="#ffd23f" />
            <stop offset="100%" stopColor="#ee9b00" />
          </radialGradient>
          <filter id="stickerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#smileGrad)" stroke="#ee9b00" strokeWidth="2.5" filter="url(#stickerShadow)" />
        {/* Eyes */}
        <ellipse cx="33" cy="42" rx="5" ry="7" fill="#3d2c00" />
        <ellipse cx="67" cy="42" rx="5" ry="7" fill="#3d2c00" />
        {/* Smile */}
        <path d="M 30,55 A 20,20 0 0,0 70,55" fill="none" stroke="#3d2c00" strokeWidth="6" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="23" cy="52" r="6" fill="#ff70a6" opacity="0.6" />
        <circle cx="77" cy="52" r="6" fill="#ff70a6" opacity="0.6" />
      </svg>
    )
  },
  heart: {
    code: ':heart:',
    label: 'Heart',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="100%" stopColor="#c9184a" />
          </linearGradient>
          <filter id="heartShadow" x="-15%" y="-15%" width="130%" height="130%">
            <dropShadow dx="2" dy="5" stdDeviation="4" floodColor="#5c001e" floodOpacity="0.3" />
          </filter>
        </defs>
        <path d="M 12,35 C 12,18 35,12 50,30 C 65,12 88,18 88,35 C 88,60 50,88 50,88 C 50,88 12,60 12,35 Z" 
              fill="url(#heartGrad)" stroke="#a4133c" strokeWidth="2.5" filter="url(#heartShadow)" />
        {/* Highlight */}
        <path d="M 22,30 C 22,25 28,21 33,22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </svg>
    )
  },
  thumbsup: {
    code: ':thumbsup:',
    label: 'Thumbs Up',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <linearGradient id="thumbsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ea8de" />
            <stop offset="100%" stopColor="#0077b6" />
          </linearGradient>
          <filter id="thumbsShadow" x="-10%" y="-10%" width="125%" height="125%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>
        <g filter="url(#thumbsShadow)">
          {/* Fist and thumb */}
          <path d="M 20,55 C 20,48 26,45 32,45 L 50,45 C 50,45 48,25 52,15 C 55,10 65,8 68,15 C 70,22 65,35 70,42 L 85,42 C 90,42 94,46 94,52 C 94,56 91,60 88,61 C 91,63 92,67 90,71 C 88,74 85,76 82,76 C 84,78 85,82 82,85 C 80,88 76,89 72,89 L 35,89 C 26,89 20,82 20,74 Z" 
                fill="url(#thumbsGrad)" stroke="#03045e" strokeWidth="2.5" />
          {/* Sleeve/Wrist */}
          <rect x="8" y="52" width="12" height="35" rx="3" fill="#0096c7" stroke="#03045e" strokeWidth="2.5" />
        </g>
      </svg>
    )
  },
  laughing: {
    code: ':laughing:',
    label: 'Laughing',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <radialGradient id="laughGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="70%" stopColor="#ffd23f" />
            <stop offset="100%" stopColor="#ee9b00" />
          </radialGradient>
          <filter id="laughShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#laughGrad)" stroke="#ee9b00" strokeWidth="2.5" filter="url(#laughShadow)" />
        {/* Squinting Eyes (Laughing) */}
        <path d="M 23,45 L 35,38 L 25,35" fill="none" stroke="#3d2c00" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 77,45 L 65,38 L 75,35" fill="none" stroke="#3d2c00" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Open Laughing Mouth */}
        <path d="M 28,52 C 28,52 35,78 50,78 C 65,78 72,52 72,52 Z" fill="#780000" stroke="#3d2c00" strokeWidth="3" />
        {/* Tongue */}
        <path d="M 38,68 C 42,60 58,60 62,68 C 58,74 42,74 38,68 Z" fill="#ff70a6" />
        {/* Teeth */}
        <path d="M 28,53 L 72,53 C 68,58 32,58 28,53 Z" fill="#fff" />
      </svg>
    )
  },
  crying: {
    code: ':crying:',
    label: 'Crying',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <radialGradient id="cryGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#e3f2fd" />
            <stop offset="65%" stopColor="#90caf9" />
            <stop offset="100%" stopColor="#42a5f5" />
          </radialGradient>
          <linearGradient id="tearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f7fa" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
          <filter id="cryShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#0d47a1" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#cryGrad)" stroke="#1565c0" strokeWidth="2.5" filter="url(#cryShadow)" />
        {/* Sad Eyes */}
        <path d="M 25,40 C 28,34 38,34 40,40" fill="none" stroke="#0d47a1" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 75,40 C 72,34 62,34 60,40" fill="none" stroke="#0d47a1" strokeWidth="5.5" strokeLinecap="round" />
        {/* Sad Mouth */}
        <path d="M 35,68 A 15,15 0 0,1 65,68" fill="none" stroke="#0d47a1" strokeWidth="5.5" strokeLinecap="round" />
        {/* Big Tears */}
        <path d="M 30,48 C 30,48 24,65 30,75 C 36,65 30,48 30,48 Z" fill="url(#tearGrad)" stroke="#0077b6" strokeWidth="1.5" />
        <path d="M 70,48 C 70,48 64,65 70,75 C 76,65 70,48 70,48 Z" fill="url(#tearGrad)" stroke="#0077b6" strokeWidth="1.5" />
      </svg>
    )
  },
  shocked: {
    code: ':shocked:',
    label: 'Shocked',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <radialGradient id="shockGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="60%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#fb8500" />
          </radialGradient>
          <filter id="shockShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#shockGrad)" stroke="#fb8500" strokeWidth="2.5" filter="url(#shockShadow)" />
        {/* Wide Open Eyes */}
        <circle cx="33" cy="38" r="8" fill="#fff" stroke="#333" strokeWidth="1.5" />
        <circle cx="33" cy="38" r="3.5" fill="#000" />
        <circle cx="67" cy="38" r="8" fill="#fff" stroke="#333" strokeWidth="1.5" />
        <circle cx="67" cy="38" r="3.5" fill="#000" />
        {/* Worried Eyebrows */}
        <path d="M 22,25 C 28,21 38,25 38,25" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
        <path d="M 78,25 C 72,21 62,25 62,25" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
        {/* O-shaped Mouth */}
        <ellipse cx="50" cy="65" rx="10" ry="14" fill="#1b1100" stroke="#fb8500" strokeWidth="2" />
      </svg>
    )
  },
  angry: {
    code: ':angry:',
    label: 'Angry',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <radialGradient id="angryGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffb3c1" />
            <stop offset="60%" stopColor="#ff0f7b" />
            <stop offset="100%" stopColor="#ab004b" />
          </radialGradient>
          <filter id="angryShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#590022" floodOpacity="0.3" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#angryGrad)" stroke="#ab004b" strokeWidth="2.5" filter="url(#angryShadow)" />
        {/* Angled Angry Eyes */}
        <path d="M 22,35 L 42,42 L 38,48 L 22,35 Z" fill="#fff" stroke="#4a001a" strokeWidth="1.5" />
        <polygon points="32,41 38,43 36,46 31,43" fill="#000" />
        <path d="M 78,35 L 58,42 L 62,48 L 78,35 Z" fill="#fff" stroke="#4a001a" strokeWidth="1.5" />
        <polygon points="68,41 62,43 64,46 69,43" fill="#000" />
        {/* Angry Eyebrows */}
        <path d="M 18,28 L 44,40" fill="none" stroke="#000" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 82,28 L 56,40" fill="none" stroke="#000" strokeWidth="5.5" strokeLinecap="round" />
        {/* Gritted Mouth */}
        <rect x="35" y="60" width="30" height="12" rx="3" fill="#fff" stroke="#4a001a" strokeWidth="3.5" />
        <line x1="50" y1="60" x2="50" y2="72" stroke="#4a001a" strokeWidth="2" />
        <line x1="42" y1="60" x2="42" y2="72" stroke="#4a001a" strokeWidth="1.5" />
        <line x1="58" y1="60" x2="58" y2="72" stroke="#4a001a" strokeWidth="1.5" />
        {/* Anger veins */}
        <path d="M 72,18 L 78,24 M 78,18 L 72,24" stroke="#ff0000" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  fire: {
    code: ':fire:',
    label: 'Fire',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d00000" />
            <stop offset="40%" stopColor="#dc2f02" />
            <stop offset="75%" stopColor="#f48c06" />
            <stop offset="100%" stopColor="#ffba08" />
          </linearGradient>
          <radialGradient id="innerFire" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#ffe3e0" />
            <stop offset="35%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#f48c06" opacity="0" />
          </radialGradient>
          <filter id="fireShadow" x="-15%" y="-15%" width="130%" height="130%">
            <dropShadow dx="2" dy="5" stdDeviation="4" floodColor="#7f0000" floodOpacity="0.35" />
          </filter>
        </defs>
        <path d="M 50,92 C 75,92 88,72 88,52 C 88,28 72,12 65,30 C 58,10 42,4 32,25 C 22,12 18,30 12,50 C 12,72 25,92 50,92 Z" 
              fill="url(#fireGrad)" stroke="#370000" strokeWidth="2.5" filter="url(#fireShadow)" />
        {/* Inner glow core */}
        <path d="M 50,88 C 68,88 76,74 76,58 C 76,40 64,30 60,42 C 55,24 45,20 38,36 C 30,26 28,38 24,56 C 24,74 32,88 50,88 Z" 
              fill="url(#innerFire)" opacity="0.9" />
      </svg>
    )
  },
  star: {
    code: ':star:',
    label: 'Star',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="40%" stopColor="#ffea00" />
            <stop offset="100%" stopColor="#ff9100" />
          </linearGradient>
          <filter id="starShadow" x="-15%" y="-15%" width="130%" height="130%">
            <dropShadow dx="2" dy="5" stdDeviation="4" floodColor="#b56700" floodOpacity="0.4" />
          </filter>
        </defs>
        <polygon points="50,6 64,36 97,38 72,59 79,91 50,74 21,91 28,59 3,38 36,36" 
                 fill="url(#starGrad)" stroke="#cc7000" strokeWidth="2.5" strokeLinejoin="round" filter="url(#starShadow)" />
        {/* Star highlight lines */}
        <path d="M 50,15 L 50,65" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <path d="M 20,42 L 80,42" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    )
  },
  clap: {
    code: ':clap:',
    label: 'Clap',
    render: (size = 100) => (
      <svg width={size} height={size} viewBox="0 0 100 100" className="sticker-svg">
        <defs>
          <linearGradient id="handGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffddc1" />
            <stop offset="100%" stopColor="#e5989b" />
          </linearGradient>
          <linearGradient id="handGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe5d9" />
            <stop offset="100%" stopColor="#ffb5a7" />
          </linearGradient>
          <filter id="clapShadow" x="-10%" y="-10%" width="120%" height="120%">
            <dropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>
        <g filter="url(#clapShadow)">
          {/* Left hand */}
          <path d="M 15,62 C 12,50 20,38 32,45 L 52,60 C 52,60 55,42 55,30 C 55,25 60,25 61,30 L 61,58 C 61,58 66,45 69,42 C 72,39 76,43 73,48 L 58,74 L 38,82 Z" 
                fill="url(#handGrad1)" stroke="#b56576" strokeWidth="2" transform="rotate(-15 40 60)" />
          {/* Right hand */}
          <path d="M 85,62 C 88,50 80,38 68,45 L 48,60 C 48,60 45,42 45,30 C 45,25 40,25 39,30 L 39,58 C 39,58 34,45 31,42 C 28,39 24,43 27,48 L 42,74 L 62,82 Z" 
                fill="url(#handGrad2)" stroke="#b56576" strokeWidth="2" transform="rotate(15 60 60)" />
        </g>
        {/* Sound/impact lines */}
        <path d="M 50,15 L 50,25" stroke="#f4a261" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 35,22 L 42,28" stroke="#f4a261" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 65,22 L 58,28" stroke="#f4a261" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    )
  }
};

const StickerPicker = ({ onSelectSticker }) => {
  return (
    <div className="sticker-picker-container">
      <div className="sticker-picker-title">Select reaction sticker:</div>
      <div className="sticker-grid">
        {Object.entries(STICKERS).map(([key, item]) => (
          <button
            key={key}
            type="button"
            className="sticker-picker-btn"
            onClick={() => onSelectSticker(item.code)}
            title={item.label}
          >
            <div className="sticker-preview-icon">
              {item.render(50)}
            </div>
            <span className="sticker-label">{item.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickerPicker;
