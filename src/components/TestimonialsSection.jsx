import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { testimonialsData } from '../data/testimonialsData';
import { TestimonialCard } from './TestimonialCard';

export function TestimonialsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Background shifts upward slower than scroll (classic parallax)
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  // Title slides in from bottom on enter, out from top on exit
  const titleY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [50, 0, 0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Cards: left card enters from left, right card from right. Both reverse on exit.
  const card1X = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [-60, 0, 0, 60]);
  const card2X = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [60, 0, 0, -60]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <section
      id="reviews"
      ref={ref}
      className="w-full py-24 md:py-40 relative z-20 overflow-hidden"
    >
      {/* Parallax background layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-plum -z-10 scale-110"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Parallax Title */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="font-display text-4xl md:text-5xl text-pearl mb-6">Words of Delight</h2>
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
          <p className="font-sans text-pearl/70 text-sm md:text-base">
            Hear from those who have experienced our creations firsthand.
          </p>
        </motion.div>

        {/* Cards with opposing parallax entry/exit */}
        <motion.div
          style={{ opacity: cardsOpacity }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          {testimonialsData.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              style={{ x: i === 0 ? card1X : card2X }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
