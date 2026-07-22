import React, { useState } from 'react';
import { Plus, Coffee, GlassWater, CupSoda, Gauge, Settings2, X, RotateCcw, Droplet, Sparkles, Flame, Check } from 'lucide-react';

const ICON_MAP = {
  Coffee: Coffee,
  GlassWater: GlassWater,
  CupSoda: CupSoda,
  Gauge: Gauge,
  Droplet: Droplet,
  Sparkles: Sparkles,
  Flame: Flame
};

export default function QuickAddPanel({ presets = [], onAddWater, onUpdatePresets, onResetPresets }) {
  const [customMl, setCustomMl] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Editable copy of presets
  const [editingPresets, setEditingPresets] = useState(presets);
  const [editingItem, setEditingItem] = useState(null); // Slot being edited

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = Number(customMl);
    if (val > 0 && val <= 3000) {
      onAddWater(val, 'Custom Log');
      setCustomMl('');
      setShowCustomModal(false);
    }
  };

  const handleOpenEdit = () => {
    setEditingPresets(JSON.parse(JSON.stringify(presets)));
    setShowEditModal(true);
  };

  const handleUpdateItemAmount = (id, newAmount) => {
    setEditingPresets(prev =>
      prev.map(item => (item.id === id ? { ...item, amount: Number(newAmount) } : item))
    );
  };

  const handleUpdateItemLabel = (id, newLabel) => {
    setEditingPresets(prev =>
      prev.map(item => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const handleUpdateItemIcon = (id, newIcon) => {
    setEditingPresets(prev =>
      prev.map(item => (item.id === id ? { ...item, icon: newIcon } : item))
    );
  };

  const handleSaveAllPresets = () => {
    onUpdatePresets(editingPresets);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleAddNewPreset = () => {
    const newId = 'p_' + Date.now();
    const newPreset = {
      id: newId,
      label: 'My Container',
      amount: 250,
      icon: 'GlassWater',
      color: 'from-cyan-500/25 to-blue-600/25 border-cyan-400/50 text-cyan-300'
    };
    setEditingPresets(prev => [...prev, newPreset]);
  };

  const handleDeletePreset = (id) => {
    if (editingPresets.length <= 1) return;
    setEditingPresets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <Droplet className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300/90 font-heading">
            Quick Log Presets
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleOpenEdit}
            className="text-[11px] font-semibold text-sky-300 hover:text-white flex items-center gap-1 glass-pill px-2.5 py-1 rounded-full border border-sky-500/30 transition-all hover:bg-sky-900/40"
            title="Customize container presets"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" /> Customize
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className="text-[11px] font-semibold text-cyan-300 hover:text-white flex items-center gap-1 glass-pill px-2.5 py-1 rounded-full border border-cyan-500/30 transition-all hover:bg-cyan-900/40"
          >
            <Plus className="w-3.5 h-3.5" /> Custom
          </button>
        </div>
      </div>

      {/* Customizable Grid Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {presets.map((p) => {
          const IconComp = ICON_MAP[p.icon] || GlassWater;
          return (
            <button
              key={p.id}
              onClick={() => onAddWater(p.amount, p.label)}
              className={`relative overflow-hidden p-3.5 rounded-2xl glass-card bg-gradient-to-br ${
                p.color || 'from-cyan-500/20 to-blue-600/20 border-cyan-400/40 text-cyan-300'
              } hover:scale-[1.03] active:scale-95 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border shadow-lg shadow-cyan-950/40 group`}
            >
              {/* Outer Glow Halo on hover */}
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="p-2 rounded-xl bg-slate-950/70 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <IconComp className="w-5 h-5 text-cyan-300" />
              </div>

              <div className="text-center z-10">
                <span className="block font-heading font-extrabold text-base text-white tracking-wide">
                  +{p.amount} <span className="text-xs font-normal text-cyan-200/80">ml</span>
                </span>
                <span className="block text-[11px] font-semibold text-slate-300/90 truncate max-w-[120px]">
                  {p.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit Presets Customizer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-card rounded-3xl p-5 border border-sky-500/30 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full glass-pill text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white">Customize Containers</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Edit volumes (e.g. 200ml, 300ml, 500ml), labels & icons:</p>

            {/* Presets List */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 mb-4">
              {editingPresets.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl glass-pill border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItemLabel(item.id, e.target.value)}
                      placeholder="Container Name"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none"
                    />

                    <div className="relative w-24">
                      <input
                        type="number"
                        min="10"
                        max="3000"
                        step="10"
                        value={item.amount}
                        onChange={(e) => handleUpdateItemAmount(item.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs font-bold text-cyan-300 focus:border-cyan-400 focus:outline-none"
                      />
                      <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-semibold">ml</span>
                    </div>

                    {editingPresets.length > 1 && (
                      <button
                        onClick={() => handleDeletePreset(item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                        title="Delete container"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Icon Selection */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Icon:</span>
                    {Object.keys(ICON_MAP).map((iconName) => {
                      const IconC = ICON_MAP[iconName];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => handleUpdateItemIcon(item.id, iconName)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            item.icon === iconName
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <IconC className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddNewPreset}
                className="w-full py-2.5 rounded-2xl glass-button text-xs font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-1 border border-dashed border-cyan-500/40"
              >
                <Plus className="w-4 h-4" /> Add Container Slot
              </button>
            </div>

            {/* Modal Controls */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPresets(onResetPresets())}
                className="p-3 rounded-xl glass-pill text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                title="Reset to default presets"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveAllPresets}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Check className="w-4 h-4" /> Save Presets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Amount Single-Time Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative">
            <h3 className="font-heading font-bold text-lg text-sky-100 mb-1">Log Custom Intake</h3>
            <p className="text-xs text-slate-400 mb-4">Enter exact water volume in milliliters (ml):</p>

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
                  className="w-full bg-slate-900/90 border border-sky-500/50 rounded-2xl px-4 py-3 text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <span className="absolute right-4 top-3.5 text-sm font-semibold text-slate-400">ml</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-3 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customMl || Number(customMl) <= 0}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
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
