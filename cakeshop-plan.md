# Artisan Cake Shop — Interactive Web Experience Plan

This document outlines the sequenced development plan for the immersive single-page Artisan Cake Shop website using **React 18 + Vite + Tailwind CSS + Framer Motion**.

---

## Project Overview

- **Goal:** Create a visually stunning, immersive single-page website simulating a "living page" with parallax depth layering, Framer Motion physics, and scroll-triggered storytelling (fake-3D effect) without the performance overhead of WebGL/Three.js.
- **Project Type:** **WEB**
- **Primary Agent:** `frontend-specialist`
- **Key Skills:** `frontend-design`, `nextjs-react-expert`, `tailwind-patterns`, `clean-code`, `testing-patterns`, `vulnerability-scanner`

---

## Success Criteria

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **Lighthouse Performance** | >= 90 (Desktop) | `python .agents/scripts/verify_all.py .` |
| **Animation Frame Rate** | Sustained 60fps | GPU rendering checks (only animate transform/opacity) |
| **Largest Contentful Paint (LCP)** | < 2.5 seconds | Performance profiling / Lighthouse |
| **Mobile Responsiveness** | Breakpoint support >= 320px | Manual & automated viewport scanning |
| **Accessibility (a11y)** | WCAG AA compliant | WCAG color ratio verification + screen-reader attributes |
| **Reduced Motion** | Respected via CSS/React | `prefers-reduced-motion` halts all continuous loops |

---

## Tech Stack & Rationale

1. **Vite 5 + React 18:** Light, fast SPA with instant Hot Module Replacement (HMR).
2. **Tailwind CSS v3/v4:** Utility classes for rapid custom styling. (Version selection subject to user feedback).
3. **Framer Motion 11:** Spring physics, scroll-driven hooks, and robust `layoutId` shared layout transitions for organic animation feel.
4. **WebP Format:** All visual assets pre-compressed to WebP with transparent backgrounds to keep payload budget < 800KB.

---

## File & Folder Structure

We propose initializing the project directly in the workspace root `c:\Users\hagra\cakeshop` (instead of a subfolder `cake-shop`) for simpler command executions and clean workspace tracking, subject to user approval.

```plaintext
c:\Users\hagra\cakeshop\
├── .agents/                      # ag-kit environment files
├── .instructions/                # Original specifications
├── public/
│   └── images/
│       ├── chocolate_ganache_drip_cake.webp        # Cake 1
│       ├── pastel_sprinkles_cake.webp              # Cake 2
│       ├── artisanal_strawberry_shortcake.webp     # Cake 3
│       ├── modern_fondant_celebration_cake.webp    # Cake 4
│       ├── red_velvet_layer_cake.webp              # Cake 5
│       ├── carrot_cake_with_spices.webp            # Cake 6
│       ├── lemon_meringue_cake.webp                # Cake 7
│       ├── coffee_walnut_cake.webp                 # Cake 8
│       ├── strawberry.webp                         # Topping 1
│       ├── chocolate_curl.webp                     # Topping 2
│       ├── gold_flakes.webp                        # Topping 3
│       ├── sprinkles_mix.webp                      # Topping 4
│       ├── mint_leaf.webp                          # Topping 5
│       ├── ceramic_plate.webp                      # Empty plate placeholder
│       ├── avatar_young_woman.webp                 # Testimonial Avatar 1
│       └── avatar_older_man.webp                   # Testimonial Avatar 2
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                 # Sticky transparent-to-solid nav
│   │   ├── HeroSection.jsx            # Floating 3D viewport
│   │   ├── FloatingCake.jsx           # Individual spring/loop cake component
│   │   ├── FloatingTopping.jsx        # Individual fast float topping
│   │   ├── FeaturedSection.jsx        # layoutId glide grid container
│   │   ├── FeaturedCard.jsx           # Featured cake card
│   │   ├── EmptyPlate.jsx             # Empty plate visual container
│   │   ├── MenuSection.jsx            # CSS grid with scroll reveal
│   │   ├── MenuItem.jsx               # Single menu card
│   │   ├── TestimonialsSection.jsx    # Flex testimonials section (plum bg)
│   │   └── TestimonialCard.jsx        # Individual CSS hover lift card
│   ├── data/
│   │   ├── menuData.js                # MenuItem dataset
│   │   ├── featuredData.js            # Featured list including layoutId configs
│   │   └── testimonialsData.js        # Testimonials reviews dataset
│   ├── hooks/
│   │   ├── useScrollNavbar.js         # Scroll-Y monitoring hook
│   │   └── useReducedMotion.js        # Custom Hook mapping media query for a11y
│   ├── App.jsx                        # LayoutGroup root & assembly
│   ├── main.jsx                       # Entry point
│   ├── index.css                      # Tailwind base & custom styles
│   └── index.html                     # HTML root + Google fonts (Playfair Display, DM Sans)
├── package.json
├── tailwind.config.js (or v4 CSS)
├── vite.config.js
└── cakeshop-plan.md                  # This file
```

---

## Open Questions / Design Decisions

> [!IMPORTANT]
> **1. Workspace Location:** Should we initialize the Vite app directly in the root directory `c:\Users\hagra\cakeshop` or create a nested `cake-shop` folder? (Root initialization is recommended to keep scripts running easily).
> **2. Tailwind CSS Version:** Do you prefer Tailwind CSS v3 (using `tailwind.config.js` JS theme extension) or Tailwind CSS v4 (which uses pure CSS variables in `index.css` via `@theme`)?
> **3. Image Asset Generation:** We will auto-generate the 16 transparent WebP image files (using the `generate_image` tool based on the detailed visual prompts provided) and save them in `/public/images/`.

---

## Task Breakdown

### Phase 1: Environment & Asset Setup

#### Task 1.1: Project Initialization
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P0
- **Dependencies:** None
- **INPUT:** Workspace folder
- **OUTPUT:** Vite React boilerplate in workspace root
- **VERIFY:** Check `package.json` exists in target directory. Run `npm install` check.

#### Task 1.2: Dependencies Installation
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P0
- **Dependencies:** Task 1.1
- **INPUT:** `package.json`
- **OUTPUT:** Installed `framer-motion` and Tailwind CSS dependencies
- **VERIFY:** Inspect `node_modules/` and `package.json` dependencies list.

#### Task 1.3: Styling & Font Configuration
- **Agent:** `frontend-specialist`
- **Skills:** `tailwind-patterns`, `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 1.2
- **INPUT:** `index.css`, `tailwind.config.js` (or CSS imports), `index.html`
- **OUTPUT:** Google Fonts loaded in `index.html` (Playfair Display, DM Sans), Custom color system (Cream White `#FEFBF6`, Warm Rose `#FDE8D0`, Dusty Rose `#FDA4AF`, Deep Plum `#4A1A3A`, Warm Gold `#D4A853`, Chocolate `#3D1A00`, Pearl White `#FFFFFF`, Mist Gray `#F5F0EB`) configured.
- **VERIFY:** Validate CSS compilation passes. Check if typography class assignments work.

#### Task 1.4: Image Asset Scaffolding
- **Agent:** `frontend-specialist`
- **Skills:** `app-builder`
- **Priority:** P0
- **Dependencies:** Task 1.1
- **INPUT:** Visual descriptions and prompts provided by user
- **OUTPUT:** 16 `.webp` image assets in `/public/images/` with transparent backgrounds:
  1. `chocolate_ganache_drip_cake.webp` (Chocolate Ganache Drip Cake)
  2. `pastel_sprinkles_cake.webp` (Pastel Sprinkles Cake)
  3. `artisanal_strawberry_shortcake.webp` (Artisanal Strawberry Shortcake)
  4. `modern_fondant_celebration_cake.webp` (Modern Fondant Celebration Cake)
  5. `red_velvet_layer_cake.webp` (Red Velvet Layer Cake)
  6. `carrot_cake_with_spices.webp` (Carrot Cake with Spices)
  7. `lemon_meringue_cake.webp` (Lemon Meringue Cake)
  8. `coffee_walnut_cake.webp` (Coffee & Walnut Cake)
  9. `strawberry.webp` (Individual ripe strawberry)
  10. `chocolate_curl.webp` (Elegant dark chocolate curl)
  11. `gold_flakes.webp` (Shimmering edible gold flakes)
  12. `sprinkles_mix.webp` (Assorted colorful sprinkles mix)
  13. `mint_leaf.webp` (Individual fresh mint leaf)
  14. `ceramic_plate.webp` (Elegant empty ceramic dessert plate)
  15. `avatar_young_woman.webp` (Smiling young woman headshot)
  16. `avatar_older_man.webp` (Diverse older man smiling headshot)
- **VERIFY:** Inspect `/public/images/` folder. Verify all 16 assets are present, render correctly with transparent backgrounds, and meet style requirements.

---

### Phase 2: Static Data & Core Hooks

#### Task 2.1: Static Datasets Setup
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P1
- **Dependencies:** Task 1.1
- **INPUT:** Data schemas from TRD
- **OUTPUT:** `/src/data/menuData.js`, `/src/data/featuredData.js`, and `/src/data/testimonialsData.js`
- **VERIFY:** Import files in a test script or components and check values.

#### Task 2.2: Reusable Utility Hooks
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`
- **Priority:** P1
- **Dependencies:** Task 1.1
- **INPUT:** None
- **OUTPUT:** `/src/hooks/useScrollNavbar.js` (tracks scrollY state) and `/src/hooks/useReducedMotion.js` (checks media query for user preferences)
- **VERIFY:** Test states change correctly on mock scroll and preferences change.

---

### Phase 3: Core Components Build

#### Task 3.1: Floating Animations (Cake & Toppings)
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `nextjs-react-expert`
- **Priority:** P0
- **Dependencies:** Task 1.4
- **INPUT:** `FloatingCake.jsx`, `FloatingTopping.jsx` props interface
- **OUTPUT:** Dynamic components running Framer Motion springs on mount and mirror loops for float (translateY), respecting `useReducedMotion`.
- **VERIFY:** Inspect visual movement. Ensure only `transform` properties animate.

#### Task 3.2: Hero Section UI
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 3.1, Task 1.3
- **INPUT:** `HeroSection.jsx`
- **OUTPUT:** Immersive 100vh hero section, centered Playfair typography, 4 absolute cakes, and toppings with staggered delayed entries and float layers.
- **VERIFY:** Confirm responsiveness: scale down and reposition gracefully on small viewports.

#### Task 3.3: Sticky Navbar
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 2.2, Task 1.3
- **INPUT:** `Navbar.jsx`
- **OUTPUT:** Sticky navbar translating transparent-to-solid rose/plum background on scroll > 80px.
- **VERIFY:** Check CSS transitions and class updates on page scroll. Keyboard navigable links.

#### Task 3.4: Featured Section (Shared Layout Transition)
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 2.1, Task 3.2
- **INPUT:** `FeaturedSection.jsx`, `FeaturedCard.jsx`, `EmptyPlate.jsx`
- **OUTPUT:** 2x2 grid containing 3 cards + 1 empty plate. The hero cake (`cake2`) must smoothly transition from Hero to Featured grid slot on scroll via `layoutId="featured-hero-cake"` inside a shared `LayoutGroup`.
- **VERIFY:** Scroll up/down. Transition executes smoothly without visual jumps.

#### Task 3.5: Menu Grid Section
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 2.1
- **INPUT:** `MenuSection.jsx`, `MenuItem.jsx`
- **OUTPUT:** CSS Grid with scroll reveals (`whileInView`) staggered by card index. Custom borders/shadows.
- **VERIFY:** Stagger animation triggers once on scroll reveal.

#### Task 3.6: Testimonials (Contrast Section)
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 2.1
- **INPUT:** `TestimonialsSection.jsx`, `TestimonialCard.jsx`
- **OUTPUT:** Rich contrast deep plum `#4A1A3A` section with flex row layout. Pure CSS hover transitions (lift, shadow, background opacity increase) - no Framer Motion overhead.
- **VERIFY:** Test keyboard focus trigger matches hover effect.

---

### Phase 4: App Integration & Verification

#### Task 4.1: App Assembly
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P0
- **Dependencies:** All components
- **INPUT:** `src/App.jsx`
- **OUTPUT:** Consolidated single-page application wrapped in a single Framer Motion `LayoutGroup`.
- **VERIFY:** Build and launch dev server. Verify smooth rendering.

#### Task 4.2: Performance & Audit Fixes
- **Agent:** `frontend-specialist`
- **Skills:** `web-design-guidelines`, `performance-profiling`
- **Priority:** P1
- **Dependencies:** Task 4.1
- **INPUT:** Code base
- **OUTPUT:** Optimized images (loading lazy), GPU acceleration via CSS `will-change: transform`, no layout-affecting framer-motion properties.
- **VERIFY:** Check dev console for warnings.

---

## Phase X: Verification Checklist

Once implementation is complete, run the following automated verification suite.

### Automated Tests Execution
```bash
# Run the master checklist tool
python .agents/scripts/checklist.py .
```
Verify the checklist output resolves with no blocker failures:
- **Security scan:** no secrets or critical vulnerabilities
- **CSS Linting:** Tailwind classes compile correctly
- **UX & Accessibility Check:** Color contrasts, font structures, alt text checks
- **Responsive Layout Check:** Viewports from 320px up to 1440px verify correctly

### Manual Inspections
- [ ] **Purple Ban check:** Verify no violet, indigo, or purple gradients/glows. Deep plum is restricted to warm luxury branding tones.
- [ ] **No Template layouts:** Ensure asymmetry, organic spring motions, and floating elements create a bespoke look.
- [ ] **Keyboard navigation:** Tab through links, check focus indicator rings are visible.

### Final Marker
Once all checks pass, append the following to this document:
```markdown
## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: [Current Date]
```
