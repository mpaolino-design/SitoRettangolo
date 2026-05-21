# Maschera Sonora — Sound-Responsive SVG Animation

## Overview
Pagina web autonoma che cattura audio dal microfono in tempo reale e anima una maschera/uccello tra due stati SVG (quiete e movimento) in base al volume.

## Audio Pipeline

1. `getUserMedia` richiede accesso microfono
2. `AudioContext` + `AnalyserNode` campiona l'audio in tempo reale (FFT 1024)
3. Calcolo volume RMS ogni frame (`requestAnimationFrame`)
4. Mappatura volume → valore di animazione con curva personalizzabile

## Mappatura Volume → Animazione

- **Soglia bassa**: volume ≥ ~0.15 attiva movimento completo
- **Smoothing**: filtro esponenziale (`lerp`) per attacco/rilascio naturali
- **Curva**: `clamp(volume * sensitivityGain, 0, 1)` con `sensitivityGain` regolabile da utente
- Il valore risultante controlla sia il cross-fade che la pupilla

## Layers SVG

### Cross-fade becco/testa
- Layer fondo: STATO DI QUIETE (opacità 1 - animationValue)
- Layer sopra: STATO DI Movimento (opacità animationValue)
- Entrambi ancorati allo stesso `viewBox` (0 0 1179 2556) e centrati nella viewport

### Pupilla (animata separatamente via JS)
- Posizione quiete: `cx=449.81, cy=1131.84`
- Posizione movimento: `cx=395.33, cy=1093.06`
- Interpolazione lineare tra le due in base ad animationValue
- Questo evita l'effetto "doppia pupilla" del cross-fade

## UI

- Pulsante "Attiva microfono" (richiede interazione utente per AudioContext)
- Slider **Sensibilità**: moltiplicatore del volume in ingresso
- Slider **Smoothing**: velocità di attacco/rilascio (0-1)
- Indicatore volume in tempo reale (barra o meter)

## Edge Cases

- **Nessun microfono**: messaggio "Microfono non trovato"
- **Permesso negato**: messaggio "Permesso microfono negato", maschera ferma in quiete
- **Browser non supportato**: fallback con maschera statica in quiete
- **Silenzio/rumore di fondo**: lo smoothing evita flickering; si può aggiungere noise gate minimo

## Implementation Files

- `index.html` — entry point, UI
- `style.css` — layout, responsive centering della maschera
- `app.js` — audio pipeline, animation loop, SVG manipolazione

## Non incluso (YAGNI)

- File audio upload
- Registrazione/export
- Multi-maschera
- Effetti visivi extra (particelle, sfondi)
