(function () {
  'use strict';

  let svg = document.getElementById('canvas');
  const container = document.getElementById('canvas-container');
  const downloadBtn = document.getElementById('download');
  const clearBtn = document.getElementById('clear-flow');

  const $ = (id) => document.getElementById(id);
  const rowsInp = $('rows');
  const colsInp = $('cols');
  const wScaleInp = $('w-scale');
  const hScaleInp = $('h-scale');
  const rotInp = $('rotation');
  const gapInp = $('gap');
  const randomRotInp = $('random-rot');
  const continuousInp = $('continuous');
  const gridModeInp = $('grid-mode');
  const gridControls = $('grid-controls');
  const innerProbInp = $('inner-prob');
  const innerFillInp = $('inner-fill');

  const rowsVal = $('rows-val');
  const colsVal = $('cols-val');
  const wVal = $('w-val');
  const hVal = $('h-val');
  const rotVal = $('rot-val');
  const gapVal = $('gap-val');
  const innerProbVal = $('inner-prob-val');

  const FLOW_BASE = 80;
  const FLOW_MIN_DIST = 8;
  let flowRects = [];
  let isDrawing = false;
  let lastPoint = null;

  function showGridControls(show) {
    gridControls.classList.toggle('visible', show);
  }

  function readParams() {
    const continuous = continuousInp.checked || randomRotInp.checked;
    return {
      gridMode: gridModeInp.checked,
      rows: parseInt(rowsInp.value, 10),
      cols: parseInt(colsInp.value, 10),
      wScale: parseInt(wScaleInp.value, 10) / 100,
      hScale: parseInt(hScaleInp.value, 10) / 100,
      rotation: parseInt(rotInp.value, 10),
      gapPx: continuous ? 0 : parseFloat(gapInp.value),
      randomRot: randomRotInp.checked,
      continuous,
      innerProb: parseInt(innerProbInp.value, 10) / 100,
      innerFill: innerFillInp.checked,
    };
  }

  function computeGrid(params) {
    if (params.rows < 1 || params.cols < 1) return null;
    const rect = container.getBoundingClientRect();
    const svgW = rect.width;
    const svgH = rect.height;
    const gapPx = params.gapPx;
    const totalGapW = (params.cols - 1) * gapPx;
    const totalGapH = (params.rows - 1) * gapPx;
    const cellW = (svgW - totalGapW) / params.cols;
    const cellH = (svgH - totalGapH) / params.rows;
    return { svgW, svgH, cellW, cellH, gapPx };
  }

  function buildGridRects(params, grid) {
    const rects = [];
    for (let r = 0; r < params.rows; r++) {
      for (let c = 0; c < params.cols; c++) {
        const cx = c * (grid.cellW + grid.gapPx) + grid.cellW / 2;
        const cy = r * (grid.cellH + grid.gapPx) + grid.cellH / 2;
        let w, h;
        if (params.continuous) {
          w = grid.cellW;
          h = grid.cellH;
        } else {
          const base = Math.min(grid.cellW, grid.cellH);
          w = Math.max(2, base * params.wScale);
          h = Math.max(2, base * params.hScale);
        }
        const hasInner = Math.random() < params.innerProb;
        const rot = params.randomRot ? Math.random() * 360 : params.rotation;
        rects.push({ cx, cy, w, h, hasInner, rot });
      }
    }
    return rects;
  }

  let rafId = null;

  function scheduleRender() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      render();
    });
  }

  function renderRects(rects, params, svgW, svgH) {
    const strokeW = 1;
    let content = `<svg id="canvas" xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;

    for (const r of rects) {
      const x = r.cx - r.w / 2;
      const y = r.cy - r.h / 2;

      let tag = `<rect x="${x}" y="${y}" width="${r.w}" height="${r.h}" fill="none" stroke="white" stroke-width="${strokeW}"`;

      if (r.rot !== 0) {
        tag += ` transform="rotate(${r.rot} ${r.cx} ${r.cy})"`;
      }

      tag += '/>';

      if (r.hasInner) {
        const iw = r.w * 0.5;
        const ih = r.h * 0.5;
        const ix = r.cx - iw / 2;
        const iy = r.cy - ih / 2;
        const fill = params.innerFill ? 'white' : 'none';
        tag += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${fill}" stroke="white" stroke-width="${strokeW}"`;
        if (r.rot !== 0) {
          tag += ` transform="rotate(${r.rot} ${r.cx} ${r.cy})"`;
        }
        tag += '/>';
      }

      content += tag;
    }

    content += '</svg>';

    const parser = new DOMParser();
    const newSvg = parser.parseFromString(content, 'image/svg+xml').documentElement;
    svg.replaceWith(newSvg);
    svg = document.getElementById('canvas');
  }

  function render() {
    const params = readParams();
    const rect = container.getBoundingClientRect();
    const svgW = rect.width;
    const svgH = rect.height;

    if (params.gridMode) {
      const grid = computeGrid(params);
      if (!grid) return;
      const rects = buildGridRects(params, grid);
      renderRects(rects, params, svgW, svgH);
    } else {
      renderRects(flowRects, params, svgW, svgH);
    }
  }

  function bindSlider(input, display) {
    input.addEventListener('input', () => {
      display.textContent = input.value;
      scheduleRender();
    });
  }

  function bindCheckbox(input) {
    input.addEventListener('change', scheduleRender);
  }

  bindSlider(rowsInp, rowsVal);
  bindSlider(colsInp, colsVal);
  bindSlider(wScaleInp, wVal);
  bindSlider(hScaleInp, hVal);
  bindSlider(rotInp, rotVal);
  bindSlider(gapInp, gapVal);
  bindSlider(innerProbInp, innerProbVal);

  bindCheckbox(randomRotInp);
  bindCheckbox(continuousInp);
  bindCheckbox(innerFillInp);

  gridModeInp.addEventListener('change', () => {
    showGridControls(gridModeInp.checked);
    scheduleRender();
  });

  function makeRect(cx, cy, params) {
    const w = params.wScale * FLOW_BASE;
    const h = params.hScale * FLOW_BASE;
    const hasInner = Math.random() < params.innerProb;
    const rot = params.randomRot ? Math.random() * 360 : params.rotation;
    return { cx, cy, w, h, hasInner, rot };
  }

  function getCanvasPoint(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      cx: clientX - rect.left,
      cy: clientY - rect.top,
    };
  }

  function startDraw(e) {
    if (gridModeInp.checked) return;
    e.preventDefault();
    isDrawing = true;
    const pt = getCanvasPoint(e);
    lastPoint = pt;
    flowRects.push(makeRect(pt.cx, pt.cy, readParams()));
    scheduleRender();
  }

  function moveDraw(e) {
    if (!isDrawing || gridModeInp.checked) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    const params = readParams();
    const dist = Math.hypot(pt.cx - lastPoint.cx, pt.cy - lastPoint.cy);
    const step = Math.max(FLOW_MIN_DIST, params.gapPx || 1);

    if (dist >= step) {
      const n = Math.floor(dist / step);
      for (let i = 0; i < n; i++) {
        const t = (i + 1) / n;
        const cp = {
          cx: lastPoint.cx + (pt.cx - lastPoint.cx) * t,
          cy: lastPoint.cy + (pt.cy - lastPoint.cy) * t,
        };
        flowRects.push(makeRect(cp.cx, cp.cy, params));
      }
      lastPoint = pt;
      scheduleRender();
    }
  }

  function endDraw(e) {
    if (!isDrawing) return;
    isDrawing = false;
    lastPoint = null;
  }

  container.addEventListener('mousedown', startDraw);
  window.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);

  container.addEventListener('touchstart', startDraw, { passive: false });
  window.addEventListener('touchmove', moveDraw, { passive: false });
  window.addEventListener('touchend', endDraw);

  clearBtn.addEventListener('click', () => {
    flowRects = [];
    scheduleRender();
  });

  function downloadSVG() {
    const params = readParams();
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const label = params.randomRot ? 'rand' : params.rotation;
    a.download = `pattern-${params.rows}x${params.cols}-w${Math.round(params.wScale * 100)}-h${Math.round(params.hScale * 100)}-r${label}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadBtn.addEventListener('click', downloadSVG);

  window.addEventListener('resize', scheduleRender);

  showGridControls(gridModeInp.checked);
  render();
})();
