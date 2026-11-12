export const Logo = ({ className = "" }: { className?: string }) => (
  <a href="#top" className={`group inline-flex items-baseline gap-2 ${className}`} aria-label="Drivero — home">
    <span className="font-display text-2xl tracking-tight">Driv<span className="text-gold">e</span>ro</span>
    <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] opacity-60">Georgia</span>
  </a>
);