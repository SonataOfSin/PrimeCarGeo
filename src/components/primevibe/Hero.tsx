import hero from "@/assets/hero-vclass.jpg";
import { Plane, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { useT } from "@/lib/i18n";

const TRUST = [
  { icon: Plane, key: "trust.flight" },
  { icon: BadgeCheck, key: "trust.meet" },
  { icon: ShieldCheck, key: "trust.price" },
  { icon: Clock, key: "trust.support" },
];

export const Hero = () => {
  const { t } = useT();
  return (
  <section id="top" className="relative isolate min-h-dvh w-full overflow-hidden bg-onyx text-bone">
    <div className="absolute inset-0">
      <img
        src={hero}
        alt="Black Mercedes-Benz V-Class on a cobblestone street in Tbilisi at night"
        width={1920}
        height={1080}
        className="size-full object-cover animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx" />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/80 via-transparent to-transparent" />
    </div>

    <div className="relative container min-h-dvh flex flex-col justify-end md:justify-center pt-28 pb-56 md:pb-48 lg:pb-40">
      <div className="max-w-2xl animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-gold" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold">{t("hero.eyebrow")}</span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
          {t("hero.title.1")} <em className="not-italic text-gold">{t("hero.title.quietly")}</em>.
          <br /> {t("hero.title.2")} <em className="italic font-light">{t("hero.title.beautifully")}</em>.
        </h1>
        <p className="mt-6 max-w-xl text-base md:text-lg text-bone/75 leading-relaxed">
          {t("hero.lede")}
        </p>
      </div>

      <ul className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/10 max-w-4xl">
        {TRUST.map(({ icon: Icon, key }) => (
          <li key={key} className="bg-onyx/60 backdrop-blur px-3 py-5 flex flex-col items-center justify-center gap-2 text-center min-h-[84px]">
            <Icon className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-bone/85 leading-tight">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};