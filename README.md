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
src/
├── assets/          # Images and static resources
├── components/      # React components
│   └── canvas/      # 3D canvas components
├── constants/       # Static data
├── hoc/             # Higher Order Components
├── utils/           # Utility functions
├── App.jsx          # Main application
├── main.jsx         # Entry point
├── index.css        # Global styles
└── styles.css       # Custom styles
```

## License

MIT
