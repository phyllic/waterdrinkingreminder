import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

export default function PWAInstallBanner({ showModal, onCloseModal }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (standalone) {
      setIsInstalled(true);
    }
    if (iosDevice && !standalone) {
      setIsIOS(true);
    }

    // Catch Chrome / Android / Edge install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // When showModal prop changes from parent (e.g. bottom bar button click)
  useEffect(() => {
    if (showModal) {
      handleTriggerInstall();
    }
  }, [showModal]);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
      if (onCloseModal) onCloseModal();
    } else {
      setShowGuideModal(true);
    }
  };

  const closeModal = () => {
    setShowGuideModal(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      {/* Top Banner (Only if not installed and not dismissed) */}
      {!dismissedBanner && !isInstalled && (deferredPrompt || isIOS) && (
        <div className="w-full max-w-sm mx-auto mb-4 p-3.5 rounded-2xl glass-card bg-gradient-to-r from-sky-600/30 to-cyan-600/30 border border-sky-400/40 flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="block font-heading font-bold text-xs text-white">Install HydroPet App</span>
              <span className="block text-[11px] text-slate-300">Add to home screen for offline & alerts</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTriggerInstall}
              className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Install
            </button>
            <button
              onClick={() => setDismissedBanner(true)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detailed Install Modal (Triggered by Bottom Bar or Banner) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-lg text-white">Install App to Home Screen</h3>
            </div>

            {isInstalled ? (
              <div className="py-4 text-center">
                <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-2 animate-bounce" />
                <p className="font-heading font-bold text-base text-white">HydroPet is Installed!</p>
                <p className="text-xs text-slate-300 mt-1">You are using the home screen PWA app.</p>
              </div>
            ) : isIOS ? (
              <div>
                <p className="text-xs text-slate-300 mb-4">Follow these simple steps on iOS Safari to add HydroPet to your home screen:</p>
                <div className="space-y-3 text-xs mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                    <Share className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>1. Tap the <strong>Share</strong> icon in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                    <PlusSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>2. Scroll down & select <strong>"Add to Home Screen"</strong>.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-300 mb-4">Add HydroPet to your mobile home screen for quick 1-tap access, offline usage, and hydration reminder alerts!</p>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                    <Download className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>1. Tap <strong>"Install"</strong> in your browser menu (⋮).</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill">
                    <PlusSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>2. Confirm <strong>"Add to Home Screen"</strong>.</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
