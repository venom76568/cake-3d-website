
export function FeaturedCard({ item }) {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/5] bg-cream group overflow-hidden flex flex-col items-center justify-center border border-mist/50">
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-warm-rose opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>
      
      {/* Image area:
          - Hero-link card: NO image rendered here — TravelingCake flies in and occupies this space.
            An invisible but fully-sized anchor div is kept so getBoundingClientRect() gives
            the correct landing coordinates. A faint ring acts as a landing indicator.
          - All other cards: render image normally. */}
      {item.layoutId ? (
        <div
          id="featured-cake-anchor"
          className="w-[70%] z-10 relative mt-[-10%] aspect-[3/4] flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* Subtle dashed ring: visible before the cake arrives, hidden once it lands */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-mist opacity-40" />
        </div>
      ) : (
        <div className="w-[70%] z-10 relative mt-[-10%] group-hover:scale-105 transition-transform duration-700 ease-out flex flex-col items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-auto drop-shadow-2xl object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-cream via-cream/80 to-transparent z-20 flex flex-col items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-display text-xl md:text-2xl text-plum text-center mb-2">
          {item.name}
        </h3>
        <span className="font-sans text-xs uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          View Details
        </span>
      </div>
    </div>
  );
}
