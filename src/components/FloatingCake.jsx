import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function FloatingCake({ src, alt, layoutId, className, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: delay,
        },
      };

  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: ['-2%', '2%'],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: delay,
        },
      };

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative drop-shadow-2xl ${className}`}
      {...animationProps}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain"
        animate={floatAnimation}
        loading="lazy"
        style={{ willChange: 'transform' }}
      />
    </motion.div>
  );
}
