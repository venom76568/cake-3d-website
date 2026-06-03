export function EmptyPlate({ image }) {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/5] flex items-center justify-center bg-mist/30 border border-mist">
      <img
        src={image}
        alt="Empty Plate"
        className="w-[60%] opacity-40 object-contain drop-shadow-sm"
        loading="lazy"
      />
      <span className="absolute bottom-8 font-sans text-xs uppercase tracking-widest text-plum/40">
        Your Next Favorite
      </span>
    </div>
  );
}
