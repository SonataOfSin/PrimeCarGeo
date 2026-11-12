import { useId } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Briefcase, Users, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * VehicleCard — premium fleet card for the dark (onyx) sections.
 *
 * Pure presentational component: all copy is passed in pre-localized via
 * `vehicle` + `labels`, so it works with the site's i18n dictionary or any
 * CMS/backend data source. "View Vehicle" (photo or CTA) opens an in-page
 * details dialog built on the existing Radix primitive; booking is delegated
 * to the parent via `onBook` so the card stays decoupled from booking flow.
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
  /** Primary CTA, e.g. "View Vehicle" */
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
  /** Accessible label for the details-dialog close control */
  close: string;
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
  close: "Close",
};

export interface VehicleCardProps {
  vehicle: VehicleDisplayData;
  /** Localized labels; overrides the English defaults key by key. */
  labels?: Partial<VehicleCardLabels>;
  /** Called by both booking actions; omit to hide the inline booking link. */
  onBook?: () => void;
  className?: string;
}

const formatAmount = (amount: number) => new Intl.NumberFormat("en-US").format(amount);

const imageAltText = (vehicle: VehicleDisplayData) =>
  vehicle.imageAlt || `${vehicle.name}${vehicle.year ? ` (${vehicle.year})` : ""}`;

/* -------------------------------------------------------------------------- */
/*  Shared building blocks (used by the card and the details dialog)          */
/* -------------------------------------------------------------------------- */

const Specs = ({
  vehicle,
  labels,
  className,
}: {
  vehicle: VehicleDisplayData;
  labels: VehicleCardLabels;
  className?: string;
}) => (
  <dl className={cn("grid grid-cols-2 divide-x divide-bone/10 border-y border-bone/10", className)}>
    <div className="flex items-center gap-3 py-3.5 pr-4">
      <Users className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <div>
        <dt className="text-[10px] uppercase tracking-[0.2em] text-bone/60">{labels.passengers}</dt>
        <dd className="mt-1 font-display text-xl leading-none text-bone">{vehicle.passengers}</dd>
      </div>
    </div>
    <div className="flex items-center gap-3 py-3.5 pl-4">
      <Briefcase className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <div>
        <dt className="text-[10px] uppercase tracking-[0.2em] text-bone/60">{labels.luggage}</dt>
        <dd className="mt-1 font-display text-xl leading-none text-bone">{vehicle.luggage}</dd>
      </div>
    </div>
  </dl>
);

const FeatureList = ({ features, className }: { features: string[]; className?: string }) => (
  <ul className={cn("space-y-2", className)}>
    {features.map((feature) => (
      <li key={feature} className="flex items-start gap-2.5 text-sm leading-snug text-bone/75">
        <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold/90" />
        {feature}
      </li>
    ))}
  </ul>
);

const Price = ({
  price,
  labels,
  className,
}: {
  price: VehiclePrice;
  labels: VehicleCardLabels;
  className?: string;
}) => (
  <div className={className}>
    <span className="block text-[10px] uppercase tracking-[0.3em] text-bone/60">{labels.from}</span>
    <div className="mt-1 flex items-baseline justify-between gap-3">
      <p className="font-display text-4xl leading-none text-gold">
        {formatAmount(price.amount)}
        <span className="ml-1 text-2xl">{price.currency}</span>
      </p>
      <span className="text-[11px] text-bone/60">{labels.unit}</span>
    </div>
    <p className="mt-1.5 text-[11px] leading-snug text-bone/60">{labels.indicative}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Details dialog                                                            */
/* -------------------------------------------------------------------------- */

const VehicleDetailsDialog = ({
  vehicle,
  labels,
  onBook,
}: {
  vehicle: VehicleDisplayData;
  labels: VehicleCardLabels;
  onBook?: () => void;
}) => (
  <DialogPortal>
    <DialogOverlay className="bg-onyx/85 backdrop-blur-sm" />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 flex max-h-[92dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden border border-bone/15 bg-onyx text-bone shadow-luxe duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
      )}
    >
      <div className="relative shrink-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]">
          <img
            src={vehicle.image}
            alt={imageAltText(vehicle)}
            width={vehicle.imageWidth}
            height={vehicle.imageHeight}
            decoding="async"
            className="size-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/15 to-transparent"
          />
        </div>

        <span className="absolute left-5 top-5 bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-onyx md:left-8 md:top-8">
          {vehicle.category}
        </span>

        <DialogClose asChild>
          <button
            type="button"
            aria-label={labels.close}
            className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-bone/20 bg-onyx/70 text-bone backdrop-blur-md transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:right-5 md:top-5"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </DialogClose>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 md:p-10">
        <DialogTitle className="font-display text-3xl leading-tight text-balance md:text-4xl">
          {vehicle.name}
          {vehicle.year && (
            <span className="ml-2 align-middle font-sans text-lg font-normal text-gold">
              ({vehicle.year})
            </span>
          )}
        </DialogTitle>
        <DialogDescription className="mt-3 max-w-xl text-sm leading-relaxed text-bone/70">
          {vehicle.description}
        </DialogDescription>

        <div aria-hidden="true" className="gold-rule my-6" />

        <Specs vehicle={vehicle} labels={labels} />

        <div className="mt-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-bone/60">{labels.features}</h3>
          <FeatureList features={vehicle.features} className="mt-3" />
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-bone/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <Price price={vehicle.price} labels={labels} />
          <DialogClose asChild>
            <button
              type="button"
              onClick={onBook}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-gradient-gold px-8 text-[11px] uppercase tracking-[0.25em] text-onyx transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx motion-reduce:transition-none"
            >
              {labels.book}
            </button>
          </DialogClose>
        </div>
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
);

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

export const VehicleCard = ({ vehicle, labels: labelOverrides, onBook, className }: VehicleCardProps) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const titleId = useId();

  return (
    <Dialog>
      <article
        aria-labelledby={titleId}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden border border-bone/10 bg-bone/[0.04]",
          "transition-[transform,border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:border-gold/40 hover:bg-bone/[0.055] hover:shadow-luxe",
          "motion-safe:hover:-translate-y-1 motion-reduce:transition-none",
          className,
        )}
      >
        {/* Gold hairline sweep along the top edge on hover */}
        <span
          aria-hidden="true"
          className="gold-rule absolute inset-x-0 top-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        />

        {/* Photograph — also opens the details dialog */}
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`${labels.view}: ${vehicle.name}`}
            className="relative block w-full cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <img
                src={vehicle.image}
                alt={imageAltText(vehicle)}
                width={vehicle.imageWidth}
                height={vehicle.imageHeight}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-105 motion-reduce:transition-none"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-onyx opacity-70" />
              <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-onyx">
                {vehicle.category}
              </span>
            </span>
          </button>
        </DialogTrigger>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <h3 id={titleId} className="font-display text-2xl leading-tight md:text-3xl">
            {vehicle.name}
            {vehicle.year && (
              <span className="ml-2 align-middle font-sans text-base font-normal text-gold">
                ({vehicle.year})
              </span>
            )}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-bone/70">{vehicle.description}</p>

          <Specs vehicle={vehicle} labels={labels} className="mt-5" />

          <div className="mt-5">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-bone/60">{labels.features}</h4>
            <FeatureList features={vehicle.features} className="mt-3" />
          </div>

          {/* Price + actions, pinned to the bottom */}
          <div className="mt-auto pt-6">
            <div className="border-t border-bone/10 pt-5">
              <Price price={vehicle.price} labels={labels} />
            </div>

            <DialogTrigger asChild>
              <button
                type="button"
                className="group/btn mt-6 inline-flex h-12 w-full items-center justify-center gap-3 border border-gold/50 bg-gold/10 px-5 text-[11px] uppercase tracking-[0.25em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-onyx hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx motion-reduce:transition-none"
              >
                {labels.view}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/btn:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </button>
            </DialogTrigger>

            {onBook && (
              <button
                type="button"
                onClick={onBook}
                className="mt-3 inline-flex h-9 w-full items-center justify-center text-[10px] uppercase tracking-[0.25em] text-bone/60 underline decoration-bone/25 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx motion-reduce:transition-none"
              >
                {labels.book}
              </button>
            )}
          </div>
        </div>
      </article>

      <VehicleDetailsDialog vehicle={vehicle} labels={labels} onBook={onBook} />
    </Dialog>
  );
};
