/* ============================================================
   Blogr — main.js
   Handles: mobile nav, dropdown toggles, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const toggle  = document.querySelector('.nav__toggle');
  const menu    = document.querySelector('.nav__menu');
  const overlay = createOverlay();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open');
      overlay.classList.toggle('is-active');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    overlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  function closeNav () {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    // Also close any open dropdowns
    document.querySelectorAll('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.nav__link--dropdown[aria-expanded="true"]').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
    });
  }

  function createOverlay () {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;inset:0;background:hsla(0,0%,0%,0.35);z-index:149;
      opacity:0;pointer-events:none;transition:opacity 0.3s ease;
    `;
    el.classList.add('nav-overlay');
    document.body.appendChild(el);

    const style = document.createElement('style');
    style.textContent = '.nav-overlay.is-active{opacity:1!important;pointer-events:auto!important;}';
    document.head.appendChild(style);
    return el;
  }

  /* ---------- Dropdown toggles (mobile + accessible) ---------- */
  const dropdownBtns = document.querySelectorAll('.nav__link--dropdown');

  dropdownBtns.forEach(btn => {
    const dropdown = btn.nextElementSibling;
    if (!dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      dropdownBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const other = otherBtn.nextElementSibling;
          if (other) other.classList.remove('is-open');
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      dropdown.classList.toggle('is-open', !isOpen);
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdownBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const d = btn.nextElementSibling;
      if (d) d.classList.remove('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.feature, .future__illustration, .infra__content, .infra__phones, .open__illustration, .section__title'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));

})();
