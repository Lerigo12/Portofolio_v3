/**
 * Custom Cursor Module - Desktop only.
 * Uses InputManager to eliminate duplicate listeners.
 * Uses IntersectionObserver-based visibility for performance.
 */
import InputManager from './input-manager.js';

let cursorDot, cursorOutline;
let isActive = false;
let observerTarget;

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function initCursor() {
  if (isTouchDevice() || window.innerWidth < 768) {
    destroyCursor();
    return;
  }

  if (cursorDot || cursorOutline) return;
  InputManager.init();
  createCursorElements();
  setupHoverEffects();
  animateCursor();
  setupVisibilityObserver();
  isActive = true;
}

function createCursorElements() {
  cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorDot.style.cssText = 'position:fixed;width:6px;height:6px;background:#00d4aa;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:opacity 0.2s;';

  cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-outline';
  cursorOutline.style.cssText = 'position:fixed;width:36px;height:36px;border:1.5px solid #00d4aa;border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform 0.15s ease-out,border-color 0.2s,opacity 0.2s;';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);
}

function setupHoverEffects() {
  const hoverSelectors = 'a,button,.nav__link,.btn,.project-card,.skill-card,.contact__social-link,.footer__social-link,.back-to-top,.nav__toggle,.nav__mobile-link,.modal__close,.contact__submit';

  // Use event delegation instead of per-element listeners
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target && cursorOutline) {
      cursorOutline.classList.add('is-hover');
      cursorOutline.style.borderColor = '#f472b6';
      if (cursorDot) cursorDot.classList.add('is-hidden');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target && cursorOutline) {
      cursorOutline.classList.remove('is-hover');
      cursorOutline.style.borderColor = '#00d4aa';
      if (cursorDot) cursorDot.classList.remove('is-hidden');
    }
  }, { passive: true });
}

function animateCursor() {
  if (!cursorDot || !cursorOutline) return;
  requestAnimationFrame(animateCursor);
  if (!isActive) return;

  cursorOutline.style.left = `${InputManager.mouseX}px`;
  cursorOutline.style.top = `${InputManager.mouseY}px`;
}

function setupVisibilityObserver() {
  observerTarget = document.body;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        isActive = e.isIntersecting;
      });
    },
    { threshold: 0 }
  );
  observer.observe(observerTarget);
}

export function destroyCursor() {
  if (cursorDot) { cursorDot.remove(); cursorDot = null; }
  if (cursorOutline) { cursorOutline.remove(); cursorOutline = null; }
  isActive = false;
}

export function isCursorActive() { return isActive; }
