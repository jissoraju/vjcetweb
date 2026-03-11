// ============================================
// VJCET College Website — script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ==================== STICKY HEADER ====================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ==================== HAMBURGER MENU ====================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((span, i) => {
      if (isOpen) {
        if (i === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (i === 1) span.style.opacity = '0';
        if (i === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        span.style.transform = '';
        span.style.opacity = '';
      }
    });
  });

  document.querySelectorAll('.has-dropdown .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
    }
  });

  // ==================== ACTIVE NAV LINKS ====================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href')?.replace('#', '') === current) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ==================== SEARCH OVERLAY ====================
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
    searchClose && searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('active');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay) searchOverlay.classList.remove('active');
  });

  // ==================== COUNTER ANIMATION ====================
  const animateCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(ease(progress) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
  };

  const allCounters = document.querySelectorAll('[data-target]');

  // Check if element is in viewport
  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  // Fire immediately for any counter already visible (hero stats)
  allCounters.forEach(el => {
    if (isInViewport(el)) animateCounter(el);
  });

  // Also fire on scroll for counters not yet visible
  const onScroll = () => {
    allCounters.forEach(el => {
      if (!el.dataset.counted && isInViewport(el)) animateCounter(el);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // IntersectionObserver as extra safety net
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    allCounters.forEach(el => {
      if (!el.dataset.counted) counterObserver.observe(el);
    });
  }

  // ==================== SCROLL REVEAL ====================
  const revealEls = document.querySelectorAll(
    '.accred-card, .program-card, .dept-card, .campus-card, .news-card, ' +
    '.testimonial-card, .event-item, .company-logo, .pl-stat, .step, .highlight-item'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), (idx % 6) * 80);
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ==================== TABS ====================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });

  // ==================== BACK TO TOP ====================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#1a4731';
    setTimeout(() => { btn.textContent = original; btn.style.background = ''; contactForm.reset(); }, 3000);
  });

  // ==================== SMOOTH SCROLLING ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        nav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(span => { span.style.transform = ''; span.style.opacity = ''; });
      }
    });
  });

  // ==================== TICKER ====================
  const tickerContent = document.querySelector('.ticker-content');
  if (tickerContent) tickerContent.innerHTML += tickerContent.innerHTML;

  // ==================== KEYBOARD ACCESSIBILITY ====================
  document.querySelectorAll('.has-dropdown').forEach(item => {
    item.querySelector('.nav-link')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.classList.toggle('open'); }
    });
  });

  console.log('✅ VJCET Website loaded successfully');
});
