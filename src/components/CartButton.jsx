import { motion } from 'framer-motion';
import { useCart } from '../context/useCart';

export function CartButton() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <motion.button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3 bg-plum text-pearl font-sans text-sm uppercase tracking-widest px-6 py-4 shadow-2xl hover:bg-plum/90 transition-colors"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      aria-label="Open cart"
    >
      {/* Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Cart
      {totalItems > 0 && (
        <motion.span
          key={totalItems}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="bg-gold text-plum text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
        >
          {totalItems}
        </motion.span>
      )}
    </motion.button>
  );
}
