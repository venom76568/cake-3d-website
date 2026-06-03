import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { featuredData } from '../data/featuredData';
import { FeaturedCard } from './FeaturedCard';
import { EmptyPlate } from './EmptyPlate';

export function FeaturedSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Title slides in from left, subtitle from right — reverse parallax on exit
  const titleX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ['-12%', '0%', '0%', '12%']);
  const subtitleX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ['12%', '0%', '0%', '-12%']);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Cards stagger up on enter, reverse down on exit
  const card1Y = useTransform(scrollYProgress, [0.05, 0.3, 0.7, 0.95], [80, 0, 0, -80]);
  const card2Y = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [80, 0, 0, -80]);
  const card3Y = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.85], [80, 0, 0, -80]);
  const card4Y = useTransform(scrollYProgress, [0.2, 0.45, 0.55, 0.8], [80, 0, 0, -80]);
  const cardYTransforms = [card1Y, card2Y, card3Y, card4Y];

  return (
    <section
      id="featured"
      ref={ref}
      className="w-full py-24 md:py-40 bg-pearl relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Parallax Header */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-32 gap-6 overflow-hidden"
        >
          <div className="max-w-2xl overflow-hidden">
            <motion.h2
              style={{ x: titleX }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-plum leading-tight"
            >
              Curated Selection
            </motion.h2>
            <motion.p
              style={{ x: subtitleX }}
              className="mt-6 font-sans text-plum/70 max-w-md text-sm md:text-base leading-relaxed"
            >
              Explore our most beloved creations, where traditional techniques meet modern aesthetics.
            </motion.p>
          </div>
          <button className="px-8 py-3 border border-plum text-plum font-sans text-sm uppercase tracking-widest hover:bg-plum hover:text-pearl transition-colors duration-300">
            View All
          </button>
        </motion.div>

        {/* Cards with per-card parallax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {featuredData.map((item, index) => (
            <motion.div
              key={item.id}
              style={{ y: cardYTransforms[index] }}
              className={index % 2 !== 0 ? 'sm:mt-24' : ''}
            >
              {item.isPlaceholder ? (
                <EmptyPlate image={item.image} />
              ) : (
                <FeaturedCard item={item} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
