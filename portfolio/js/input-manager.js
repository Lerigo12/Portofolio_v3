/**
 * Shared Input Manager - Centralizes mouse, resize, and visibility listeners.
 * Eliminates duplicate listeners across all modules.
 */
const InputManager = {
  _mouseHandlers: [],
  _resizeHandlers: [],
  _visibilityHandlers: [],
  _initialized: false,
  _mouseX: 0,
  _mouseY: 0,
  _targetX: 0,
  _targetY: 0,

  init() {
    if (this._initialized) return;
    this._initialized = true;

    document.addEventListener('mousemove', (e) => {
      this._mouseX = e.clientX;
      this._mouseY = e.clientY;
      this._targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this._targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      this._mouseHandlers.forEach((fn) => fn(e));
    }, { passive: true });

    window.addEventListener('resize', () => {
      this._resizeHandlers.forEach((fn) => fn());
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      this._visibilityHandlers.forEach((fn) => fn(document.hidden));
    }, { passive: true });
  },

  onMouseMove(fn) {
    this._mouseHandlers.push(fn);
    return () => {
      this._mouseHandlers = this._mouseHandlers.filter((h) => h !== fn);
    };
  },

  onResize(fn) {
    this._resizeHandlers.push(fn);
    return () => {
      this._resizeHandlers = this._resizeHandlers.filter((h) => h !== fn);
    };
  },

  onVisibility(fn) {
    this._visibilityHandlers.push(fn);
    return () => {
      this._visibilityHandlers = this._visibilityHandlers.filter((h) => h !== fn);
    };
  },

  get mouseX() { return this._mouseX; },
  get mouseY() { return this._mouseY; },
  get targetX() { return this._targetX; },
  get targetY() { return this._targetY; },
};

export default InputManager;