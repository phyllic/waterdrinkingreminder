import React, { useState } from 'react';
import { Plus, Coffee, GlassWater, CupSoda, Gauge } from 'lucide-react';

export default function QuickAddPanel({ onAddWater }) {
  const [customMl, setCustomMl] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const presets = [
    { label: 'Small Cup', amount: 200, icon: Coffee, color: 'from-sky-500/20 to-blue-600/20 border-sky-400/40 text-sky-300' },
    { label: 'Glass', amount: 350, icon: GlassWater, color: 'from-cyan-500/20 to-teal-600/20 border-cyan-400/40 text-cyan-300' },
    { label: 'Bottle', amount: 500, icon: CupSoda, color: 'from-blue-500/20 to-indigo-600/20 border-blue-400/40 text-blue-300' },
    { label: 'Flask', amount: 750, icon: Gauge, color: 'from-teal-500/20 to-emerald-600/20 border-teal-400/40 text-teal-300' },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = Number(customMl);
    if (val > 0 && val <= 3000) {
      onAddWater(val, 'Custom');
      setCustomMl('');
      setShowCustomModal(false);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300/80">Log Hydration</h3>
        <button
          onClick={() => setShowCustomModal(true)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 glass-pill px-2.5 py-1 rounded-full border border-cyan-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Custom
        </button>
      </div>

      {/* Preset Grid Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {presets.map((p) => {
          const IconComp = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => onAddWater(p.amount, p.label)}
              className={`relative overflow-hidden p-3.5 rounded-2xl glass-card bg-gradient-to-br ${p.color} hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 border shadow-lg group`}
            >
              <div className="p-2 rounded-xl bg-slate-900/60 group-hover:scale-110 transition-transform">
                <IconComp className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="block font-heading font-bold text-sm text-white">+{p.amount} ml</span>
                <span className="block text-[11px] font-medium text-slate-400">{p.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Amount Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative">
            <h3 className="font-heading font-bold text-lg text-sky-100 mb-1">Custom Water Log</h3>
            <p className="text-xs text-slate-400 mb-4">Enter the exact amount of water in milliliters (ml):</p>

            <form onSubmit={handleCustomSubmit}>
              <div className="relative mb-5">
                <input
                  type="number"
                  min="10"
                  max="3000"
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  placeholder="e.g. 450"
                  autoFocus
                  className="w-full bg-slate-900/80 border border-sky-500/40 rounded-2xl px-4 py-3 text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
                <span className="absolute right-4 top-3.5 text-sm font-semibold text-slate-400">ml</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-3 rounded-xl glass-pill text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customMl || Number(customMl) <= 0}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  Add Water
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
