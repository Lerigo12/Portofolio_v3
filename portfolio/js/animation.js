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

  // Hero label with opacity + translateY
  tl.from('.hero__label', {
    opacity: 0, y: 24, duration: 0.7, delay: 0.3,
    willChange: 'transform, opacity',
  })
  // Hero title lines with stagger
  .from('.hero__title-line', {
    opacity: 0, y: 40, duration: 0.8, stagger: 0.12, delay: 0.1,
    ease: 'power3.out',
    willChange: 'transform, opacity',
  }, '-=0.4')
  // Role with subtle scale
  .from('.hero__role', {
    opacity: 0, y: 20, duration: 0.6, delay: 0.1,
    scale: 0.97, willChange: 'transform, opacity',
  }, '-=0.3')
  // Description
  .from('.hero__description', {
    opacity: 0, y: 20, duration: 0.6, delay: 0.05,
    willChange: 'transform, opacity',
  }, '-=0.2')
  // Actions with scale
  .from('.hero__actions', {
    opacity: 0, y: 20, duration: 0.6, delay: 0.05,
    scale: 0.98, willChange: 'transform, opacity',
  }, '-=0.2')
  // Scroll indicator
  .from('.hero__scroll', {
    opacity: 0, y: 12, duration: 0.5, delay: 0.1,
    willChange: 'transform, opacity',
  }, '-=0.2')
  // Parallax: grid moves slowly
  .from('.hero__grid', {
    y: 30, opacity: 0.4, duration: 1.5, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    willChange: 'transform, opacity',
  }, '-=0.5');
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

  // Label fade up
  gsap.from('.about__label', {
    scrollTrigger: { trigger: about, start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Title
  gsap.from('.about__title', {
    scrollTrigger: { trigger: about, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Description
  gsap.from('.about__description', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Interests — staggered fade-up
  gsap.from('.about__interest', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 16, duration: 0.5, stagger: 0.06, delay: 0.3, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Stats — counter with fade-up
  gsap.from('.about__stat', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 24, duration: 0.6, stagger: 0.12, delay: 0.4, ease: 'power3.out',
    willChange: 'transform, opacity',
    onComplete: initCounterAnimations,
  });

  // CTA
  gsap.from('.about__cta', {
    scrollTrigger: { trigger: about, start: 'top 85%' },
    opacity: 0, y: 16, duration: 0.6, delay: 0.55, ease: 'power3.out',
    willChange: 'transform, opacity',
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

  // Header elements
  gsap.from('.skills__label', {
    scrollTrigger: { trigger: skills, start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.skills__title', {
    scrollTrigger: { trigger: skills, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.skills__subtitle', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Category buttons
  gsap.from('.skills__category', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 16, duration: 0.5, stagger: 0.06, delay: 0.3, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Skill cards — stagger fade-up
  gsap.from('.skill-card', {
    scrollTrigger: { trigger: skills, start: 'top 85%' },
    opacity: 0, y: 30, duration: 0.6, stagger: 0.08, delay: 0.4, ease: 'power3.out',
    willChange: 'transform, opacity',
  });
}

/* ===== Journey ===== */
function initJourneyAnimations() {
  const result = safeGsap();
  if (!result) return;
  const { gsap, ScrollTrigger } = result;

  const journey = document.querySelector('.journey');
  if (!journey) return;

  gsap.from('.journey__label', {
    scrollTrigger: { trigger: journey, start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.journey__title', {
    scrollTrigger: { trigger: journey, start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  gsap.from('.journey__subtitle', {
    scrollTrigger: { trigger: journey, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out',
    willChange: 'transform, opacity',
  });

  // Timeline items — stagger from both sides
  gsap.utils.toArray('.journey__item').forEach((item, index) => {
    const content = item.querySelector('.journey__content');
    const dot = item.querySelector('.journey__dot');

    // Content slides in from left or right based on position
    const xPos = index % 2 === 0 ? -40 : 40;

    gsap.from(content, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0, x: xPos, duration: 0.7, delay: index * 0.08, ease: 'power3.out',
      willChange: 'transform, opacity',
      onComplete: () => {
        item.classList.add('is-visible');
      },
    });

    // Dot scales in
    gsap.from(dot, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      scale: 0, opacity: 0, duration: 0.4, delay: index * 0.08 + 0.15, ease: 'back.out(2)',
      willChange: 'transform, opacity',
    });
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
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    willChange: 'transform, opacity',
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

      categoryBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      skillCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;

        if (shouldShow) {
          card.classList.add('is-visible');
        } else {
          card.classList.remove('is-visible');
        }
      });

      ScrollTrigger.refresh();
    });
  });
}

/* ===== Profile 3D Hover ===== */
export function initProfile3DHover() {
  const frame = document.querySelector('.about__image-frame');
  if (!frame) return;

  frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    frame.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    frame.style.boxShadow = `0 20px 60px var(--color-shadow), 0 0 40px var(--color-electric-blue-dim)`;
  });

  frame.addEventListener('mouseleave', () => {
    frame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    frame.style.boxShadow = 'none';
  });
}

export function initRevealAnimations() {
  initAnimations();
  initScrollAnimations();
}
