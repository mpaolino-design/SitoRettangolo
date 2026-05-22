/* Floating names */
const projects = [
  'Marionetta',
  'Maschera Sonora',
  'Pasta-Tonno',
  'Texture Pattern',
  'Tipografia Cinetica',
];

const container = document.getElementById('floating-names');
const names = [];

const trailCount = 4;

projects.forEach((text) => {
  const el = document.createElement('div');
  el.className = 'floating-name';
  el.textContent = text;
  container.appendChild(el);

  const trails = [];
  for (let t = 0; t < trailCount; t++) {
    const tr = document.createElement('div');
    tr.className = 'floating-name trail';
    tr.textContent = text;
    tr.style.opacity = 0.06 * (1 - t / (trailCount + 1));
    container.appendChild(tr);
    trails.push({ el: tr, x: 0, y: 0 });
  }

  const heroRect = document.getElementById('hero').getBoundingClientRect();
  const speed = 1 + Math.random() * 1.5;
  names.push({
    el,
    trails,
    trailIndex: 0,
    x: Math.random() * heroRect.width,
    y: Math.random() * heroRect.height,
    vx: (Math.random() > 0.5 ? 1 : -1) * speed,
    vy: (Math.random() > 0.5 ? 1 : -1) * speed,
    glow: 0,
    glowTimer: Math.random() * 300 + 100,
  });
});

/* Drag */
let dragTarget = null;
let dragOffX = 0;
let dragOffY = 0;

document.addEventListener('mousedown', (e) => {
  const nameEl = e.target.closest('.floating-name:not(.trail)');
  if (!nameEl) return;
  const n = names.find((x) => x.el === nameEl);
  if (!n) return;
  dragTarget = n;
  const heroRect = document.getElementById('hero').getBoundingClientRect();
  dragOffX = e.clientX - heroRect.left - n.x;
  dragOffY = e.clientY - heroRect.top - n.y;
  n.vx = 0;
  n.vy = 0;
});

document.addEventListener('mousemove', (e) => {
  if (!dragTarget) return;
  const heroRect = document.getElementById('hero').getBoundingClientRect();
  dragTarget.x = e.clientX - heroRect.left - dragOffX;
  dragTarget.y = e.clientY - heroRect.top - dragOffY;
});

document.addEventListener('mouseup', () => {
  dragTarget = null;
});

/* Hover speed boost + letter colors */
const title = document.getElementById('main-title');
const hoverColors = ['#F2071B', '#3a86ff', '#F24405', '#FFFFFF'];
let speedMult = 1;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = 0;

const titleText = title.textContent;
title.textContent = '';
const letters = titleText.split('').map((ch) => {
  const span = document.createElement('span');
  span.textContent = ch === ' ' ? '\u00A0' : ch;
  span.style.transition = 'color 0.15s';
  span.dataset.colorIndex = '0';
  title.appendChild(span);
  return span;
});
letters.forEach((span) => {
  span.addEventListener('mouseenter', () => {
    const idx = (parseInt(span.dataset.colorIndex) + 1) % hoverColors.length;
    span.dataset.colorIndex = idx;
    span.style.color = hoverColors[idx];
  });
});

title.addEventListener('mouseleave', () => {
  speedMult = 1;
});

title.addEventListener('mousemove', (e) => {
  const dt = e.timeStamp - lastMouseTime;
  if (dt > 0) {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const pxPerMs = Math.sqrt(dx * dx + dy * dy) / dt;
    speedMult = Math.min(1 + pxPerMs * 15, 4);
  }
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastMouseTime = e.timeStamp;
});

function animateFloating() {
  const hero = document.getElementById('hero');
  const heroRect = hero.getBoundingClientRect();
  const w = heroRect.width;
  const h = heroRect.height;

  names.forEach((n) => {
    if (speedMult > 1) {
      speedMult = Math.max(1, speedMult - 0.05);
    }
    if (Math.random() < 0.02) {
      n.vx += (Math.random() - 0.5) * 0.8;
      n.vy += (Math.random() - 0.5) * 0.8;
      const maxSpeed = 3;
      const currentSpeed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (currentSpeed > maxSpeed) {
        n.vx = (n.vx / currentSpeed) * maxSpeed;
        n.vy = (n.vy / currentSpeed) * maxSpeed;
      }
    }
    n.x += n.vx * speedMult;
    n.y += n.vy * speedMult;

    const rect = n.el.getBoundingClientRect();
    const ew = rect.width;
    const eh = rect.height;

    if (n.x < 0) { n.x = 0; n.vx *= -1; }
    if (n.x + ew > w) { n.x = w - ew; n.vx *= -1; }
    if (n.y < 0) { n.y = 0; n.vy *= -1; }
    if (n.y + eh > h) { n.y = h - eh; n.vy *= -1; }

    n.el.style.transform = `translate(${n.x}px, ${n.y}px)`;

    n.trails[n.trailIndex].x = n.x;
    n.trails[n.trailIndex].y = n.y;
    n.trailIndex = (n.trailIndex + 1) % n.trails.length;
  });

  names.forEach((n) => {
    n.trails.forEach((tr) => {
      tr.el.style.transform = `translate(${tr.x}px, ${tr.y}px)`;
    });
    n.el.classList.remove('colliding');
  });

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i];
      const b = names[j];
      const ar = a.el.getBoundingClientRect();
      const br = b.el.getBoundingClientRect();
      const ax = a.x + ar.width / 2;
      const ay = a.y + ar.height / 2;
      const bx = b.x + br.width / 2;
      const by = b.y + br.height / 2;
      const dx = ax - bx;
      const dy = ay - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = (ar.width + br.height) / 2;

      if (dist < minDist && dist > 0) {
        a.el.classList.add('colliding');
        b.el.classList.add('colliding');
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x += nx * overlap * 0.5;
        a.y += ny * overlap * 0.5;
        b.x -= nx * overlap * 0.5;
        b.y -= ny * overlap * 0.5;
        const tempVx = a.vx;
        const tempVy = a.vy;
        a.vx = b.vx;
        a.vy = b.vy;
        b.vx = tempVx;
        b.vy = tempVy;
      }
    }
  }

  names.forEach((n) => {
    n.glowTimer--;
    if (n.glowTimer <= 0) {
      n.glow = 0.7 + Math.random() * 0.3;
      n.glowTimer = Math.random() * 400 + 200;
    }
    if (n.glow > 0) {
      n.glow -= 0.01;
      if (n.glow < 0) n.glow = 0;
    }
    const baseOpacity = n.el.classList.contains('colliding') ? 0.5 : 0.25;
    n.el.style.opacity = Math.min(baseOpacity + n.glow, 0.95);
    if (n.glow > 0.3) {
      n.el.style.textShadow = '0 0 12px #3F83BF, 0 0 30px #3F83BF';
    } else {
      n.el.style.textShadow = 'none';
    }
    n.trails.forEach((tr) => {
      const trailGlow = Math.max(0, n.glow - 0.2);
      tr.el.style.opacity = (0.04 + trailGlow * 0.3) * (1 - n.trails.indexOf(tr) / (n.trails.length + 1));
    });
  });

  requestAnimationFrame(animateFloating);
}

animateFloating();

/* Cards + pendulums */
const cardColors = ['#F2071B', '#3F83BF', '#F24405', '#68A66D', '#6B3FA0'];

const cardData = [
  { name: 'Pasta-Tonno', url: 'Progetto Pasta-Tonno 2_02/index.html', desc: 'Blog cucina punk con ricetta pasta al tonno' },
  { name: 'Texture Pattern', url: 'Texture-pattern exercise_02/index.html', desc: 'Generatore di pattern vettoriali SVG' },
  { name: 'Tipografia Cinetica', url: 'Tipografia cinetica_02/index.html', desc: 'Macchina da scrivere cinetica "Martello"' },
  { name: 'Maschera Sonora', url: 'Maschera Sonora_02/index.html', desc: 'Maschera animata reattiva al microfono' },
  { name: 'Marionetta', url: 'Marionetta_02/index.html', desc: 'Disegno tramite gesture della mano con webcam' },
];

const grid = document.getElementById('spheres-grid');

const cw = 140, ch = 140;
const circs = [];

const svgPath = 'M208.52,259.93l5.06-.49-5.06-.49c-4.7-.45-5.71-6.86-1.38-8.74l4.66-2.03-4.96,1.1c-4.61,1.02-7.55-4.76-4.02-7.89l3.81-3.37-4.38,2.58c-4.07,2.4-8.65-2.19-6.26-6.26l2.58-4.38-3.37,3.81c-3.13,3.54-8.91.59-7.89-4.02l1.1-4.96-2.03,4.66c-1.88,4.33-8.29,3.31-8.74-1.38l-.49-5.06-.49,5.06c-.45,4.7-6.86,5.71-8.74,1.38l-2.03-4.66,1.1,4.96c1.02,4.61-4.76,7.55-7.89,4.02l-3.37-3.81,2.58,4.38c2.4,4.07-2.19,8.65-6.26,6.26l-4.38-2.58,3.81,3.37c3.54,3.13.59,8.91-4.02,7.89l-4.96-1.1,4.66,2.03c4.33,1.88,3.31,8.29-1.38,8.74l-5.06.49,5.06.49c4.7.45,5.71,6.86,1.38,8.74l-4.66,2.03,4.96-1.1c4.61-1.02,7.55,4.76,4.02,7.89l-3.81,3.37,4.38-2.58c4.07-2.4,8.65,2.19,6.26,6.26l-2.58,4.38,3.37-3.81c3.13-3.54,8.91-.59,7.89,4.02l-1.1,4.96,2.03-4.66c1.88-4.33,8.29-3.31,8.74,1.38l.49,5.06.49-5.06c.45-4.7,6.86-5.71,8.74-1.38l2.03,4.66-1.1-4.96c-1.02-4.61,4.76-7.55,7.89-4.02l3.37,3.81-2.58-4.38c-2.4-4.07,2.19-8.65,6.26-6.26l4.38,2.58-3.81-3.37c-3.54-3.13-.59-8.91,4.02-7.89l4.96,1.1-4.66-2.03c-4.33-1.88-3.31-8.29,1.38-8.74ZM195.4,265.37c-3.12-.69-5.12,3.23-2.72,5.35-2.76-1.62-5.87,1.49-4.24,4.24-2.12-2.4-6.04-.4-5.35,2.72h0c-1.27-2.93-5.62-2.25-5.93.94-.31-3.19-4.65-3.87-5.93-.94.69-3.12-3.23-5.12-5.35-2.72,1.62-2.76-1.49-5.87-4.24-4.24,2.4-2.12.4-6.04-2.72-5.35,2.93-1.27,2.25-5.62-.94-5.93,3.19-.31,3.87-4.65.94-5.93,3.12.69,5.12-3.23,2.72-5.35,2.76,1.62,5.87-1.49,4.24-4.24,2.12,2.4,6.04.4,5.35-2.72,1.27,2.93,5.62,2.25,5.93-.94.31,3.19,4.65,3.87,5.93.94h0s0,0,0,0c-.69,3.12,3.23,5.12,5.35,2.72-1.62,2.76,1.49,5.87,4.24,4.24-2.4,2.12-.4,6.04,2.72,5.35-2.93,1.27-2.25,5.62.94,5.93-3.19.31-3.87,4.65-.94,5.93Z';

cardData.forEach((d, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  const color = cardColors[i % cardColors.length];
  card.innerHTML = `<svg viewBox="175 228 44 55" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"><path d="${svgPath}" fill="${color}"/></svg><span style="position:relative;z-index:2;text-align:center;padding:0.3rem;font-size:0.85rem;line-height:1.2">${d.name}</span>`;
  grid.appendChild(card);
  card.addEventListener('click', () => window.open(d.url, '_blank'));

  const angle = Math.random() * Math.PI * 2;
  circs.push({
    el: card,
    x: 0, y: 0,
    vx: Math.cos(angle) * (0.8 + Math.random() * 1.2),
    vy: Math.sin(angle) * (0.8 + Math.random() * 1.2),
    placed: false,
  });
});

function animateCircs() {
  const rect = grid.getBoundingClientRect();
  const maxX = rect.width - cw;
  const maxY = rect.height - ch;

  circs.forEach((c) => {
    if (!c.placed) {
      c.x = 10 + Math.random() * Math.max(1, maxX - 20);
      c.y = 10 + Math.random() * Math.max(1, maxY - 20);
      c.placed = true;
    }

    c.x += c.vx;
    c.y += c.vy;

    if (c.x < 5) { c.x = 5; c.vx *= -1; }
    if (c.x > maxX - 5) { c.x = maxX - 5; c.vx *= -1; }
    if (c.y < 5) { c.y = 5; c.vy *= -1; }
    if (c.y > maxY - 5) { c.y = maxY - 5; c.vy *= -1; }

    c.el.style.left = c.x + 'px';
    c.el.style.top = c.y + 'px';
  });

  for (let i = 0; i < circs.length; i++) {
    for (let j = i + 1; j < circs.length; j++) {
      const a = circs[i];
      const b = circs[j];
      const dx = (a.x + cw / 2) - (b.x + cw / 2);
      const dy = (a.y + ch / 2) - (b.y + ch / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = 80;
      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x += nx * overlap * 0.5;
        a.y += ny * overlap * 0.5;
        b.x -= nx * overlap * 0.5;
        b.y -= ny * overlap * 0.5;
        const tvx = a.vx, tvy = a.vy;
        a.vx = b.vx; a.vy = b.vy;
        b.vx = tvx; b.vy = tvy;
      }
    }
  }

  circs.forEach((c) => {
    c.x = Math.max(0, Math.min(c.x, maxX));
    c.y = Math.max(0, Math.min(c.y, maxY));
  });

  requestAnimationFrame(animateCircs);
}

animateCircs();

/* Back-to-top visibility */
const btnTop = document.querySelector('.btn-top');
const btnScroll = document.querySelector('.btn-scroll');
const floatingNames = document.getElementById('floating-names');

function updateVisibility() {
  const hero = document.getElementById('hero');
  const heroBottom = hero.getBoundingClientRect().bottom;
  const visible = heroBottom > 0;
  btnTop.style.display = window.scrollY > window.innerHeight * 0.8 ? 'flex' : 'none';
  btnScroll.style.display = visible ? '' : 'none';
  floatingNames.style.display = visible ? '' : 'none';
}

window.addEventListener('scroll', updateVisibility);
window.addEventListener('resize', updateVisibility);
updateVisibility();
