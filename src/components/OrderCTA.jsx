import { useState } from 'react';
import { motion } from 'framer-motion';
import { OrderModal } from './OrderModal';

export function OrderCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Sticky Floating Button */}
      <motion.button
        id="order-cta-button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-3 bg-plum text-pearl font-sans text-sm uppercase tracking-widest px-6 py-4 shadow-2xl hover:bg-plum/90 transition-colors"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Place an order"
      >
        <span className="text-gold text-base">◈</span>
        Order Now
      </motion.button>

      <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
