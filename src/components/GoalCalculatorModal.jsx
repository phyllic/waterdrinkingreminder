import React, { useState } from 'react';
import { Calculator, X, Sparkles } from 'lucide-react';

export default function GoalCalculatorModal({ currentGoal, profile, onSave, onClose }) {
  const [weightKg, setWeightKg] = useState(profile.weightKg || 65);
  const [activity, setActivity] = useState(profile.activityLevel || 'moderate');
  const [customTarget, setCustomTarget] = useState(currentGoal);

  // Hydration formula: 35ml per kg body weight + activity multiplier
  // Low: +200ml, Moderate: +500ml, Intense: +900ml
  const calculateRecommended = () => {
    const base = weightKg * 35;
    let extra = 500;
    if (activity === 'low') extra = 200;
    if (activity === 'intense') extra = 900;
    return Math.round((base + extra) / 50) * 50; // Round to nearest 50ml
  };

  const recommended = calculateRecommended();

  const handleSave = () => {
    onSave(customTarget, { weightKg, activityLevel: activity });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-pill text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h3 className="font-heading font-bold text-lg text-sky-100">Daily Goal Calculator</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Calculate your personalized water target based on your body weight and daily activity level.
        </p>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6">
          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1">
              Body Weight (kg): <span className="text-cyan-400 font-bold">{weightKg} kg</span>
            </label>
            <input
              type="range"
              min="35"
              max="150"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-2">Daily Activity Level:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Light', desc: 'Desk / Sedentary' },
                { id: 'moderate', label: 'Moderate', desc: 'Walk / Light Sport' },
                { id: 'intense', label: 'Intense', desc: 'Heavy Workout / Gym' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivity(item.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    activity === item.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'glass-pill border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="block font-heading font-bold text-xs">{item.label}</span>
                  <span className="block text-[10px] opacity-75">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-semibold text-cyan-300">Recommended Target</span>
              <span className="font-heading font-bold text-xl text-white">{recommended} ml / day</span>
            </div>
            <button
              type="button"
              onClick={() => setCustomTarget(recommended)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 flex items-center gap-1 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Apply
            </button>
          </div>

          {/* Manual Target Override */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1">Target Water Goal (ml):</label>
            <input
              type="number"
              step="50"
              min="500"
              max="6000"
              value={customTarget}
              onChange={(e) => setCustomTarget(Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-sky-500/40 rounded-2xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl glass-pill text-sm font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-sm font-bold text-white shadow-lg shadow-cyan-500/20"
          >
            Save Target
          </button>
        </div>
      </div>
    </div>
  );
}
