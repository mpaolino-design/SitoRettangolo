# Portfolio Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page portfolio hub at `Sito/index.html` that links to all 5 existing sub-projects.

**Architecture:** Vanilla HTML/CSS/JS served from `Sito/` root. DOM-based floating text animation in hero, CSS + JS sphere trembling effect. No frameworks or build tools.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Google Fonts (Anton, Inter).

**Files:**
- Create: `Sito/index.html`
- Create: `Sito/css/style.css`
- Create: `Sito/js/script.js`

---

### Task 1: HTML structure

**Files:**
- Create: `Sito/index.html`

- [ ] **Write `index.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mario Paolino — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <section id="hero">
    <div id="floating-names" aria-hidden="true"></div>
    <h1 id="main-title">MARIO PAOLINO</h1>
    <a href="#projects" class="btn-scroll">Scopri i progetti</a>
  </section>

  <section id="about">
    <div class="container">
      <h2>About</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </section>

  <section id="projects">
    <div class="container" id="spheres-grid"></div>
  </section>

  <footer>
    <div class="container">
      <a href="https://www.instagram.com/mariopaolino/" target="_blank" rel="noopener">Instagram</a>
      <a href="mailto:mario@paolino.com">Email</a>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Verify structure** — open `Sito/index.html` in browser, confirm empty sections render without errors (console)

---

### Task 2: Styles

**Files:**
- Create: `Sito/css/style.css`

- [ ] **Write `style.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #F2E0BD;
  color: #1a1a1a;
  overflow-x: hidden;
}

/* Hero */
#hero {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#floating-names {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.floating-name {
  position: absolute;
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #F2071B;
  opacity: 0.15;
  white-space: nowrap;
  user-select: none;
  will-change: transform;
}

#main-title {
  position: relative;
  z-index: 1;
  font-family: 'Anton', sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  color: #F2071B;
  text-align: center;
  line-height: 1;
  pointer-events: none;
}

.btn-scroll {
  position: absolute;
  bottom: 3rem;
  z-index: 1;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #F2071B;
  text-decoration: none;
  padding: 0.75rem 2rem;
  border: 2px solid #F2071B;
  border-radius: 999px;
  transition: background 0.2s, color 0.2s;
}

.btn-scroll:hover {
  background: #F2071B;
  color: #F2E0BD;
}

/* About */
#about {
  padding: 5rem 1rem;
  background: #fffbf0;
}

#about h2 {
  font-family: 'Anton', sans-serif;
  font-size: 2.5rem;
  color: #F2071B;
  margin-bottom: 1rem;
}

#about p {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 640px;
  color: #333;
}

/* Projects */
#projects {
  padding: 5rem 1rem;
}

#spheres-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.sphere {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease;
  will-change: transform;
}

.sphere:hover {
  transform: scale(1.05);
}

.sphere span {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  line-height: 1.3;
}

/* Footer */
footer {
  padding: 2rem 1rem;
  text-align: center;
  background: #1a1a1a;
}

footer a {
  font-family: 'Inter', sans-serif;
  color: #F2E0BD;
  text-decoration: none;
  margin: 0 1rem;
  font-size: 0.95rem;
}

footer a:hover {
  color: #F2071B;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

- [ ] **Verify styles** — open `index.html`, confirm hero, about, projects, footer sections render with correct colors and layout

---

### Task 3: Floating names animation (hero)

**Files:**
- Modify: `Sito/js/script.js`

- [ ] **Write floating names logic**

```javascript
const projects = [
  'Marionetta',
  'Maschera Sonora',
  'Pasta-Tonno',
  'Texture Pattern',
  'Tipografia Cinetica',
];

const container = document.getElementById('floating-names');
const names = [];

projects.forEach((text) => {
  const el = document.createElement('div');
  el.className = 'floating-name';
  el.textContent = text;
  container.appendChild(el);

  const speed = 0.3 + Math.random() * 0.5;
  names.push({
    el,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() > 0.5 ? 1 : -1) * speed,
    vy: (Math.random() > 0.5 ? 1 : -1) * speed,
  });
});

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function animateFloating() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  names.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;

    const rect = n.el.getBoundingClientRect();
    const ew = rect.width;
    const eh = rect.height;

    if (n.x < 0) { n.x = 0; n.vx *= -1; }
    if (n.x + ew > w) { n.x = w - ew; n.vx *= -1; }
    if (n.y < 0) { n.y = 0; n.vy *= -1; }
    if (n.y + eh > h) { n.y = h - eh; n.vy *= -1; }

    n.el.style.transform = `translate(${n.x}px, ${n.y}px)`;
  });

  requestAnimationFrame(animateFloating);
}

window.addEventListener('resize', () => { /* positions adjust naturally next frame */ });
animateFloating();
```

- [ ] **Verify floating names** — open page, confirm 5 project names bounce around behind the title, no console errors

---

### Task 4: Sphere trembling + project data

**Files:**
- Modify: `Sito/js/script.js`

- [ ] **Append sphere logic to script.js**

```javascript
const sphereColors = ['#F2071B', '#3F83BF', '#F24405', '#68A66D', '#3a86ff'];

const sphereData = [
  { name: 'Marionetta', url: 'Marionetta_02/index.html' },
  { name: 'Maschera Sonora', url: 'Maschera Sonora_02/index.html' },
  { name: 'Pasta-Tonno', url: 'Progetto Pasta-Tonno 2_02/index.html' },
  { name: 'Texture Pattern', url: 'Texture-pattern exercise_02/index.html' },
  { name: 'Tipografia Cinetica', url: 'Tipografia cinetica_02/index.html' },
];

const grid = document.getElementById('spheres-grid');
const spheres = [];

sphereData.forEach((d, i) => {
  const a = document.createElement('a');
  a.className = 'sphere';
  a.href = d.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.style.backgroundColor = sphereColors[i % sphereColors.length];
  a.innerHTML = `<span>${d.name}</span>`;
  grid.appendChild(a);
  spheres.push({ el: a, trembling: true, dx: 0, dy: 0 });
});

function animateSpheres() {
  spheres.forEach((s) => {
    if (!s.trembling) return;
    s.dx = (Math.random() - 0.5) * 6;
    s.dy = (Math.random() - 0.5) * 6;
    s.el.style.transform = `translate(${s.dx}px, ${s.dy}px)`;
  });
  requestAnimationFrame(animateSpheres);
}

grid.addEventListener('mouseover', (e) => {
  const link = e.target.closest('.sphere');
  if (link) {
    const s = spheres.find((x) => x.el === link);
    if (s) s.trembling = false;
  }
});

grid.addEventListener('mouseout', (e) => {
  const link = e.target.closest('.sphere');
  if (link) {
    const s = spheres.find((x) => x.el === link);
    if (s) s.trembling = true;
  }
});

animateSpheres();
```

- [ ] **Verify spheres** — open page, scroll to projects section, confirm 5 colored spheres tremble, stop on hover, link to correct sub-projects on click

---

### Task 5: Final integration check

- [ ] **Open `Sito/index.html` in browser** and verify:
  - Hero: title visible, 5 names bounce behind, CTA button visible
  - About: placeholder text renders
  - Spheres: 5 trembling colored circles, stop on hover, click opens correct project in new tab
  - Footer: social links visible and functional
  - Console: no errors
  - Responsive: layout works at desktop and mobile widths
