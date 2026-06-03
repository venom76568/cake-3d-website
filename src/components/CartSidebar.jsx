import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/useCart';
import { useOrders } from '../hooks/useOrders';

export function CartSidebar() {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { addOrder } = useOrders();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    // Create one order entry per cart item
    await Promise.all(
      items.map((item) =>
        addOrder({
          customerName: data.customerName,
          phone: data.phone,
          notes: data.notes || '',
          cakeName: item.name,
          quantity: item.quantity,
          priceAtOrder: item.priceRaw || 0,
        })
      )
    );
    clearCart();
    reset();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 bg-plum/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer — slides from right */}
          <motion.aside
            key="cart-drawer"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            {success ? (
              /* Success State */
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full bg-plum flex items-center justify-center"
                >
                  <span className="text-gold text-4xl">✓</span>
                </motion.div>
                <h2 className="font-display text-3xl text-plum">Order Placed!</h2>
                <p className="font-sans text-sm text-plum/60">
                  Your order has been received. We&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-mist shrink-0">
                  <div className="flex items-center gap-3">
                    <h2 className="font-display text-xl text-plum">Your Cart</h2>
                    {totalItems > 0 && (
                      <span className="bg-plum text-pearl text-xs font-sans w-5 h-5 rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-plum/40 hover:text-plum transition-colors text-2xl leading-none"
                    aria-label="Close cart"
                  >
                    ×
                  </button>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <span className="text-5xl opacity-20">◈</span>
                    <p className="font-display text-2xl text-plum/30">Your cart is empty</p>
                    <p className="font-sans text-xs text-plum/30">
                      Add a cake from the collection to get started
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2.5 border border-plum text-plum font-sans text-xs uppercase tracking-widest hover:bg-plum hover:text-pearl transition-colors"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-4 p-3 bg-mist/50 border border-mist"
                          >
                            {/* Image */}
                            <div className="w-16 h-16 shrink-0 bg-pearl border border-mist overflow-hidden flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => { e.currentTarget.style.opacity = '0.2'; }}
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-sm text-plum truncate">{item.name}</p>
                              <p className="font-sans text-xs text-plum/50 mt-0.5">{item.price} each</p>

                              {/* Qty Controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 border border-plum/20 text-plum text-sm flex items-center justify-center hover:bg-plum hover:text-pearl transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="font-sans text-sm text-plum w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 border border-plum/20 text-plum text-sm flex items-center justify-center hover:bg-plum hover:text-pearl transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Line total + remove */}
                            <div className="shrink-0 flex flex-col items-end justify-between">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-plum/30 hover:text-dusty-rose transition-colors text-lg leading-none"
                                aria-label="Remove item"
                              >
                                ×
                              </button>
                              <span className="font-sans text-sm font-semibold text-plum">
                                ₹{((item.priceRaw || 0) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Order Form + Total */}
                    <div className="shrink-0 border-t border-mist px-6 py-5 bg-cream flex flex-col gap-4">
                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs uppercase tracking-widest text-plum/60">
                          Total ({totalItems} item{totalItems !== 1 ? 's' : ''})
                        </span>
                        <span className="font-display text-2xl text-plum font-bold">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-sans text-[10px] uppercase tracking-widest text-plum/60">
                              Name *
                            </label>
                            <input
                              {...register('customerName', { required: 'Required' })}
                              className="border border-plum/20 bg-pearl px-3 py-2 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                              placeholder="Ananya"
                            />
                            {errors.customerName && (
                              <span className="text-[10px] text-red-500">{errors.customerName.message}</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-sans text-[10px] uppercase tracking-widest text-plum/60">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              {...register('phone', { required: 'Required' })}
                              className="border border-plum/20 bg-pearl px-3 py-2 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                              placeholder="9876543210"
                            />
                            {errors.phone && (
                              <span className="text-[10px] text-red-500">{errors.phone.message}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[10px] uppercase tracking-widest text-plum/60">
                            Notes (optional)
                          </label>
                          <textarea
                            {...register('notes')}
                            rows={2}
                            className="border border-plum/20 bg-pearl px-3 py-2 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors resize-none"
                            placeholder="Special requests, delivery address…"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-plum text-pearl font-sans text-sm uppercase tracking-widest py-4 hover:bg-plum/80 disabled:opacity-50 transition-colors mt-1"
                        >
                          {isSubmitting ? 'Placing Order…' : `Place Order · ₹${totalPrice.toLocaleString()}`}
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
