import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function FloatingTopping({ src, alt, className, delay = 0, floatDuration = 3, yRange = ['-5%', '5%'], rotateRange = [-5, 5] }) {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          type: 'spring',
          stiffness: 120,
          damping: 20,
          delay: delay,
        },
      };

  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: yRange,
        rotate: rotateRange,
        transition: {
          duration: floatDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: delay,
        },
      };

  return (
    <motion.div
      className={`absolute z-20 drop-shadow-xl ${className}`}
      {...animationProps}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain blur-[1px]"
        animate={floatAnimation}
        loading="lazy"
        style={{ willChange: 'transform' }}
      />
    </motion.div>
  );
}
