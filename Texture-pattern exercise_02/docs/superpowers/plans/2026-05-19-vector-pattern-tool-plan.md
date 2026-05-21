# Vector Pattern Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive web tool that renders a grid of SVG rectangles with rotation, scaling, row gaps, and optional inner rectangles, exportable as SVG.

**Architecture:** Single-page app with vanilla HTML/CSS/JS. A sidebar holds sliders controlling grid parameters; an SVG element in the main area is regenerated on each slider change. No framework or build step.

**Tech Stack:** HTML5, CSS3, vanilla JS (ES6+), SVG

---

## File Structure

| File | Responsibility |
|------|---------------|
| `index.html` | Document structure, sidebar layout, SVG container |
| `style.css` | Layout (sidebar + canvas), slider styling, responsive |
| `script.js` | All logic: param reading, grid computation, SVG generation, export |

---

### Task 1: Project scaffold — create files

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `script.js`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vector Pattern Tool</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <aside id="controls">
      <h1>Pattern Tool</h1>

      <label>Righe <span id="rows-val">10</span></label>
      <input type="range" id="rows" min="1" max="100" value="10">

      <label>Colonne <span id="cols-val">10</span></label>
      <input type="range" id="cols" min="1" max="100" value="10">

      <label>Scala (%) <span id="scale-val">70</span></label>
      <input type="range" id="scale" min="10" max="95" value="70">

      <label>Rotazione (°) <span id="rot-val">0</span></label>
      <input type="range" id="rotation" min="0" max="360" value="0">

      <label>Gap verticale (mm) <span id="gap-val">1</span></label>
      <input type="range" id="gap" min="0.5" max="5" step="0.5" value="1">

      <label>Prob. rett. interno (%) <span id="inner-prob-val">30</span></label>
      <input type="range" id="inner-prob" min="0" max="100" value="30">

      <label>
        <input type="checkbox" id="inner-fill" checked>
        Inner Fill
      </label>

      <button id="download">Scarica SVG</button>
    </aside>
    <main id="canvas-container">
      <svg id="canvas" xmlns="http://www.w3.org/2000/svg"></svg>
    </main>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `style.css`**

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

#app {
  display: flex;
  height: 100%;
}

#controls {
  width: 260px;
  min-width: 260px;
  padding: 20px;
  background: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#controls h1 {
  font-size: 18px;
  margin-bottom: 8px;
}

#controls label {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#controls input[type="range"] {
  width: 100%;
}

#controls button {
  margin-top: 8px;
  padding: 10px;
  background: #222;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
}

#controls button:hover {
  background: #444;
}

#canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

#canvas {
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

- [ ] **Step 3: Create `script.js`** (empty shell)

```js
// Vector Pattern Tool
(function () {
  'use strict';

  // --- DOM refs ---
  const svg = document.getElementById('canvas');
  const container = document.getElementById('canvas-container');
  const downloadBtn = document.getElementById('download');

  // --- Param refs ---
  const $ = (id) => document.getElementById(id);
  const rowsInp = $('rows');
  const colsInp = $('cols');
  const scaleInp = $('scale');
  const rotInp = $('rotation');
  const gapInp = $('gap');
  const innerProbInp = $('inner-prob');
  const innerFillInp = $('inner-fill');

  const rowsVal = $('rows-val');
  const colsVal = $('cols-val');
  const scaleVal = $('scale-val');
  const rotVal = $('rot-val');
  const gapVal = $('gap-val');
  const innerProbVal = $('inner-prob-val');

  // TODO: implement in subsequent tasks
})();
```

- [ ] **Step 4: Verify** — Open `index.html` in browser, confirm layout renders with sidebar + empty SVG area

---

### Task 2: Slider event binding and value display

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add helper to bind slider → value display + render trigger**

```js
function bindSlider(input, display) {
  input.addEventListener('input', () => {
    display.textContent = input.value;
    render();
  });
}

bindSlider(rowsInp, rowsVal);
bindSlider(colsInp, colsVal);
bindSlider(scaleInp, scaleVal);
bindSlider(rotInp, rotVal);
bindSlider(gapInp, gapVal);
bindSlider(innerProbInp, innerProbVal);

innerFillInp.addEventListener('change', render);
```

- [ ] **Step 2: Add readParams helper**

```js
function readParams() {
  return {
    rows: parseInt(rowsInp.value, 10),
    cols: parseInt(colsInp.value, 10),
    scale: parseInt(scaleInp.value, 10) / 100,
    rotation: parseInt(rotInp.value, 10),
    gapMm: parseFloat(gapInp.value),
    innerProb: parseInt(innerProbInp.value, 10) / 100,
    innerFill: innerFillInp.checked,
  };
}
```

- [ ] **Step 3: Add stub `render()` that calls `readParams`**

```js
function render() {
  const params = readParams();
  console.log('render', params);
}
```

- [ ] **Step 4: Call `render()` once at startup**

```js
render();
```

---

### Task 3: Grid computation and cell layout

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add computeGrid helper**

```js
const MM_TO_PX = 3.7795; // 96 DPI → 1mm ≈ 3.78px

function computeGrid(params) {
  const rect = container.getBoundingClientRect();
  const svgW = rect.width;
  const svgH = rect.height;
  const gapPx = params.gapMm * MM_TO_PX;

  const cellW = svgW / params.cols;
  const totalGapH = (params.rows - 1) * gapPx;
  const cellH = (svgH - totalGapH) / params.rows;

  return { svgW, svgH, cellW, cellH, gapPx };
}
```

- [ ] **Step 2: Add buildRects helper**

```js
function buildRects(params, grid) {
  const rects = [];
  for (let r = 0; r < params.rows; r++) {
    for (let c = 0; c < params.cols; c++) {
      const cx = c * grid.cellW + grid.cellW / 2;
      const cy = r * (grid.cellH + grid.gapPx) + grid.cellH / 2;
      const size = Math.min(grid.cellW, grid.cellH) * params.scale;
      const hasInner = Math.random() < params.innerProb;

      rects.push({ cx, cy, size, hasInner });
    }
  }
  return rects;
}
```

---

### Task 4: SVG rendering — outer rectangles

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Build SVG string**

Replace the `render()` stub with:

```js
function render() {
  const params = readParams();
  const grid = computeGrid(params);
  const rects = buildRects(params, grid);
  const strokeW = 1;

  let svgContent = `<svg id="canvas" xmlns="http://www.w3.org/2000/svg" width="${grid.svgW}" height="${grid.svgH}" viewBox="0 0 ${grid.svgW} ${grid.svgH}">`;

  for (const r of rects) {
    const half = r.size / 2;
    const x = r.cx - half;
    const y = r.cy - half;

    let rectTag = `<rect x="${x}" y="${y}" width="${r.size}" height="${r.size}" fill="none" stroke="black" stroke-width="${strokeW}"`;

    if (params.rotation !== 0) {
      rectTag += ` transform="rotate(${params.rotation} ${r.cx} ${r.cy})"`;
    }

    rectTag += '/>';

    if (r.hasInner) {
      const innerHalf = r.size * 0.25; // half of 50%
      const innerSize = r.size * 0.5;
      const ix = r.cx - innerHalf;
      const iy = r.cy - innerHalf;
      const fill = params.innerFill ? 'black' : 'none';
      rectTag += `<rect x="${ix}" y="${iy}" width="${innerSize}" height="${innerSize}" fill="${fill}" stroke="black" stroke-width="${strokeW}"`;
      if (params.rotation !== 0) {
        rectTag += ` transform="rotate(${params.rotation} ${r.cx} ${r.cy})"`;
      }
      rectTag += '/>';
    }

    svgContent += rectTag;
  }

  svgContent += '</svg>';

  const parser = new DOMParser();
  const newSvg = parser.parseFromString(svgContent, 'image/svg+xml').documentElement;
  svg.replaceWith(newSvg);
  // reassign global ref
  svg = document.getElementById('canvas');
}
```

- [ ] **Step 2: Fix `svg` declaration — change `const` to `let`** at the top of script.js

```js
let svg = document.getElementById('canvas');
```

- [ ] **Step 3: Test in browser** — open `index.html`, sliders should update the grid in real time

---

### Task 5: Download SVG

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add download handler**

```js
function downloadSVG() {
  const params = readParams();
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pattern-${params.rows}x${params.cols}-${Math.round(params.scale * 100)}-${params.rotation}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

downloadBtn.addEventListener('click', downloadSVG);
```

- [ ] **Step 2: Test download** — click button, verify `.svg` file downloads and opens correctly

---

### Task 6: Debounce and resize handling

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Debounce render on slider input** — replace direct `render()` call in bindSlider with a requestAnimationFrame throttle

```js
let rafId = null;
function scheduleRender() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = null;
    render();
  });
}
```

Replace `render()` with `scheduleRender()` in bindSlider and change listener:

```js
function bindSlider(input, display) {
  input.addEventListener('input', () => {
    display.textContent = input.value;
    scheduleRender();
  });
}
```

Also update innerFillInp listener to use `scheduleRender()`.

- [ ] **Step 2: Handle window resize**

```js
window.addEventListener('resize', scheduleRender);
```

---

### Task 7: Final polish and edge cases

**Files:**
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Handle edge case — 0 rows or 0 cols** (guard division by zero)

In `computeGrid`, add guard:

```js
if (params.rows < 1 || params.cols < 1) {
  svg.innerHTML = '';
  return null;
}
```

And in `render`, check for null grid:

```js
const grid = computeGrid(params);
if (!grid) return;
```

- [ ] **Step 2: Prevent negative/zero size** in `buildRects`:

```js
const size = Math.max(2, Math.min(grid.cellW, grid.cellH) * params.scale);
```

- [ ] **Step 3: Responsive fix** — ensure SVG container respects viewport on small screens

Add to `style.css`:

```css
@media (max-width: 600px) {
  #app {
    flex-direction: column;
  }
  #controls {
    width: 100%;
    min-width: unset;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
}
```

---

## Self-Review Checklist

- [ ] All spec requirements covered: grid, scale, rotation, gap, inner rects, probability, fill toggle, download
- [ ] No placeholders — all code is complete in every step
- [ ] Type/name consistency: `params`, `grid`, `rects` used consistently across all tasks
- [ ] Edge cases handled: division by zero, tiny sizes, resize, responsive layout
