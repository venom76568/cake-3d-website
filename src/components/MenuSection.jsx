import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { menuData } from '../data/menuData';
import { MenuItem } from './MenuItem';

const PREVIEW_COUNT = 6;

export function MenuSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const previewCakes = menuData.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="menu"
      ref={ref}
      className="w-full py-16 md:py-32 bg-cream relative z-20 border-t border-mist/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Parallax Header */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="font-display text-4xl md:text-5xl text-plum mb-6">The Collection</h2>
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
          <p className="font-sans text-plum/70 text-sm md:text-base">
            Meticulously crafted pastries and cakes that blend seasonal ingredients with innovative
            techniques.
          </p>
        </motion.div>

        {/* 6-cake preview grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 mb-20">
          {previewCakes.map((item, index) => (
            <MenuItem key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          <p className="font-sans text-sm text-plum/50">
            Showing 6 of {menuData.length} cakes
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-3 px-10 py-4 bg-plum text-pearl font-sans text-sm uppercase tracking-widest hover:bg-plum/80 transition-colors group"
          >
            View All Cakes
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
