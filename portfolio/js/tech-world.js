/**
 * Tech World 3D Module - Interactive technology objects.
 * Uses InputManager to eliminate duplicate listeners.
 */
import InputManager from './input-manager.js';

const techWorldData = [
  { id: 'html', name: 'HTML5', color: '#e34c26', geometry: 'box' },
  { id: 'css', name: 'CSS3', color: '#264de4', geometry: 'circle' },
  { id: 'js', name: 'JavaScript', color: '#f7df1e', geometry: 'octahedron' },
  { id: 'php', name: 'PHP', color: '#777bb4', geometry: 'tetrahedron' },
  { id: 'python', name: 'Python', color: '#3776ab', geometry: 'icosahedron' },
  { id: 'laravel', name: 'Laravel', color: '#ff2d20', geometry: 'dodecahedron' },
  { id: 'figma', name: 'Figma', color: '#f24e1e', geometry: 'torus' },
];

let scene, camera, renderer;
let techMeshes = [];
let particles;
let animationId;
let isVisible = true;
let raycaster, mouse;
let hoveredTech = null;
let tooltipEl = null;
let clock;
let observerTarget;

export function initTechWorld() {
  try {
    if (typeof window === 'undefined') return;
    const { THREE } = window;
    if (!THREE) { showFallback(); return; }

    const container = document.getElementById('tech-world-scene');
    if (!container) return;

    InputManager.init();
    clock = new THREE.Clock();

    initScene(THREE, container);
    createTechObjects(THREE);
    createParticles(THREE);
    setupRaycaster();
    animate();
    setupIntersectionObserver();
  } catch (err) {
    console.warn('Tech World failed:', err.message);
    showFallback();
  }
}

function initScene(THREE, container) {
  const isMobile = checkMobile();
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050510, isMobile ? 0.008 : 0.005);

  camera = new THREE.PerspectiveCamera(isMobile ? 50 : 60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, isMobile ? 15 : 25);

  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 2);
  renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: isMobile ? 'low-power' : 'high-performance' });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const canvas = renderer.domElement;
  canvas.className = 'tech-world__canvas';
  container.appendChild(canvas);

  scene.add(new THREE.AmbientLight(0x334466, isMobile ? 0.5 : 0.8));
  const p1 = new THREE.PointLight(0x00d4aa, isMobile ? 1 : 2.5, 50); p1.position.set(5, 5, 10); scene.add(p1);
  const p2 = new THREE.PointLight(0x3b82f6, isMobile ? 0.8 : 1.5, 50); p2.position.set(-5, -3, 8); scene.add(p2);
  const p3 = new THREE.PointLight(0xa855f7, isMobile ? 0.5 : 1, 50); p3.position.set(0, -5, -5); scene.add(p3);
}

function checkMobile() {
  return window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
}

function createTechObjects(THREE) {
  const isMobile = checkMobile();
  const count = techWorldData.length;
  const radius = isMobile ? 6 : 8;

  techWorldData.forEach((tech, index) => {
    const angle = (index / count) * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 2;
    const size = isMobile ? 0.6 : 1.0;
    let geometry;

    switch (tech.geometry) {
      case 'box': geometry = new THREE.BoxGeometry(size, size, size); break;
      case 'circle': geometry = new THREE.CircleGeometry(Math.max(0.01, size * 0.7), 32); break;
      case 'octahedron': geometry = new THREE.OctahedronGeometry(Math.max(0.01, size * 0.7)); break;
      case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(Math.max(0.01, size * 0.7)); break;
      case 'icosahedron': geometry = new THREE.IcosahedronGeometry(Math.max(0.01, size * 0.7)); break;
      case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(Math.max(0.01, size * 0.7)); break;
      case 'torus': geometry = new THREE.TorusGeometry(Math.max(0.01, size * 0.5), Math.max(0.01, size * 0.2), 16, 32); break;
      default: geometry = new THREE.BoxGeometry(size, size, size);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tech.color), emissive: new THREE.Color(tech.color),
      emissiveIntensity: isMobile ? 0.15 : 0.3, metalness: 0.8, roughness: 0.2,
      transparent: true, opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
    mesh.userData = {
      techId: tech.id, techName: tech.name, techColor: tech.color,
      angle, radius, yOffset, baseY: yOffset,
      rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.005 },
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatAmplitude: 0.3 + Math.random() * 0.3,
    };
    scene.add(mesh);
    techMeshes.push(mesh);
  });
}

function createParticles(THREE) {
  const isMobile = checkMobile();
  const count = isMobile ? 500 : 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    const brightness = 0.3 + Math.random() * 0.7;
    colors[i * 3] = brightness * 0.5;
    colors[i * 3 + 1] = brightness * 0.8;
    colors[i * 3 + 2] = brightness;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: isMobile ? 0.3 : 0.5, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function setupRaycaster() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'tech-world__tooltip';
  tooltipEl.style.cssText = 'position:fixed;padding:0.4rem 0.8rem;border-radius:var(--radius-full);background:rgba(18,18,26,0.95);backdrop-filter:blur(12px);border:1px solid var(--color-border);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:600;color:var(--color-text-primary);pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.15s;white-space:nowrap;';
  document.body.appendChild(tooltipEl);

  InputManager.onMouseMove((e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (raycaster && techMeshes.length > 0) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(techMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (tooltipEl) { tooltipEl.textContent = hit.userData.techName; tooltipEl.style.left = `${e.clientX + 15}px`; tooltipEl.style.top = `${e.clientY - 10}px`; tooltipEl.style.opacity = '1'; }
        hoveredTech = hit.userData;
        document.body.style.cursor = 'pointer';
      } else {
        if (tooltipEl) tooltipEl.style.opacity = '0';
        hoveredTech = null;
        document.body.style.cursor = 'default';
      }
    }
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!isVisible) return;

  const elapsed = clock.getElapsedTime();

  techMeshes.forEach((mesh, index) => {
    const ud = mesh.userData;
    mesh.rotation.x += ud.rotationSpeed.x;
    mesh.rotation.y += ud.rotationSpeed.y;
    mesh.rotation.z += ud.rotationSpeed.z;
    mesh.position.y = ud.baseY + Math.sin(elapsed * ud.floatSpeed + index) * ud.floatAmplitude;
    const scaleTarget = (hoveredTech && hoveredTech.techId === ud.techId) ? 1.5 : 1.0;
    mesh.scale.set(mesh.scale.x + (scaleTarget - mesh.scale.x) * 0.1, mesh.scale.y + (scaleTarget - mesh.scale.y) * 0.1, mesh.scale.z + (scaleTarget - mesh.scale.z) * 0.1);
  });

  if (particles) { particles.rotation.y += 0.0005; particles.rotation.x += 0.0002; }
  camera.position.x += (InputManager.targetX * 3 - camera.position.x) * 0.01;
  camera.position.y += (-InputManager.targetY * 2 - camera.position.y) * 0.01;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

function setupIntersectionObserver() {
  observerTarget = document.querySelector('.tech-world');
  if (!observerTarget) return;
  const observer = new IntersectionObserver(
    (entries) => { entries.forEach((e) => { isVisible = e.isIntersecting; if (!isVisible && animationId) cancelAnimationFrame(animationId); else if (isVisible && !animationId) animate(); }); },
    { threshold: 0.05 }
  );
  observer.observe(observerTarget);
}

function showFallback() {
  const container = document.getElementById('tech-world-scene');
  if (!container) return;
  container.innerHTML = `<div class="tech-world__fallback"><div class="tech-world__fallback-grid">${techWorldData.map(t => `<div class="tech-world__fallback-card" style="--tech-color:${t.color}"><span class="tech-world__fallback-name">${t.name}</span></div>`).join('')}</div></div>`;
}

