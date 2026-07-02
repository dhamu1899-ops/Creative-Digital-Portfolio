/* =========================================================
   STACKLY — shared visual effects (page transition + ripple)
   Included on every page.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page-load fade-in ---------- */
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });

  /* ---------- Fade-out on internal navigation ---------- */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

  /* ---------- Placeholder links & stub buttons -> 404 ----------
     Any anchor pointing at bare "#" (no real destination and no
     existing onclick behaviour) or any element flagged .js-stub
     is a feature that isn't wired up to anything real yet. */
  function goTo404() {
    document.body.classList.remove('page-loaded');
    setTimeout(() => { window.location.href = '404.html'; }, 280);
  }
  document.querySelectorAll('a[href="#"]:not([onclick])').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goTo404();
    });
  });
  document.querySelectorAll('.js-stub').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      goTo404();
    });
  });

  /* ---------- Subtle hero parallax on scroll ---------- */
  const heroFrame = document.querySelector('.hero-frame');
  if (heroFrame && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const offset = Math.min(window.scrollY * 0.06, 40);
      heroFrame.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn, .filter-btn, .dash-filter-btn, .role-tab').forEach(el => {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

});
