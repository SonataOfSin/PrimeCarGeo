import { SectionHead } from "./Fleet";
import { useT } from "@/lib/i18n";
import { requestBooking } from "@/lib/bookingBus";

export const Airport = () => {
  const { t } = useT();
  return (
  <section id="airport" className="reveal py-24 md:py-32 bg-bone text-onyx">
    <div className="container max-w-3xl">
      <div>
        <SectionHead eyebrow={t("airport.eyebrow")} title={t("airport.title")} light />
        <p className="mt-6 text-onyx/70 leading-relaxed max-w-md">{t("airport.lede")}</p>
        <ul className="mt-8 space-y-3 text-sm">
          {[t("airport.f1"), t("airport.f2"), t("airport.f3"), t("airport.f4")].map((f) => (
            <li key={f} className="flex gap-3 items-center"><span className="size-1.5 bg-gold rotate-45" />{f}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => requestBooking({ service_type: "airport", pickup: "Tbilisi Airport (TBS)", dropoff: "Tbilisi" })}
          className="mt-10 inline-flex items-center justify-center h-12 px-8 bg-onyx text-bone text-[11px] uppercase tracking-[0.28em] hover:bg-gold hover:text-onyx transition-colors"
        >
          {t("airport.cta")}
        </button>
      </div>
    </div>
  </section>
  );
};