// Perf watchdog: fires ONCE when the average fps is < 24 across 2 consecutive 4s windows.
// Ignores 30fps-capped displays (median ≈ 33.3ms, low variance), the intro (t < 3s),
// hidden tabs and page transitions (reset()).
export class Watchdog {
  private frames: number[] = [];
  private winStart = -1;
  private bad = 0;
  private fired = false;
  constructor(private onFire: () => void) {}
  reset() { this.frames = []; this.winStart = -1; this.bad = 0; }
  frame(deltaMs: number, t: number) {
    if (this.fired || document.hidden || t < 3) return;
    if (this.winStart < 0) this.winStart = t;
    this.frames.push(deltaMs);
    if (t - this.winStart < 4) return;
    const f = this.frames.slice().sort((a, b) => a - b);
    const avg = f.length / (t - this.winStart);
    const med = f[f.length >> 1];
    const p10 = f[Math.floor(f.length * 0.1)], p90 = f[Math.floor(f.length * 0.9)];
    const capped30 = Math.abs(med - 33.3) < 2 && p90 - p10 < 6;
    this.bad = avg < 24 && !capped30 ? this.bad + 1 : 0;
    this.frames = [];
    this.winStart = t;
    if (this.bad >= 2) { this.fired = true; this.onFire(); }
  }
}
