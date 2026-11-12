import { SectionHead } from "./Fleet";
import { useT } from "@/lib/i18n";

const IDS = ["1", "2", "3"];

export const Testimonials = () => {
  const { t } = useT();
  return (
  <section className="reveal py-24 md:py-32 bg-onyx text-bone">
    <div className="container">
      <SectionHead eyebrow={t("test.eyebrow")} title={t("test.title")} />
      <div className="mt-14 grid md:grid-cols-3 gap-px bg-bone/10 border border-bone/10">
        {IDS.map((id) => (
          <figure key={id} className="bg-onyx p-8 md:p-10 flex flex-col">
            <div className="flex gap-1 text-gold text-lg" aria-label="5 out of 5 stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <span aria-hidden className="font-display text-6xl text-gold leading-none">"</span>
            <blockquote className="mt-4 text-base md:text-lg leading-relaxed text-bone/85">{t(`test.${id}.q`)}</blockquote>
            <figcaption className="mt-8 pt-6 border-t border-bone/10">
              <div className="font-display text-lg">{t(`test.${id}.n`)}</div>
              <div className="text-xs uppercase tracking-[0.25em] text-bone/55 mt-1">{t(`test.${id}.r`)}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
  );
};