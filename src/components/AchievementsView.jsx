import React from 'react';
import { Award, Lock, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export default function AchievementsView({ companion, unlockedBadges = [], onSwitchCompanion }) {
  const BADGES = [
    { id: 'first_sip', title: 'First Sip', desc: 'Log your very first water entry', icon: '🌱' },
    { id: 'goal_reached', title: 'Hydrated Champion', desc: 'Reach 100% of your daily water goal', icon: '🏆' },
    { id: 'streak_3', title: '3-Day Wave', desc: 'Maintain a 3-day hydration streak', icon: '🌊' },
    { id: 'streak_7', title: '7-Day Legend', desc: 'Maintain a 7-day hydration streak', icon: '🔥' },
    { id: 'level_2', title: 'Evolution Stage 2', desc: 'Level up your companion to Level 2', icon: '⭐' },
    { id: 'night_hydrator', title: 'Night Owl', desc: 'Log water intake during quiet hours', icon: '🌙' },
  ];

  // Level XP progress calculations
  const getLevelProgress = (xp) => {
    if (xp >= 3000) return 100;
    if (xp >= 1500) return Math.round(((xp - 1500) / 1500) * 100);
    if (xp >= 500) return Math.round(((xp - 500) / 1000) * 100);
    return Math.round((xp / 500) * 100);
  };

  const progressPercent = getLevelProgress(companion.xp);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 animate-fadeIn pb-16">
      {/* Companion XP Level Card */}
      <div className="p-5 rounded-3xl glass-card border border-sky-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-base text-white">{companion.name} Status</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-700/50">
            Level {companion.level}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-3">
          Companion Type: <span className="font-semibold text-cyan-300 capitalize">{companion.type}</span> • Total XP: <span className="font-bold text-white">{companion.xp} XP</span>
        </p>

        {/* Level XP Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-sky-500/20 overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Switch Companion Button */}
        <button
          onClick={() => onSwitchCompanion(companion.type === 'flora' ? 'aqua' : 'flora')}
          className="w-full py-2.5 rounded-2xl glass-button text-xs font-bold text-cyan-200 hover:text-white flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Switch to {companion.type === 'flora' ? 'Aqua (Axolotl)' : 'Flora (Plant)'}
        </button>
      </div>

      {/* Badges Grid */}
      <div className="p-5 rounded-3xl glass-card border border-sky-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="font-heading font-bold text-base text-sky-100">Achievement Badges</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'glass-card bg-gradient-to-br from-amber-500/10 to-cyan-500/10 border-amber-500/40 shadow-lg'
                    : 'glass-pill border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{b.icon}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <div>
                  <span className="block font-heading font-bold text-xs text-white mb-0.5">{b.title}</span>
                  <span className="block text-[10px] text-slate-400 leading-snug">{b.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
