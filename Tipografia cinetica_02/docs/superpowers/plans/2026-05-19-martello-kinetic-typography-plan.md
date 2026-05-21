# Martello Kinetic Typography — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file HTML web tool where typing "martello" on the keyboard animates each letter as a nail hammered into the canvas border, with speed proportional to typing pace.

**Architecture:** Single `index.html` with inline `<style>` and `<script>`. Vanilla JS organizes into 5 internal modules (via factory functions/objects): InputHandler, Sequencer, Renderer, AnimationLoop, Trembler. Canvas API for all drawing. `requestAnimationFrame` for animation loop.

**Tech Stack:** HTML5, Canvas API, Vanilla JS (ES6+), no dependencies.

---

### Task 1: HTML skeleton + canvas + CSS

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML + CSS skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Martello</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chokokutai&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #1a1a2e; }
  canvas { display: block; width: 100%; height: 100%; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
/* JS here */
</script>
</body>
</html>
```

- [ ] **Step 2: Create canvas setup + resize handler**

```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
```

- [ ] **Step 3: Verify it works**

Open `index.html` in a browser. Expected: full-viewport dark canvas, nothing else.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add HTML skeleton with canvas and dark background"
```

---

### Task 2: Letter state model + layout

**Files:**
- Modify: `index.html` (add JS inside existing script tag)

- [ ] **Step 1: Define word + letter config array**

```js
const WORD = 'martello';
const COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6b6b','#ffd93d','#6bcb77','#4d96ff'];

const LETTERS = WORD.split('').map((char, i) => ({
  char,
  index: i,
  edge: (char === 'a' || char === 't' || char === 'l') ? 'up' : 'down',
  col: i === 6 ? 5 : (i > 6 ? i - 1 : i),
  phase: 'idle',
  progress: 0,
  nailColor: COLORS[i],
}));

// special: both L's share column 5
LETTERS[6].col = 5; // second L doesn't shift
LETTERS[7].col = 6; // O
```

Wait — let me recalculate. The original mapping:
- M(i=0) → col 0, down
- A(i=1) → col 1, up
- R(i=2) → col 2, down
- T(i=3) → col 3, up
- E(i=4) → col 4, down
- L(i=5) → col 5, up
- L(i=6) → col 5, up (same col as L1)
- O(i=7) → col 6, down

```js
const WORD = 'martello';
const NAIL_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9ff3', '#00d2d3', '#ff9ff3', '#f368e0'];

const LETTERS = WORD.split('').map((char, i) => {
  const isL = char === 'l';
  return {
    char,
    index: i,
    edge: 'down',
    col: i,
    phase: 'idle',
    progress: 0,
    nailColor: NAIL_COLORS[i],
    active: false,
  };
});

// Override edges: A, T, L, L go UP
LETTERS[1].edge = 'up';  // A
LETTERS[3].edge = 'up';  // T
LETTERS[5].edge = 'up';  // L1
LETTERS[6].edge = 'up';  // L2

// Override columns for LL + O shift
LETTERS[6].col = 5; // L2 shares column with L1
LETTERS[6].sub = 1; // offset within column
LETTERS[7].col = 6; // O
```

- [ ] **Step 2: Add layout calculation function**

```js
function layout() {
  const cols = 7; // M A R T E LL O
  const colW = W / cols;
  LETTERS.forEach(l => {
    const halfCol = colW / 2;
    const offset = l.sub ? (l.sub === 1 ? -16 : 16) : 0;
    l.x = l.col * colW + halfCol + offset;
    l.y = l.edge === 'up' ? 60 : H - 60;
  });
}
```

- [ ] **Step 3: Draw letter positions for debugging**

```js
function drawDebug() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  LETTERS.forEach(l => {
    ctx.fillText(l.char, l.x, l.y);
  });
}

function loop() { drawDebug(); requestAnimationFrame(loop); }
loop();
```

Verify in browser: letters M, A, R, T, E, L, L, O visible, spaced across 7 columns, alternating top/bottom edges.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add letter state model and layout"
```

---

### Task 3: Nail rendering

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add drawNail function**

```js
function drawNail(x, y, color, pulse) {
  const headR = 8 + pulse * 3;
  const shaftLen = 30;
  const shaftW = 3;
  const glowR = 20 + pulse * 10;

  // glow
  const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fill();

  // shaft (pointing into the edge)
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = shaftW;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + shaftLen);
  ctx.stroke();

  // head
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, headR, 0, Math.PI * 2);
  ctx.fill();
}
```

- [ ] **Step 2: Temporarily draw nails in the render loop**

```js
function render() {
  ctx.clearRect(0, 0, W, H);
  LETTERS.forEach(l => {
    if (l.phase === 'idle' || l.phase === 'nail') {
      const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
      drawNail(l.x, l.edge === 'up' ? l.y + 30 : l.y - 30, l.nailColor, pulse);
    }
    if (l.phase !== 'idle') {
      ctx.fillStyle = '#fff';
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(l.char, l.x, l.y);
    }
  });
}
```

Verify in browser: colorful glowing nails appear on the canvas edges.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add nail rendering with glow effect"
```

---

### Task 4: InputHandler + tremble effect

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add InputHandler logic + tremble state**

```js
let lastKeyTime = 0;
let tremble = { active: false, intensity: 0, decay: 0.9 };
let currentLetterIndex = 0;

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  const expected = WORD[currentLetterIndex];

  if (key === expected) {
    const now = Date.now();
    const delta = lastKeyTime ? now - lastKeyTime : 800;
    lastKeyTime = now;

    if (key === 'l') {
      // trigger both L's
      startLetter(currentLetterIndex, delta);
      startLetter(currentLetterIndex + 1, delta);
      currentLetterIndex += 2;
    } else {
      startLetter(currentLetterIndex, delta);
      currentLetterIndex += 1;
    }
  } else {
    // wrong key → tremble
    tremble.active = true;
    tremble.intensity = 8;
  }
});

function startLetter(index, delta) {
  if (index >= LETTERS.length) return;
  const l = LETTERS[index];
  if (l.active) return;
  l.active = true;
  l.phase = 'nail';
  l.progress = 0;
  l.duration = mapSpeed(delta);
}

function mapSpeed(delta) {
  const clamped = Math.max(200, Math.min(1500, delta));
  return clamped;
}
```

- [ ] **Step 2: Add canvas tremble transform to render loop**

```js
function render() {
  ctx.save();
  if (tremble.active) {
    const tx = (Math.random() - 0.5) * tremble.intensity;
    const ty = (Math.random() - 0.5) * tremble.intensity;
    ctx.translate(tx, ty);
    tremble.intensity *= tremble.decay;
    if (tremble.intensity < 0.5) tremble.active = false;
  }

  // ... rest of rendering

  ctx.restore();
}
```

- [ ] **Step 3: Test in browser**

Type "martello" — correct letters should activate (visible via nail phase). Wrong letters should shake the canvas. Verify the tremble decays.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add keyboard input handler and canvas tremble effect"
```

---

### Task 5: Animation phases — nail → windup → hit → settle

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add phase transition logic to the animation loop**

```js
function updateAnimations(dt) {
  LETTERS.forEach(l => {
    if (!l.active || l.phase === 'idle') return;

    l.progress += dt / l.duration;

    switch (l.phase) {
      case 'nail':
        if (l.progress >= 0.3) { l.phase = 'windup'; l.progress = 0; }
        break;
      case 'windup':
        if (l.progress >= 0.2) { l.phase = 'hit'; l.progress = 0; }
        break;
      case 'hit':
        if (l.progress >= 0.3) { l.phase = 'settle'; l.progress = 0; }
        break;
      case 'settle':
        if (l.progress >= 0.2) { l.phase = 'idle'; l.progress = 1; }
        break;
    }
  });
}
```

- [ ] **Step 2: Add hammer state to animation model**

```js
function getHammerState(l) {
  // For a letter going DOWN: hammer starts above the canvas (y = -80)
  // For a letter going UP: hammer starts below the canvas (y = H + 80)
  const baseY = l.edge === 'down' ? -80 : H + 80;
  const targetY = l.edge === 'down' ? l.y - 40 : l.y + 40;

  if (l.phase === 'idle' || !l.active) return { x: l.x, y: baseY, alpha: 0 };

  const p = l.progress;
  let ty = baseY;
  let alpha = 1;

  switch (l.phase) {
    case 'nail':
      alpha = p / 0.3; // fade in
      ty = baseY;
      break;
    case 'windup':
      // rear back slightly opposite direction
      ty = baseY + (baseY < 0 ? -20 : 20) * Math.sin(p / 0.2 * Math.PI);
      break;
    case 'hit':
      // fast acceleration toward target
      const hitProgress = p / 0.3;
      const eased = hitProgress * hitProgress; // ease-in
      ty = (l.edge === 'down' ? -80 : H + 80) + (targetY - (l.edge === 'down' ? -80 : H + 80)) * eased;
      // at the moment of impact (progress near end of hit phase), transform nail -> letter
      break;
    case 'settle':
      // slow retreat
      ty = targetY + (baseY - targetY) * (p / 0.2);
      alpha = 1 - p / 0.2 * 0.5;
      break;
  }

  return { x: l.x, y: ty, alpha };
}
```

- [ ] **Step 3: Transform nail to letter at moment of impact**

When hit phase reaches ~90% progress, the nail is replaced by the letter. Use a crossfade: nail fades out as letter fades in.

```js
function getLetterAppearance(l) {
  if (!l.active) return { alpha: 0 };
  if (l.phase === 'hit' && l.progress >= 0.25) {
    const fadeIn = (l.progress - 0.25) / 0.05;
    return { alpha: Math.min(1, fadeIn) };
  }
  if (l.phase === 'settle' || (l.phase === 'idle' && l.progress >= 1)) {
    return { alpha: 1 };
  }
  if (l.phase === 'nail' || l.phase === 'windup' || (l.phase === 'hit' && l.progress < 0.25)) {
    return { alpha: 0 };
  }
  return { alpha: 0 };
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add animation phases and hammer tracking"
```

---

### Task 6: Full renderer — hammer, nails, letters

**Files:**
- Modify: `index.html`

- [ ] **Step 1: drawHammer function**

```js
function drawHammer(state) {
  if (state.alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.alpha;

  const { x, y } = state;
  const handleLen = 60;
  const handleW = 6;
  const headW = 24;
  const headH = 14;

  // handle
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x - handleW / 2, y, handleW, handleLen);

  // head
  ctx.fillStyle = '#778899';
  const headX = x - headW / 2;
  const headY = y - headH;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(headX, headY, headW, headH, 3) : ctx.rect(headX, headY, headW, headH);
  ctx.fill();

  // impact lines during hit
  if (state.impactLines) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const len = 10 + Math.random() * 15;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * 20, y + Math.sin(angle) * 20 + handleLen);
      ctx.lineTo(x + Math.cos(angle) * (20 + len), y + Math.sin(angle) * (20 + len) + handleLen);
      ctx.stroke();
    }
  }

  ctx.restore();
}
```

- [ ] **Step 2: Complete render function**

```js
let lastTime = 0;

function loop(time) {
  const dt = lastTime ? Math.min(time - lastTime, 50) : 16;
  lastTime = time;

  updateAnimations(dt);

  ctx.save();

  // tremble
  if (tremble.active) {
    const tx = (Math.random() - 0.5) * tremble.intensity;
    const ty = (Math.random() - 0.5) * tremble.intensity;
    ctx.translate(tx, ty);
    tremble.intensity *= tremble.decay;
    if (tremble.intensity < 0.5) tremble.active = false;
  }

  ctx.clearRect(-10, -10, W + 20, H + 20);

  LETTERS.forEach(l => {
    // draw nail if applicable
    if (l.active && (l.phase === 'nail' || (l.phase === 'windup') || (l.phase === 'hit' && l.progress < 0.25))) {
      const pulse = Math.sin(time / 300) * 0.3 + 0.7;
      drawNail(l.x, l.edge === 'up' ? l.y + 30 : l.y - 30, l.nailColor, pulse);
    }

    // draw letter
    const letterAppearance = getLetterAppearance(l);
    if (letterAppearance.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = letterAppearance.alpha;
      ctx.fillStyle = '#fff';
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const drawX = l.x + (l.sub ? (l.sub === 1 ? 30 : -30) : 0);
      ctx.fillText(l.char.toUpperCase(), drawX, l.y);
      ctx.restore();
    }

    // draw hammer
    const hammerState = getHammerState(l);
    hammerState.impactLines = l.phase === 'hit' && l.progress > 0.1 && l.progress < 0.3;
    drawHammer(hammerState);
  });

  ctx.restore();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

- [ ] **Step 3: Test in browser**

Open and type "martello". Each keypress should: nail appears → hammer rears → hammer hits → nail→letter transition → hammer retreats.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: complete renderer with hammer, nails, and letters"
```

---

### Task 7: Speed mapping + responsiveness polish

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Refine speed mapping curve**

```js
function mapSpeed(delta) {
  // Very fast typing (<300ms) → 400ms animation
  // Normal typing (~500ms) → 800ms animation
  // Slow typing (>1200ms) → 1400ms animation
  const t = Math.max(200, Math.min(1500, delta));
  // map to 400-1400ms range with ease
  const minAnim = 400;
  const maxAnim = 1400;
  const ratio = (t - 200) / 1300;
  return minAnim + (maxAnim - minAnim) * ratio;
}
```

- [ ] **Step 2: Add canvas resize recalculation**

```js
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  layoutRecalc();
}
window.addEventListener('resize', resize);
resize();
```

- [ ] **Step 3: Add instruction text at bottom of canvas**

```js
function drawInstructions() {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Type "martello" on your keyboard', W / 2, H - 10);
  ctx.restore();
}
```

- [ ] **Step 4: Test all scenarios**

Fast typing (quickly press m-a-r-t-e-l-l-o) → fast hammer.
Slow typing (wait 2s between letters) → slow, deliberate hammer.
Wrong keys → canvas tremble.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: final polish — speed mapping, resize, and instructions"
```

---

### Task 8: Edge case handling

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Handle typing after word is complete**

```js
document.addEventListener('keydown', (e) => {
  if (currentLetterIndex >= WORD.length) return; // ignore after word done

  const key = e.key.toLowerCase();
  const expected = WORD[currentLetterIndex];
  // ... rest of handler
});
```

- [ ] **Step 2: Handle rapid retyping of same letter (anti-double-fire)**

Already handled by `l.active` flag check in `startLetter`.

- [ ] **Step 3: Handle tab/window hidden → resume gracefully**

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // pause tracking? Actually requestAnimationFrame auto-pauses, just reset lastTime
  } else {
    lastTime = 0; // prevent huge dt spike
  }
});
```

- [ ] **Step 4: Final test pass**

Test: type wrong keys, type fast, type slow, type after word done (should be no-op), resize window.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: handle edge cases — completion, visibility, rapid input"
```
