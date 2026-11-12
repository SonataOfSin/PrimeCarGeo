import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useT, type Lang } from "@/lib/i18n";

const NAV = [
  { href: "#fleet", key: "nav.fleet" },
  { href: "#airport", key: "nav.airport" },
  { href: "#destinations", key: "nav.destinations" },
  { href: "#services", key: "nav.services" },
  { href: "#corporate", key: "nav.corporate" },
  { href: "#contact", key: "nav.contact" },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "ka" as Lang, label: "GE" },
];

const LangSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useT();
  return (
    <div className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] ${className}`} role="group" aria-label="Language">
      {LANGS.map((l, i) => (
        <span key={l.code} className="inline-flex items-center">
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            className={`px-1.5 py-1 transition-colors ${lang === l.code ? "text-gold" : "text-bone/60 hover:text-bone"}`}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && <span className="text-bone/20">/</span>}
        </span>
      ))}
    </div>
  );
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useT();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between text-bone">
        <Logo className="text-bone" />
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm uppercase tracking-[0.2em] text-bone/80 hover:text-gold transition-colors">
              {t(n.key)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitcher className="hidden md:inline-flex" />
          <button
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 text-bone"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden glass-dark border-t border-white/5 animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4" aria-label="Mobile">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-bone/90 text-lg uppercase tracking-[0.2em]">
                {t(n.key)}
              </a>
            ))}
            <LangSwitcher className="mt-2" />
          </nav>
        </div>
      )}
    </header>
  );
};