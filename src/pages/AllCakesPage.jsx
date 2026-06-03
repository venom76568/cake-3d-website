import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDynamicMenu } from '../hooks/useDynamicMenu';
import { MenuItem } from '../components/MenuItem';

export function AllCakesPage() {
  const { allCakes } = useDynamicMenu();

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="w-full pt-32 pb-16 px-6 md:px-12 border-b border-mist/50 text-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-plum/50 hover:text-plum transition-colors mb-10 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          <h1 className="font-display text-5xl md:text-6xl text-plum mb-6">
            Full Collection
          </h1>
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
          <p className="font-sans text-plum/60 text-sm md:text-base max-w-xl mx-auto">
            Every cake we craft with love — browse the entire menu and add your favourites to the cart.
          </p>
        </motion.div>
      </div>

      {/* Full Cakes Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {allCakes.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-3xl text-plum/30">No cakes yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {allCakes.map((cake, index) => (
              <MenuItem key={cake.id} item={cake} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
