import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * TravelingCake — A fixed-positioned cake that smoothly flies from the hero
 * section to the featured card as the user scrolls down.
 *
 * Architecture:
 *  - Measures #hero-cake-anchor and #featured-cake-anchor via getBoundingClientRect.
 *  - Uses position:fixed so it escapes all overflow:hidden parents.
 *  - useTransform(scrollY, fn) with stable callbacks (via useCallback + refs) maps
 *    scrollY directly to top/left/width — the animation speed matches the scroll exactly.
 *  - z-index: 5 at rest (sits behind the z-20 typography, above z-0 background).
 *    Pops to z-index: 50 the moment scrolling begins so it floats over all sections.
 */
export function TravelingCake() {
  const { scrollY } = useScroll();

  // Mutable refs so transform callbacks are stable (no MotionValue recreation on re-render)
  const fromRef = useRef({ absTop: 400, left: 200, width: 300 });
  const toRef   = useRef({ absTop: 2500, left: 100, width: 200 });
  const vhRef   = useRef(800);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => {
      const heroEl     = document.getElementById('hero-cake-anchor');
      const featuredEl = document.getElementById('featured-cake-anchor');
      if (!heroEl || !featuredEl) return;

      const scrollTop  = window.scrollY;
      const heroBcr    = heroEl.getBoundingClientRect();
      const featBcr    = featuredEl.getBoundingClientRect();

      // Store absolute document positions (viewport top + current scrollY)
      fromRef.current = {
        absTop: heroBcr.top + scrollTop,
        left:   heroBcr.left,
        width:  heroBcr.width,
      };
      toRef.current = {
        absTop: featBcr.top + scrollTop,
        left:   featBcr.left,
        width:  featBcr.width,
      };
      vhRef.current = window.innerHeight;
      setReady(true);
    };

    // Wait for all sections to mount and paint before measuring
    const timer = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /**
   * scrollEnd: the scrollY value at which the cake arrives at its destination.
   * At scrollEnd, the featured anchor is sitting at vh*0.35 from top of viewport.
   * Formula: featuredAbsTop - scrollEnd = vh*0.35  →  scrollEnd = featuredAbsTop - vh*0.35
   */
  const getScrollEnd = useCallback(
    () => Math.max(toRef.current.absTop - vhRef.current * 0.35, 200),
    []
  );

  // Vertical fixed position:
  //  - While traveling (0 → scrollEnd): interpolate from hero to featured anchor.
  //  - After landing (scrollY > scrollEnd): follow the featured card as it scrolls
  //    off the page by keeping top = absoluteDocPosition - scrollY.
  //    This makes the fixed element behave as if it were in normal document flow.
  const top = useTransform(scrollY, useCallback((v) => {
    const f = fromRef.current;
    const t = toRef.current;
    const scrollEnd = getScrollEnd();

    if (v >= scrollEnd) {
      // Cake has landed — scroll with the featured card so it doesn't float
      return t.absTop - v;
    }

    // In-flight: linear interpolation hero → featured
    const p = v / scrollEnd; // no clamping needed, v < scrollEnd here
    return f.absTop + (t.absTop - scrollEnd - f.absTop) * p;
  }, [getScrollEnd]));

  // Horizontal fixed position
  const left = useTransform(scrollY, useCallback((v) => {
    const f = fromRef.current;
    const t = toRef.current;
    const scrollEnd = getScrollEnd();
    const p = Math.max(0, Math.min(1, v / scrollEnd));
    return f.left + (t.left - f.left) * p;
  }, [getScrollEnd]));

  // Width shrinks from hero size to featured card image size
  const width = useTransform(scrollY, useCallback((v) => {
    const f = fromRef.current;
    const t = toRef.current;
    const scrollEnd = getScrollEnd();
    const p = Math.max(0, Math.min(1, v / scrollEnd));
    return f.width + (t.width - f.width) * p;
  }, [getScrollEnd]));

  // z-index:
  //  - While hero section is visible (scrollY < 90% of hero height = 90vh): z=5
  //    The cake stays BEHIND the ARTISAN BAKERY text (z-20) during the entire hero view.
  //  - Once the hero section has mostly scrolled off (scrollY > 0.9*vh): z=50
  //    The cake floats OVER every subsequent section as it travels to its destination.
  const zIndex = useTransform(scrollY, useCallback((v) => {
    const heroHeight = vhRef.current; // hero section = exactly 100vh
    return v > heroHeight * 0.2 ? 50 : 5;
  }, []));

  // Cake is always fully visible — no fade-out. It stays at the featured card
  // position permanently (following the card as the page scrolls).
  const opacity = useTransform(scrollY, useCallback(() => 1, []));

  return (
    <motion.div
      style={{
        position: 'fixed',
        top,
        left,
        width,
        zIndex,
        opacity,
        pointerEvents: 'none',
        display: ready ? 'block' : 'none',
      }}
    >
      <img
        src="/images/pastel_sprinkles_cake.webp"
        alt="Pastel Sprinkles Cake"
        className="w-full h-auto drop-shadow-2xl object-contain"
        style={{ willChange: 'transform' }}
      />
    </motion.div>
  );
}
