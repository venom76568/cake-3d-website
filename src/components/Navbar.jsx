import { useState } from 'react';
import { useScrollNavbar } from '../hooks/useScrollNavbar';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const isScrolled = useScrollNavbar(80);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['Featured', 'Menu', 'Reviews', 'Order'];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-cream/95 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="font-display font-bold text-2xl text-plum tracking-tight relative z-50">
            Artisan<span className="text-gold italic">.</span>
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-sans text-sm font-medium text-plum/80 hover:text-plum transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-end gap-1.5 p-2 relative z-50 w-10 h-10" 
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`h-[2px] bg-plum block transition-all duration-300 ease-out ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`}></span>
            <span className={`h-[2px] bg-plum block transition-all duration-300 ease-out ${isMobileMenuOpen ? 'w-6 opacity-0' : 'w-6'}`}></span>
            <span className={`h-[2px] bg-plum block transition-all duration-300 ease-out ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-4'}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-xl flex flex-col items-center justify-center min-h-screen"
          >
            <nav className="flex flex-col items-center gap-10">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-4xl text-plum hover:text-gold transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
