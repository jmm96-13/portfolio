document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PARTÍCULAS DE FONDO ─────────────────────
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.7 + 0.3;
    // azul o cian
    this.color = Math.random() > 0.5 ? '59,130,246' : '6,182,212';
  }

  Particle.prototype.update = function () {
    // ligera atracción al cursor
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x += dx * 0.008;
        this.y += dy * 0.008;
      }
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  };

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 9000), 200);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // ── 2. TYPING EFFECT ──────────────────────────
  const isEnglish = document.documentElement.lang === 'en';

  const phrases = isEnglish ? [
    'Software Developer',
    'Tech Solutions',
    'Technical Support',
    'Digital Transformation',
    'Data Analysis',
    'AI & Automation'
  ] : [
    'Software Developer',
    'Soluciones Tecnológicas',
    'Soporte técnico',
    'Transformación Digital',
    'Análisis de Datos',
    'IA y Automatización'
  ];
  const typedEl = document.getElementById('typed');
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const DELAY_TYPE = 70, DELAY_DEL = 38, DELAY_PAUSE = 1800;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, DELAY_PAUSE);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? DELAY_DEL : DELAY_TYPE);
  }
  typeLoop();


  // ── 3. SCROLL REVEAL ──────────────────────────
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  faders.forEach(el => observer.observe(el));


  // ── 4. HEADER SHADOW EN SCROLL ────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });


  // ── 5. BACK TO TOP ────────────────────────────
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    backToTop.style.alignItems = 'center';
    backToTop.style.justifyContent = 'center';
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ── 6. LIGHTBOX ───────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn    = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => lightbox.classList.add('show'));
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

document.querySelectorAll('.gallery img, .preview-img, .contact-img').forEach(img => {    img.addEventListener('click', () => openLightbox(img.src, img.alt));
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(img.src, img.alt);
    });
  });

  lightbox.addEventListener('click', e => {
    if (e.target !== lightboxImg) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });


  // ── 7. NAV LINK ACTIVE EN SCROLL ──────────────
  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-bar a');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-bar a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

  // Estilo para nav link activo (inyectado dinámicamente)
  const style = document.createElement('style');
  style.textContent = `.nav-bar a.active { color: var(--white); background: rgba(59,130,246,0.18); }`;
  document.head.appendChild(style);

  // ── 8. MENÚ HAMBURGUESA MÓVIL ────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navBar = document.querySelector('.nav-bar');

  if (menuToggle && navBar) {

    menuToggle.addEventListener('click', () => {
      navBar.classList.toggle('active');
    });

    // Cerrar menú al pulsar una opción
    document.querySelectorAll('.nav-bar a').forEach(link => {
      link.addEventListener('click', () => {
        navBar.classList.remove('active');
      });
    });

  }

  // ── 9. MENÚ DESPLEGABLE EN NAV ─────────────────────
  // Dropdown de proyectos
  document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.parentElement.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
  });

});