/* Stage — draws the current frame of the sequence on a full-viewport canvas. */
export class Stage {
  constructor(canvas, store, seq, poster) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d', { alpha: false });
    this.store = store; this.seq = seq; this.poster = poster;
    this.p = 0; this.pending = false; this.on = false; this.bg = '#0b0b0a';
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  destroy() { window.removeEventListener('resize', this.resize); }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.5 : 2);
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.request();
  }
  /* progress (0..1) → fractional global frame index, piecewise linear over the keyframes */
  frameAt(p) {
    const k = this.seq.keyframes;
    if (p <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) {
      if (p <= k[i][0]) { const [p0, f0] = k[i - 1], [p1, f1] = k[i]; const t = p1 === p0 ? 1 : (p - p0) / (p1 - p0); return f0 + (f1 - f0) * t; }
    }
    return k[k.length - 1][1];
  }
  setProgress(p) { this.p = p; this.request(); }
  request() { if (this.pending) return; this.pending = true; requestAnimationFrame(() => { this.pending = false; this.render(); }); }
  draw(img, alpha) {
    const cw = this.canvas.width, ch = this.canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    this.ctx.globalAlpha = alpha; this.ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh); this.ctx.globalAlpha = 1;
  }
  render() {
    const f = Math.max(0, Math.min(this.store.total - 1, this.frameAt(this.p)));
    const i = Math.floor(f), frac = f - i;
    const a = this.store.nearest(i);
    if (!a) return;                       // nothing decoded yet: the poster stays visible underneath
    const ctx = this.ctx;
    ctx.fillStyle = this.bg; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw(a, 1);
    const b = this.store.frames[i + 1];
    if (frac > 0.02 && b && b !== a && this.store.ready(i + 1)) this.draw(b, frac);
    if (!this.on) { this.on = true; this.canvas.classList.add('on'); }
  }
}
