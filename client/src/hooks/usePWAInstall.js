import { useState, useEffect } from 'react';

let deferredPrompt = null;
const listeners = new Set();

const notify = () => listeners.forEach(fn => fn(deferredPrompt));

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

const usePWAInstall = () => {
  const [prompt, setPrompt] = useState(deferredPrompt);

  useEffect(() => {
    const handler = (p) => setPrompt(p);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const isStandalone = typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches;

  const install = async () => {
    if (!prompt) return false;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    deferredPrompt = null;
    notify();
    return outcome === 'accepted';
  };

  return { canInstall: !!prompt && !isStandalone, install };
};

export default usePWAInstall;
