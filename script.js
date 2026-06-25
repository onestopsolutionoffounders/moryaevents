/* ========================================
   MORYA EVENTS — main.js
   Handles: Navbar scroll, Hamburger menu,
   AOS animations, Sparkle canvas,
   Counter animation, Contact form
======================================== */

/* ===== 1. NAVBAR — scroll shadow ===== */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load


/* ===== 2. HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ===== 3. AOS — scroll-triggered animations ===== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initAOS);

function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('galleryLightboxImage');
  const lightboxCaption = document.getElementById('galleryLightboxCaption');
  const closeBtn = document.getElementById('galleryLightboxClose');

  if (!galleryGrid || !lightbox || !lightboxImage || !closeBtn) return;

  const galleryImages = [
    { src: 'Birthday.jpeg', alt: 'Birthday celebration decor' },
    { src: 'img2.jpeg', alt: 'Event photo 2' },
    { src: 'img3.jpeg', alt: 'Event photo 3' },
    { src: 'img4.jpeg', alt: 'Event photo 4' },
    { src: 'img5.jpeg', alt: 'Event photo 5' },
  ];

  galleryGrid.innerHTML = galleryImages.map(({ src, alt }) =>
    `<button type="button" class="gallery-item" data-src="${src}" aria-label="View ${alt}">
      <img src="${src}" alt="${alt}" loading="lazy" />
      <span class="gallery-label">${alt}</span>
    </button>`
  ).join('');

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  galleryGrid.addEventListener('click', (event) => {
    const item = event.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(item.dataset.src, item.querySelector('img')?.alt || 'Gallery image');
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded', initGallery);


/* ===== 4. SPARKLE CANVAS (hero background) ===== */
(function initSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      r:       Math.random() * 1.8 + 0.3,
      alpha:   Math.random(),
      speed:   Math.random() * 0.4 + 0.1,
      drift:   (Math.random() - 0.5) * 0.3,
      flicker: Math.random() * 0.02 + 0.005,
      dir:     Math.random() > 0.5 ? 1 : -1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Flicker alpha
      p.alpha += p.flicker * p.dir;
      if (p.alpha >= 1 || p.alpha <= 0) p.dir *= -1;

      // Drift upward slowly
      p.y -= p.speed;
      p.x += p.drift;

      // Wrap when off-screen
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4 || p.x > W + 4) { p.x = Math.random() * W; }

      // Gold sparkle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * 0.85})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();


/* ===== 5. COUNTER ANIMATION (stats strip) ===== */
function animateCounter(el, target, duration) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 1800);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);


/* ===== 6. CONTACT FORM ===== */
document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name  = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const type  = form.querySelector('#event-type');

    let valid = true;

    [name, phone, type].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e05252';
        field.focus();
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Phone format check (basic Indian number)
    const phoneVal = phone.value.replace(/\s+/g, '');
    if (!/^(\+91|0)?[6-9]\d{9}$/.test(phoneVal) && !/^\+?\d{7,15}$/.test(phoneVal)) {
      phone.style.borderColor = '#e05252';
      phone.focus();
      return;
    }

    // Build WhatsApp pre-fill message
    const eventType = type.value;
    const email     = form.querySelector('#email').value;
    const message   = form.querySelector('#message').value;

    const waText = encodeURIComponent(
      `Hi Morya Events! 🎉\n\n` +
      `Name: ${name.value.trim()}\n` +
      `Phone: ${phone.value.trim()}\n` +
      `Email: ${email || 'N/A'}\n` +
      `Event Type: ${eventType}\n` +
      `Message: ${message || 'N/A'}\n\n` +
      `I would like to enquire about your event services.`
    );

    // Show success message
    successMsg.classList.add('show');

    // Disable button briefly
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending… ✦';

    // Open WhatsApp after short delay
    setTimeout(() => {
      window.open(`https://wa.me/918888957783?text=${waText}`, '_blank');
      form.reset();
      btn.disabled    = false;
      btn.textContent = 'Send Enquiry ✦';
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 800);
  });

  // Clear error border on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
});


/* ===== 7. BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== 8. ACTIVE NAV LINK (scroll spy) ===== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', initScrollSpy);


/* ===== 9. SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 8 : 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
