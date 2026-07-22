import React, { useState } from 'react';
import { Bell, Volume2, VolumeX, Moon, X, Send } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function ReminderModal({ settings, onSave, onClose }) {
  const [enabled, setEnabled] = useState(settings.enabled !== false);
  const [intervalMinutes, setIntervalMinutes] = useState(settings.intervalMinutes || 60);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled !== false);
  const [quietStart, setQuietStart] = useState(settings.quietStart || '22:00');
  const [quietEnd, setQuietEnd] = useState(settings.quietEnd || '07:00');
  const [permissionStatus, setPermissionStatus] = useState(notificationService.getPermission());

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setPermissionStatus(res);
  };

  const handleTestNotification = () => {
    notificationService.sendLocalNotification(
      '💧 HydroPet Test Alert',
      'Hydration reminder is active! Keep your pet happy and stay healthy.'
    );
  };

  const handleSave = () => {
    onSave({
      enabled,
      intervalMinutes,
      soundEnabled,
      quietStart,
      quietEnd
    });
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
          <Bell className="w-5 h-5 text-cyan-400" />
          <h3 className="font-heading font-bold text-lg text-sky-100">Reminder Settings</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Set up smart notification alerts & sound chimes to keep your drinking habits consistent.
        </p>

        {/* Browser Permission Banner */}
        {permissionStatus !== 'granted' && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <div className="text-xs text-amber-200">
              <span className="block font-bold">Notifications Disabled</span>
              <span className="opacity-80">Enable browser notifications to receive alerts.</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Enable
            </button>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-pill">
            <span className="text-xs font-semibold text-sky-100">Enable Water Reminders</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Interval Selector */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-2">Reminder Interval:</label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setIntervalMinutes(mins)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    intervalMinutes === mins
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'glass-pill border-slate-700/50 text-slate-400 hover:border-slate-600 text-xs'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60} hour${mins > 60 ? 's' : ''}` : `${mins} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-pill">
            <div className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="text-xs font-semibold text-sky-100">Sound Effects & Chimes</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Quiet Hours */}
          <div className="p-3.5 rounded-2xl glass-pill">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-sky-100">Quiet Hours (Sleeping Mode)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Silence Starts</span>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-semibold"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Silence Ends</span>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Test Notification Button */}
          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full py-2.5 rounded-xl border border-sky-500/30 glass-button text-sky-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send Test Notification
          </button>
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
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
