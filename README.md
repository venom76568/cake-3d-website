# Artisan Bakery - 3D Scroll Experience

A modern, highly interactive Cake Shop website built with React, Vite, Tailwind CSS v4, and Framer Motion. It features scroll-driven 3D parallax effects and custom layout tracking to create a premium, immersive user experience.

## ✨ Key Features

- **Traveling Cake Animation**: A custom `position: fixed` animation architecture that smoothly translates a cake across different document flow sections based directly on the user's scroll position.
- **Dynamic Parallax Environments**: Deep Z-axis depth created by staggering the movement, scale, and blur of background elements (floating toppings) and foreground framing elements.
- **Performant Animations**: Leverages Framer Motion's `useScroll` and `useTransform` to bind animations directly to scroll progress, ensuring 1:1 synchronization without spring physics lag.
- **Modern Tech Stack**: Bootstrapped with Vite for instant HMR, styled with the new Tailwind CSS v4 `@theme` architecture, and built with modern functional React patterns.

## 🚀 Quick Start

Get the project running locally in under 2 minutes.

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venom76568/cake-3d-website.git
   cd cakeshop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the 3D scroll effects in action.

## 🛠️ Project Structure

- `src/components/HeroSection.jsx` - Contains the massive typography, parallax floating toppings, and the intricate scroll-driven entry animations for the framing cakes.
- `src/components/TravelingCake.jsx` - The core engineering behind the scroll-linked element that escapes `overflow: hidden` boundaries to travel seamlessly across layout sections.
- `src/index.css` - Contains the global CSS and the Tailwind v4 `@theme` configuration mapping custom brand colors (chocolate, plum, cream, etc.).

## 🎨 Design Philosophy

This project actively avoids modern SaaS design clichés (like overused bento grids and generic UI library components). Instead, it aims for a **Premium** aesthetic by using large-scale typography, rich brand colors (cream, warm-brown, chocolate, plum), and advanced scroll-linked depth-of-field visual effects.
