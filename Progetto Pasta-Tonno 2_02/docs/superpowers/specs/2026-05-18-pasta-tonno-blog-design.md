# Pasta al Tonno — Punk Stellato Blog Design

## Concept
Single-page cooking blog (zine style) with a contrast between **punk/street attitude** (noise textures, halftone, raw typography) and **Michelin-star rigidity** (clean grid, generous spacing, hierarchical typography). The recipe itself is the "island of perfection" in a sea of grunge.

## Sections (smooth-scroll)
1. **Hero / Home** — big title, bn image with halftone, CTA
2. **Ricette** — card grid listing
3. **La Ricetta** — the actual recipe (sterile/rigid layout)
4. **Chef** — bio with punk attitude
5. **Contatti** — minimal footer

## Color Palette

| Role | Hex | Usage |
|---|---|---|
| Main background | `#0a0a0a` | Base for all non-recipe sections |
| Recipe background | `#d4c4a8` (pelle/tela grezza + halftone overlay) | Recipe section canvas |
| Text on dark | `#f5f0eb` | Body text on black |
| Text on light | `#000000` | Body text on recipe background |
| Primary accent | `#C00707` (rosso mattone) | Titles, borders, strong elements |
| Secondary accent | `#d95a2b` (arancione bruciato) | Hover states, highlights |
| Tertiary accent | `#d4a017` (giallo senape) | Minor details, decorations |

## Typography
- **Titles & numbers:** [Bytesized](https://fonts.google.com/specimen/Bytesized) (Google Fonts) — monospace, expressive, rigid
- **Body text:** Inter (Google Fonts) — clean, modern, maximally readable
- **CHEF MARION PAOLON:** All caps, Bytesized, rosso mattone

## Visual Effects
- **Noise grain** overlay on all dark backgrounds (punk texture) — via CSS pseudo-element with SVG `<feTurbulence>`
- **Halftone / mezzetinte** effect on hero image and chef photo — subtle enough to keep readability; implemented via CSS mask or canvas
- **Angled separators** (`clip-path: polygon(...)` skew cuts) in rosso mattone between sections
- Sticky nav: black bg, links in arancione bruciato, hover → giallo senape. Hamburger menu on mobile via CSS `:target` or JS toggle

## Recipe Section Details
The recipe is laid out with rigid Michelin-star precision:
- Two-column grid: ingredients (left), steps (right)
- Steps numbered in large Bytesized
- Generous spacing and clear hierarchy
- Box for chef signature + prep time in rosso mattone
- "CHEF MARION PAOLON" signature in Bytesized all-caps at the bottom
- Halftone overlay on recipe background is kept very subtle (low opacity) so black text remains fully readable

## Recipe Section Details
The recipe is laid out with rigid Michelin-star precision:
- Two-column grid: ingredients (left), steps (right)
- Steps numbered in large Bytesized
- Generous spacing and clear hierarchy
- Box for chef signature + prep time in rosso mattone
- "CHEF MARION PAOLON" signature in Bytesized all-caps at the bottom

## Technical
- Single HTML file
- No framework — vanilla HTML/CSS/JS
- Google Fonts loaded via `<link>`
- Smooth scroll via CSS `scroll-behavior: smooth`
- Noise/halftone effects via CSS pseudo-elements and SVG filters
- Responsive design for mobile
