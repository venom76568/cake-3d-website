import { motion } from 'framer-motion';
import { useCart } from '../context/useCart';

export function MenuItem({ item, index }) {
  const { addToCart } = useCart();
  const isEven = index % 2 === 0;
  const xEntry = isEven ? -40 : 40;

  return (
    <motion.div
      initial={{ opacity: 0, x: xEntry, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col group"
    >
      <div className="relative w-full aspect-[4/3] bg-mist overflow-hidden mb-5 border border-border/30">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-lg"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
        />
        <div className="absolute inset-0 bg-plum/0 group-hover:bg-plum/5 transition-colors duration-500" />
      </div>

      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="min-w-0">
          <h4 className="font-display text-lg text-plum mb-1.5 group-hover:text-gold transition-colors duration-300">
            {item.name}
          </h4>
          <p className="font-sans text-sm text-plum/70 line-clamp-2">{item.description}</p>
        </div>
        <span className="font-sans font-semibold text-plum shrink-0">{item.price}</span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(item)}
        className="w-full border border-plum text-plum font-sans text-xs uppercase tracking-widest py-3 mt-auto group-hover:bg-plum group-hover:text-pearl transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <span className="text-base leading-none">+</span>
        Add to Cart
      </button>

      {/* Animated underline */}
      <div className="mt-4 h-[1px] bg-plum/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 w-full bg-gold origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
