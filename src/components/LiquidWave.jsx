import React from 'react';

export default function LiquidWave({ currentMl = 0, goalMl = 2500 }) {
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));
  const waveHeightPercent = 100 - percentage; // SVG offset

  return (
    <div className="relative w-full max-w-xs h-64 sm:h-72 mx-auto rounded-3xl overflow-hidden glass-card shadow-[0_20px_50px_rgba(2,132,199,0.25)] flex flex-col items-center justify-between p-6">
      
      {/* Background Liquid Wave Container */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none">
        {/* Animated Wave Layer 1 (Slow Back Wave) */}
        <div 
          className="absolute left-0 w-[200%] h-[200%] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) opacity-60 animate-wave-slow"
          style={{
            top: `${waveHeightPercent - 10}%`,
            background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.7) 0%, rgba(2, 132, 199, 0.9) 100%)',
            borderRadius: '40%'
          }}
        />

        {/* Animated Wave Layer 2 (Fast Front Wave) */}
        <div 
          className="absolute left-0 w-[200%] h-[200%] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) opacity-90 animate-wave-fast"
          style={{
            top: `${waveHeightPercent - 5}%`,
            background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.8) 0%, rgba(3, 105, 161, 0.95) 100%)',
            borderRadius: '43%'
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex justify-between items-center text-xs text-sky-200/80 font-medium">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur border border-sky-400/20">
          Target: {goalMl.toLocaleString()} ml
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur border border-sky-400/20">
          {percentage >= 100 ? '🎉 Goal Achieved!' : `${(goalMl - currentMl).toLocaleString()} ml left`}
        </span>
      </div>

      {/* Center Percentage Display */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
        <div className="flex items-baseline justify-center">
          <span className="font-heading font-black text-5xl sm:text-6xl tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {percentage}
          </span>
          <span className="font-heading font-bold text-2xl text-sky-200 ml-1 drop-shadow">%</span>
        </div>
        <p className="font-heading font-semibold text-lg text-sky-100 tracking-wide mt-1 drop-shadow">
          {currentMl.toLocaleString()} <span className="text-sm font-normal text-sky-200/80">ml</span>
        </p>
      </div>

      {/* Floating Bubbles decorative overlay */}
      <div className="relative z-10 w-full text-center">
        <div className="w-16 h-1 rounded-full bg-sky-200/40 mx-auto animate-pulse" />
      </div>
    </div>
  );
}
