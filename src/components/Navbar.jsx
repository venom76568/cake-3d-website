import { useScrollNavbar } from '../hooks/useScrollNavbar';

export function Navbar() {
  const isScrolled = useScrollNavbar(80);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="font-display font-bold text-2xl text-plum tracking-tight">
          Artisan<span className="text-gold italic">.</span>
        </a>
        <nav className="hidden md:flex gap-8">
          {['Featured', 'Menu', 'Reviews', 'Order'].map((item) => (
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
        <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span className="w-6 h-[2px] bg-plum block"></span>
          <span className="w-6 h-[2px] bg-plum block"></span>
          <span className="w-4 h-[2px] bg-plum block"></span>
        </button>
      </div>
    </header>
  );
}
