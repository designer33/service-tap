// Shared AudioContext singleton — must be resumed after a user gesture.
// Call unlockAudio() on first user interaction; playBeep() anywhere after that.

let _ctx = null;

function getCtx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _ctx;
}

export function unlockAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (_) {}
}

export function playBeep(freq = 880, duration = 0.45, vol = 0.3) {
  try {
    const ctx = getCtx();

    const doPlay = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    };

    // If suspended (no user gesture yet), resume first then play
    if (ctx.state === 'suspended') {
      ctx.resume().then(doPlay).catch(() => {});
    } else {
      doPlay();
    }
  } catch (_) {}
}
