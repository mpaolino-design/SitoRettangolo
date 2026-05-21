# Marionetta Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based hand-gesture drawing tool using TensorFlow.js hand-pose-detection

**Architecture:** Single `index.html` file with CDN-loaded TF.js libraries, fullscreen canvas, off-screen buffer for committed segments, gesture state machine running per rAF frame.

**Tech Stack:** Vanilla HTML/CSS/JS, `@tensorflow-models/hand-pose-detection` (TF.js runtime), Canvas 2D API

---

### Task 1: Fix runtime & fullscreen canvas

**File:** `index.html` (rewrite)

Current code uses MediaPipe runtime (`runtime: 'mediapipe'`) which tries to fetch WASM files and fails with "Failed to fetch". Switch to TF.js runtime which uses WebGL directly — no external WASM downloads.

Also resize canvas to full viewport instead of 640×480.

- [ ] **Step 1: Replace CDN scripts**

Remove `@mediapipe/hands` script tag. Add TF.js runtime packages:

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>
```

- [ ] **Step 2: Update detector config to use TF.js runtime**

Change from:
```js
runtime: 'mediapipe',
modelType: 'full',
maxHands: 2
```
to:
```js
runtime: 'tfjs',
modelType: 'full',
maxHands: 2
```

- [ ] **Step 3: Fullscreen canvas + black background**

Replace the centered container layout with full-viewport canvas. Video becomes a small overlay.

Replace style with:
```html
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; overflow: hidden; font-family: monospace; }
  #drawCanvas { display: block; width: 100vw; height: 100vh; }
  #video { position: fixed; top: 12px; right: 12px; width: 160px; height: 120px;
           border-radius: 8px; transform: scaleX(-1); z-index: 10;
           border: 1px solid rgba(255,255,255,0.2); }
  #info { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
           color: #fff; font-size: 13px; text-align: center;
           background: rgba(0,0,0,0.7); padding: 6px 14px; border-radius: 8px;
           z-index: 10; }
  #status { position: fixed; top: 12px; left: 12px; color: #fff; font-size: 13px;
            background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 6px;
            z-index: 10; display: flex; align-items: center; gap: 8px; }
  #colorDot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); display: inline-block; }
</style>
```

Replace body with:
```html
<video id="video" autoplay playsinline></video>
<canvas id="drawCanvas"></canvas>
<div id="info">Loading model...</div>
<div id="status"><span id="colorDot" style="background:#fff"></span> <span id="modeText">Draw</span></div>
```

- [ ] **Step 4: Update JS — resize canvas, remove skeleton drawing, add resize handler**

Replace the JS section. Keep `dist3D`, `startWebcam`, and the overall structure. Remove `drawHands`, `logDistances`, `HAND_CONNECTIONS`, `KEYPOINT_LABELS`. Add canvas resize:

```js
const video = document.getElementById('video');
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const colorDot = document.getElementById('colorDot');
const modeText = document.getElementById('modeText');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const TIP = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const MCP = { index: 5, middle: 9, ring: 13, pinky: 17 };

const ACTIVATE_THRESHOLD = 0.035;
const RELEASE_MULTIPLIER = 1.5;

// Buffer canvas for committed segments
const buffer = document.createElement('canvas');
const bufCtx = buffer.getContext('2d');

function resizeBuffer() {
  buffer.width = window.innerWidth;
  buffer.height = window.innerHeight;
}
window.addEventListener('resize', resizeBuffer);
resizeBuffer();
```

- [ ] **Step 5: Simplify detectLoop to just estimate hands + show FPS**

```js
async function detectLoop(detector) {
  if (!detector) return;
  try {
    const hands = await detector.estimateHands(video);
    processHands(hands);
    info.textContent = `Hands: ${hands.length}`;
  } catch (e) {
    console.error(e);
  }
  requestAnimationFrame(() => detectLoop(detector));
}
```

- [ ] **Step 6: Verify**

Open `index.html` in Chrome. Expected: black fullscreen canvas, webcam preview top-right, "Loading model..." then "Hands: 0" (or 1/2 when hands visible). No "Failed to fetch" error.

---

### Task 2: Gesture detection state machine

**File:** `index.html`

Add all gesture detection logic as `processHands()` function.

- [ ] **Step 1: Add state constants and variables**

```js
const MODE = { IDLE: 'idle', DRAW: 'draw', ERASER: 'eraser' };
let currentMode = MODE.IDLE;
let canChangeColor = true;

const COLORS = ['#ffffff', '#ff0000', '#0066ff', '#00cc44', '#ff8800'];
let colorIndex = 0;
let currentColor = COLORS[0];
```

- [ ] **Step 2: Add `processHands()` function**

```js
function processHands(hands) {
  if (hands.length === 0) {
    if (currentMode === MODE.DRAW) finalizeSegment();
    currentMode = MODE.IDLE;
    modeText.textContent = 'Idle';
    return;
  }

  // Use the first hand for drawing
  const hand = hands[0];
  const kp = hand.keypoints;
  const kp3d = hand.keypoints3D;

  if (!kp3d || kp3d.length < 21) return;

  const thumbTip = kp3d[TIP.thumb];
  const indexTip = kp3d[TIP.index];
  const middleTip = kp3d[TIP.middle];

  const dTM = dist3D(thumbTip, middleTip);

  // Fist detection: all 4 finger tips below their MCP (folded toward palm)
  const fingers = ['index', 'middle', 'ring', 'pinky'];
  const isFist = fingers.every(f => kp[TIP[f]] && kp[MCP[f]] && kp[TIP[f]].y > kp[MCP[f]].y);

  // Draw gesture: thumb close to middle (with hysteresis)
  const drawThreshold = currentMode === MODE.DRAW
    ? ACTIVATE_THRESHOLD * RELEASE_MULTIPLIER
    : ACTIVATE_THRESHOLD;
  const isDraw = dTM < drawThreshold;
  // Pinch gesture: thumb close to index (one-shot color change)
  const isPinch = dist3D(thumbTip, kp3d[TIP.index]) < ACTIVATE_THRESHOLD;

  // Determine mode
  if (isFist) {
    if (currentMode !== MODE.ERASER) {
      if (currentMode === MODE.DRAW) finalizeSegment();
      currentMode = MODE.ERASER;
      modeText.textContent = 'Eraser';
    }
  } else if (isDraw) {
    if (currentMode !== MODE.DRAW) {
      startNewSegment();
    }
    currentMode = MODE.DRAW;
    modeText.textContent = 'Draw';
  } else {
    if (currentMode === MODE.DRAW) finalizeSegment();
    currentMode = MODE.IDLE;
    modeText.textContent = 'Idle';
  }

  // Color change (one-shot)
  if (isPinch && canChangeColor) {
    colorIndex = (colorIndex + 1) % COLORS.length;
    currentColor = COLORS[colorIndex];
    colorDot.style.background = currentColor;
    canChangeColor = false;
  }
  if (!isPinch) {
    canChangeColor = true;
  }
}
```

- [ ] **Step 3: Add segment placeholder functions**

```js
function startNewSegment() {}
function finalizeSegment() {}
```

- [ ] **Step 4: Verify**

Open browser. Wave hand in front of webcam. Console shows no errors. Info shows "Hands: 1" or "Hands: 2". Status text changes between Idle/Draw/Eraser as you open/close your hand.

---

### Task 3: Drawing engine

**File:** `index.html`

Implement the actual drawing with segments, off-screen buffer, variable stroke width, and trail following midpoint of index+middle.

- [ ] **Step 1: Add segment data structures and drawing functions**

```js
let currentSegment = [];
let isSegmentActive = false;

const STROKE_MIN = 2;
const STROKE_MAX = 30;
const THUMB_MIDDLE_DIST_MIN = 0.01;
const THUMB_MIDDLE_DIST_MAX = 0.035;

function dist2D(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function startNewSegment() {
  currentSegment = [];
  isSegmentActive = true;
}

function finalizeSegment() {
  if (!isSegmentActive) return;
  isSegmentActive = false;
  // Commit current segment to buffer
  if (currentSegment.length < 2) { currentSegment = []; return; }
  drawSegmentOnBuffer(currentSegment);
  currentSegment = [];
}

function drawSegmentOnBuffer(segment) {
  if (segment.length < 2) return;
  for (let i = 1; i < segment.length; i++) {
    const p0 = segment[i - 1];
    const p1 = segment[i];
    bufCtx.beginPath();
    bufCtx.moveTo(p0.x, p0.y);
    bufCtx.lineTo(p1.x, p1.y);
    bufCtx.strokeStyle = p0.color;
    bufCtx.lineWidth = p1.width;
    bufCtx.lineCap = 'round';
    bufCtx.lineJoin = 'round';
    bufCtx.stroke();
  }
}
```

- [ ] **Step 2: Add trail tracking during DRAW mode**

In `processHands()`, inside the `if (currentMode === MODE.DRAW)` block, add:

```js
if (currentMode === MODE.DRAW) {
  if (currentMode !== MODE.DRAW) {
    startNewSegment();
  }
  currentMode = MODE.DRAW;
  modeText.textContent = 'Draw';

  // Calculate trail point (midpoint of index_tip and middle_tip in 2D)
  const idx2d = kp[TIP.index];
  const mid2d = kp[TIP.middle];
  if (idx2d && mid2d) {
    const trailX = (idx2d.x + mid2d.x) / 2;
    const trailY = (idx2d.y + mid2d.y) / 2;
    // Calculate stroke width from 3D distance
    const widthNorm = (dTM - THUMB_MIDDLE_DIST_MIN) / (THUMB_MIDDLE_DIST_MAX - THUMB_MIDDLE_DIST_MIN);
    const strokeW = lerp(STROKE_MIN, STROKE_MAX, widthNorm);
    currentSegment.push({ x: trailX, y: trailY, width: strokeW, color: currentColor });
  }
}
```

- [ ] **Step 3: Add render loop (draw active segment over buffer)**

Replace the `detectLoop` render section. After `processHands(hands)`, add rendering:

```js
function render() {
  // Clear main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw committed segments from buffer
  ctx.drawImage(buffer, 0, 0);
  // Draw active segment
  if (isSegmentActive && currentSegment.length >= 2) {
    drawSegmentOnCanvas(ctx, currentSegment);
  }
}

function drawSegmentOnCanvas(context, segment) {
  for (let i = 1; i < segment.length; i++) {
    const p0 = segment[i - 1];
    const p1 = segment[i];
    context.beginPath();
    context.moveTo(p0.x, p0.y);
    context.lineTo(p1.x, p1.y);
    context.strokeStyle = p1.color;
    context.lineWidth = p1.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  }
}
```

Update `detectLoop` to call `render()`:

```js
async function detectLoop(detector) {
  if (!detector) return;
  try {
    const hands = await detector.estimateHands(video);
    processHands(hands);
    render();
  } catch (e) {
    console.error(e);
  }
  requestAnimationFrame(() => detectLoop(detector));
}
```

- [ ] **Step 4: Verify**

Open browser. Make thumb tip touch middle finger tip → draw mode activates. Move hand → white line appears on black canvas. Vary thumb↔middle distance → line width changes. Release → segment finalized, line stays.

---

### Task 4: Color cycle & eraser

**File:** `index.html`

- [ ] **Step 1: Verify color cycling is already wired (from Task 2 step 2)**

The pinch detection and color change logic was added in Task 2. Verify:
- Pinch (thumb_tip + index_tip) → color cycles to next
- The `colorDot` updates
- Can't rapid-cycle (one-shot guard with `canChangeColor`)

No code change needed — verify in browser.

- [ ] **Step 2: Implement eraser rendering**

Replace the `processHands` eraser block. When in ERASER mode, erase on the buffer canvas:

```js
if (isFist) {
  if (currentMode !== MODE.ERASER) {
    if (currentMode === MODE.DRAW) finalizeSegment();
    currentMode = MODE.ERASER;
    modeText.textContent = 'Eraser';
  }
  // Erase at fist center
  const wrist = kp[0];
  if (wrist) {
    const eraserRadius = 40;
    // Erase on main canvas buffer
    bufCtx.save();
    bufCtx.globalCompositeOperation = 'destination-out';
    bufCtx.beginPath();
    bufCtx.arc(wrist.x, wrist.y, eraserRadius, 0, Math.PI * 2);
    bufCtx.fill();
    bufCtx.restore();
  }
}
```

- [ ] **Step 3: Verify eraser**

Open browser. Make fist → mode shows "Eraser". Move fist over drawn lines → lines disappear. Open hand → back to "Idle" or "Draw".

---

### Task 5: Polish & edge cases

**File:** `index.html`

- [ ] **Step 1: Handle window resize correctly**

When window resizes, committed segments on the old-sized buffer are lost. To preserve them, we need to redraw all segments. But since we don't store ALL points (only the current segment), we just re-size the buffers:

Currently resize already reinitializes buffers, which clears committed drawings. Acceptable for v1 — user knows resize clears canvas. Add a note in the info overlay if needed.

Better approach: store committed segments in an array and redraw on resize.

Replace the segment system with a `committedSegments` array:

```js
let committedSegments = [];

function finalizeSegment() {
  if (!isSegmentActive) return;
  isSegmentActive = false;
  if (currentSegment.length >= 2) {
    committedSegments.push([...currentSegment]);
    drawSegmentOnBuffer(currentSegment);
  }
  currentSegment = [];
}

function resizeBuffer() {
  buffer.width = window.innerWidth;
  buffer.height = window.innerHeight;
  // Redraw all committed segments
  for (const seg of committedSegments) {
    drawSegmentOnBuffer(seg);
  }
}
```

- [ ] **Step 2: Add model loading retry**

```js
async function loadDetector(retries = 1) {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  for (let i = 0; i <= retries; i++) {
    try {
      return await handPoseDetection.createDetector(model, {
        runtime: 'tfjs',
        modelType: 'full',
        maxHands: 2
      });
    } catch (e) {
      if (i < retries) {
        info.textContent = 'Retrying model load...';
        await new Promise(r => setTimeout(r, 2000));
      } else throw e;
    }
  }
}
```

- [ ] **Step 3: Full `main()` function**

```js
async function main() {
  await startWebcam();
  info.textContent = 'Loading model...';
  const detector = await loadDetector();
  info.textContent = 'Ready';
  detectLoop(detector);
}

main().catch(e => {
  console.error(e);
  info.textContent = 'Error: ' + e.message;
});
```

- [ ] **Step 4: Verify complete**

Open browser. Full flow:
1. Webcam prompt → Allow
2. "Loading model..." → "Ready"
3. Open hand in front of cam → "Idle" status
4. Thumb_tip + middle_tip close → white line draws following hand
5. Vary distance → line thickness changes
6. Pinch thumb + index → color cycles (red, blue, green, orange, back to white)
7. Make fist → "Eraser" mode, move over lines → they disappear
8. Release fist → back to Idle/Draw
9. Resize window → drawing preserved
