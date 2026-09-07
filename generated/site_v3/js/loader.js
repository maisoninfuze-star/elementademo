/* FrameStore — staged preloading of the scroll sequence frames. */
export class FrameStore {
  constructor(seq, set, base) {
    this.seq = seq; this.set = set; this.base = base;
    this.total = seq.total;
    this.frames = new Array(this.total).fill(null);
    this.index = [];
    seq.segments.forEach(s => { for (let k = 1; k <= s.n; k++) this.index.push({ seg: s.id, k }); });
    this.loaded = 0; this.failed = 0;
    this.onProgress = null; this.onFrame = null;
  }
  src(i) { const { seg, k } = this.index[i]; return `${this.base}/${this.set}/${seg}/f_${String(k).padStart(3, '0')}.webp`; }
  ready(i) { const im = this.frames[i]; return !!(im && im.complete && im.naturalWidth); }
  nearest(i) {
    i = Math.max(0, Math.min(this.total - 1, i));
    for (let j = i; j >= 0; j--) if (this.ready(j)) return this.frames[j];
    for (let j = i + 1; j < this.total; j++) if (this.ready(j)) return this.frames[j];
    return null;
  }
  load(list, concurrency = 6) {
    const todo = list.filter(i => !this.frames[i]);
    if (!todo.length) return Promise.resolve();
    return new Promise(resolve => {
      let next = 0, done = 0;
      const step = () => {
        if (next >= todo.length) return;
        const i = todo[next++];
        const im = new Image();
        im.decoding = 'async';
        const fin = ok => { done++; if (ok) this.loaded++; else { this.failed++; this.frames[i] = null; } this.onProgress && this.onProgress(this.loaded / this.total); if (ok) this.onFrame && this.onFrame(i); if (done === todo.length) resolve(); else step(); };
        im.onload = () => fin(true); im.onerror = () => fin(false);
        this.frames[i] = im; im.src = this.src(i);
      };
      for (let c = 0; c < concurrency; c++) step();
    });
  }
  /* Load order: every 2nd frame of the opening, the rest of the opening, then the remaining frames in two passes. */
  plan(firstCount) {
    const all = [...Array(this.total).keys()];
    const first = all.slice(0, firstCount), rest = all.slice(firstCount);
    return [first.filter(i => i % 2 === 0), first.filter(i => i % 2 === 1), rest.filter(i => i % 2 === 0), rest.filter(i => i % 2 === 1)];
  }
  async run(plan) { for (const list of plan) await this.load(list); }
}
