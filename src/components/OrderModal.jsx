import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { useOrders } from '../hooks/useOrders';
import { useDynamicMenu } from '../hooks/useDynamicMenu';

export function OrderModal({ isOpen, onClose }) {
  const { addOrder } = useOrders();
  const { allCakes } = useDynamicMenu();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { quantity: 1 } });
  const [success, setSuccess] = useState(false);

  // useWatch is memoization-safe unlike watch()
  const selectedCakeName = useWatch({ control, name: 'cakeName' });
  const quantityRaw = useWatch({ control, name: 'quantity', defaultValue: 1 });
  const quantity = parseInt(quantityRaw || 1, 10);
  const selectedCake = allCakes.find((c) => c.name === selectedCakeName);
  const priceRaw = selectedCake?.priceRaw || 0;
  const totalPrice = priceRaw * quantity;

  const onSubmit = async (data) => {
    const cake = allCakes.find((c) => c.name === data.cakeName);
    await addOrder({
      customerName: data.customerName,
      phone: data.phone,
      cakeName: data.cakeName,
      quantity: parseInt(data.quantity, 10),
      notes: data.notes || '',
      priceAtOrder: cake?.priceRaw || 0,
    });
    setSuccess(true);
    reset();
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  const handleClose = () => {
    reset();
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-plum/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[480px] bg-cream z-50 shadow-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {success ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-plum flex items-center justify-center mb-6">
                  <span className="text-gold text-3xl">✓</span>
                </div>
                <h2 className="font-display text-3xl text-plum mb-3">Order Placed!</h2>
                <p className="font-sans text-sm text-plum/60">
                  We&apos;ve received your order and will be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-8 py-6 border-b border-mist">
                  <h2 className="font-display text-2xl text-plum">Place an Order</h2>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center text-plum/40 hover:text-plum transition-colors text-xl"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                        Your Name *
                      </label>
                      <input
                        {...register('customerName', { required: 'Required' })}
                        className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                        placeholder="Ananya"
                      />
                      {errors.customerName && (
                        <span className="text-xs text-red-500">{errors.customerName.message}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Required' })}
                        className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-500">{errors.phone.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                      Choose a Cake *
                    </label>
                    <select
                      {...register('cakeName', { required: 'Please select a cake' })}
                      className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="">Select a cake…</option>
                      {allCakes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} — {c.price}
                        </option>
                      ))}
                    </select>
                    {errors.cakeName && (
                      <span className="text-xs text-red-500">{errors.cakeName.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      {...register('quantity', { min: 1 })}
                      className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors w-24"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                      Notes (optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors resize-none"
                      placeholder="Any special requests, delivery address…"
                    />
                  </div>

                  {selectedCake && priceRaw > 0 && (
                    <div className="flex justify-between items-center py-3 border-t border-mist">
                      <span className="font-sans text-xs uppercase tracking-widest text-plum/60">
                        Estimated Total
                      </span>
                      <span className="font-display text-2xl text-plum font-bold">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-plum text-pearl font-sans text-sm uppercase tracking-widest py-4 hover:bg-plum/80 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Placing Order…' : 'Place Order'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
