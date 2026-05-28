/* ====== Footer year ====== */
(function () {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ====== Active nav based on current page ====== */
(function () {
  const path = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('nav a.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const target = href.replace(/\/+$/, '').split('/').pop() || 'index.html';
    if (target === path || (path === '' && target === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();

/* ====== Scroll reveals ====== */
(function () {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ====== Header spotlight ====== */
(function () {
  if (reduceMotion) return;
  const header = document.querySelector('header');
  const stage  = document.querySelector('.spotlight-stage');
  if (!header || !stage) return;

  let raf = null, lastX = 50, lastY = 38;
  header.addEventListener('mouseenter', () => stage.classList.add('is-on'));
  header.addEventListener('mouseleave', () => stage.classList.remove('is-on'));
  header.addEventListener('mousemove', (e) => {
    const r = header.getBoundingClientRect();
    lastX = ((e.clientX - r.left) / r.width) * 100;
    lastY = ((e.clientY - r.top) / r.height) * 100;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      stage.style.setProperty('--spot-x', lastX + '%');
      stage.style.setProperty('--spot-y', lastY + '%');
      raf = null;
    });
  });
})();

/* ====== Hero portrait parallax (Hello page only) ====== */
(function () {
  if (reduceMotion) return;
  const heroFloat = document.querySelector('.hero-float');
  const helloSection = document.getElementById('hello');
  if (!heroFloat || !helloSection) return;
  if (!window.matchMedia('(min-width: 641px)').matches) return;

  let raf = null;
  const apply = (e) => {
    const r = heroFloat.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    const max = 4;
    const ry = Math.max(-max, Math.min(max, dx * max * 1.5));
    const rx = Math.max(-max, Math.min(max, -dy * max * 1.0));
    heroFloat.style.setProperty('--tilt-x', rx.toFixed(2) + 'deg');
    heroFloat.style.setProperty('--tilt-y', ry.toFixed(2) + 'deg');
  };
  helloSection.addEventListener('mouseenter', () => heroFloat.classList.add('tilt'));
  helloSection.addEventListener('mouseleave', () => {
    heroFloat.classList.remove('tilt');
    heroFloat.style.setProperty('--tilt-x', '0deg');
    heroFloat.style.setProperty('--tilt-y', '0deg');
  });
  helloSection.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => { apply(e); raf = null; });
  });
})();

/* ====== Headshot lightbox (Headshots page only) ====== */
(function () {
  const gallery = document.querySelector('[data-gallery]');
  const lb      = document.getElementById('lightbox');
  if (!gallery || !lb) return;

  const items = Array.from(gallery.querySelectorAll('.is-zoomable'));
  if (!items.length) return;

  const lbImg    = document.getElementById('lightbox-img');
  const lbCount  = document.getElementById('lightbox-counter');
  const btnPrev  = lb.querySelector('.lightbox-prev');
  const btnNext  = lb.querySelector('.lightbox-next');
  const btnClose = lb.querySelector('.lightbox-close');

  let current = 0, lastFocus = null;

  const sources = items.map(f => {
    const i = f.querySelector('img');
    return { src: i.src, alt: i.alt || 'Headshot' };
  });
  const pad = n => String(n).padStart(2, '0');

  const show = (idx) => {
    current = (idx + sources.length) % sources.length;
    const s = sources[current];
    lbImg.src = s.src;
    lbImg.alt = s.alt;
    lbCount.textContent = pad(current + 1) + ' / ' + pad(sources.length);
  };
  const open = (idx) => {
    lastFocus = document.activeElement;
    show(idx);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnNext.focus();
  };
  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  items.forEach((f, i) => {
    f.addEventListener('click', () => open(i));
    f.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  btnClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft')  show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
