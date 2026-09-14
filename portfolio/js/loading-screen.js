/**
 * Loading Screen Module - Futuristic initialization screen.
 * Animates a progress bar and percentage from 0 to 100, then fades out.
 */
export function initLoadingScreen(onComplete) {
  const loadingScreen = document.getElementById('loading-screen');
  const fill = document.getElementById('loading-fill');
  const percentage = document.getElementById('loading-percentage');

  if (!loadingScreen || !fill || !percentage) {
    onComplete();
    return;
  }

  let progress = 0;
  const totalDuration = 1800;
  const intervalMs = 20;
  const increment = (100 / totalDuration) * intervalMs;

  const interval = setInterval(() => {
    progress = Math.min(progress + increment, 100);
    fill.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        setTimeout(() => {
          loadingScreen.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 600);
      }, 200);
    }
  }, intervalMs);

  document.body.style.overflow = 'hidden';
}

/**
 * Initialize navbar scroll effect and smooth scrolling.
 */
export function initNavbar() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (!header || !navToggle || !navMobile) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('is-open');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    navMobile.classList.toggle('is-open');
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navLinks.forEach((l) => l.classList.remove('nav__link--active'));
        link.classList.add('nav__link--active');
        closeMobileMenu();
      }
    });
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        closeMobileMenu();
      }
    });
  });
}

/**
 * Update active nav link based on scroll position.
 */
export function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}