export function TestimonialCard({ testimonial }) {
  return (
    <div className="flex flex-col bg-plum border border-pearl/10 p-8 md:p-10 hover:-translate-y-2 hover:bg-white/5 hover:border-pearl/20 hover:shadow-2xl transition-all duration-500 ease-out group">
      <div className="flex gap-1 mb-8 text-gold">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      
      <p className="font-display text-lg md:text-xl text-pearl/90 leading-relaxed mb-10 flex-grow group-hover:text-pearl transition-colors duration-300">
        {testimonial.text}
      </p>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-pearl/20 bg-pearl/10 flex items-center justify-center text-pearl/30 text-xs">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = testimonial.name.charAt(0);
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-medium text-sm text-pearl tracking-wide">
            {testimonial.name}
          </span>
          <span className="font-sans text-xs text-pearl/50 tracking-widest uppercase mt-0.5">
            {testimonial.role}
          </span>
        </div>
      </div>
    </div>
  );
}
