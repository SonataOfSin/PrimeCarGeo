import { ArrowRight, Briefcase, Users } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * VehicleCard — premium fleet card for the dark (onyx) sections.
 *
 * Pure presentational component: all copy is passed in pre-localized via
 * `data`, so it works with the site's i18n dictionary or any CMS data.
 * "View Vehicle" opens an in-page details dialog (existing Radix primitive);
 * booking is delegated to the parent via `onBook`.
 */

export interface VehiclePrice {
  amount: number;
  /** Currency symbol rendered after the amount, e.g. "₾" */
  currency: string;
}

export interface VehicleDisplayData {
  id: string;
  name: string;
  year?: string;
  /** Category badge shown over the photo, e.g. "Executive" */
  category: string;
  description: string;
  /** Short feature highlights */
  features: string[];
  image: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  passengers: number;
  luggage: number;
  price: VehiclePrice;
}

export interface VehicleCardLabels {
  /** "From" — price prefix */
  from: string;
  /** Primary CTA */
  view: string;
  /** Secondary CTA (prefills the booking widget) */
  book: string;
  passengers: string;
  luggage: string;
  /** Heading above the feature list */
  features: string;
  /** Price disclaimer microcopy */
  indicative: string;
  /** Price unit, e.g. "per transfer" */
  unit: string;
}

const DEFAULT_LABELS: VehicleCardLabels = {
  from: "From",
  view: "View Vehicle",
  book: "Book this vehicle",
  passengers: "Passengers",
  luggage: "Luggage",
  features: "Highlights",
  indicative: "Indicative price — final quote on booking",
  unit: "per transfer",
};

export interface VehicleCardProps {
  data: VehicleDisplayData;
  /** Localized labels; overrides the English defaults key by key. */
  labels?: Partial<VehicleCardLabels>;
  /** Called by both "Book" actions; omit to hide the secondary CTA. */
  onBook?: () => void;
  className?: string;
}

const formatAmount = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const VehicleCard = ({ data, labels: labelOverrides, onBook, className }: VehicleCardProps) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const imageAlt = data.imageAlt || `${data.name}${data.year ? ` (${data.year})` : ""}`;

  return (
    <Dialog>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden border border-bone/10 bg-bone/[0.03]",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe",
          className,
        )}
      >
        {/* Gold hairline sweep along the top edge on hover */}
        <span
          aria-hidden="true"
          className="gold-rule absolute inset-x-0 top-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Photograph — also opens the details dialog */}
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`${labels.view} — ${data.name}`}
            className="relative block w-full cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <img
                src={data.image}
                alt={imageAlt}
                width={data.imageWidth}
                height={data.imageHeight}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-onyx opacity-60" />
              <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-onyx">
                {data.category}
              </span>
            </span>
          </button>
        </DialogTrigger>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <h3 className="font-display text-2xl leading-tight md:text-3xl">
            {data.name}
            {data.year && (
              <span className="ml-2 align-middle font-sans text-base font-normal text-gold">
                ({data.year})
              </span>
            )}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-bone/70">{data.description}</p>

          {/* Capacity */}
          <div className="mt-5 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-bone/80">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" aria-hidden="true" />
              {data.passengers} {labels.passengers}
            </span>
            <span className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gold" aria-hidden="true" />
              {data.luggage} {labels.luggage}
            </span>
          </div>

          {/* Feature highlights */}
          <ul className="mt-5 space-y-2" aria-label={labels.features}>
            {data.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-bone/75">
                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold/90" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Price + actions, pinned to the bottom */}
          <div className="mt-auto pt-7">
            <div className="border-t border-bone/10 pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-bone/50">
                    {labels.from}
                  </span>
                  <span className="mt-1 block font-display text-3xl leading-none text-gold md:text-4xl">
                    {formatAmount(data.price.amount)}
                    <span className="ml-1 text-2xl md:text-3xl">{data.price.currency}</span>
                  </span>
                </div>
                <span className="pb-1 text-right text-[11px] leading-snug text-bone/45">
                  {labels.unit}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-bone/45">{labels.indicative}</p>
            </div>

            <DialogTrigger asChild>
              <button
                type="button"
                className="group/btn mt-6 inline-flex h-12 w-full items-center justify-center gap-3 border border-gold/50 bg-gold/10 px-6 text-[11px] uppercase tracking-[0.25em] text-gold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:bg-gold hover:text-onyx hover:shadow-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {labels.view}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </DialogTrigger>

            {onBook && (
              <button
                type="button"
                onClick={onBook}
                className="mt-3 inline-flex h-9 w-full items-center justify-center text-[10px] uppercase tracking-[0.25em] text-bone/55 underline-offset-4 transition-colors hover:text-gold hover:underline hover:decoration-gold/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {labels.book}
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Details dialog */}
      <DialogContent className="max-h-[92dvh] max-w-2xl gap-0 overflow-y-auto border-bone/15 bg-onyx p-0 text-bone md:max-w-3xl [&>button]:rounded-full [&>button]:border [&>button]:border-bone/20 [&>button]:bg-onyx/70 [&>button]:p-2 [&>button]:text-bone [&>button]:backdrop-blur-md">
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1]">
          <img
            src={data.image}
            alt={imageAlt}
            width={data.imageWidth}
            height={data.imageHeight}
            className="size-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/25 to-transparent"
          />
          <span className="absolute left-6 top-6 bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-onyx md:left-8 md:top-8">
            {data.category}
          </span>
        </div>

        <div className="p-6 md:p-10">
          <DialogTitle className="font-display text-3xl leading-tight md:text-4xl">
            {data.name}
            {data.year && (
              <span className="ml-2 align-middle font-sans text-lg font-normal text-gold">
                ({data.year})
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="mt-3 max-w-xl text-sm leading-relaxed text-bone/70">
            {data.description}
          </DialogDescription>

          <div aria-hidden="true" className="gold-rule my-6" />

          {/* Capacity */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-bone/80">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" aria-hidden="true" />
              {data.passengers} {labels.passengers}
            </span>
            <span className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gold" aria-hidden="true" />
              {data.luggage} {labels.luggage}
            </span>
          </div>

          {/* Features */}
          <div className="mt-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-bone/45">
              {labels.features}
            </span>
            <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {data.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-bone/75">
                  <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold/90" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Price + booking */}
          <div className="mt-8 flex flex-col gap-5 border-t border-bone/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-bone/50">
                {labels.from}
              </span>
              <span className="mt-1 block font-display text-3xl leading-none text-gold md:text-4xl">
                {formatAmount(data.price.amount)}
                <span className="ml-1 text-2xl md:text-3xl">{data.price.currency}</span>
              </span>
              <span className="mt-1.5 block text-[11px] text-bone/45">
                {labels.unit} · {labels.indicative}
              </span>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                onClick={onBook}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-gradient-gold px-8 text-[11px] uppercase tracking-[0.25em] text-onyx transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {labels.book}
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
