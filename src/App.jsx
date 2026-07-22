import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Droplet, BarChart2, Award, Settings, Bell, Calculator, Volume2, VolumeX, Sparkles } from 'lucide-react';

import CompanionAvatar from './components/CompanionAvatar';
import LiquidWave from './components/LiquidWave';
import QuickAddPanel from './components/QuickAddPanel';
import GoalCalculatorModal from './components/GoalCalculatorModal';
import ReminderModal from './components/ReminderModal';
import AnalyticsView from './components/AnalyticsView';
import AchievementsView from './components/AchievementsView';
import PWAInstallBanner from './components/PWAInstallBanner';

import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import { notificationService } from './services/notificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'analytics', 'achievements'
  
  // App State
  const [logs, setLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [goalMl, setGoalMl] = useState(2500);
  const [userProfile, setUserProfile] = useState({ weightKg: 65, activityLevel: 'moderate' });
  const [companion, setCompanion] = useState({ type: 'flora', name: 'Bloom', xp: 0, level: 1 });
  const [streakData, setStreakData] = useState({ currentStreak: 0, maxStreak: 0 });
  const [achievements, setAchievements] = useState([]);
  const [reminderSettings, setReminderSettings] = useState({ enabled: true, intervalMinutes: 60, soundEnabled: true });
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Initial Load
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = () => {
    const loadedLogs = storageService.getLogs();
    const todaySum = storageService.getTodayTotal();
    const loadedGoal = storageService.getGoal();
    const loadedProfile = storageService.getUserProfile();
    const loadedComp = storageService.getCompanion();
    const loadedStreak = storageService.getStreak();
    const loadedBadges = storageService.getAchievements();
    const loadedReminders = storageService.getReminderSettings();

    setLogs(loadedLogs);
    setTodayTotal(todaySum);
    setGoalMl(loadedGoal);
    setUserProfile(loadedProfile);
    setCompanion(loadedComp);
    setStreakData(loadedStreak);
    setAchievements(loadedBadges);
    setReminderSettings(loadedReminders);

    soundService.setMuted(!loadedReminders.soundEnabled);
    setIsMuted(!loadedReminders.soundEnabled);

    if (loadedReminders.enabled) {
      notificationService.startReminderTimer(loadedReminders.intervalMinutes, loadedComp.name);
    }
  };

  // Add Water Handler
  const handleAddWater = (amount, presetName = 'Custom') => {
    // 1. Save Log
    storageService.addLog(amount, presetName);

    // 2. Play Gulp Sound
    soundService.playGulpSound();

    // 3. Add XP (1ml = 1 XP)
    const { companion: updatedComp, leveledUp } = storageService.addXP(amount);

    // 4. Update Badges & Streaks
    storageService.unlockAchievement('first_sip');
    
    const newTotal = storageService.getTodayTotal();
    setTodayTotal(newTotal);
    setLogs(storageService.getLogs());
    setCompanion(updatedComp);
    setStreakData(storageService.getStreak());

    // Goal Reached Check
    if (newTotal >= goalMl && todayTotal < goalMl) {
      storageService.unlockAchievement('goal_reached');
      triggerConfetti();
      soundService.playAchievementChime();
      notificationService.sendLocalNotification(
        '🏆 Daily Goal Reached!',
        `Awesome job! You reached your ${goalMl}ml water goal today!`
      );
    } else if (leveledUp) {
      storageService.unlockAchievement('level_2');
      triggerConfetti();
      soundService.playAchievementChime();
      notificationService.sendLocalNotification(
        '⭐ Pet Leveled Up!',
        `${updatedComp.name} has evolved to Level ${updatedComp.level}!`
      );
    }

    setAchievements(storageService.getAchievements());
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDeleteLog = (id) => {
    storageService.deleteLog(id);
    setLogs(storageService.getLogs());
    setTodayTotal(storageService.getTodayTotal());
  };

  const handleSaveGoal = (newGoal, newProfile) => {
    storageService.setGoal(newGoal);
    storageService.setUserProfile(newProfile);
    setGoalMl(newGoal);
    setUserProfile(newProfile);
  };

  const handleSaveReminders = (newSettings) => {
    storageService.saveReminderSettings(newSettings);
    setReminderSettings(newSettings);
    soundService.setMuted(!newSettings.soundEnabled);
    setIsMuted(!newSettings.soundEnabled);

    if (newSettings.enabled) {
      notificationService.startReminderTimer(newSettings.intervalMinutes, companion.name);
    } else {
      notificationService.stopReminderTimer();
    }
  };

  const handleSwitchCompanion = (newType) => {
    const newName = newType === 'flora' ? 'Bloom' : 'Aqua';
    const updated = { ...companion, type: newType, name: newName };
    storageService.saveCompanion(updated);
    setCompanion(updated);
    triggerConfetti();
  };

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundService.setMuted(newMuted);
    const updated = { ...reminderSettings, soundEnabled: !newMuted };
    storageService.saveReminderSettings(updated);
    setReminderSettings(updated);
  };

  const hydrationPercent = Math.min(100, Math.round((todayTotal / goalMl) * 100));

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Bar */}
      <header className="p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Droplet className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h1 className="font-heading font-black text-lg text-white leading-tight">HydroPet</h1>
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">Hydration Companion</span>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-2xl glass-pill text-slate-300 hover:text-white transition-colors"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="p-2 rounded-2xl glass-pill text-slate-300 hover:text-white transition-colors"
            title="Goal Calculator"
          >
            <Calculator className="w-4 h-4 text-sky-400" />
          </button>
          <button
            onClick={() => setShowReminderModal(true)}
            className="p-2 rounded-2xl glass-pill text-slate-300 hover:text-white transition-colors relative"
            title="Reminders"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {reminderSettings.enabled && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-2 z-10 overflow-y-auto">
        <PWAInstallBanner />

        {activeTab === 'home' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Pet Companion Avatar Visualizer */}
            <CompanionAvatar
              type={companion.type}
              level={companion.level}
              hydrationPercent={hydrationPercent}
              name={companion.name}
            />

            {/* Liquid Wave Progress Card */}
            <LiquidWave currentMl={todayTotal} goalMl={goalMl} />

            {/* Quick Add Intake Preset Buttons */}
            <QuickAddPanel onAddWater={handleAddWater} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            logs={logs}
            goalMl={goalMl}
            streakData={streakData}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            companion={companion}
            unlockedBadges={achievements}
            onSwitchCompanion={handleSwitchCompanion}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-[#090d16] via-[#090d16]/90 to-transparent pointer-events-none">
        <div className="glass-card rounded-3xl p-2 border border-sky-500/20 shadow-2xl flex items-center justify-around pointer-events-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-5 h-5" />
            <span className="text-[10px] font-heading tracking-wide">Hydrate</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[10px] font-heading tracking-wide">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-heading tracking-wide">Badges</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showGoalModal && (
        <GoalCalculatorModal
          currentGoal={goalMl}
          profile={userProfile}
          onSave={handleSaveGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}

      {showReminderModal && (
        <ReminderModal
          settings={reminderSettings}
          onSave={handleSaveReminders}
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
}
