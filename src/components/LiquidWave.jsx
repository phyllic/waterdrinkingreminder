import React from 'react';

export default function LiquidWave({ currentMl = 0, goalMl = 2500 }) {
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));
  const waveHeightPercent = 100 - percentage; // SVG top offset

  return (
    <div className="relative w-full max-w-xs h-64 sm:h-72 mx-auto rounded-3xl overflow-hidden glass-card-glow flex flex-col items-center justify-between p-6 transition-all duration-500">
      
      {/* Background Liquid Wave Container */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none">
        
        {/* Animated Wave Layer 1 (Back Layer) */}
        <div 
          className="absolute left-0 w-[220%] h-[220%] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) opacity-50 animate-wave-slow"
          style={{
            top: `${waveHeightPercent - 12}%`,
            background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.95) 100%)',
            borderRadius: '42%'
          }}
        />

        {/* Animated Wave Layer 2 (Front High-Glow Layer) */}
        <div 
          className="absolute left-0 w-[220%] h-[220%] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) opacity-90 animate-wave-fast"
          style={{
            top: `${waveHeightPercent - 6}%`,
            background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.9) 0%, rgba(3, 105, 161, 0.98) 100%)',
            borderRadius: '45%'
          }}
        />

        {/* Rising Bubble Particles Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[20%] bottom-0 w-3 h-3 rounded-full bg-white/40 blur-[1px] animate-bubble-1" />
          <div className="absolute left-[50%] bottom-0 w-4 h-4 rounded-full bg-white/50 blur-[1px] animate-bubble-2" />
          <div className="absolute left-[75%] bottom-0 w-2.5 h-2.5 rounded-full bg-white/30 blur-[1px] animate-bubble-3" />
        </div>
      </div>

      {/* Foreground Top Info */}
      <div className="relative z-10 w-full flex justify-between items-center text-xs text-sky-100 font-medium">
        <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur border border-sky-400/30 font-bold shadow-md">
          Target: {goalMl.toLocaleString()} ml
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur border border-sky-400/30 font-bold text-cyan-300 shadow-md">
          {percentage >= 100 ? '🎉 Goal Achieved!' : `${(goalMl - currentMl).toLocaleString()} ml left`}
        </span>
      </div>

      {/* Center Percentage Display */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
        <div className="flex items-baseline justify-center drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)]">
          <span className="font-heading font-black text-6xl sm:text-7xl tracking-tighter text-white">
            {percentage}
          </span>
          <span className="font-heading font-extrabold text-3xl text-cyan-300 ml-1">%</span>
        </div>
        <p className="font-heading font-bold text-xl text-sky-100 tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {currentMl.toLocaleString()} <span className="text-sm font-normal text-sky-200/90">ml</span>
        </p>
      </div>

      {/* Decorative Bottom Bar Indicator */}
      <div className="relative z-10 w-full text-center">
        <div className="w-20 h-1.5 rounded-full bg-cyan-200/50 mx-auto animate-pulse shadow-glow" />
      </div>
    </div>
  );
}
