const KEYS = {
  LOGS: 'hydropet_logs',
  GOAL: 'hydropet_daily_goal',
  USER_PROFILE: 'hydropet_user_profile',
  COMPANION: 'hydropet_companion',
  ACHIEVEMENTS: 'hydropet_achievements',
  REMINDERS: 'hydropet_reminders',
  STREAK: 'hydropet_streak_data'
};

export const storageService = {
  // Get today's date string (YYYY-MM-DD)
  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  // Hydration Logs
  getLogs() {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getTodayLogs() {
    const today = this.getTodayKey();
    return this.getLogs().filter(log => log.date === today);
  },

  getTodayTotal() {
    return this.getTodayLogs().reduce((sum, log) => sum + log.amount, 0);
  },

  addLog(amount, presetName = 'Custom') {
    const logs = this.getLogs();
    const newLog = {
      id: Date.now().toString(),
      date: this.getTodayKey(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      amount: Number(amount),
      presetName
    };
    logs.push(newLog);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
    this.updateStreak();
    return newLog;
  },

  deleteLog(id) {
    const logs = this.getLogs().filter(l => l.id !== id);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  // Daily Goal (in ml)
  getGoal() {
    try {
      const g = localStorage.getItem(KEYS.GOAL);
      return g ? Number(g) : 2500;
    } catch {
      return 2500;
    }
  },

  setGoal(goalMl) {
    localStorage.setItem(KEYS.GOAL, String(goalMl));
  },

  // User Profile for Goal Calculator
  getUserProfile() {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : { weightKg: 65, activityLevel: 'moderate' };
    } catch {
      return { weightKg: 65, activityLevel: 'moderate' };
    }
  },

  setUserProfile(profile) {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Companion Data ('flora' or 'aqua')
  getCompanion() {
    try {
      const data = localStorage.getItem(KEYS.COMPANION);
      return data ? JSON.parse(data) : { type: 'flora', name: 'Bloom', xp: 0, level: 1 };
    } catch {
      return { type: 'flora', name: 'Bloom', xp: 0, level: 1 };
    }
  },

  saveCompanion(companionData) {
    localStorage.setItem(KEYS.COMPANION, JSON.stringify(companionData));
  },

  addXP(amountXp) {
    const comp = this.getCompanion();
    comp.xp += amountXp;
    
    // Level formula: level 1: 0-500, level 2: 500-1500, level 3: 1500-3000, level 4: 3000+
    let newLevel = 1;
    if (comp.xp >= 3000) newLevel = 4;
    else if (comp.xp >= 1500) newLevel = 3;
    else if (comp.xp >= 500) newLevel = 2;

    const leveledUp = newLevel > comp.level;
    comp.level = newLevel;
    this.saveCompanion(comp);
    return { companion: comp, leveledUp };
  },

  // Streak Counter
  getStreak() {
    try {
      const data = localStorage.getItem(KEYS.STREAK);
      return data ? JSON.parse(data) : { currentStreak: 0, lastGoalDate: null, maxStreak: 0 };
    } catch {
      return { currentStreak: 0, lastGoalDate: null, maxStreak: 0 };
    }
  },

  updateStreak() {
    const today = this.getTodayKey();
    const totalToday = this.getTodayTotal();
    const goal = this.getGoal();
    const streak = this.getStreak();

    if (totalToday >= goal && streak.lastGoalDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (streak.lastGoalDate === yesterdayKey) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }
      streak.lastGoalDate = today;
      if (streak.currentStreak > streak.maxStreak) {
        streak.maxStreak = streak.currentStreak;
      }
      localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
    }
  },

  // Achievements
  getAchievements() {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  unlockAchievement(badgeId) {
    const current = this.getAchievements();
    if (!current.includes(badgeId)) {
      current.push(badgeId);
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(current));
      return true;
    }
    return false;
  },

  // Reminders Settings
  getReminderSettings() {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      return data ? JSON.parse(data) : {
        enabled: true,
        intervalMinutes: 60,
        soundEnabled: true,
        quietStart: '22:00',
        quietEnd: '07:00'
      };
    } catch {
      return {
        enabled: true,
        intervalMinutes: 60,
        soundEnabled: true,
        quietStart: '22:00',
        quietEnd: '07:00'
      };
    }
  },

  saveReminderSettings(settings) {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(settings));
  }
};
