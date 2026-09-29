/**
 * Animation Module - Advanced GSAP & ScrollTrigger configurations.
 * All animations use GPU-accelerated properties only (opacity, transform).
 * No layout-shifting properties are animated.
 */

const ANIMATION_CONFIG = {
  hero: { duration: 0.8, ease: 'power3.out', stagger: 0.1 },
  section: { duration: 0.7, ease: 'power3.out', offset: 0.15 },
  parallax: { duration: 1.2, ease: 'none' },
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function safeGsap() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return null;
  gsap.registerPlugin(ScrollTrigger);
  if (prefersReducedMotion()) {
    ScrollTrigger.config({ skipAnimations: true });
  }
  return { gsap, ScrollTrigger };
}

/* ===== Hero ===== */
export function initAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (prefersReducedMotion()) {
    gsap.set(['.hero__label', '.hero__title-line', '.hero__role', '.hero__description', '.hero__actions', '.hero__portrait'], {
      opacity: 1, clearProps: 'transform',
    });
    return;
  }

  tl.from('.hero__label', {
    opacity: 0, y: 20, duration: 0.6, delay: 0.2,
  })
  .from('.hero__title-line', {
    opacity: 0, y: 36, duration: 0.75, stagger: 0.1,
    ease: 'power3.out',
  }, '-=0.35')
  .from('.hero__role', {
    opacity: 0, y: 16, duration: 0.55,
  }, '-=0.35')
  .from('.hero__description', {
    opacity: 0, y: 16, duration: 0.55,
  }, '-=0.3')
  .from('.hero__actions', {
    opacity: 0, y: 16, duration: 0.55,
  }, '-=0.25')
  .from('.hero__portrait', {
    opacity: 0, y: 28, scale: 0.97, duration: 0.9,
    ease: 'power3.out',
  }, '-=0.7');
}

/* ===== Universal Scroll Reveals ===== */
export function initScrollAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  // Universal fade-up for all sections
  gsap.utils.toArray('.section:not(.about):not(.about)').forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      willChange: 'transform, opacity',
    });
  });

  // Tech world parallax background
  gsap.from('.tech-world__scene', {
    scrollTrigger: {
      trigger: '.tech-world',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: 60, opacity: 0.6, duration: 1, ease: 'none',
    willChange: 'transform, opacity',
  });

  initAboutAnimations();
  initSkillsAnimations();
  initSkillsFilter();
  initJourneyAnimations();
  initTechWorldAnimations();
  initContactAnimations();
  initProjectsAnimations();
}

/* ===== About ===== */
function initAboutAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const about = document.querySelector('.about');
  if (!about) return;

  // About section entrance — fade up only
  gsap.from(about, {
    scrollTrigger: { trigger: about, start: 'top 80%' },
    opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.about__title', {
    scrollTrigger: { trigger: about, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
  });

  gsap.from('.about__description', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.1, ease: 'power3.out',
  });

  gsap.from('.about__interest', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 16, duration: 0.5, stagger: 0.06, delay: 0.2, ease: 'power3.out',
  });

  gsap.from('.about__stat', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 24, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power3.out',
    onComplete: initCounterAnimations,
  });

  gsap.from('.about__aside', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: 'power3.out',
  });
}

/* ===== Counter Animation ===== */
function initCounterAnimations() {
  const { gsap } = window;
  if (!gsap) return;

  document.querySelectorAll('.about__stat-value[data-target]').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.floor(obj.val) + suffix;
      },
    });
  });
}

/* ===== Skills ===== */
function initSkillsAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const skills = document.querySelector('.skills');
  if (!skills) return;

  gsap.from('.skills__title', {
    scrollTrigger: { trigger: skills, start: 'top 80%' },
    opacity: 0, y: 28, duration: 0.7, ease: 'power3.out',
  });

  gsap.from('.skills__subtitle', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 18, duration: 0.55, delay: 0.1, ease: 'power3.out',
  });

  gsap.from('.skills__category', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 14, duration: 0.45, stagger: 0.05, delay: 0.15, ease: 'power3.out',
  });

  gsap.from('.skill-card', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 24, duration: 0.55, stagger: 0.05, delay: 0.25, ease: 'power3.out',
  });
}

/* ===== Journey ===== */
function initJourneyAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const journey = document.querySelector('.journey');
  if (!journey) return;

  gsap.from('.journey__title', {
    scrollTrigger: { trigger: journey, start: 'top 80%' },
    opacity: 0, y: 28, duration: 0.7, ease: 'power3.out',
  });

  gsap.from('.journey__subtitle', {
    scrollTrigger: { trigger: journey, start: 'top 85%' },
    opacity: 0, y: 18, duration: 0.55, delay: 0.1, ease: 'power3.out',
  });

  gsap.utils.toArray('.journey__item').forEach((item, index) => {
    const content = item.querySelector('.journey__content');
    const dot = item.querySelector('.journey__dot');

    gsap.from(content, {
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0, y: 24, duration: 0.65, delay: index * 0.05, ease: 'power3.out',
      onComplete: () => item.classList.add('is-visible'),
    });

    if (dot) {
      gsap.from(dot, {
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        scale: 0, opacity: 0, duration: 0.35, delay: index * 0.05 + 0.1, ease: 'back.out(1.6)',
      });
    }
  });
}

/* ===== Projects ===== */
function initProjectsAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const projects = document.querySelector('.projects');
  if (!projects) return;

  gsap.from('.projects__label', {
    scrollTrigger: { trigger: projects, start: 'top 80%' },
    opacity: 0, y: 16, duration: 0.5, ease: 'power3.out',
  });

  gsap.from('.projects__title', {
    scrollTrigger: { trigger: projects, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.projects__subtitle', {
    scrollTrigger: { trigger: projects, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Project cards — staggered scale + fade
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    const image = card.querySelector('.project-card__image');

    // Card entrance
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0, y: 40, scale: 0.96, duration: 0.8, delay: index * 0.1, ease: 'power3.out',
      willChange: 'transform, opacity',
    });

    // Image zoom on scroll
    if (image) {
      gsap.from(image, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'bottom 60%',
          scrub: 1,
        },
        scale: 1.1, duration: 1, ease: 'none',
        willChange: 'transform',
      });
    }
  });
}

/* ===== Tech World ===== */
function initTechWorldAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const techWorld = document.querySelector('.tech-world');
  if (!techWorld) return;

  gsap.from('.tech-world__label', {
    scrollTrigger: { trigger: techWorld, start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.tech-world__title', {
    scrollTrigger: { trigger: techWorld, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.tech-world__subtitle', {
    scrollTrigger: { trigger: techWorld, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });
}

/* ===== Contact ===== */
function initContactAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const contact = document.querySelector('.contact');
  if (!contact) return;

  gsap.from('.contact__label', {
    scrollTrigger: { trigger: contact, start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.contact__title', {
    scrollTrigger: { trigger: contact, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.contact__description', {
    scrollTrigger: { trigger: contact, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Info panel slides from left
  gsap.from('.contact__info', {
    scrollTrigger: { trigger: contact, start: 'top 85%' },
    opacity: 0, x: -30, duration: 0.7, delay: 0.3, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Form slides from right
  gsap.from('.contact__form-wrapper', {
    scrollTrigger: { trigger: contact, start: 'top 85%' },
    opacity: 0, x: 30, duration: 0.7, delay: 0.4, ease: 'power3.out',
    willChange: 'transform, opacity',
  });
}

/* ===== Skills Filter ===== */
function initSkillsFilter() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const categoryBtns = document.querySelectorAll('.skills__category');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!categoryBtns.length || !skillCards.length) return;

  skillCards.forEach((card) => card.classList.add('is-visible'));

  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      categoryBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      skillCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;
        card.classList.toggle('is-visible', shouldShow);
      });

      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });
}

/* ===== Profile 3D Hover ===== */
export function initProfile3DHover() {
  const frame = document.querySelector('.hero__portrait');
  if (!frame || prefersReducedMotion()) return;

  frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    frame.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  frame.addEventListener('mouseleave', () => {
    frame.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

export function initRevealAnimations() {
  initAnimations();
  initScrollAnimations();
}
