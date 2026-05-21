# Vector Pattern Tool — Design Spec

**Date**: 2026-05-19
**Status**: Approved

## Overview

A web-based interactive tool for generative vector art. The tool renders a grid of rectangles on an SVG canvas, where each rectangle can be rotated, scaled, and optionally contain a smaller inner rectangle. All parameters are controlled globally via sliders. The result can be exported as an SVG file.

## Architecture

Single-page application: one HTML file + one JS file + one CSS file (or inlined). No framework dependencies — pure DOM manipulation for UI and SVG generation.

- **UI layer**: HTML controls (sliders, toggle, button) in a sidebar panel
- **Rendering layer**: SVG element generated and replaced on each parameter change
- **Export layer**: `Blob` from SVG `outerHTML` with download link

## Canvas & Grid

- The SVG viewport fills the available container space (responsive)
- Grid defined by user-controlled **Rows** and **Columns** sliders
- Cell size computed dynamically: `cellWidth = svgWidth / cols`, `cellHeight = svgHeight / rows`
- Vertical gap between rows: user-controlled (default ~1mm, converted to pixels at render)
- Horizontal gap between cells in same row: 0 (rectangles touch laterally)

## Outer Rectangles

- One per cell, centered within the cell
- **Scale**: slider (% of cell size, e.g. 10–95%)
- **Rotation**: slider (0–360°, applied via SVG `transform="rotate(deg cx cy)"` where cx,cy is the rectangle center)
- **Width/Height**: `cellSize * scale` (single scale slider keeps proportions)
- **Style**: `fill="none" stroke="black" stroke-width="..."` — outline only, no fill

## Gap Between Rows

- User sets gap in mm via slider (e.g. 0.5–5mm)
- Converted to pixels at render time using a reference DPI (96)
- Cell height is computed as: `cellHeight = (svgHeight - (rows - 1) * gapPx) / rows`
- This ensures the total SVG content (cells + gaps) fills the viewport without scrolling

## Inner Rectangles

- Each outer rectangle has a `probability`-based chance of containing an inner rectangle
- **Probability**: slider 0–100%
- **Size**: exactly 50% of the outer rectangle (width and height)
- **Position**: centered within the outer rectangle
- **Style (toggle)**: either `fill="black" stroke="none"` (filled) or `fill="none" stroke="black"` (outline)

## Controls (UI)

All in a left sidebar panel:

| Control | Type | Range | Default |
|---------|------|-------|---------|
| Rows | range slider | 1–100 | 10 |
| Columns | range slider | 1–100 | 10 |
| Scale | range slider | 10–95 (%) | 70 |
| Rotation | range slider | 0–360 (°) | 0 |
| Vertical Gap | range slider | 0.5–5 (mm) | 1 |
| Inner Probability | range slider | 0–100 (%) | 30 |
| Inner Fill | checkbox toggle | on/off | on |
| Download SVG | button | — | — |

Each slider displays its current value next to it.

## Rendering Pipeline

1. User changes a slider → event handler fires
2. Read all current parameter values from DOM
3. Calculate grid dimensions: cell size, positions
4. Generate array of rect objects with computed `x, y, w, h, rotation, inner`
5. Build SVG string: `<svg>` + `<g>` per row + `<rect>` per cell (and optional inner `<rect>`)
6. Replace previous SVG in container with new SVG
7. On "Download SVG": serialize current SVG element, create `Blob`, trigger download via `<a>` click

## Export

- Single click download as `.svg` file
- Filename: `pattern-<rows>x<cols>-<scale>-<rot>.svg`
- No external dependencies required for export

## Performance

- SVG is regenerated entirely on each slider change (debounced by 16ms via requestAnimationFrame)
- For grids up to ~5000 rectangles (~70×70), rendering is sub-100ms
- For larger grids, a frame-skip or explicit "Render" button can be added later
- Inner rectangle check is O(1) per cell (coin flip per probability threshold)

## Future Considerations (not in v1)

- Canvas 2D fallback for very large grids
- Color palettes for stroke and inner fill
- Per-cell editing (click to toggle properties)
- Export as PNG (requires Canvas conversion)
- Preset / randomize button
