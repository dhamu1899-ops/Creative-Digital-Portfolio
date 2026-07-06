document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Back to top ---------- */
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Counter animation ---------- */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const revealEls = document.querySelectorAll('.reveal-up');
  const counterEls = document.querySelectorAll('.stat-num[data-count]');
  const barEls = document.querySelectorAll('.bar-fill');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObserver.observe(el));

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.style.width = entry.target.dataset.width + '%'; barObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  barEls.forEach(el => barObserver.observe(el));

  /* ---------- Work / grid filter (work page) ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        workCards.forEach(card => {
          const match = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('hide', !match);
        });
      });
    });
  }

  /* ---------- Testimonial carousel ---------- */
  const slides = document.querySelectorAll('.testi-slide');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (slides.length && dotsWrap) {
    let current = 0;
    let autoplayTimer;
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      resetAutoplay();
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    resetAutoplay();
  }

  /* ---------- Newsletter forms -> real email delivery ----------
     Uses FormSubmit (https://formsubmit.co) — a free form-relay service
     that emails submissions with no backend required. Replace the
     address below with the real inbox that should receive signups;
     FormSubmit sends a one-time confirmation link to that address the
     first time a submission comes in, which must be clicked to activate. */
  const NEWSLETTER_ENDPOINT = 'https://formsubmit.co/ajax/hello@stackly.com';
  document.querySelectorAll('form.newsletter').forEach(newsletterForm => {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const button = newsletterForm.querySelector('button');
      if (!input || !input.value.trim()) return;
      const original = button.textContent;
      button.textContent = '...';
      button.disabled = true;

      fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: 'New newsletter signup — Stackly', email: input.value.trim() })
      })
        .then(res => { if (!res.ok) throw new Error('request failed'); })
        .then(() => {
          button.textContent = 'Joined';
          input.value = '';
          window.showToast && window.showToast("You're subscribed — thanks!");
        })
        .catch(() => {
          window.showToast && window.showToast('Something went wrong. Please try again shortly.');
        })
        .finally(() => {
          button.disabled = false;
          setTimeout(() => { button.textContent = original; }, 2600);
        });
    });
  });

  /* ---------- Contact form -> real email delivery ----------
     Same FormSubmit relay as the newsletter forms above — swap in the
     real destination inbox and confirm the activation email. */
  const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/hello@stackly.com';
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const payload = {};
      new FormData(contactForm).forEach((value, key) => { payload[key] = value; });
      payload._subject = 'New project enquiry — Stackly';

      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => { if (!res.ok) throw new Error('request failed'); })
        .then(() => {
          contactForm.reset();
          window.showToast && window.showToast("Message sent — we'll reply within one business day.");
        })
        .catch(() => {
          window.showToast && window.showToast('Something went wrong sending your message. Please email us directly.');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        });
    });
  }

  /* ---------- Toast helper ---------- */
  window.showToast = function (message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.id = 'globalToast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span>' + message + '</span>';
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
  };

  /* ---------- Signup success toast (redirected here from signup.html) ---------- */
  const pageParams = new URLSearchParams(window.location.search);
  if (pageParams.get('signup') === 'success') {
    setTimeout(() => window.showToast('Account created — welcome to Stackly!'), 500);
    history.replaceState(null, '', window.location.pathname);
  }

  /* ---------- Highlight active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

});
