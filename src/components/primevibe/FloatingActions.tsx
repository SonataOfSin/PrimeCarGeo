import { useEffect, useState } from "react";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { requestBooking } from "@/lib/bookingBus";
import { useT } from "@/lib/i18n";

export const FloatingActions = () => {
  const { t } = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile persistent action bar */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-bone/10 glass-dark transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href={whatsappUrl("Hello Drivero, I'd like to ask about a chauffeur booking.")}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 min-h-14 text-bone text-[11px] uppercase tracking-[0.25em]"
        >
          <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
        </a>
        <button
          onClick={() => requestBooking()}
          className="inline-flex items-center justify-center gap-2 min-h-14 bg-gold text-onyx text-[11px] uppercase tracking-[0.25em]"
        >
          <CalendarCheck className="h-4 w-4" /> {t("cta.book")}
        </button>
      </div>

      {/* Desktop floating reserve */}
      <button
        onClick={() => requestBooking()}
        className={`hidden md:inline-flex fixed bottom-8 right-8 z-40 items-center justify-center h-12 px-6 bg-gold text-onyx text-xs uppercase tracking-[0.25em] shadow-gold ring-1 ring-onyx/20 hover:scale-105 transition-all duration-300 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {t("cta.reserve")}
      </button>
    </>
  );
};
