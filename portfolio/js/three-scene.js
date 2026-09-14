/**
 * Three.js Scene Module - Hero background 3D.
 * Uses InputManager to eliminate duplicate listeners.
 */
import InputManager from './input-manager.js';

let scene, camera, renderer;
let centralMesh, wireframeMesh, ringMesh;
let particleSystem;
let animationId;
let isMobile = false;
let isVisible = true;
let observerTarget;

export function initThreeScene() {
  try {
    if (typeof window === 'undefined') return;
    const { THREE } = window;
    if (!THREE) return;

    const canvas = document.querySelector('.hero__canvas');
    if (!canvas) return;

    isMobile = checkMobile();
    InputManager.init();

    initScene(THREE, canvas);

    if (isMobile) {
      createMinimalParticles(THREE);
    } else {
      createCentralObject(THREE);
      createParticleField(THREE);
      createOrbitalRing(THREE);
      createStars(THREE);
    }

    animate();
    setupIntersectionObserver();
  } catch (err) {
    console.warn('Three.js initialization failed:', err.message);
    const canvas = document.querySelector('.hero__canvas');
    if (canvas) canvas.style.display = 'none';
  }
}

function checkMobile() {
  return (
    window.innerWidth < 768 ||
    navigator.hardwareConcurrency <= 4
  );
}

function initScene(THREE, canvas) {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050510, 0.012);

  camera = new THREE.PerspectiveCamera(
    isMobile ? 55 : 60,
    window.innerWidth / window.innerHeight,
    0.1, 1000
  );
  camera.position.set(0, 0, isMobile ? 30 : 25);

  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer = new THREE.WebGLRenderer({
    canvas, antialias: !isMobile, alpha: true,
    powerPreference: isMobile ? 'low-power' : 'high-performance',
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0x334466, isMobile ? 0.5 : 0.8));

  const p1 = new THREE.PointLight(0x00d4aa, isMobile ? 1 : 2.5, 60);
  p1.position.set(5, 5, 10);
  scene.add(p1);

  const p2 = new THREE.PointLight(0x3b82f6, isMobile ? 0.8 : 1.8, 60);
  p2.position.set(-5, -3, 8);
  scene.add(p2);

  const p3 = new THREE.PointLight(0xa855f7, isMobile ? 0.5 : 1.2, 50);
  p3.position.set(0, -5, -5);
  scene.add(p3);
}

function createCentralObject(THREE) {
  const innerGeo = new THREE.IcosahedronGeometry(Math.max(0.01, 3), 2);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.3,
    metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.6,
  });
  centralMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(centralMesh);

  const wireGeo = new THREE.IcosahedronGeometry(Math.max(0.01, 5), 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.35,
  });
  wireframeMesh = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireframeMesh);

  const glowGeo = new THREE.SphereGeometry(Math.max(0.01, 6), 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, transparent: true, opacity: 0.04, side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));
}

function createParticleField(THREE) {
  const count = isMobile ? 500 : 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = 8 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    const colorChoice = Math.random();
    let r, g, b;
    if (colorChoice < 0.4) { r = 0; g = 0.83; b = 0.67; }
    else if (colorChoice < 0.7) { r = 0.23; g = 0.51; b = 0.97; }
    else { r = 0.66; g = 0.33; b = 0.97; }
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.8 : 1.2, vertexColors: true, transparent: true,
    opacity: 0.7, sizeAttenuation: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createOrbitalRing(THREE) {
  const ringGeo = new THREE.TorusGeometry(Math.max(0.01, 8), Math.max(0.01, 0.03), 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.5 });
  ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI * 0.4;
  ringMesh.rotation.z = Math.PI * 0.1;
  scene.add(ringMesh);

  const ring2Geo = new THREE.TorusGeometry(Math.max(0.01, 10), Math.max(0.01, 0.02), 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI * 0.6;
  ring2.rotation.y = Math.PI * 0.3;
  scene.add(ring2);
}

function createMinimalParticles(THREE) {
  const count = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    colors[i * 3] = 0.3;
    colors[i * 3 + 1] = 0.83;
    colors[i * 3 + 2] = 0.67;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.5, vertexColors: true, transparent: true, opacity: 0.5,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createStars(THREE) {
  const count = isMobile ? 500 : 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.3, color: 0x667799, transparent: true, opacity: 0.5,
    sizeAttenuation: true, depthWrite: false,
  });
  scene.add(new THREE.Points(geometry, material));
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!isVisible) return;

  const time = performance.now() * 0.001;

  if (centralMesh) {
    centralMesh.rotation.y = time * 0.3;
    centralMesh.rotation.x = Math.sin(time * 0.2) * 0.15;
    centralMesh.position.y = Math.sin(time * 0.8) * 0.5;
  }
  if (wireframeMesh) {
    wireframeMesh.rotation.y = -time * 0.15;
    wireframeMesh.rotation.z = time * 0.1;
  }
  if (ringMesh) {
    ringMesh.rotation.y = time * 0.4;
  }
  if (particles) {
    particles.rotation.y = time * 0.02;
  }

  camera.position.x += (InputManager.targetX * 5 - camera.position.x) * 0.01;
  camera.position.y += (-InputManager.targetY * 3 - camera.position.y) * 0.01;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

function setupIntersectionObserver() {
  observerTarget = document.querySelector('.hero');
  if (!observerTarget) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (!isVisible && animationId) {
          cancelAnimationFrame(animationId);
        } else if (isVisible && !animationId) {
          animate();
        }
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(observerTarget);
}

export function disposeThreeScene() {
  if (animationId) cancelAnimationFrame(animationId);
  if (observerTarget) observerTarget = null;
  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
  if (renderer) renderer.dispose();
}
