# Marionetta — Hand Pose Drawing Tool

## Overview

Marionetta is a browser-based drawing tool controlled entirely by hand gestures via webcam. It uses TensorFlow.js `@tensorflow-models/hand-pose-detection` with the MediaPipe Hands model to detect 21 hand keypoints in 3D, then interprets gestures to draw, erase, and change colors on a full-screen canvas.

## Architecture

- **Single HTML file** (vanilla, no build tools)
- TensorFlow.js + hand-pose-detection loaded via CDN script tags
- Canvas rendering with off-screen canvas optimization
- Webcam video preview (small overlay)

### Layer stack (top to bottom)

1. **Overlay info** — current color indicator, draw/eraser mode
2. **Drawing canvas** — full viewport `<canvas>`, receives strokes
3. **Video layer** — webcam feed mirrored, small overlay (160×120, top-right)

### Tech stack

- `@tensorflow-models/hand-pose-detection` (CDN)
- `@tensorflow/tfjs-core`, `@tensorflow/tfjs-converter`, `@tensorflow/tfjs-backend-webgl` (CDN)
- `@mediapipe/hands` (CDN) — MediaPipe hands solution for 3D landmarks
- Canvas 2D API for rendering

## Gesture→Action Mapping

| Hand state | Condition | Action |
|---|---|---|
| Idle | None of the below | Nothing |
| Draw | `dist3D(thumb_tip, middle_tip) < 0.035` | Active stroke following midpoint(index_tip, middle_tip) |
| Change color | `dist3D(thumb_tip, index_tip) < 0.035` — one-shot per pinch | Cycle next color |
| Eraser | All 4 finger tips have y > respective mcp y (folded relative to palm) | Erase via `destination-out` composite |
| Release | Above thresholds exceeded + hysteresis buffer | End current stroke / allow next color change |

### Thresholds

- Activation: ~3.5cm in 3D metric space
- Release hysteresis: distances must exceed 1.5× activation threshold before gesture is considered released (prevents jitter)

### Distance metric

All fingertip distances use the 3D keypoints (`keypoints3D`) returned by the model, which are in metric scale (meters). The origin is the auxiliary keypoint (mean of first knuckles of index, middle, ring, pinky).

## Drawing Mechanics

### Stroke engine

- A **segment** = consecutive points drawn without releasing the gesture
- Points stored as `{x, y, width, color, timestamp}`
- When draw gesture releases → segment finalized → committed to off-screen canvas
- Only the active segment is redrawn every frame; committed segments are blitted

### Stroke width

- Proportional to the Euclidean distance `dist3D(thumb_tip, middle_tip)`
- When the tips are closest → minimum width (~2px)
- When farthest (within gesture range) → maximum width (~30px)
- Linear interpolation between min and max based on distance relative to a configured range

### Trail point

- `midX = (index_tip.x + middle_tip.x) / 2`
- `midY = (index_tip.y + middle_tip.y) / 2`
- Points are mirrored horizontally to match the mirrored webcam feed

### Color system

5 colors, cycled via pinch (one-shot per pinch):

1. White (default, on black background)
2. Red
3. Blue
4. Green
5. Orange

Back to white after orange. A `canChangeColor` boolean flag prevents rapid cycling: it is set to `false` on pinch detection and reset to `true` only when `dist3D(thumb_tip, index_tip)` exceeds the threshold (gesture released).

## Eraser

- Pugno: all 4 finger tips (index, middle, ring, pinky) have y-coordinate greater than respective mcp y-coordinate — fingers folded toward palm
- Uses `globalCompositeOperation = 'destination-out'` on the drawing canvas
- Eraser radius proportional to the bounding box of the fist
- Eraser applies to both main canvas and off-screen buffer to ensure erasures persist when the buffer is blitted

## Canvas Layout

- **Drawing canvas**: `window.innerWidth × window.innerHeight`
- Scaled on `window.resize` event (debounced)
- **Video preview**: 160×120, top-right corner, mirrored via CSS `transform: scaleX(-1)`
- **Info overlay**: bottom-center, semi-transparent, shows current color dot + mode text

## Performance

- **Off-screen canvas**: all finalized segments are rendered to a buffer canvas
- The active segment is composited over the buffer in the main rAF loop
- `estimateHands(video)` is called once per animation frame
- Model type: `full` (the user can fall back to `lite` if performance is poor)

## Error handling

- Webcam access failure → show error message, fallback mode (no drawing)
- Model loading failure → retry once, then show error
- No hands detected → no-op in loop (no drawing, no erasing)
- If model FPS drops below threshold → auto-downgrade to `lite` model

## Initialization flow

```
load page → request webcam → load hand-pose-detection model →
start rAF loop: estimateHands → gesture detection → canvas update
```

## Non-goals

- No UI palette or controls (color is gesture-only)
- No save/export functionality
- No multi-touch or touchscreen input
- No frameworks or build tools

## Constraints

- Must work in latest Chrome, Firefox, Edge on desktop
- Webcam required (user-facing camera)
- ModelType: full by default, lite as fallback
- Single hand for drawing (multi-hand ignored for drawing, but both hands tracked)
