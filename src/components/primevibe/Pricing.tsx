import { SectionHead } from "./Fleet";
import { ArrowRight, Clock } from "lucide-react";
import { useT } from "@/lib/i18n";
import { requestBooking } from "@/lib/bookingBus";

const ROUTES = [
  { from: "TBS Airport", to: "Tbilisi City", duration: "30 min", gel: "from 50₾", usd: "$18", pickup: "Tbilisi Airport (TBS)", dropoff: "Tbilisi" },
  { from: "Tbilisi", to: "Kazbegi", duration: "2.5 h", gel: "350₾", usd: "$130", pickup: "Tbilisi", dropoff: "Kazbegi (Stepantsminda)" },
  { from: "Tbilisi", to: "Kakheti Wine Tour", duration: "3 h", gel: "400₾", usd: "$145", pickup: "Tbilisi", dropoff: "Kakheti Wine Region" },
  { from: "Tbilisi", to: "Batumi", duration: "5 h", gel: "600₾", usd: "$220", pickup: "Tbilisi", dropoff: "Batumi" },
  { from: "Multi-day", to: "Private Tour", duration: "per day", gel: "800₾", usd: "$290", pickup: "Tbilisi", dropoff: "Private tour itinerary" },
];

export const Pricing = () => {
  const { t } = useT();
  return (
  <section id="pricing" className="reveal py-24 md:py-32 bg-onyx text-bone">
    <div className="container">
      <SectionHead eyebrow={t("prices.eyebrow")} title={t("prices.title")} />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/10 border border-bone/10">
        {ROUTES.map((r) => (
          <div key={`${r.from}-${r.to}`} className="bg-onyx p-8 flex flex-col">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-bone/60">
              <span>{r.from}</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold" />
              <span>{r.to}</span>
            </div>
            <div className="mt-6 font-display text-4xl text-gold">{r.gel}</div>
            <div className="mt-1 text-sm text-bone/60">{r.usd}</div>
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-bone/55">
              <Clock className="h-3.5 w-3.5" /> {r.duration}
            </div>
            <button
              type="button"
              onClick={() => requestBooking({ pickup: r.pickup, dropoff: r.dropoff })}
              className="mt-6 inline-flex items-center justify-center h-11 px-6 border border-bone/25 text-[10px] uppercase tracking-[0.25em] hover:bg-gold hover:text-onyx hover:border-gold transition-colors self-start"
            >
              {t("prices.book")}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-bone/50 text-center">{t("prices.note")}</p>
    </div>
  </section>
  );
};