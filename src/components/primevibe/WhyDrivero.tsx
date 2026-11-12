import { SectionHead } from "./Fleet";
import { ShieldCheck, Clock3, Languages, Receipt, Route, HeartHandshake } from "lucide-react";

const REASONS = [
  { icon: Clock3, t: "Punctual by design", d: "Flights tracked in real time, 60 minutes of complimentary waiting, and a chauffeur on site before you land." },
  { icon: ShieldCheck, t: "Vetted chauffeurs", d: "Licensed, background-checked professionals in a suit — not a ride-hailing driver in a hatchback." },
  { icon: Receipt, t: "Fixed, transparent pricing", d: "The price confirmed at booking is the price you pay. No surge, no night surcharge, no detour billing." },
  { icon: Languages, t: "English & Russian spoken", d: "Clear communication from first message to final drop-off, 24 hours a day." },
  { icon: Route, t: "Georgia end to end", d: "Tbilisi, Kutaisi, Batumi, Kazbegi, Kakheti, Svaneti — one operator for the whole itinerary." },
  { icon: HeartHandshake, t: "One point of contact", d: "A coordinator who knows your booking, your preferences and your schedule — reachable on WhatsApp." },
];

export const WhyDrivero = () => (
  <section id="why" className="reveal py-24 md:py-32 bg-bone text-onyx">
    <div className="container">
      <SectionHead eyebrow="Why Drivero" title="The difference is in what never goes wrong." light />
      <div className="mt-12 grid gap-px bg-onyx/10 border border-onyx/10 md:grid-cols-2 lg:grid-cols-3">
        {REASONS.map(({ icon: Icon, t, d }) => (
          <div key={t} className="bg-bone p-8">
            <Icon className="h-6 w-6 text-gold" aria-hidden />
            <h3 className="mt-6 font-display text-2xl">{t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-onyx/70">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
