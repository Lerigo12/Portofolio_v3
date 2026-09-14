/**
 * Back to Top Module.
 * Uses IntersectionObserver for efficient visibility detection.
 */
export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;
  let isVisible = false;

  // Use IntersectionObserver for hero section visibility
  const hero = document.getElementById('home');
  if (hero) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const shouldShow = !entry.isIntersecting && window.scrollY > 300;
          if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            btn.classList.toggle('is-visible', isVisible);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(hero);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Throttled scroll handler
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const show = window.scrollY > 300;
        btn.classList.toggle('is-visible', show);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
