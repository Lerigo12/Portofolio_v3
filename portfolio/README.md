# Achmad Naufal Ilhamdy — Portfolio

**Full Stack Web Developer & UI/UX Designer**

Building Digital Experiences Through Code, Design, and Innovation.

---

## ✨ Features

- **Hero Section** — Animated 3D background with Three.js, GSAP entrance animations
- **About** — Profile with 3D hover effect, animated stats counters, interest tags
- **Skills** — Filterable tech stack with 13 technologies across 5 categories
- **Projects** — Modal detail view with features, tech stack, architecture, challenges, solutions
- **Journey** — Vertical timeline with animated dots and content reveal
- **Tech World** — Interactive 3D floating technology objects with hover tooltips
- **Contact** — EmailJS-powered form with validation, success state
- **Custom Cursor** — Desktop-only dot + ring with hover states
- **Back to Top** — Smooth scroll with IntersectionObserver visibility
- **Dark Futuristic Theme** — CSS custom properties, glassmorphism, neon accents

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES Modules) |
| **Animation** | GSAP 3.12.5, ScrollTrigger 3.12.5 |
| **3D Graphics** | Three.js r164 |
| **Icons** | Lucide Icons |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono (Google Fonts) |
| **Forms** | EmailJS (client-side only) |

---

## 📁 Folder Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── manifest.json           # PWA manifest
├── robots.txt              # SEO crawling rules
├── sitemap.xml             # XML sitemap
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── css/
│   ├── reset.css           # CSS reset & base styles
│   ├── variables.css       # CSS custom properties (colors, spacing, fonts)
│   ├── style.css           # Main styles (all components)
│   └── responsive.css      # Media queries (320px–1920px)
├── js/
│   ├── main.js             # App entry point
│   ├── input-manager.js    # Centralized input listeners
│   ├── animation.js        # GSAP/ScrollTrigger animations
│   ├── three-scene.js      # Hero Three.js scene
│   ├── tech-world.js       # Tech World 3D scene
│   ├── cursor.js           # Custom cursor (desktop only)
│   ├── project-detail.js   # Project modal logic
│   ├── contact.js          # Form validation + EmailJS
│   ├── back-to-top.js      # Back-to-top button
│   └── loading-screen.js   # Initial loading animation
├── assets/
│   ├── images/             # Profile photo, favicons, OG image
│   ├── icons/              # Custom icons
│   └── projects/           # Project screenshots (optional)
└── components/             # Reserved for future component partials
```

---

## ⚙️ Installation

### Prerequisites
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local HTTP server (required for ES Modules)

### Quick Start

```bash
# Clone or download
cd portfolio

# Option 1: Python 3
python3 -m http.server 8000

# Option 2: Node.js (npx)
npx serve .

# Option 3: PHP
php -S localhost:8000

# Option 4: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Open `http://localhost:8000` in browser.

---

## 🔧 Local Development

### Adding/Modifying Content

| To Change | Edit File |
|-----------|-----------|
| Colors, spacing, fonts | `css/variables.css` |
| Global styles | `css/style.css` |
| Responsive breakpoints | `css/responsive.css` |
| Hero content | `index.html` (hero section) |
| About content | `index.html` (about section) |
| Skills/tech stack | `index.html` (skills section) |
| Projects | `index.html` (projects section) + `js/project-detail.js` |
| Journey timeline | `index.html` (journey section) |
| Contact info | `index.html` (contact section) |
| Animations | `js/animation.js` |
| 3D scenes | `js/three-scene.js`, `js/tech-world.js` |

### EmailJS Setup (Contact Form)

1. Create account at [emailjs.com](https://emailjs.com)
2. Create Email Service, Template
3. Update `js/contact.js`:

```javascript
const EMAILJS_PUBLIC_KEY = 'your_public_key';
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
```

Template variables available: `from_name`, `from_email`, `subject`, `message`, `to_email`

---

## 🎨 Customization

### Theme Colors

Edit `css/variables.css`:

```css
:root {
  --color-primary: #00d4aa;      /* Main accent (cyan) */
  --color-electric-blue: #3b82f6; /* Blue accent */
  --color-neon-purple: #a855f7;   /* Purple accent */
  --color-cyan: #06d6a0;          /* Success/cyan */
  --color-bg: #0a0a0f;            /* Background */
  --color-surface: #12121a;       /* Cards/surfaces */
}
```

### Typography

```css
:root {
  --font-display: 'Space Grotesk', ...;  /* Headings */
  --font-body: 'Inter', ...;             /* Body text */
  --font-mono: 'JetBrains Mono', ...;    /* Code/mono */
}
```

### Adding a Project

1. Add project card in `index.html` (projects section)
2. Add project data in `js/project-detail.js`:
```javascript
{
  id: 'my-project',
  title: 'MY PROJECT',
  category: 'Full Stack',
  description: '...',
  features: ['Feature 1', 'Feature 2'],
  technologies: ['React', 'Node.js'],
  architecture: '...',
  challenges: ['...'],
  solutions: ['...']
}
```
3. Add `data-project-id="my-project"` to project card

---

## 🚀 Deployment

### Static Hosting (Recommended)

This is a **static site** — no server required.

| Platform | Steps |
|----------|-------|
| **GitHub Pages** | 1. Push to GitHub repo<br>2. Settings → Pages → Source: Deploy from branch<br>3. Select `main` / `(root)` |
| **Vercel** | 1. `npm i -g vercel`<br>2. `vercel` in project root<br>3. Follow prompts |
| **Netlify** | 1. Drag `portfolio/` folder to Netlify dashboard<br>2. Or connect Git repo |
| **Cloudflare Pages** | 1. Connect Git repo<br>2. Build command: (none)<br>3. Output: `/` |
| **Firebase Hosting** | 1. `firebase init hosting`<br>2. Public directory: `portfolio`<br>3. `firebase deploy` |

### Build Step

**None required.** All code runs in browser natively.

> ⚠️ **Important:** Must serve over HTTP/HTTPS (not `file://`) for ES Modules to work.

### Custom Domain

1. Add `CNAME` file to root with your domain
2. Configure DNS:
   - GitHub Pages: `CNAME` → `<username>.github.io`
   - Vercel/Netlify: Add in dashboard

### Environment Variables

For EmailJS keys in production, use platform-specific env vars:

```bash
# Vercel
vercel env add EMAILJS_PUBLIC_KEY

# Netlify
netlify env:set EMAILJS_PUBLIC_KEY "your_key"
```

Then reference in `contact.js`:

```javascript
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
```

---

## ✅ Pre-Deployment Checklist

- [ ] Replace `your-domain.com` in `index.html` (canonical, OG, Twitter, JSON-LD)
- [ ] Add real profile photo: `assets/images/Profile.jpeg`
- [ ] Add favicon files: `assets/images/favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`
- [ ] Add OG image: `assets/images/og-image.png` (1200×630px)
- [ ] Add PWA icons: `assets/images/icon-192.png`, `icon-512.png`
- [ ] Update EmailJS keys in `js/contact.js` (or use env vars)
- [ ] Update social links in `index.html` (GitHub, Instagram, Email)
- [ ] Update JSON-LD `sameAs` URLs
- [ ] Test in production build: `npx serve .` → verify no console errors
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO > 90)

---

## 📄 License

MIT License — Feel free to use as template for your own portfolio.

---

## 🙏 Credits

- **GSAP** — GreenSock Animation Platform
- **Three.js** — 3D graphics
- **Lucide** — Icons
- **Google Fonts** — Typography
- **EmailJS** — Contact form