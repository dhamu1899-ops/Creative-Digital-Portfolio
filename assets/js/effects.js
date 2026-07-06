/* =========================================================
   STACKLY — shared visual effects
   Page-entry loader, theme toggle, ripple, stub-link routing.
   Included on every page.
   ========================================================= */

/* ---------- Page loader: hide after its data-duration ----------
   Runs immediately (not gated on DOMContentLoaded) so the timer
   starts as soon as possible after the browser paints. */
(function () {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  var duration = parseInt(loader.dataset.duration, 10) || 2000;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hide = function () { loader.classList.add('hide'); };
  if (reduceMotion) {
    setTimeout(hide, 300);
  } else {
    setTimeout(hide, duration);
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Light / dark theme toggle ---------- */
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('stackly_theme', 'dark'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem('stackly_theme', 'light'); } catch (e) {}
      }
    });
  });

  /* ---------- Placeholder links & stub buttons -> 404 ----------
     Any anchor pointing at bare "#" (no real destination and no
     existing onclick behaviour) or any element flagged .js-stub
     is a feature that isn't wired up to anything real yet. */
  document.querySelectorAll('a[href="#"]:not([onclick])').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });
  document.querySelectorAll('.js-stub').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
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
