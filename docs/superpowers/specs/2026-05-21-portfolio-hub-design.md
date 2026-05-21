# Portfolio Hub — Design Spec

## Overview

Single-page portfolio website that aggregates 5 existing sub-projects (`Marionetta_02/`, `Maschera Sonora_02/`, `Progetto Pasta-Tonno 2_02/`, `Texture-pattern exercise_02/`, `Tipografia cinetica_02/`). Built with vanilla HTML/CSS/JS, served from the `Sito/` root. No framework.

## Sections

### 1. Hero
- Background: `#F2E0BD`
- Title "MARIO PAOLINO" centered, font Anton, large, color Primary `#F2071B`
- Behind the title: the 5 project names floating chaotically (bouncing off edges, low opacity ~0.2), DOM-based with `requestAnimationFrame`
- Bottom of hero: CTA button "Scopri i progetti" in primary color, scrolls to project section

### 2. About
- Placeholder section with lorem ipsum text
- Will be refined later with actual bio

### 3. Project Spheres
- 5 circular cards (~220px diameter), each containing a project name
- Colors rotate through palette: Rosso `#F2071B`, Blu `#3F83BF`, Arancione `#F24405`, Verde `#68A66D`, Secondary `#3a86ff`
- Trembling animation: continuous random micro-shift (±2–4px) via JS
- Hover: stops trembling, slight scale-up (1.05), cursor pointer
- Click: opens project URL in new tab (`target="_blank"`, `rel="noopener"`)
- Responsive grid: 3+2 on desktop, wraps on smaller viewports
- Gap between spheres: moderate with slight variation, margins from screen edges

### 4. Footer
- Social links (Instagram, email) — reuse from Pasta-Tonno blog style

## Tech Stack
- Vanilla HTML/CSS/JS
- Google Fonts: Anton (titles), Inter (body/captions) — already used in existing projects
- No frameworks or build tools

## Color System

| Role | Hex |
|------|-----|
| Primary | `#F2071B` |
| Secondary | `#3a86ff` |
| Background | `#F2E0BD` |
| Active | `#F2071B` |
| Hover | `#F2071BB3` |
| Disabled | `#00000080` |

## States
- Active: `#F2071B`
- Hover: `#F2071BB3`
- Disabled: `#00000080`

## Typography

| Element | Font |
|---------|------|
| H1–H3 | Anton |
| Body | Inter |
| Caption | Inter |

## File Structure (in `Sito/`)

```
Sito/
├── index.html           (new — portfolio hub)
├── css/
│   └── style.css        (new — portfolio styles)
├── js/
│   └── script.js        (new — floating names + sphere trembling)
├── Style-guide.md
├── Style guide.txt
├── colori.txt
├── Marionetta_02/
├── Maschera Sonora_02/
├── Progetto Pasta-Tonno 2_02/
├── Texture-pattern exercise_02/
└── Tipografia cinetica_02/
```
