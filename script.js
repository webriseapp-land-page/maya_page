// ===========================
// CUSTOM CURSOR
// ===========================
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .review-thumb, .feature-card, .badge').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ===========================
// HERO PARTICLE CANVAS
// ===========================
const canvas = document.getElementById('heroParticles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size  = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -Math.random() * 0.6 - 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(245,197,163,${this.alpha})`
        : `rgba(122,179,179,${this.alpha})`;
    };
    this.reset();
    this.y = Math.random() * H; // start scattered
    this.update = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset();
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===========================
// REVIEWS GRID
// ===========================
// ===========================
// REVIEWS PHONE PILE
// ===========================
const reviewsPile = document.getElementById('reviewsPile');
const TOTAL_REVIEWS = 12;

// Positions mimic the reference image:
// Two rows of tall phone cards, fanning out from center with heavy overlap
// left% and top% are relative to .reviews-pile (100% wide, 560px tall)
// rotation fans out like a spread hand of cards
const pilePositions = [
  { l:  2, t: 18, r: -22, z: 2 },
  { l:  9, t:  8, r: -14, z: 3 },
  { l: 18, t:  3, r:  -7, z: 4 },
  { l: 28, t:  1, r:   0, z: 5 },
  { l: 38, t:  2, r:   8, z: 6 },
  { l: 48, t:  6, r:  15, z: 5 },
  { l: 57, t: 14, r:  22, z: 4 },
  // second overlapping row slightly lower
  { l:  6, t: 42, r: -18, z: 7 },
  { l: 20, t: 34, r: -10, z: 8 },
  { l: 33, t: 30, r:   3, z: 9 },
  { l: 46, t: 32, r:  11, z: 8 },
  { l: 59, t: 38, r:  20, z: 7 },
];

for (let i = 0; i < TOTAL_REVIEWS; i++) {
  const p = pilePositions[i];
  const card = document.createElement('div');
  card.className = 'pile-card';
  card.style.left      = p.l + '%';
  card.style.top       = p.t + '%';
  card.style.transform = `rotate(${p.r}deg)`;
  card.style.zIndex    = p.z;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `ביקורת ${i + 1} – לחצי לפתיחה`);

  const img = document.createElement('img');
  img.src = `images/review_${i + 1}.jpeg`;
  img.alt = `ביקורת לקוחה ${i + 1}`;
  img.loading = 'lazy';
  card.appendChild(img);

  const src = `images/review_${i + 1}.jpeg`;
  card.addEventListener('click', () => openLightbox(src));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(src); }
  });

  reviewsPile.appendChild(card);
}

// ===========================
// LIGHTBOX
// ===========================
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose  = document.getElementById('lightboxClose');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===========================
// CONTACT FORM
// ===========================
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  const origText = btn.innerHTML;
  btn.innerHTML = '<span class="btn-text">שולח...</span>';
  btn.disabled = true;
  setTimeout(() => {
    contactForm.reset();
    btn.innerHTML = origText;
    btn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

// ===========================
// SMOOTH ANCHOR SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===========================
// HERO PARALLAX
// ===========================
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.22}px) scale(1)`;
  }, { passive: true });
}

// ===========================
// ADD DECO RING TO ABOUT IMAGES
// ===========================
const imgMain = document.querySelector('.img-main');
if (imgMain) {
  const ring2 = document.createElement('div');
  ring2.className = 'img-deco-ring';
  ring2.setAttribute('aria-hidden', 'true');
  imgMain.parentElement.appendChild(ring2);
}
