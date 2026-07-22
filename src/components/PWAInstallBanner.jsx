import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (iosDevice && !isStandalone) {
      setIsIOS(true);
    }

    // Catch Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (dismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <>
      <div className="w-full max-w-sm mx-auto mb-4 p-3.5 rounded-2xl glass-card bg-gradient-to-r from-sky-600/30 to-cyan-600/30 border border-sky-400/40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="block font-heading font-bold text-xs text-white">Install HydroPet App</span>
            <span className="block text-[11px] text-slate-300">Add to home screen for offline use & alerts</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Instructions Popup */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-bold text-lg text-white mb-2">Install on iOS Safari</h3>
            <p className="text-xs text-slate-300 mb-4">Follow these simple steps to install HydroPet on your iPhone or iPad:</p>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                <Share className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                <PlusSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>2. Scroll down & select <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
