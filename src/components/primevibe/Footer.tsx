import { Logo } from "./Logo";
import { Instagram, Facebook } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Footer = () => {
  const { t } = useT();
  return (
  <footer className="bg-onyx text-bone/70 border-t border-bone/10">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Logo className="text-bone" />
        <p className="mt-4 max-w-sm text-sm">{t("footer.tagline")}</p>
        <div className="mt-6 flex gap-3">
          <a href="#" aria-label="Instagram" className="size-10 inline-flex items-center justify-center border border-bone/20 hover:border-gold hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="size-10 inline-flex items-center justify-center border border-bone/20 hover:border-gold hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bone/45 mb-4">{t("footer.explore")}</div>
        <ul className="space-y-2 text-sm">
          <li><a href="#fleet" className="hover:text-gold">{t("nav.fleet")}</a></li>
          <li><a href="#airport" className="hover:text-gold">{t("airport.eyebrow")}</a></li>
          <li><a href="#destinations" className="hover:text-gold">{t("nav.destinations")}</a></li>
          <li><a href="#services" className="hover:text-gold">{t("nav.services")}</a></li>
        </ul>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bone/45 mb-4">{t("footer.contact")}</div>
        <ul className="space-y-2 text-sm">
          <li><a href="tel:+995595140106" className="hover:text-gold">+995 595 14 01 06</a></li>
          <li><a href="mailto:chigladze.a@gmail.com" className="hover:text-gold">chigladze.a@gmail.com</a></li>
          <li>{t("footer.based")}</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-bone/10">
      <div className="container py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-bone/45">
        <span>© {new Date().getFullYear()} Drivero. {t("footer.rights")}</span>
        <span>{t("footer.crafted")}</span>
      </div>
    </div>
  </footer>
  );
};