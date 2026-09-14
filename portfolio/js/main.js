/**
 * Main JavaScript - Entry point for the portfolio.
 * Loads and initializes all modules.
 */
import { initLoadingScreen, initNavbar, updateActiveNav } from './loading-screen.js';
import { initAnimations, initScrollAnimations, initProfile3DHover } from './animation.js';
import { initThreeScene } from './three-scene.js';
import { initCursor } from './cursor.js';
import { initProjectDetail } from './project-detail.js';
import { initTechWorld } from './tech-world.js';
import { initContactForm } from './contact.js';
import { initBackToTop } from './back-to-top.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen(() => {
    initNavbar();
    updateActiveNav();
    initAnimations();
    initScrollAnimations();
    initThreeScene();
    initCursor();
    initProfile3DHover();
    initProjectDetail();
    initTechWorld();
    initContactForm();
    initBackToTop();
  });
});