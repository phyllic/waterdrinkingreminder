import React from 'react';

export default function CompanionAvatar({ type = 'flora', level = 1, hydrationPercent = 50, name = 'Bloom' }) {
  const isThirsty = hydrationPercent < 30;
  const isHydrated = hydrationPercent >= 80;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Glow Halo */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700 ${
          isThirsty ? 'bg-amber-600/30' : isHydrated ? 'bg-cyan-400/50' : 'bg-sky-500/30'
        }`} 
      />

      {/* Companion Graphic SVG Container */}
      <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center animate-float">
        {type === 'flora' ? (
          <FloraSVG level={level} isThirsty={isThirsty} isHydrated={isHydrated} />
        ) : (
          <AquaSVG level={level} isThirsty={isThirsty} isHydrated={isHydrated} />
        )}

        {/* Floating Bubble/Sparkle Elements when hydrated */}
        {isHydrated && (
          <>
            <span className="absolute top-2 right-4 text-xl animate-bounce">✨</span>
            <span className="absolute bottom-4 left-2 text-lg animate-pulse">💧</span>
            <span className="absolute top-6 left-6 text-sm animate-ping">⭐</span>
          </>
        )}

        {/* Thirsty Sweat Drop when lagging behind */}
        {isThirsty && (
          <span className="absolute top-4 right-6 text-2xl animate-pulse">💧</span>
        )}
      </div>

      {/* Companion Status Badge */}
      <div className="relative z-10 mt-2 flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-sky-500/30 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-heading font-bold text-sky-200 text-sm tracking-wide">{name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/50">
            Lvl {level}
          </span>
        </div>

        <p className="text-xs mt-1.5 font-medium text-slate-300">
          {isThirsty ? '🥀 Feeling thirsty... Need water!' : isHydrated ? '🌊 Super Hydrated & Happy!' : '🌿 Growing nicely! Keep drinking.'}
        </p>
      </div>
    </div>
  );
}

// Flora (Plant Companion) Vector Graphic
function FloraSVG({ level, isThirsty, isHydrated }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(2,132,199,0.3)]">
      {/* Pot Base */}
      <path d="M 60 145 L 140 145 L 130 180 L 70 180 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
      <ellipse cx="100" cy="145" rx="40" ry="8" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
      
      {/* Soil */}
      <ellipse cx="100" cy="144" rx="36" ry="6" fill="#475569" />

      {/* Stem */}
      <path 
        d={isThirsty ? "M 100 142 Q 115 110 90 85" : "M 100 142 Q 95 100 100 70"} 
        fill="none" 
        stroke={isThirsty ? "#a3e635" : "#22c55e"} 
        strokeWidth="6" 
        strokeLinecap="round" 
      />

      {/* Leaves depending on level */}
      {/* Level 1: Single sprout leaf */}
      <path 
        d="M 100 110 Q 75 105 80 95 Q 100 100 100 110" 
        fill={isThirsty ? "#84cc16" : "#4ade80"} 
        stroke="#16a34a" 
        strokeWidth="2" 
      />
      <path 
        d="M 100 105 Q 125 100 120 90 Q 100 95 100 105" 
        fill={isThirsty ? "#84cc16" : "#4ade80"} 
        stroke="#16a34a" 
        strokeWidth="2" 
      />

      {/* Level 2+: Extra foliage */}
      {level >= 2 && (
        <>
          <path d="M 98 85 Q 70 75 80 65 Q 98 75 98 85" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <path d="M 102 85 Q 130 75 120 65 Q 102 75 102 85" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        </>
      )}

      {/* Level 3+: Flower Petals */}
      {level >= 3 && (
        <g transform="translate(100, 60)">
          <circle cx="0" cy="-12" r="10" fill="#f43f5e" />
          <circle cx="12" cy="0" r="10" fill="#f43f5e" />
          <circle cx="0" cy="12" r="10" fill="#f43f5e" />
          <circle cx="-12" cy="0" r="10" fill="#f43f5e" />
          <circle cx="0" cy="0" r="8" fill="#fde047" />
        </g>
      )}

      {/* Level 4: Golden Crown aura & fruits */}
      {level >= 4 && (
        <g transform="translate(100, 40)">
          <polygon points="0,-18 6,-6 18,-6 9,2 12,14 0,6 -12,14 -9,2 -18,-6 -6,-6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        </g>
      )}

      {/* Face Expression */}
      <g transform={isThirsty ? "translate(95, 120)" : "translate(100, 115)"}>
        {/* Eyes */}
        <circle cx="-10" cy="-5" r="3.5" fill="#0f172a" />
        <circle cx="10" cy="-5" r="3.5" fill="#0f172a" />
        {/* Eye Shine */}
        <circle cx="-9" cy="-6" r="1.2" fill="#ffffff" />
        <circle cx="11" cy="-6" r="1.2" fill="#ffffff" />

        {/* Mouth */}
        {isThirsty ? (
          <path d="M -6 5 Q 0 0 6 5" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        ) : isHydrated ? (
          <path d="M -8 2 Q 0 10 8 2 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />
        ) : (
          <path d="M -5 2 Q 0 6 5 2" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}

// Aqua (Axolotl Aquatic Companion) Vector Graphic
function AquaSVG({ level, isThirsty, isHydrated }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.4)]">
      {/* Water Bubble Sphere */}
      <circle cx="100" cy="105" r="75" fill="url(#bubbleGrad)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />

      <defs>
        <radialGradient id="bubbleGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Gill Feathers */}
      <g stroke="#ec4899" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M 65 95 Q 40 80 45 65" />
        <path d="M 62 105 Q 35 105 40 90" />
        <path d="M 65 115 Q 40 130 48 118" />

        <path d="M 135 95 Q 160 80 155 65" />
        <path d="M 138 105 Q 165 105 160 90" />
        <path d="M 135 115 Q 160 130 152 118" />
      </g>

      {/* Axolotl Body */}
      <ellipse cx="100" cy="115" rx="42" ry="36" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />

      {/* Little Paws */}
      <circle cx="72" cy="138" r="8" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
      <circle cx="128" cy="138" r="8" fill="#f472b6" stroke="#db2777" strokeWidth="2" />

      {/* Level 3+ Crystal / Sparkle Aura */}
      {level >= 3 && (
        <polygon points="100,50 106,62 120,62 109,70 113,82 100,74 87,82 91,70 80,62 94,62" fill="#7dd3fc" opacity="0.9" />
      )}

      {/* Level 4: Royal Crown */}
      {level >= 4 && (
        <path d="M 85 70 L 92 82 L 100 68 L 108 82 L 115 70 L 118 87 L 82 87 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      )}

      {/* Face Features */}
      {/* Blush */}
      <ellipse cx="78" cy="118" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="122" cy="118" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />

      {/* Eyes */}
      <circle cx="82" cy="110" r="4.5" fill="#0f172a" />
      <circle cx="118" cy="110" r="4.5" fill="#0f172a" />
      <circle cx="83.5" cy="108.5" r="1.8" fill="#ffffff" />
      <circle cx="119.5" cy="108.5" r="1.8" fill="#ffffff" />

      {/* Mouth */}
      {isThirsty ? (
        <circle cx="100" cy="122" r="4" fill="none" stroke="#0f172a" strokeWidth="2" />
      ) : isHydrated ? (
        <path d="M 92 118 Q 100 128 108 118 Z" fill="#be123c" stroke="#0f172a" strokeWidth="1.5" />
      ) : (
        <path d="M 93 118 Q 100 124 107 118" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
