# Maschera Sonora Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone web page that captures microphone audio and animates a mask between quiet and movement SVG states via cross-fade and pupil interpolation.

**Architecture:** Single `index.html` with both SVGs inlined. CSS for fullscreen layout and controls. `app.js` handles AudioContext setup, real-time RMS volume analysis, and per-frame SVG manipulation.

**Tech Stack:** Vanilla JS (no frameworks), Web Audio API, SVG inline in HTML

---
## File Structure

| File | Responsibility |
|------|---------------|
| `index.html` | Entry point; embeds both SVGs as hidden layers; UI controls |
| `style.css` | Fullscreen centering, control panel styling, responsive |
| `app.js` | `AudioEngine` class (mic, AnalyserNode, RMS); `Animation` class (rAF loop, opacity, pupil); UI bindings |

---

### Task 1: Create `index.html` — SVG layers and UI skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML structure**

Create `index.html` with:
- DOCTYPE and `<meta viewport>` for mobile
- Both SVGs inlined from their source files, each wrapped in a `<div class="svg-layer">` inside `#mask-container`
- Quiet layer has `id="layer-quiet"`, Movement layer has `id="layer-move"`
- Pupil circles given `id="pupil-quiet"` and `id="pupil-move"` (the `<circle>` elements inside their respective SVG groups)
- Control panel with: `#mic-button`, `#sensitivity-slider`, `#smoothing-slider`, `#volume-meter`
- `<script src="app.js">` at bottom of body

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maschera Sonora</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="container">
    <div id="mask-container">
      <div class="svg-layer" id="layer-quiet"><!-- SVG quiete inlined --></div>
      <div class="svg-layer" id="layer-move"><!-- SVG movimento inlined --></div>
    </div>
    <div id="controls">
      <button id="mic-button">🎤 Attiva microfono</button>
      <label>Sensibilità <input type="range" id="sensitivity-slider" min="1" max="10" value="5"></label>
      <label>Smoothing <input type="range" id="smoothing-slider" min="0" max="100" value="50"></label>
      <div id="volume-meter"><div id="volume-fill"></div></div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Embed the SVGs as inline content**

Copy the content of `STATO DI QUIETE.svg` into `#layer-quiet`, and `STATO DI Movimento.svg` into `#layer-move`.

In the quiet SVG group `OCChio`, add `id="pupil-quiet"` to the pupil `<circle>` (the second circle, `cx="449.81" cy="1131.84" r="47.38"`).

In the movement SVG group `Occhio`, add `id="pupil-move"` to the pupil `<circle>` (the second circle, `cx="395.33" cy="1093.06" r="35.4"`).

---

### Task 2: Create `style.css` — fullpage layout and controls

**Files:**
- Create: `style.css`

- [ ] **Step 1: Write the CSS**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a1a2e;
  color: #eee;
  font-family: system-ui, sans-serif;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

#mask-container {
  position: relative;
  width: 90vmin;
  height: auto;
  max-height: 80vh;
  aspect-ratio: 1179 / 2556;
}

.svg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.svg-layer svg {
  width: 100%;
  height: 100%;
  display: block;
}

#layer-quiet { z-index: 1; }
#layer-move { z-index: 2; }

#controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  width: 90vmin;
  max-width: 400px;
}

#controls label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

#controls input[type="range"] { flex: 1; margin-left: 1rem; }

#mic-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background: #e94560;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

#mic-button:hover { background: #ff6b81; }
#mic-button:disabled { background: #555; cursor: not-allowed; }

#mic-button.active { background: #0f3460; }
#mic-button.active:hover { background: #16213e; }

#volume-meter {
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

#volume-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #0f3460, #e94560);
  transition: width 0.05s;
}
```

---

### Task 3: Create `app.js` — Audio Engine

**Files:**
- Create: `app.js`

- [ ] **Step 1: Write `AudioEngine` class**

```javascript
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
```

- [ ] **Step 2: Write `Animation` class**

```javascript
class Animation {
  constructor() {
    this.quietEl = document.getElementById('layer-quiet');
    this.moveEl = document.getElementById('layer-move');
    this.pupilQuiet = document.getElementById('pupil-quiet');
    this.pupilMove = document.getElementById('pupil-move');
    this.volumeFill = document.getElementById('volume-fill');
    this.smoothingEl = document.getElementById('smoothing-slider');
    this.sensitivityEl = document.getElementById('sensitivity-slider');

    this.currentValue = 0;
    this.engine = new AudioEngine();

    // Store original pupil positions
    this.pupilQuietOrig = { cx: 449.81, cy: 1131.84, r: 47.38 };
    this.pupilMoveOrig = { cx: 395.33, cy: 1093.06, r: 35.4 };

    this.bindUI();
  }

  get smoothing() {
    return parseFloat(this.smoothingEl.value) / 100;
  }

  get sensitivity() {
    return parseFloat(this.sensitivityEl.value);
  }

  update(value) {
    const smooth = this.smoothing;
    const factor = (1 - smooth) * 0.95 + 0.05;
    this.currentValue += (value - this.currentValue) * factor;

    const t = Math.min(this.currentValue * this.sensitivity, 1);

    // Cross-fade
    this.quietEl.style.opacity = 1 - t;
    this.moveEl.style.opacity = t;

    // Pupil interpolation
    const q = this.pupilQuietOrig;
    const m = this.pupilMoveOrig;
    const cx = q.cx + (m.cx - q.cx) * t;
    const cy = q.cy + (m.cy - q.cy) * t;
    const r = q.r + (m.r - q.r) * t;

    this.pupilQuiet.setAttribute('cx', cx);
    this.pupilQuiet.setAttribute('cy', cy);
    this.pupilQuiet.setAttribute('r', r);

    if (this.pupilMove) {
      this.pupilMove.setAttribute('cx', cx);
      this.pupilMove.setAttribute('cy', cy);
      this.pupilMove.setAttribute('r', r);
    }

    // Volume meter
    this.volumeFill.style.width = (t * 100) + '%';
  }

  loop = () => {
    const vol = this.engine.running ? this.engine.getVolume() : 0;
    this.update(vol);
    requestAnimationFrame(this.loop);
  }

  startLoop() {
    this.loop();
  }
}
```

- [ ] **Step 3: Write UI bindings and error handling**

```javascript
// Add to Animation class:

bindUI() {
  const btn = document.getElementById('mic-button');
  btn.addEventListener('click', async () => {
    if (this.engine.running) {
      this.engine.stop();
      btn.textContent = '🎤 Attiva microfono';
      btn.classList.remove('active');
      btn.disabled = false;
      this.currentValue = 0;
      this.update(0);
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
        alert('Permesso microfono negato. Concedi l\'accesso nelle impostazioni del browser.');
      } else if (err.name === 'NotFoundError') {
        alert('Microfono non trovato. Collega un microfono e riprova.');
      } else {
        alert('Errore microfono: ' + err.message);
      }
      btn.textContent = '🎤 Attiva microfono';
    } finally {
      btn.disabled = false;
    }
  });
}
```

- [ ] **Step 4: Initialize on DOM ready**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const anim = new Animation();
  anim.startLoop();
});
```

---

### Task 4: Manual verification

- [ ] **Step 1: Open `index.html` in browser**

Run from project directory or open file directly.

Expected: Fullscreen dark page with mask centered, control panel below.

- [ ] **Step 2: Test mic button**

Click "Attiva microfono". Browser shows permission dialog. Grant access.
Expected: Button changes to "Disattiva microfono" (red → blue). Volume meter shows activity.

- [ ] **Step 3: Test sound response**

Make noise (speak, clap, play music).
Expected: Beak opens and pupil shifts up-left as volume increases. Silence returns to quiet state.

- [ ] **Step 4: Test sensitivity slider**

Slide sensitivity down. Speak at same volume.
Expected: Less animation for same volume. Slide up: more animation.

- [ ] **Step 5: Test smoothing slider**

Slide smoothing to low (0-20). Clap sharply.
Expected: Very fast reaction. Slide to high (80-100): slow, smooth transitions.

- [ ] **Step 6: Test error states**

Deny mic permission or test on a device without mic.
Expected: Appropriate alert message. Mask stays in quiet state.

- [ ] **Step 7: Test stop/restart**

Click "Disattiva microfono" then "Attiva microfono" again.
Expected: Clean restart, no console errors.

---

### Task 5: Edge case — browser without mic / denial

- [ ] **Step 1: Verify no-mic path**

When `getUserMedia` throws `NotFoundError`, the alert "Microfono non trovato" appears and the mask stays in quiet state.

- [ ] **Step 2: Verify permission denial path**

When `getUserMedia` throws `NotAllowedError`, the alert "Permesso microfono negato" appears and the mask stays in quiet state.
