# Martello — Kinetic Typography Web Tool

## Overview

Single-file HTML application that animates the word **"Martello"** letter-by-letter via keyboard input. Each letter behaves like a nail being hammered into the canvas border. Typing speed controls hammer animation speed.

## Input & Trigger

- **Keyboard-driven:** pressing a letter key that belongs to "martello" triggers that letter's animation sequence
- Letters follow word order: M → A → R → T → E → L → L → O
- Pressing L triggers **both** L letters simultaneously in the same column
- Pressing a non-martello key causes a brief screen tremble (shake effect on canvas)

## Speed Mapping

- Time delta between successive keypresses determines that letter's animation duration
- Fast typing (short delta) → fast hammer hit (min ~200ms animation)
- Slow typing (long delta) → slow, theatrical hammer hit (max ~1500ms animation)
- Default/fallback duration for the first letter: 800ms

## Layout (7 columns, 8 letters)

Canvas width divided into 7 equal columns (L+L share column 5):

| Col | Letter | Edge |
|-----|--------|------|
| 0   | M      | bottom |
| 1   | A      | top |
| 2   | R      | bottom |
| 3   | T      | top |
| 4   | E      | bottom |
| 5   | L L    | top (both) |
| 6   | O      | bottom |

Letters are positioned at the center of their column, on the assigned edge (top or bottom). All letters remain upright and readable — no rotation.

## Animation Phases (per letter)

1. **Nail** — a colored nail appears at the target position on the canvas edge; gentle glow pulse
2. **Wind-up** — the hammer moves into position on the opposite side of where the nail is; hammer rears back slightly
3. **Hit** — hammer strikes down toward the nail; at the moment of impact, the nail transforms into the letter
4. **Settle** — hammer retracts away; letter remains fixed at its edge position

## Hammer

- Rendered as a simple hammer shape (brown handle, gray head) on the canvas
- Positioned on the opposite side of the canvas from the letter's edge
- Its movement speed is proportional to the typing-speed-derived animation duration
- Trails/speed lines during the hit phase for impact emphasis

## Nails

- Simple nail shape (line + round head) drawn on canvas
- Each nail gets a vibrant, purely aesthetic color
- Soft glow/pulse animation before the hit
- Replaced by the letter at the moment of impact

## Visual Style

- Dark background (#1a1a2e)
- White/light-gray bold sans-serif letters
- Hammer: brown handle, gray head
- Colorful glowing nails
- Canvas fills viewport, responsive to resize

## Architecture (Vanilla JS + Canvas API)

### State

```js
letters = [
  { char, edge: "up"|"down", col, x, y, phase, progress, color, active }
]
```

### Components

- **InputHandler** — listens to `keydown`, maps key to letter index, computes time delta, triggers tremble on invalid key
- **Sequencer** — manages per-letter phase transitions (nail → windup → hit → settle)
- **Renderer** — draws nails, hammer, letters, glow effects on canvas each frame
- **AnimationLoop** — `requestAnimationFrame` driving progress updates and rendering
- **Trembler** — canvas shake effect triggered by invalid keypress

### Future Considerations

- Possible expansion to other words or multi-word sequences
- Controls for color palette, animation curves, letter sizing

## Non-goals (YAGNI)

- No save/export functionality
- No audio
- No UI controls panel (keyboard-only for now)
- No multi-word support
