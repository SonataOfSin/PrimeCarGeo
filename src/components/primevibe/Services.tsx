import { SectionHead } from "./Fleet";
import { Plane, Building2, Mountain, Wine, Calendar, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

const S = [
  { icon: Plane, tk: "svc.airport.t", dk: "svc.airport.d" },
  { icon: Building2, tk: "svc.exec.t", dk: "svc.exec.d" },
  { icon: Mountain, tk: "svc.tours.t", dk: "svc.tours.d" },
  { icon: Wine, tk: "svc.wine.t", dk: "svc.wine.d" },
  { icon: Calendar, tk: "svc.events.t", dk: "svc.events.d" },
  { icon: Sparkles, tk: "svc.concierge.t", dk: "svc.concierge.d" },
];

export const Services = () => {
  const { t } = useT();
  return (
  <section id="services" className="reveal py-24 md:py-32 bg-bone text-onyx">
    <div className="container">
      <SectionHead eyebrow={t("svc.eyebrow")} title={t("svc.title")} light />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-onyx/10 border border-onyx/10">
        {S.map(({ icon: Icon, tk, dk }) => (
          <div key={tk} className="bg-bone p-8 hover:bg-onyx hover:text-bone group transition-colors duration-500">
            <Icon className="h-7 w-7 text-gold" aria-hidden />
            <h3 className="mt-6 font-display text-2xl">{t(tk)}</h3>
            <p className="mt-3 text-sm text-onyx/70 group-hover:text-bone/70 transition-colors">{t(dk)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};