import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FloatingCake } from './FloatingCake';
import { FloatingTopping } from './FloatingTopping';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const bgTextY       = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.6], [0.88, 0]);
  const toppingY1     = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const toppingY2     = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const toppingY3     = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const toppingY4     = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const indicatorY    = useTransform(scrollYProgress, [0, 0.3], ['0%', '60%']);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Scroll parallax for the 4 corner cakes (each at a different rate for depth)
  const topLeftY    = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const topRightY   = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const bottomLeftY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bottomRightY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center bg-cream overflow-hidden"
    >
      {/* ── TYPOGRAPHY — z-20: sits above corner cakes (z-10) and TravelingCake at rest (z-5) ── */}
      <motion.div
        style={{ y: bgTextY, opacity: bgTextOpacity }}
        className="absolute z-20 flex flex-col items-center select-none pointer-events-none"
      >
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-[18vw] md:text-[14vw] leading-none font-display text-chocolate tracking-tighter mix-blend-multiply whitespace-nowrap"
        >
          ARTISAN
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
          className="text-[18vw] md:text-[14vw] leading-none font-display text-chocolate tracking-tighter mix-blend-multiply whitespace-nowrap -mt-[5%]"
        >
          BAKERY
        </motion.h1>
      </motion.div>

      {/* ── HERO CAKE ANCHOR ──
          Invisible element that TravelingCake measures to know its start position.
          opacity-0 hides it; the TravelingCake renders the actual visible image at z-5 (just behind the z-20 text). */}
      <div
        id="hero-cake-anchor"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] md:w-[45%] pointer-events-none opacity-0"
        aria-hidden="true"
      >
        {/* Same image + dimensions as the TravelingCake so measurement is accurate */}
        <img
          src="/images/pastel_sprinkles_cake.webp"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* ── FLOATING ELEMENTS LAYER — z-10 (above cream bg, below z-20 text) ── */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex items-center justify-center">

        {/* 4 CORNER CAKES — each slides in from its respective corner via nested motion.div.
            Outer motion.div: scroll-driven parallax (useTransform).
            Inner motion.div: entry animation (initial → animate), also carries random rotation. */}

        {/* Top-left: slides in from top-left corner */}
        <motion.div
          style={{ y: topLeftY }}
          className="absolute top-[5%] left-[8%] w-[35%] md:w-[25%] pointer-events-none"
        >
          <motion.div
            style={{ rotate: -25 }}
            initial={{ x: '-120%', y: '-120%', opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <FloatingCake src="/images/lemon_meringue_cake.webp" alt="Lemon Meringue" delay={0.1} />
          </motion.div>
        </motion.div>

        {/* Top-right: slides in from top-right corner */}
        <motion.div
          style={{ y: topRightY }}
          className="absolute top-[10%] right-[8%] w-[38%] md:w-[28%] pointer-events-none"
        >
          <motion.div
            style={{ rotate: 15 }}
            initial={{ x: '120%', y: '-120%', opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <FloatingCake src="/images/chocolate_ganache_drip_cake.webp" alt="Chocolate Ganache" delay={0.3} />
          </motion.div>
        </motion.div>

        {/* Bottom-left: slides in from bottom-left corner */}
        <motion.div
          style={{ y: bottomLeftY }}
          className="absolute bottom-[5%] left-[8%] w-[40%] md:w-[28%] pointer-events-none"
        >
          <motion.div
            style={{ rotate: -10 }}
            initial={{ x: '-120%', y: '120%', opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <FloatingCake src="/images/red_velvet_layer_cake.webp" alt="Red Velvet" delay={0.5} />
          </motion.div>
        </motion.div>

        {/* Bottom-right: slides in from bottom-right corner */}
        <motion.div
          style={{ y: bottomRightY }}
          className="absolute bottom-[5%] right-[8%] w-[35%] md:w-[25%] pointer-events-none"
        >
          <motion.div
            style={{ rotate: 20 }}
            initial={{ x: '120%', y: '120%', opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            <FloatingCake src="/images/coffee_walnut_cake.webp" alt="Coffee Walnut" delay={0.7} />
          </motion.div>
        </motion.div>

        {/* ── TOPPINGS — massively sized, on independent parallax layers ── */}

        <motion.div style={{ y: toppingY1 }} className="absolute inset-0 pointer-events-none">
          {/* Strawberry — upper-left quadrant, above corner cake */}
          <FloatingTopping
            src="/images/strawberry.webp"
            alt="Floating Strawberry"
            className="w-20 md:w-32 top-[10%] left-[20%] drop-shadow-lg opacity-60 blur-[2px]"
            delay={0.4}
            floatDuration={4}
            yRange={['-8%', '8%']}
            rotateRange={[-10, 10]}
          />
          {/* Gold Flakes — repositioned to bottom-centre area */}
          <FloatingTopping
            src="/images/gold_flakes.webp"
            alt="Gold Flakes"
            className="w-16 md:w-28 bottom-[15%] left-[35%] opacity-40 blur-[3px]"
            delay={0.6}
            floatDuration={5}
          />
        </motion.div>

        <motion.div style={{ y: toppingY2 }} className="absolute inset-0 pointer-events-none">
          {/* Mint Leaf — middle-right */}
          <FloatingTopping
            src="/images/mint_leaf.webp"
            alt="Floating Mint Leaf"
            className="w-16 md:w-24 top-[50%] right-[15%] drop-shadow-md opacity-50 blur-[1px]"
            delay={0.5}
            floatDuration={3.5}
            yRange={['-12%', '12%']}
            rotateRange={[0, -15]}
          />
        </motion.div>

        <motion.div style={{ y: toppingY3 }} className="absolute inset-0 pointer-events-none">
          {/* Chocolate Curl — middle-left area */}
          <FloatingTopping
            src="/images/chocolate_curl.webp"
            alt="Floating Chocolate Curl"
            className="w-20 md:w-32 top-[40%] left-[12%] drop-shadow-lg opacity-60 blur-[2px]"
            delay={0.7}
            floatDuration={4.5}
            yRange={['-6%', '6%']}
            rotateRange={[-8, 8]}
          />
        </motion.div>

        <motion.div style={{ y: toppingY4 }} className="absolute inset-0 pointer-events-none">
          {/* Sprinkles Mix — right of strawberry */}
          <FloatingTopping
            src="/images/sprinkles_mix.webp"
            alt="Floating Sprinkles Mix"
            className="w-24 md:w-40 top-[12%] left-[45%] opacity-40 blur-[4px]"
            delay={0.9}
            floatDuration={3}
            yRange={['-10%', '10%']}
            rotateRange={[-20, 20]}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ y: indicatorY, opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs font-sans tracking-widest text-plum uppercase">Explore</span>
        <motion.div
          className="w-[1px] h-12 bg-plum origin-top"
          animate={{ scaleY: [0, 1, 0], translateY: [0, 0, 24] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
