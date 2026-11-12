import tbilisi from "@/assets/dest-tbilisi.jpg";
import kazbegi from "@/assets/dest-kazbegi.jpg";
import kakheti from "@/assets/dest-kakheti.jpg";
import borjomi from "@/assets/dest-borjomi.jpg";
import batumi from "@/assets/dest-batumi.jpg";
import { SectionHead } from "./Fleet";
import { useT } from "@/lib/i18n";
import { requestBooking } from "@/lib/bookingBus";

const D = [
  { id: "tbilisi", img: tbilisi, dropoff: "Tbilisi", duration: "In-city", from: "Tbilisi Airport (TBS)" },
  { id: "kazbegi", img: kazbegi, dropoff: "Kazbegi (Stepantsminda)", duration: "≈ 2.5 h", from: "Tbilisi" },
  { id: "kakheti", img: kakheti, dropoff: "Kakheti Wine Region", duration: "≈ 2 h", from: "Tbilisi" },
  { id: "borjomi", img: borjomi, dropoff: "Borjomi", duration: "≈ 2 h", from: "Tbilisi" },
  { id: "batumi", img: batumi, dropoff: "Batumi", duration: "≈ 5 h", from: "Tbilisi" },
];

export const Destinations = () => {
  const { t } = useT();
  return (
  <section id="destinations" className="reveal py-24 md:py-32 bg-onyx text-bone">
    <div className="container">
      <SectionHead eyebrow={t("dest.eyebrow")} title={t("dest.title")} />
    </div>
    <div className="container mt-12 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-[280px] md:auto-rows-[340px]">
      {D.map((d, i) => (
        <div
          key={d.id}
          className={`group relative overflow-hidden block ${
            i < 2 ? "md:col-span-3" : "md:col-span-2"
          }`}
        >
          <img src={d.img} alt={t(`dest.${d.id}.name`)} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{t(`dest.${d.id}.tag`)}</span>
            <h3 className="mt-2 font-display text-3xl md:text-4xl">{t(`dest.${d.id}.name`)}</h3>
            <p className="mt-2 text-sm text-bone/75 max-w-sm">{t(`dest.${d.id}.blurb`)}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-bone/55">{d.duration} from {d.from}</span>
              <button
                type="button"
                onClick={() => requestBooking({ pickup: d.from, dropoff: d.dropoff, service_type: "tour" })}
                className="inline-flex items-center h-11 px-5 border border-bone/30 text-[10px] uppercase tracking-[0.25em] hover:bg-gold hover:text-onyx hover:border-gold transition-colors"
              >
                Request this transfer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
};