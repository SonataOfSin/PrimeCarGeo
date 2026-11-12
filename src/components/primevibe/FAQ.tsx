import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead } from "./Fleet";
import { useT } from "@/lib/i18n";

const IDS = [1, 2, 3, 4, 5, 6];

export const FAQ = () => {
  const { t } = useT();
  return (
  <section className="reveal py-24 md:py-32 bg-bone text-onyx">
    <div className="container grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <SectionHead eyebrow={t("faq.eyebrow")} title={t("faq.title")} light />
      </div>
      <div className="lg:col-span-7">
        <Accordion type="single" collapsible className="w-full">
          {IDS.map((i) => (
            <AccordionItem key={i} value={`i-${i}`} className="border-onyx/15">
              <AccordionTrigger className="text-left font-display text-xl md:text-2xl hover:text-gold hover:no-underline py-6">
                {t(`faq.${i}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-onyx/70 text-base leading-relaxed pb-6">{t(`faq.${i}.a`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
  );
};