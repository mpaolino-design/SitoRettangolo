class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.source = null;
    this.stream = null;
    this.running = false;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.running = true;
  }

  stop() {
    this.running = false;
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  getVolume() {
    if (!this.analyser || !this.running) return 0;
    this.analyser.getByteTimeDomainData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const val = (this.dataArray[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / this.dataArray.length);
    return Math.min(rms * 2.5, 1);
  }
}

function samplePath(el, n) {
  const pts = [];
  const len = el.getTotalLength();
  for (let i = 0; i < n; i++) {
    const p = el.getPointAtLength((i / (n - 1)) * len);
    pts.push(p);
  }
  return pts;
}

function buildPathData(pts) {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${pts[i].x},${pts[i].y}`;
  }
  return d;
}

function starPoints(cx, cy, r1, r2, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(' ');
}

class StarField {
  constructor() {
    this.container = document.getElementById('stars');
    this.stars = [];
    this.time = 0;
    this.createStars();
  }

  createStars() {
    const configs = [
      { cx: 100, cy: 100, points: 5, r1: 60, r2: 22, maxScale: 4.0, rotSpeed: 0.4, phase: 0 },
      { cx: 1079, cy: 100, points: 6, r1: 70, r2: 25, maxScale: 3.5, rotSpeed: 0.3, phase: 1.0 },
      { cx: 589, cy: 60, points: 7, r1: 55, r2: 20, maxScale: 4.5, rotSpeed: 0.5, phase: 0.7 },
      { cx: 60, cy: 700, points: 5, r1: 65, r2: 24, maxScale: 4.0, rotSpeed: 0.35, phase: 2.1 },
      { cx: 1119, cy: 750, points: 8, r1: 60, r2: 22, maxScale: 3.8, rotSpeed: 0.45, phase: 1.5 },
      { cx: 60, cy: 1400, points: 6, r1: 70, r2: 26, maxScale: 4.2, rotSpeed: 0.5, phase: 3.0 },
      { cx: 1119, cy: 1450, points: 5, r1: 65, r2: 24, maxScale: 3.5, rotSpeed: 0.4, phase: 0.3 },
      { cx: 589, cy: 1280, points: 7, r1: 50, r2: 18, maxScale: 3.0, rotSpeed: 0.6, phase: 1.8 },
      { cx: 100, cy: 2100, points: 6, r1: 60, r2: 22, maxScale: 4.0, rotSpeed: 0.3, phase: 2.5 },
      { cx: 1079, cy: 2150, points: 7, r1: 70, r2: 25, maxScale: 3.5, rotSpeed: 0.35, phase: 0.9 },
      { cx: 589, cy: 2496, points: 5, r1: 55, r2: 20, maxScale: 4.5, rotSpeed: 0.5, phase: 1.2 },
      { cx: 200, cy: 500, points: 8, r1: 45, r2: 16, maxScale: 3.5, rotSpeed: 0.55, phase: 2.8 },
      { cx: 979, cy: 500, points: 6, r1: 50, r2: 18, maxScale: 3.2, rotSpeed: 0.4, phase: 0.6 },
      { cx: 200, cy: 1900, points: 5, r1: 50, r2: 18, maxScale: 3.8, rotSpeed: 0.45, phase: 3.2 },
      { cx: 979, cy: 1900, points: 7, r1: 55, r2: 20, maxScale: 3.5, rotSpeed: 0.35, phase: 1.7 },
    ];

    const ns = 'http://www.w3.org/2000/svg';
    for (const cfg of configs) {
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('transform', `translate(${cfg.cx},${cfg.cy})`);
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', starPoints(0, 0, cfg.r1, cfg.r2, cfg.points));
      poly.classList.add('star');
      g.appendChild(poly);
      this.container.appendChild(g);
      this.stars.push({ el: g, ...cfg });
    }
  }

  update(t, dt) {
    this.time += dt;
    for (const s of this.stars) {
      const scale = 1 + t * (s.maxScale - 1);
      const rot = Math.sin(this.time * s.rotSpeed + s.phase) * t * 20;
      s.el.setAttribute('transform', `translate(${s.cx},${s.cy}) scale(${scale}) rotate(${rot})`);
      s.el.style.opacity = t;
    }
  }
}

class Animation {
  constructor() {
    this.pupilEl = document.getElementById('pupil');
    this.beakEl = document.getElementById('beak');
    this.volumeFill = document.getElementById('volume-fill');
    this.smoothingEl = document.getElementById('smoothing-slider');
    this.sensitivityEl = document.getElementById('sensitivity-slider');

    this.currentValue = 0;
    this.lastTime = 0;
    this.engine = new AudioEngine();
    this.starField = new StarField();

    this.pupilOrig = { cx: 449.81, cy: 1131.84, r: 47.38 };
    this.pupilMove = { cx: 387.6, cy: 1086.86, r: 26.14 };

    this.beakSamples = 80;
    this.beakPtsQ = samplePath(this.beakEl, this.beakSamples);

    const movePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    movePath.setAttribute('d', 'M899.96,1258.23c38.68-.75,72.24-.96,101.87-2.3,0,0-9.35,26.44-181.49,121.98,0,0-141.55-23.45-180.05-108.47,0,0,120.71-176.18,58.53-288.84,32.7-.61,151.29-83.14,227.17-65.52,39.57,9.19,105.08,40.36,126.93,63.63,0,0-222.12,114.12-373.95,267.22,0,0,104.65,14.56,220.98,12.3Z');
    this.beakPtsM = samplePath(movePath, this.beakSamples);

    this.bindUI();
  }

  get smoothing() {
    return parseFloat(this.smoothingEl.value) / 100;
  }

  get sensitivity() {
    return parseFloat(this.sensitivityEl.value);
  }

  update(value, time, dt) {
    const smooth = this.smoothing;
    const factor = (1 - smooth) * 0.95 + 0.05;
    this.currentValue += (value - this.currentValue) * factor;

    const t = Math.min(this.currentValue * this.sensitivity, 1);

    const q = this.pupilOrig;
    const m = this.pupilMove;
    this.pupilEl.setAttribute('cx', q.cx + (m.cx - q.cx) * t);
    this.pupilEl.setAttribute('cy', q.cy + (m.cy - q.cy) * t);
    this.pupilEl.setAttribute('r', q.r + (m.r - q.r) * t);

    const interpolated = this.beakPtsQ.map((p, i) => ({
      x: p.x + (this.beakPtsM[i].x - p.x) * t,
      y: p.y + (this.beakPtsM[i].y - p.y) * t
    }));
    this.beakEl.setAttribute('d', buildPathData(interpolated));

    this.starField.update(t, dt);

    this.volumeFill.style.width = (t * 100) + '%';
  }

  loop = (timestamp) => {
    const dt = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0.016;
    this.lastTime = timestamp;
    const vol = this.engine.running ? this.engine.getVolume() : 0;
    this.update(vol, timestamp / 1000, dt);
    requestAnimationFrame(this.loop);
  }

  startLoop() {
    this.loop(0);
  }

  bindUI() {
    const btn = document.getElementById('mic-button');
    btn.addEventListener('click', async () => {
      if (this.engine.running) {
        this.engine.stop();
        btn.textContent = '🎤 Attiva microfono';
        btn.classList.remove('active');
        btn.disabled = false;
        this.currentValue = 0;
        this.update(0, 0, 0.016);
        return;
      }
      try {
        btn.disabled = true;
        btn.textContent = '⏳ Richiedo accesso...';
        await this.engine.start();
        btn.textContent = '🔴 Disattiva microfono';
        btn.classList.add('active');
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          alert("Permesso microfono negato. Concedi l'accesso nelle impostazioni del browser.");
        } else if (err.name === 'NotFoundError') {
          alert('Microfono non trovato. Collega un microfono e riprova.');
        } else if (err.name === 'NotReadableError') {
          alert('Microfono occupato da un\'altra applicazione.');
        } else {
          alert('Errore microfono: ' + err.message);
        }
        btn.textContent = '🎤 Attiva microfono';
      } finally {
        btn.disabled = false;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const anim = new Animation();
  anim.startLoop();
});
