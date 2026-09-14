/**
 * Project Detail Modal Module.
 * Uses event delegation for efficient listener management.
 */
const projectsData = [
  {
    id: 'calf',
    title: 'CALF',
    category: 'Prototype desain web aplikasi calf',
    description: 'Sistem digitalisasi Calf untuk membantu pengelolaan pembelian customer. Dibangun menggunakan Figma untuk prototyping UI/UX.',
    features: ['Multi Role Auth', 'Super Admin', 'Customer', 'Pendataan Barang', 'Pembayaran Barang', 'Payment Gateway', 'Monitoring Keuangan'],
    technologies: ['Figma'],
    architecture: 'Figma prototype with interactive components and auto-layout for responsive design.',
    challenges: ['Creating intuitive multi-role authentication flow', 'Designing payment gateway integration UI', 'Balancing information density with usability'],
    solutions: ['Used Figma auto-layout and components for consistency', 'Created separate flows for each user role', 'Implemented clear visual hierarchy for payment flows'],
  },
  {
    id: 'sentiment-analysis',
    title: 'SENTIMENT ANALYSIS SHOPEE',
    category: 'Machine Learning',
    description: 'Sistem analisis sentimen ulasan pengguna menggunakan Machine Learning dan Natural Language Processing. Menganalisis ulasan Shopee untuk menentukan sentimen positif, negatif, atau netral dengan akurasi tinggi.',
    features: ['Text Preprocessing', 'Case Folding', 'Tokenizing', 'Stopword Removal', 'Normalisasi', 'Stemming', 'TF-IDF', 'Naive Bayes', 'SVM', 'Confusion Matrix', 'Accuracy', 'Precision & Recall', 'F1 Score'],
    technologies: ['Python', 'Google Colab', 'Machine Learning', 'NLP'],
    architecture: 'Pipeline-based NLP architecture with data preprocessing module, feature extraction (TF-IDF), multi-model comparison (Naive Bayes vs SVM), and evaluation dashboard with confusion matrix visualization.',
    challenges: ['Handling Indonesian slang and informal language in reviews', 'Balancing model complexity with inference speed', 'Achieving high accuracy with limited labeled dataset', 'Comparing multiple ML algorithms for optimal performance'],
    solutions: ['Built custom Indonesian stopword list and slang dictionary for better preprocessing', 'Used TF-IDF vectorization to reduce dimensionality while preserving meaningful features', 'Applied data augmentation techniques to expand the training dataset', 'Compared Naive Bayes and SVM with cross-validation to select the best performing model'],
  },
];

let activeProjectId = null;
let previousFocusEl = null;
let _keydownHandler = null;
let _clickHandler = null;

export { projectsData };

export function openModal(projectId) {
  const project = projectsData.find((p) => p.id === projectId);
  if (!project) return;

  activeProjectId = projectId;
  previousFocusEl = document.activeElement;

  const container = document.getElementById('project-modal-container');
  if (container) {
    container.innerHTML = `
      <div class="modal-overlay" id="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal">
          <button class="modal__close" aria-label="Close project detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="modal__image"><div class="modal__image-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div class="modal__image-overlay"></div></div>
          <div class="modal__body">
            <p class="modal__category">${project.category}</p>
            <h2 class="modal__title" id="modal-title">${project.title}</h2>
            <p class="modal__description">${project.description}</p>
            <div class="modal__section"><h3 class="modal__section-title">Features</h3><div class="modal__features">${project.features.map((f) => `<span class="modal__feature">${f}</span>`).join('')}</div></div>
            <div class="modal__section"><h3 class="modal__section-title">Technology</h3><div class="modal__tech">${project.technologies.map((t) => `<span class="modal__tech-badge">${t}</span>`).join('')}</div></div>
            <div class="modal__section"><h3 class="modal__section-title">Architecture</h3><p class="modal__architecture">${project.architecture}</p></div>
            <div class="modal__section"><h3 class="modal__section-title">Challenges</h3><ul class="modal__list">${project.challenges.map((c) => `<li class="modal__list-item">${c}</li>`).join('')}</ul></div>
            <div class="modal__section"><h3 class="modal__section-title">Solutions</h3><ul class="modal__list">${project.solutions.map((s) => `<li class="modal__list-item">${s}</li>`).join('')}</ul></div>
            <div class="modal__actions"><a href="#" class="btn btn--primary">VIEW PROJECT</a><a href="#" class="btn btn--secondary">GITHUB</a></div>
          </div>
        </div>
      </div>`;
  } else {
    document.body.insertAdjacentHTML('beforeend', createModalHTML(project));
  }

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const modalEl = document.getElementById('project-modal');
    if (modalEl) modalEl.classList.add('modal-overlay--active');
    const modal = document.querySelector('.modal');
    if (modal) modal.classList.add('modal--active');
  });

  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('modal-close') || document.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  });

  // Single delegated listeners (replaces per-element)
  _keydownHandler = (e) => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab' && activeProjectId) {
      const modalEl = document.getElementById('project-modal');
      if (!modalEl) return;
      const focusable = modalEl.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
  };
  document.addEventListener('keydown', _keydownHandler);

  _clickHandler = (e) => {
    const modal = document.getElementById('project-modal');
    if (modal && e.target === modal) closeModal();
  };
  document.addEventListener('click', _clickHandler);
}

function createModalHTML(project) {
  return `
    <div class="modal-overlay" id="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal">
        <button class="modal__close" aria-label="Close project detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="modal__image"><div class="modal__image-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div class="modal__image-overlay"></div></div>
        <div class="modal__body">
          <p class="modal__category">${project.category}</p>
          <h2 class="modal__title" id="modal-title">${project.title}</h2>
          <p class="modal__description">${project.description}</p>
          <div class="modal__section"><h3 class="modal__section-title">Features</h3><div class="modal__features">${project.features.map((f) => `<span class="modal__feature">${f}</span>`).join('')}</div></div>
          <div class="modal__section"><h3 class="modal__section-title">Technology</h3><div class="modal__tech">${project.technologies.map((t) => `<span class="modal__tech-badge">${t}</span>`).join('')}</div></div>
          <div class="modal__section"><h3 class="modal__section-title">Architecture</h3><p class="modal__architecture">${project.architecture}</p></div>
          <div class="modal__section"><h3 class="modal__section-title">Challenges</h3><ul class="modal__list">${project.challenges.map((c) => `<li class="modal__list-item">${c}</li>`).join('')}</ul></div>
          <div class="modal__section"><h3 class="modal__section-title">Solutions</h3><ul class="modal__list">${project.solutions.map((s) => `<li class="modal__list-item">${s}</li>`).join('')}</ul></div>
          <div class="modal__actions"><a href="#" class="btn btn--primary">VIEW PROJECT</a><a href="#" class="btn btn--secondary">GITHUB</a></div>
        </div>
      </div>
    </div>`;
}

export function closeModal() {
  const modalEl = document.getElementById('project-modal');
  if (!modalEl) return;
  modalEl.classList.remove('modal-overlay--active');
  const modal = modalEl.querySelector('.modal');
  if (modal) modal.classList.remove('modal--active');

  setTimeout(() => {
    const container = document.getElementById('project-modal-container');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
    if (previousFocusEl) { previousFocusEl.focus(); previousFocusEl = null; }
  }, 300);

  // Cleanup delegated listeners
  if (_keydownHandler) { document.removeEventListener('keydown', _keydownHandler); _keydownHandler = null; }
  if (_clickHandler) { document.removeEventListener('click', _clickHandler); _clickHandler = null; }
  activeProjectId = null;
}

// Event delegation for project cards
function initProjectDetail() {
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.project-card__actions .btn--primary');
    if (viewBtn) {
      const card = viewBtn.closest('.project-card');
      const projectId = card?.dataset.projectId || '';
      if (projectId) openModal(projectId);
    }
  });
}

export { initProjectDetail };
