import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { requestBooking } from "@/lib/bookingBus";
import { VehicleCard, type VehicleCardLabels, type VehicleDisplayData } from "@/components/primevibe/VehicleCard";
import { FLEET_VEHICLES, type FleetVehicle } from "@/data/fleet.mock";

export const Fleet = () => {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.85), behavior: "smooth" });

  const labels: VehicleCardLabels = {
    from: t("fleet.card.from"),
    view: t("fleet.card.view"),
    book: t("fleet.book"),
    passengers: t("fleet.card.passengers"),
    luggage: t("fleet.card.luggage"),
    features: t("fleet.card.features"),
    indicative: t("fleet.card.indicative"),
    unit: t("fleet.card.unit"),
  };

  const toDisplay = (v: FleetVehicle): VehicleDisplayData => ({
    id: v.id,
    name: v.name,
    year: v.year,
    category: t(v.categoryKey),
    description: t(v.blurbKey),
    features: v.featureKeys.map((key) => t(key)),
    image: v.image,
    imageAlt: v.name,
    imageWidth: v.imageWidth,
    imageHeight: v.imageHeight,
    passengers: v.passengers,
    luggage: v.luggage,
    price: { amount: v.priceFrom, currency: v.currency },
  });

  return (
    <section id="fleet" className="reveal py-24 md:py-32 bg-onyx text-bone">
      <div className="container">
        <SectionHead eyebrow={t("fleet.eyebrow")} title={t("fleet.title")} />
        <div className="mt-12 flex items-center justify-between">
          <p className="text-bone/70 max-w-md text-sm md:text-base">{t("fleet.lede")}</p>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} aria-label={t("fleet.prev")} className="size-11 inline-flex items-center justify-center border border-bone/20 hover:border-gold hover:text-gold transition-colors"><ChevronLeft /></button>
            <button onClick={() => scroll(1)} aria-label={t("fleet.next")} className="size-11 inline-flex items-center justify-center border border-bone/20 hover:border-gold hover:text-gold transition-colors"><ChevronRight /></button>
          </div>
        </div>
      </div>
      <div ref={ref} className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[max(1.5rem,calc((100vw-1400px)/2+2rem))]">
        {FLEET_VEHICLES.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            className="snap-start shrink-0 w-[85vw] sm:w-[480px] md:w-[560px]"
            data={toDisplay(vehicle)}
            labels={labels}
            onBook={() => requestBooking({ vehicle: vehicle.bookingRef })}
          />
        ))}
      </div>
    </section>
  );
};

export const SectionHead = ({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) => (
  <div className={`max-w-3xl ${light ? "text-onyx" : ""}`}>
    <div className="flex items-center gap-3">
      <span className="h-px w-10 bg-gold" />
      <span className="text-[11px] uppercase tracking-[0.4em] text-gold">{eyebrow}</span>
    </div>
    <h2 className="mt-5 font-display text-4xl md:text-6xl leading-[1] text-balance">{title}</h2>
  </div>
);
