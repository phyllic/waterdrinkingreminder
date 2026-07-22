// Notification Service for browser & PWA background reminders
import { soundService } from './soundService';

class NotificationService {
  constructor() {
    this.timerId = null;
  }

  isSupported() {
    return 'Notification' in window;
  }

  getPermission() {
    return this.isSupported() ? Notification.permission : 'denied';
  }

  async requestPermission() {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  sendLocalNotification(title, body) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    // Check quiet hours
    const settings = JSON.parse(localStorage.getItem('hydropet_reminders') || '{}');
    if (this.isQuietHours(settings.quietStart, settings.quietEnd)) {
      return;
    }

    if (settings.soundEnabled !== false) {
      soundService.playReminderChime();
    }

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: 'hydropet-reminder'
        });
      });
    } else {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag: 'hydropet-reminder'
      });
    }
  }

  isQuietHours(startStr = '22:00', endStr = '07:00') {
    if (!startStr || !endStr) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);

    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;

    if (startMins < endMins) {
      return currentMins >= startMins && currentMins < endMins;
    } else {
      // Overnight (e.g. 22:00 to 07:00)
      return currentMins >= startMins || currentMins < endMins;
    }
  }

  startReminderTimer(intervalMinutes = 60, companionName = 'Your Pet') {
    this.stopReminderTimer();
    if (!intervalMinutes || intervalMinutes <= 0) return;

    const ms = intervalMinutes * 60 * 1000;
    this.timerId = setInterval(() => {
      const messages = [
        `💧 ${companionName} is getting thirsty! Time for a glass of water!`,
        `🌱 Keep your streak alive! Drink water to help ${companionName} grow!`,
        `🌊 Hydration check! A sip of water boosts energy & focus.`,
        `⭐ You're doing great today! Time to log your next water intake.`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      this.sendLocalNotification('HydroPet Reminder', randomMsg);
    }, ms);
  }

  stopReminderTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const notificationService = new NotificationService();
