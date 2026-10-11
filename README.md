# Brandon Brumertz | 3D Portfolio

A modern, interactive 3D portfolio website built with React, Three.js, and Framer Motion.

## Tech Stack

- **React 18** — UI Library
- **Vite** — Build Tool
- **Three.js** (react-three-fiber + drei) — 3D Graphics
- **Framer Motion** — Animations
- **Tailwind CSS v4** — Styling
- **EmailJS** — Contact Form

## Features

- Interactive 3D models (Desktop PC, Planet, Stars)
- Smooth animations and transitions
- Responsive design
- Contact form with validation
- Lazy loading for optimal performance
- Error boundary for graceful error handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
├── public/            # Static files (3D models, fonts)
├── scripts/           # Build & QA tooling (smoke tests, Lighthouse, asset optimization)
├── src/
│   ├── assets/        # Images, icons and textures
│   ├── components/    # React components (Navbar, Hero, About, Experience, Tech, Services, Works, Contact, Footer)
│   │   └── canvas/    # Three.js scenes (Computers, Earth, Stars, Ball) + renderer config
│   ├── constants/     # Static data (social links, contact info)
│   ├── hoc/           # SectionWrapper HOC (animated titles + section id)
│   ├── hooks/         # Custom hooks (useInView)
│   ├── i18n/          # Translations (en.js, es.js) + LocaleProvider / useLocale
│   ├── utils/         # Animation helpers (Framer Motion variants)
│   ├── App.jsx        # Main application (progressive lazy section mounting)
│   ├── main.jsx       # Entry point
│   ├── index.css      # Global styles
│   └── styles.css     # Custom styles
├── index.html         # HTML shell (SEO metadata, JSON-LD)
└── vite.config.js     # Vite config + manual chunk strategy
```

## License

MIT
