/* ============================================================
   NANDHU T S PORTFOLIO — Interactive Script
   ============================================================ */

// ---------- Utility ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---------- Navbar Scroll Effect ----------
const navbar = $('#navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ---------- Mobile Nav Toggle ----------
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = $$('span', navToggle);
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(4px, 4.5px)' : '';
  spans[1].style.opacity   = open ? '0'   : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4.5px)' : '';
});

$$('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    $$('span', navToggle).forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ---------- Particle Canvas ----------
(function initParticles() {
  const canvas = $('#particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const COLORS = ['#4f8eff', '#a259ff', '#22d3a0', '#ffffff'];

  function Particle() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.r    = Math.random() * 1.8 + 0.4;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  Particle.prototype.update = function() {
    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120 * 0.6;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.x  += this.vx;
    this.y  += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  const COUNT = window.innerWidth < 700 ? 60 : 130;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.globalAlpha = (1 - d / 100) * 0.15;
          ctx.strokeStyle = '#4f8eff';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => {
      p.update();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Scroll Reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 1);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

// ---------- CGPA Bar Animation ----------
const cgpaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.cgpa-fill');
      if (fill) {
        const target = fill.style.width;
        fill.style.width = '0%';
        requestAnimationFrame(() => {
          setTimeout(() => { fill.style.width = target; }, 50);
        });
      }
      cgpaObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

$$('.edu-card').forEach(card => cgpaObserver.observe(card));

// ---------- Smooth Active Nav Link ----------
const sections  = $$('section[id]');
const navAnchors = $$('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  let current   = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ---------- Typewriter Effect for Hero ----------
const titles = [
  'Full Stack Developer 🚀',
  'ML Enthusiast 🤖',
  'Backend Architect ⚙️',
  'React Developer ⚛️',
  'Problem Solver 💡',
];

const heroTitle = $('.hero-title');
if (heroTitle) {
  let tIdx = 0, cIdx = 0, deleting = false;
  const curText  = () => titles[tIdx];
  
  function typeWriter() {
    const full = curText();
    if (!deleting) {
      cIdx++;
      heroTitle.innerHTML = full.slice(0, cIdx) + '<span class="amp">&</span>';
      if (cIdx === full.length) {
        deleting = true;
        setTimeout(typeWriter, 2000);
        return;
      }
    } else {
      cIdx--;
      heroTitle.innerHTML = full.slice(0, cIdx) + '<span class="amp">&</span>';
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % titles.length;
      }
    }
    setTimeout(typeWriter, deleting ? 45 : 90);
  }
  
  // Start after initial animation
  setTimeout(typeWriter, 1600);
}

// ---------- Counter Animation for Stats ----------
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Number.isInteger(target) ? Math.floor(start) + '+' : start.toFixed(2);
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.stat-val', entry.target).forEach(el => {
        const val = parseFloat(el.textContent);
        animateCounter(el, val);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = $('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---------- Skill Tags Hover Glow ----------
$$('.skill-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.borderColor = 'rgba(79,142,255,0.5)';
    tag.style.color = '#7ab0ff';
    tag.style.background = 'rgba(79,142,255,0.1)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.borderColor = '';
    tag.style.color = '';
    tag.style.background = '';
  });
});

// ---------- Active Nav Highlight Style ----------
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--accent) !important;
    background: rgba(79,142,255,0.08) !important;
  }
`;
document.head.appendChild(style);

// ---------- Staggered Project Cards ----------
$$('.projects-grid .project-card, .cert-grid .cert-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 4) * 60}ms`;
});

// ---------- Copyright Year ----------
const footerCopy = $('.footer-copy');
if (footerCopy) {
  const year = new Date().getFullYear();
  footerCopy.textContent = `© ${year} · Full Stack Developer & ML Enthusiast · Kerala, India`;
}
