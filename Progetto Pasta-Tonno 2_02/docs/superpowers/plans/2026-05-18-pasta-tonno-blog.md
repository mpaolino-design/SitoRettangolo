# Pasta al Tonno — Punk Stellato Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page cooking blog with punk/street attitude and Michelin-star precision for the recipe section.

**Architecture:** Single HTML page with separate CSS and JS. Smooth-scroll navigation between 5 sections. Dark background with noise grain throughout, except the recipe section which uses a light canvas with halftone. No framework dependencies — vanilla HTML/CSS/JS.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, clip-path), vanilla JS, Google Fonts (Bytesized + Inter), SVG noise filter

---

### Task 1: HTML Structure — index.html

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html with full page structure**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PASTA AL TONNO — Cucina Punk</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bytesized&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <svg class="noise-filter" aria-hidden="true">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </svg>

  <nav class="nav">
    <div class="nav__inner">
      <a href="#hero" class="nav__logo">PASTA</a>
      <button class="nav__toggle" aria-label="Menu">☰</button>
      <ul class="nav__links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#ricette">Ricette</a></li>
        <li><a href="#ricetta">La Ricetta</a></li>
        <li><a href="#chef">Chef</a></li>
        <li><a href="#contatti">Contatti</a></li>
      </ul>
    </div>
  </nav>

  <main>
    <section id="hero" class="section hero">
      <div class="hero__content">
        <h1 class="hero__title">PASTA AL TONNO</h1>
        <p class="hero__subtitle">Cucina punk. Stellata.</p>
        <a href="#ricetta" class="hero__cta">Vedi la ricetta</a>
      </div>
    </section>

    <section id="ricette" class="section ricette">
      <div class="section__header">
        <h2 class="section__title">RICETTE</h2>
      </div>
      <div class="ricette__grid">
        <article class="ricetta-card">
          <div class="ricetta-card__image"></div>
          <div class="ricetta-card__body">
            <h3 class="ricetta-card__title">Pasta al Tonno con Pomodoro</h3>
            <p class="ricetta-card__desc">La ricetta punk che unisce semplicità e sapore. Rigatoni, tonno e pomodoro come non li hai mai visti.</p>
            <a href="#ricetta" class="ricetta-card__link">Leggi →</a>
          </div>
        </article>
      </div>
    </section>

    <section id="ricetta" class="section ricetta">
      <div class="ricetta__inner">
        <div class="ricetta__header">
          <h2 class="ricetta__title">Pasta al Tonno con Pomodoro</h2>
          <div class="ricetta__meta">
            <span class="ricetta__chef">CHEF MARION PAOLON</span>
            <span class="ricetta__time">Preparazione: 25 min</span>
          </div>
        </div>
        <div class="ricetta__grid">
          <div class="ricetta__ingredients">
            <h3 class="ricetta__subtitle">Ingredienti</h3>
            <ul class="ricetta__list">
              <li>150 g di pasta (rigatoni)</li>
              <li>Salsa di pomodoro (ciliegino)</li>
              <li>Tonno</li>
              <li>Origano</li>
              <li>Sale</li>
            </ul>
          </div>
          <div class="ricetta__steps">
            <h3 class="ricetta__subtitle">Preparazione</h3>
            <ol class="ricetta__steps-list">
              <li><span class="ricetta__step-num">1</span><span>Prendi la pentola dalla dispensa. Mettila sotto l'acqua del lavandino a metà, poi mettila sul piano cottura.</span></li>
              <li><span class="ricetta__step-num">2</span><span>Accendi il fuoco e il gas. Aspetta 10 minuti che l'acqua bolle.</span></li>
              <li><span class="ricetta__step-num">3</span><span>Metti i 150 g di pasta e 2 cucchiai di sale. Gira con il mestolo.</span></li>
              <li><span class="ricetta__step-num">4</span><span>Dopo 10 minuti assaggia. Se cotta, spegni e scolala.</span></li>
              <li><span class="ricetta__step-num">5</span><span>Rimetti la pentola sul fuoco con salsa, tonno e origano. Mescola per 2 minuti.</span></li>
              <li><span class="ricetta__step-num">6</span><span>Aggiungi la pasta, mescola e cuoci altri 2 minuti. Spegni il fuoco.</span></li>
              <li><span class="ricetta__step-num">7</span><span>Impiatta e... buon appetito! (Prendi la forchetta, se no mangi con le mani.)</span></li>
            </ol>
          </div>
        </div>
        <div class="ricetta__footer">
          <span class="ricetta__signature">CHEF MARION PAOLON</span>
        </div>
      </div>
    </section>

    <section id="chef" class="section chef">
      <div class="chef__inner">
        <div class="chef__image"></div>
        <div class="chef__body">
          <h2 class="chef__name">CHEF MARION PAOLON</h2>
          <p class="chef__bio">Appassionato di cucina semplice e senza compromessi. Ogni piatto è un manifesto: pochi ingredienti, personalità, e un pizzico di sana incoscienza. Benvenuti nella mia cucina.</p>
        </div>
      </div>
    </section>
  </main>

  <footer id="contatti" class="footer">
    <div class="footer__inner">
      <div class="footer__links">
        <a href="#" class="footer__link">Instagram</a>
        <a href="#" class="footer__link">Email</a>
      </div>
      <p class="footer__copy">© 2026 CHEF MARION PAOLON — Cucina Punk</p>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create the file**

```bash
New-Item -ItemType Directory -Path "css" -Force; New-Item -ItemType Directory -Path "js" -Force
```

```bash
Set-Content -Path "index.html" -Value @'<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PASTA AL TONNO --- Cucina Punk</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bytesized&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <svg class="noise-filter" aria-hidden="true">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </svg>
  <nav class="nav">
    <div class="nav__inner">
      <a href="#hero" class="nav__logo">PASTA</a>
      <button class="nav__toggle" aria-label="Menu">☰</button>
      <ul class="nav__links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#ricette">Ricette</a></li>
        <li><a href="#ricetta">La Ricetta</a></li>
        <li><a href="#chef">Chef</a></li>
        <li><a href="#contatti">Contatti</a></li>
      </ul>
    </div>
  </nav>
  <main>
    <section id="hero" class="section hero">
      <div class="hero__content">
        <h1 class="hero__title">PASTA AL TONNO</h1>
        <p class="hero__subtitle">Cucina punk. Stellata.</p>
        <a href="#ricetta" class="hero__cta">Vedi la ricetta</a>
      </div>
    </section>
    <section id="ricette" class="section ricette">
      <div class="section__header">
        <h2 class="section__title">RICETTE</h2>
      </div>
      <div class="ricette__grid">
        <article class="ricetta-card">
          <div class="ricetta-card__image"></div>
          <div class="ricetta-card__body">
            <h3 class="ricetta-card__title">Pasta al Tonno con Pomodoro</h3>
            <p class="ricetta-card__desc">La ricetta punk che unisce semplicità e sapore. Rigatoni, tonno e pomodoro come non li hai mai visti.</p>
            <a href="#ricetta" class="ricetta-card__link">Leggi →</a>
          </div>
        </article>
      </div>
    </section>
    <section id="ricetta" class="section ricetta">
      <div class="ricetta__inner">
        <div class="ricetta__header">
          <h2 class="ricetta__title">Pasta al Tonno con Pomodoro</h2>
          <div class="ricetta__meta">
            <span class="ricetta__chef">CHEF MARION PAOLON</span>
            <span class="ricetta__time">Preparazione: 25 min</span>
          </div>
        </div>
        <div class="ricetta__grid">
          <div class="ricetta__ingredients">
            <h3 class="ricetta__subtitle">Ingredienti</h3>
            <ul class="ricetta__list">
              <li>150 g di pasta (rigatoni)</li>
              <li>Salsa di pomodoro (ciliegino)</li>
              <li>Tonno</li>
              <li>Origano</li>
              <li>Sale</li>
            </ul>
          </div>
          <div class="ricetta__steps">
            <h3 class="ricetta__subtitle">Preparazione</h3>
            <ol class="ricetta__steps-list">
              <li><span class="ricetta__step-num">1</span><span>Prendi la pentola dalla dispensa. Mettila sotto l'acqua del lavandino a metà, poi mettila sul piano cottura.</span></li>
              <li><span class="ricetta__step-num">2</span><span>Accendi il fuoco e il gas. Aspetta 10 minuti che l'acqua bolle.</span></li>
              <li><span class="ricetta__step-num">3</span><span>Metti i 150 g di pasta e 2 cucchiai di sale. Gira con il mestolo.</span></li>
              <li><span class="ricetta__step-num">4</span><span>Dopo 10 minuti assaggia. Se cotta, spegni e scolala.</span></li>
              <li><span class="ricetta__step-num">5</span><span>Rimetti la pentola sul fuoco con salsa, tonno e origano. Mescola per 2 minuti.</span></li>
              <li><span class="ricetta__step-num">6</span><span>Aggiungi la pasta, mescola e cuoci altri 2 minuti. Spegni il fuoco.</span></li>
              <li><span class="ricetta__step-num">7</span><span>Impiatta e... buon appetito! (Prendi la forchetta, se no mangi con le mani.)</span></li>
            </ol>
          </div>
        </div>
        <div class="ricetta__footer">
          <span class="ricetta__signature">CHEF MARION PAOLON</span>
        </div>
      </div>
    </section>
    <section id="chef" class="section chef">
      <div class="chef__inner">
        <div class="chef__image"></div>
        <div class="chef__body">
          <h2 class="chef__name">CHEF MARION PAOLON</h2>
          <p class="chef__bio">Appassionato di cucina semplice e senza compromessi. Ogni piatto è un manifesto: pochi ingredienti, personalità, e un pizzico di sana incoscienza. Benvenuti nella mia cucina.</p>
        </div>
      </div>
    </section>
  </main>
  <footer id="contatti" class="footer">
    <div class="footer__inner">
      <div class="footer__links">
        <a href="#" class="footer__link">Instagram</a>
        <a href="#" class="footer__link">Email</a>
      </div>
      <p class="footer__copy">© 2026 CHEF MARION PAOLON — Cucina Punk</p>
    </div>
  </footer>
  <script src="js/script.js"></script>
</body>
</html>'@
```

---

### Task 2: CSS — Reset, Variables, Base, Noise

**Files:**
- Create: `css/style.css`
- Modify: (new file)

- [ ] **Step 1: Write CSS reset, custom properties, and base styles**

```css
/* === RESET === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0a0a0a;
  color: #f5f0eb;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  text-decoration: none;
  color: inherit;
}

ul, ol {
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

/* === CUSTOM PROPERTIES === */
:root {
  --bg-dark: #0a0a0a;
  --bg-recipe: #d4c4a8;
  --text-light: #f5f0eb;
  --text-dark: #000000;
  --red: #C00707;
  --orange: #d95a2b;
  --yellow: #d4a017;
  --font-title: 'Bytesized', monospace;
  --font-body: 'Inter', sans-serif;
}

/* === NOISE FILTER === */
.noise-filter {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  mix-blend-mode: overlay;
}
```

- [ ] **Step 2: Create css/style.css with full content**

```bash
Set-Content -Path "css/style.css" -Value @'*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Inter',sans-serif;background:#0a0a0a;color:#f5f0eb;line-height:1.6;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}ul,ol{list-style:none}img{max-width:100%;display:block}:root{--bg-dark:#0a0a0a;--bg-recipe:#d4c4a8;--text-light:#f5f0eb;--text-dark:#000000;--red:#C00707;--orange:#d95a2b;--yellow:#d4a017;--font-title:'Bytesized',monospace;--font-body:'Inter',sans-serif}.noise-filter{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0.035;mix-blend-mode:overlay}
'@
```

---

### Task 3: CSS — Navigation

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append navigation styles**

```css
/* === NAVIGATION === */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #0a0a0a;
  border-bottom: 2px solid var(--red);
  z-index: 100;
  padding: 0 1.5rem;
}

.nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav__logo {
  font-family: var(--font-title);
  font-size: 1.5rem;
  color: var(--red);
  letter-spacing: 2px;
}

.nav__toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
}

.nav__links {
  display: flex;
  gap: 2rem;
}

.nav__links a {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.2s;
}

.nav__links a:hover {
  color: var(--yellow);
}

/* === MOBILE NAV === */
@media (max-width: 768px) {
  .nav__toggle {
    display: block;
  }

  .nav__links {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background: #0a0a0a;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    pointer-events: none;
    border-bottom: 2px solid var(--red);
  }

  .nav__links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
}
```

---

### Task 4: CSS — Hero Section

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append hero styles**

```css
/* === HERO === */
.section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 1.5rem;
}

.hero {
  position: relative;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, var(--red) 0%, transparent 60%),
              radial-gradient(circle at 70% 50%, var(--orange) 0%, transparent 60%);
  opacity: 0.15;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
}

.hero__title {
  font-family: var(--font-title);
  font-size: clamp(3rem, 12vw, 8rem);
  color: var(--red);
  line-height: 1;
  letter-spacing: 4px;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-family: var(--font-body);
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--text-light);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  opacity: 0.8;
}

.hero__cta {
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-light);
  background: var(--orange);
  padding: 1rem 2.5rem;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: background 0.2s, transform 0.2s;
}

.hero__cta:hover {
  background: var(--red);
  transform: scale(1.05);
}
```

---

### Task 4b: CSS — Angled Separators Between Sections

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append angled separator styles**

```css
/* === ANGLED SEPARATORS === */
.section {
  position: relative;
}

.section::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 50px;
  background: var(--red);
  clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
  z-index: 2;
  pointer-events: none;
}

/* No separator after the last section (footer handles it) */
#contatti::after {
  display: none;
}
```

### Task 5: CSS — Ricette (Cards) Section

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append ricette section styles**

```css
/* === SECTION COMMON === */
.section__header {
  text-align: center;
  margin-bottom: 3rem;
}

.section__title {
  font-family: var(--font-title);
  font-size: clamp(2rem, 6vw, 4rem);
  color: var(--red);
  letter-spacing: 3px;
}

/* === RICETTE GRID === */
.ricette {
  align-items: center;
}

.ricette__grid {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.ricetta-card {
  background: #111;
  border: 1px solid var(--orange);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  max-width: 700px;
  margin: 0 auto;
}

.ricetta-card__image {
  background: linear-gradient(135deg, var(--red), var(--orange));
  min-height: 250px;
  position: relative;
  overflow: hidden;
}

.ricetta-card__image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(0,0,0,0.2) 4px,
    rgba(0,0,0,0.2) 8px
  );
}

.ricetta-card__body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ricetta-card__title {
  font-family: var(--font-title);
  font-size: 1.5rem;
  color: var(--red);
  margin-bottom: 0.75rem;
  letter-spacing: 1px;
}

.ricetta-card__desc {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.ricetta-card__link {
  font-family: var(--font-body);
  font-weight: 700;
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.ricetta-card__link:hover {
  color: var(--yellow);
}

@media (max-width: 600px) {
  .ricetta-card {
    grid-template-columns: 1fr;
  }
  .ricetta-card__image {
    min-height: 180px;
  }
}
```

---

### Task 6: CSS — Recipe Section (The "Sterile" Island)

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append recipe section styles**

```css
/* === RICETTA (STERILE ISLAND) === */
.ricetta {
  background: var(--bg-recipe);
  color: var(--text-dark);
  padding: 80px 1.5rem;
  position: relative;
}

.ricetta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.04) 3px,
    rgba(0,0,0,0.04) 6px
  );
  pointer-events: none;
}

.ricetta__inner {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.ricetta__header {
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 3px solid var(--red);
  padding-bottom: 2rem;
}

.ricetta__title {
  font-family: var(--font-title);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--red);
  line-height: 1.1;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.ricetta__meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-dark);
  font-weight: 600;
}

.ricetta__chef {
  color: var(--red);
  letter-spacing: 2px;
}

.ricetta__grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
}

.ricetta__subtitle {
  font-family: var(--font-title);
  font-size: 1.3rem;
  color: var(--red);
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--red);
  padding-bottom: 0.5rem;
}

.ricetta__list li {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-dark);
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.ricetta__list li:last-child {
  border-bottom: none;
}

.ricetta__steps-list li {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.ricetta__step-num {
  font-family: var(--font-title);
  font-size: 1.8rem;
  color: var(--red);
  line-height: 1;
  flex-shrink: 0;
  min-width: 1.5rem;
}

.ricetta__footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid var(--red);
}

.ricetta__signature {
  font-family: var(--font-title);
  font-size: 1.5rem;
  color: var(--red);
  letter-spacing: 4px;
}

@media (max-width: 700px) {
  .ricetta__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

---

### Task 7: CSS — Chef Section & Footer

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append chef and footer styles**

```css
/* === CHEF === */
.chef {
  align-items: center;
}

.chef__inner {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: center;
}

.chef__image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--red), var(--orange));
  position: relative;
  overflow: hidden;
}

.chef__image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.25) 3px,
    rgba(0,0,0,0.25) 6px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.25) 3px,
    rgba(0,0,0,0.25) 6px
  );
}

.chef__name {
  font-family: var(--font-title);
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--red);
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.chef__bio {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.8;
  opacity: 0.85;
}

@media (max-width: 700px) {
  .chef__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .chef__image {
    max-width: 250px;
    margin: 0 auto;
  }
}

/* === FOOTER === */
.footer {
  background: #0a0a0a;
  border-top: 2px solid var(--red);
  padding: 3rem 1.5rem;
  text-align: center;
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.footer__link {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: color 0.2s;
}

.footer__link:hover {
  color: var(--yellow);
}

.footer__copy {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-light);
  opacity: 0.5;
}
```

- [ ] **Step 2: Concatenate all CSS parts into the final file**

Use the content from Tasks 2-7 to create the complete `css/style.css`.

---

### Task 8: JavaScript — Mobile Menu Toggle

**Files:**
- Create: `js/script.js`

- [ ] **Step 1: Write the JS for mobile menu toggle**

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    document.querySelectorAll('.nav__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }
});
```

- [ ] **Step 2: Create the file**

```bash
Set-Content -Path "js/script.js" -Value "document.addEventListener('DOMContentLoaded',function(){var t=document.querySelector('.nav__toggle'),l=document.querySelector('.nav__links');if(t&&l){t.addEventListener('click',function(){l.classList.toggle('open')});document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open')})})}});"
```

---

### Task 9: Verify — Open in browser

- [ ] **Step 1: Open index.html in browser to verify**

```bash
Start-Item -LiteralPath "index.html"
```

- [ ] **Step 2: Visual checklist**
  - [ ] Navigation is sticky, red border bottom, links in orange
  - [ ] Hero has large title in Bytesized red, CTA button in orange
  - [ ] Recipe section has light canvas `#d4c4a8` with halftone overlay lines
  - [ ] Recipe ingredients (left) and steps (right) in two-column grid
  - [ ] Steps numbered in large Bytesized red
  - [ ] "CHEF MARION PAOLON" signature in Bytesized at bottom of recipe
  - [ ] Chef section with image placeholder and name in Bytesized red
  - [ ] Footer with links in orange
  - [ ] Mobile: hamburger menu appears below 768px
  - [ ] Noise grain visible on dark backgrounds (subtle)
  - [ ] Text is readable throughout
