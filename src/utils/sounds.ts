export function playBeep(frequency = 800, duration = 100, volume = 0.1): void {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "square";
    gainNode.gain.value = volume;

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch {
    // audio not available
  }
}

export function playClick(): void {
  playBeep(600, 50, 0.05);
}

export function playSuccess(): void {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "square";
      gain.gain.value = 0.08;
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.1);
    });
  } catch {
    // audio not available
  }
}

export function playError(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = "sawtooth";
    gain.gain.value = 0.08;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // audio not available
  }
}

export function playBigWin(): void {
  try {
    const ctx = new AudioContext();
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "square";
      gain.gain.value = 0.06;
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.12);
    });
  } catch {
    // audio not available
  }
}
