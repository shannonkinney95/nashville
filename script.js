document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile nav ----
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- Active nav link ----
  const sections = document.querySelectorAll('.section');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) {
        current = s.id;
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ---- Scroll reveal ----
  const revealTargets = [
    ...document.querySelectorAll('.photo-item'),
    ...document.querySelectorAll('.feature'),
    ...document.querySelectorAll('.day'),
    ...document.querySelectorAll('.style-day'),
    ...document.querySelectorAll('.cost-card'),
    ...document.querySelectorAll('.house-details'),
    ...document.querySelectorAll('.color-palette'),
    ...document.querySelectorAll('.total-card'),
    ...document.querySelectorAll('.rsvp-form'),
  ];

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealTargets.forEach(el => observer.observe(el));

  // ---- Hero parallax ----
  const heroBg = document.querySelector('.hero-bg img');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.05)`;
    }
  }, { passive: true });

  // ---- RSVP form → Google Sheets ----
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      const url = 'https://docs.google.com/forms/d/e/1FAIpQLSelatd0CWxQg13PVsEb8vSERQ8WBFs1b1oxV5JEIQLa1XbVHg/formResponse';

      try {
        await fetch(url, {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        });
        form.style.display = 'none';
        successEl.style.display = 'block';
      } catch {
        // no-cors means we can't read the response, but Google still receives the data
        form.style.display = 'none';
        successEl.style.display = 'block';
      }
    });
  }

});
