import React from 'react';
import { BarChart3, Flame, Droplet, Trash2 } from 'lucide-react';

export default function AnalyticsView({ logs = [], goalMl = 2500, streakData = {}, onDeleteLog }) {
  // Compute past 7 days hydration volume
  const getPast7DaysData = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
      const dayTotal = logs
        .filter(l => l.date === dateKey)
        .reduce((sum, l) => sum + l.amount, 0);

      days.push({
        dateKey,
        dayLabel,
        amount: dayTotal,
        percent: Math.min(100, Math.round((dayTotal / goalMl) * 100))
      });
    }
    return days;
  };

  const chartData = getPast7DaysData();

  // Summary Metrics
  const totalVolume = logs.reduce((sum, l) => sum + l.amount, 0);
  const totalDaysWithLogs = new Set(logs.map(l => l.date)).size || 1;
  const avgDailyIntake = Math.round(totalVolume / totalDaysWithLogs);

  const todayKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const todayLogs = logs.filter(l => l.date === todayKey);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 animate-fadeIn pb-16">
      {/* Header Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl glass-card flex flex-col justify-between border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Flame className="w-5 h-5 fill-amber-400/20" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
          </div>
          <div>
            <span className="font-heading font-black text-3xl text-white">{streakData.currentStreak || 0}</span>
            <span className="text-xs text-slate-400 ml-1">days</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Best streak: {streakData.maxStreak || 0} days</span>
        </div>

        <div className="p-4 rounded-3xl glass-card flex flex-col justify-between border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Droplet className="w-5 h-5 fill-cyan-400/20" />
            <span className="text-xs font-bold uppercase tracking-wider">Avg Daily</span>
          </div>
          <div>
            <span className="font-heading font-black text-3xl text-white">{avgDailyIntake.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1">ml</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Target: {goalMl.toLocaleString()} ml</span>
        </div>
      </div>

      {/* 7-Day Visual Bar Chart */}
      <div className="p-5 rounded-3xl glass-card border border-sky-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-sky-100">7-Day Hydration History</h3>
          </div>
          <span className="text-[11px] text-slate-400">Goal: {goalMl} ml</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-800">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-sky-200 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap z-20">
                {d.amount} ml ({d.percent}%)
              </div>

              {/* Bar Fill */}
              <div className="w-full max-w-[28px] bg-slate-800/80 rounded-t-lg h-full relative overflow-hidden flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${
                    d.percent >= 100
                      ? 'bg-gradient-to-t from-cyan-500 to-sky-400'
                      : 'bg-gradient-to-t from-sky-600 to-cyan-600/70'
                  }`}
                  style={{ height: `${Math.min(100, Math.max(8, d.percent))}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-cyan-300">
                {d.dayLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Intake Log Breakdown */}
      <div className="p-5 rounded-3xl glass-card border border-sky-500/20">
        <h3 className="font-heading font-bold text-sm text-sky-100 mb-3">Today's Water Entries</h3>

        {todayLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No water logged today yet. Drink up!</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {todayLogs.slice().reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl glass-pill hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-heading font-bold text-sm text-white">+{log.amount} ml</span>
                    <span className="block text-[11px] text-slate-400">{log.presetName} • {log.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
