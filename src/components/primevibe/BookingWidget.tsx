import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, Calendar, Users, MessageCircle, Car, Briefcase, Plane, Check, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { bookingWhatsappUrl } from "@/lib/whatsapp";
import { useT } from "@/lib/i18n";
import { onBookingPrefill } from "@/lib/bookingBus";
import { bookingSchema, createBooking, SERVICE_TYPES, VEHICLES, type BookingInput } from "@/services/bookings";

const GEORGIA_LOCATIONS = [
  "Tbilisi", "Tbilisi Airport (TBS)", "Kutaisi", "Kutaisi Airport (KUT)", "Batumi", "Batumi Airport (BUS)",
  "Kazbegi (Stepantsminda)", "Gudauri", "Bakuriani", "Borjomi", "Akhaltsikhe", "Vardzia", "Uplistsikhe",
  "Gori", "Mtskheta", "Ananuri", "Sighnaghi", "Telavi", "Kvareli", "Kakheti Wine Region", "Rustavi",
  "Zugdidi", "Mestia", "Ushguli", "Poti", "Kobuleti", "Sarpi Border", "Lagodekhi", "Chiatura", "Martvili",
  "Okatse Canyon", "Prometheus Cave",
] as const;

const SERVICE_LABELS: Record<string, string> = {
  transfer: "City transfer",
  airport: "Airport transfer",
  hourly: "Hourly / at disposal",
  tour: "Private tour",
  corporate: "Corporate",
};

const STEPS = ["Journey", "Vehicle", "Details"];

export const BookingWidget = () => {
  const { t, lang } = useT();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BookingInput>({
    service_type: "airport",
    pickup: t("book.from.default"),
    dropoff: t("book.to.default"),
    pickup_at: "",
    vehicle: "V-Class",
    passengers: 2,
    luggage: 2,
    flight_number: "",
    meet_greet: true,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    notes: "",
  });

  const set = <K extends keyof BookingInput>(k: K, v: BookingInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(
    () =>
      onBookingPrefill((p) => {
        setDone(false);
        setStep(0);
        setForm((f) => ({
          ...f,
          vehicle: (p.vehicle as BookingInput["vehicle"]) ?? f.vehicle,
          pickup: p.pickup ?? f.pickup,
          dropoff: p.dropoff ?? f.dropoff,
          service_type: (p.service_type as BookingInput["service_type"]) ?? f.service_type,
        }));
      }),
    [],
  );

  const validateStep = (s: number) => {
    const res = bookingSchema.safeParse(form);
    const fieldErrors = res.success ? {} : res.error.flatten().fieldErrors;
    const groups: string[][] = [
      ["pickup", "dropoff", "pickup_at"],
      ["vehicle", "passengers", "luggage"],
      ["customer_name", "customer_phone", "customer_email"],
    ];
    const next: Record<string, string> = {};
    for (const key of groups[s]) {
      const msg = (fieldErrors as Record<string, string[] | undefined>)[key]?.[0];
      if (msg) next[key] = msg;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validateStep(2)) return;
    setSending(true);
    try {
      await createBooking(form, lang);
      setDone(true);
      toast.success("Reservation request received. We reply within 15 minutes.");
    } catch {
      toast.error("Could not save your request — continuing on WhatsApp.");
      window.open(waUrl(), "_blank", "noopener");
    } finally {
      setSending(false);
    }
  };

  const waUrl = () =>
    bookingWhatsappUrl({
      vehicle: form.vehicle,
      from: form.pickup,
      to: form.dropoff,
      date: form.pickup_at,
      passengers: String(form.passengers),
    });

  return (
    <section id="book" className="py-24 md:py-32 bg-onyx text-bone scroll-mt-20">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold">{t("book.eyebrow")}</span>
        </div>
        <h2 className="mt-5 font-display text-4xl md:text-6xl leading-[1] text-balance">{t("book.title")}</h2>
        <p className="mt-4 text-bone/60 max-w-xl text-sm md:text-base">
          Send a reservation request in under a minute. A chauffeur coordinator confirms the vehicle, route and
          final price personally — no automated pricing, no surprises.
        </p>

        {done ? (
          <div className="mt-12 border border-gold/40 bg-gold/5 p-10 text-center">
            <Check className="mx-auto h-10 w-10 text-gold" />
            <h3 className="mt-5 font-display text-3xl">Request received</h3>
            <p className="mt-3 text-bone/70 text-sm max-w-md mx-auto">
              Thank you, {form.customer_name.split(" ")[0]}. We have your journey details and will confirm by phone or
              WhatsApp shortly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href={waUrl()}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-gold text-onyx px-7 h-12 text-xs uppercase tracking-[0.28em] hover:bg-gold/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
              <button
                onClick={() => { setDone(false); setStep(0); }}
                className="inline-flex items-center px-7 h-12 border border-bone/25 text-xs uppercase tracking-[0.28em] hover:border-gold hover:text-gold transition-colors"
              >
                New request
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-bone/12 bg-bone/[0.03]">
            <ol className="grid grid-cols-3 border-b border-bone/12 text-[10px] uppercase tracking-[0.28em]">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    className={`w-full h-14 flex items-center justify-center gap-2 transition-colors ${
                      i === step ? "text-gold bg-gold/5" : i < step ? "text-bone/70 hover:text-bone" : "text-bone/30"
                    }`}
                  >
                    <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {s}
                  </button>
                </li>
              ))}
            </ol>

            <div className="p-6 md:p-10">
              {step === 0 && (
                <div className="space-y-8">
                  <Chips
                    label="Service"
                    options={SERVICE_TYPES.map((s) => ({ value: s, label: SERVICE_LABELS[s] }))}
                    value={form.service_type}
                    onChange={(v) => set("service_type", v as BookingInput["service_type"])}
                  />
                  <div className="grid gap-6 md:grid-cols-3">
                    <Field icon={MapPin} label={t("book.from")} value={form.pickup} onChange={(v) => set("pickup", v)} listId="pv-locations" error={errors.pickup} />
                    <Field icon={MapPin} label={t("book.to")} value={form.dropoff} onChange={(v) => set("dropoff", v)} listId="pv-locations" error={errors.dropoff} />
                    <Field icon={Calendar} type="datetime-local" label={t("book.date")} value={form.pickup_at} onChange={(v) => set("pickup_at", v)} error={errors.pickup_at} />
                  </div>
                  <datalist id="pv-locations">
                    {GEORGIA_LOCATIONS.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  <Chips
                    label={t("book.vehicle")}
                    icon={Car}
                    options={VEHICLES.map((v) => ({ value: v, label: v }))}
                    value={form.vehicle}
                    onChange={(v) => set("vehicle", v as BookingInput["vehicle"])}
                  />
                  <div className="grid gap-6 md:grid-cols-3">
                    <SelectField icon={Users} label={t("book.pax")} value={String(form.passengers)} onChange={(v) => set("passengers", Number(v))} options={[1,2,3,4,5,6,7].map(String)} />
                    <SelectField icon={Briefcase} label="Luggage" value={String(form.luggage)} onChange={(v) => set("luggage", Number(v))} options={[0,1,2,3,4,5,6,7,8].map(String)} />
                    <Field icon={Plane} label="Flight number (optional)" value={form.flight_number || ""} onChange={(v) => set("flight_number", v)} />
                  </div>
                  <label className="inline-flex items-center gap-3 text-sm text-bone/80 cursor-pointer">
                    <input type="checkbox" checked={form.meet_greet} onChange={(e) => set("meet_greet", e.target.checked)} className="size-4 accent-[hsl(var(--gold))]" />
                    Meet &amp; greet in arrivals with a name sign
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Field label="Full name" value={form.customer_name} onChange={(v) => set("customer_name", v)} error={errors.customer_name} />
                    <Field label="Phone / WhatsApp" type="tel" value={form.customer_phone} onChange={(v) => set("customer_phone", v)} error={errors.customer_phone} />
                    <Field label="Email (optional)" type="email" value={form.customer_email || ""} onChange={(v) => set("customer_email", v)} error={errors.customer_email} />
                  </div>
                  <label className="block">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-bone/50 mb-2">Notes (child seat, stops, preferences)</div>
                    <textarea
                      rows={3}
                      value={form.notes || ""}
                      onChange={(e) => set("notes", e.target.value)}
                      className="w-full bg-transparent border border-bone/15 p-4 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </label>
                  <Summary form={form} />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-bone/12 p-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-[11px] uppercase tracking-[0.28em] text-bone/70 hover:text-gold disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={waUrl()}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-bone/25 text-[11px] uppercase tracking-[0.28em] hover:border-gold hover:text-gold transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> {t("book.submit")}
                </a>
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => validateStep(step) && setStep((s) => s + 1)}
                    className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-gold text-onyx text-[11px] uppercase tracking-[0.28em] hover:bg-gold/90 transition-colors"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-gold text-onyx text-[11px] uppercase tracking-[0.28em] hover:bg-gold/90 disabled:opacity-60 transition-colors"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Send request
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Summary = ({ form }: { form: BookingInput }) => (
  <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/10 text-xs">
    {[
      ["Route", `${form.pickup} → ${form.dropoff}`],
      ["When", form.pickup_at ? new Date(form.pickup_at).toLocaleString() : "—"],
      ["Vehicle", form.vehicle],
      ["Party", `${form.passengers} pax · ${form.luggage} bags`],
    ].map(([k, v]) => (
      <div key={k} className="bg-onyx p-4">
        <dt className="text-[9px] uppercase tracking-[0.28em] text-bone/45">{k}</dt>
        <dd className="mt-1 text-bone/90 leading-snug">{v}</dd>
      </div>
    ))}
  </dl>
);

function Chips({ label, options, value, onChange, icon: Icon }: {
  label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; icon?: any;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-bone/50 mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 px-4 min-h-11 text-[11px] uppercase tracking-[0.22em] border transition-colors ${
                active ? "border-gold text-gold bg-gold/5" : "border-bone/20 text-bone/55 hover:text-bone"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />} {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text", listId, error }: {
  icon?: any; label: string; value: string; onChange: (v: string) => void; type?: string; listId?: string; error?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-bone/50 mb-2">
        {Icon && <Icon className="h-3 w-3 text-gold shrink-0" />} {label}
      </div>
      <input
        type={type}
        value={value}
        list={listId}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b py-3 text-sm md:text-base focus:outline-none transition-colors ${
          error ? "border-destructive" : "border-bone/20 focus:border-gold"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function SelectField({ icon: Icon, label, value, onChange, options }: {
  icon?: any; label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-bone/50 mb-2">
        {Icon && <Icon className="h-3 w-3 text-gold shrink-0" />} {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-bone/20 py-3 text-sm md:text-base focus:outline-none focus:border-gold transition-colors"
      >
        {options.map((o) => <option key={o} value={o} className="bg-onyx">{o}</option>)}
      </select>
    </label>
  );
}
