/* =========================================================
   STACKLY — shared visual effects
   Page-entry loader, theme toggle, ripple, stub-link routing.
   Included on every page.
   ========================================================= */

/* ---------- Shared field validation helper ----------
   Call StackyValidate(form) before custom submit logic. Marks any
   invalid/empty required field with a red border and inline message,
   focuses the first invalid field, and returns true only if the whole
   form passes. Error state clears live as the person fixes each field. */
window.StackyValidate = function (form) {
  let valid = true;
  let firstInvalid = null;

  form.querySelectorAll('[required]').forEach((field) => {
    const wrapper = field.closest('.field');
    const newsletterParent = field.closest('form.newsletter');
    const isValid = field.checkValidity();

    if (wrapper) wrapper.classList.remove('has-error');
    else if (newsletterParent) newsletterParent.classList.remove('has-error');
    else field.classList.remove('has-error');

    if (!isValid) {
      valid = false;
      if (!firstInvalid) firstInvalid = field;

      if (wrapper) {
        wrapper.classList.add('has-error');
        let msg = wrapper.querySelector('.field-error-msg');
        if (!msg) {
          msg = document.createElement('span');
          msg.className = 'field-error-msg';
          wrapper.appendChild(msg);
        }
        if (field.validity.valueMissing) msg.textContent = 'This field is required.';
        else if (field.validity.typeMismatch) msg.textContent = 'Please enter a valid email address.';
        else if (field.validity.tooShort) msg.textContent = `Minimum ${field.minLength} characters required.`;
        else msg.textContent = 'Please check this field.';
      } else if (newsletterParent) {
        newsletterParent.classList.add('has-error');
      } else {
        field.classList.add('has-error');
      }
    }
  });

  if (firstInvalid) firstInvalid.focus();
  return valid;
};

document.addEventListener('input', (e) => {
  const field = e.target;
  if (!field.matches('input, textarea, select')) return;
  if (!field.checkValidity()) return;
  const wrapper = field.closest('.field');
  const newsletterParent = field.closest('form.newsletter');
  if (wrapper) wrapper.classList.remove('has-error');
  if (newsletterParent) newsletterParent.classList.remove('has-error');
  field.classList.remove('has-error');
}, true);

/* ---------- Page loader: hide after its data-duration ----------
   Runs immediately (not gated on DOMContentLoaded) so the timer
   starts as soon as possible after the browser paints. */
(function () {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  var duration = parseInt(loader.dataset.duration, 10) || 2000;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hidden = false;
  var hide = function () {
    if (hidden) return;
    hidden = true;
    loader.classList.add('hide');
  };
  if (reduceMotion) {
    setTimeout(hide, 3000);
  } else {
    setTimeout(hide, duration);
  }
  // Safety net: never leave the loader stuck on screen, even if the
  // timer above is somehow delayed by a slow first paint.
  window.addEventListener('load', function () {
    setTimeout(hide, duration + 1500);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

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
