import { useState } from 'react';
import { Download, X } from 'lucide-react';
import usePWAInstall from '../hooks/usePWAInstall';

const PWAInstallPrompt = () => {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(!!sessionStorage.getItem('pwa_dismissed'));
  const [installed, setInstalled] = useState(false);

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) setInstalled(true);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_dismissed', '1');
    setDismissed(true);
  };

  if (!canInstall || dismissed || installed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-primary-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/icons/icon-72x72.png" alt="Service Knock" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold text-sm">Service Knock</span>
          </div>
          <button onClick={handleDismiss} className="text-white/70 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="text-slate-700 text-sm font-semibold mb-0.5">Install the App</p>
          <p className="text-slate-500 text-xs leading-relaxed">
            Add Service Knock to your home screen for faster access and offline support.
          </p>
          <button
            onClick={handleInstall}
            className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={15} /> Install App
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
