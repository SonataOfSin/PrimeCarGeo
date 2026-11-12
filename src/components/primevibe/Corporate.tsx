import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { SectionHead } from "./Fleet";
import { corporateSchema, createCorporateInquiry, type CorporateInput } from "@/services/bookings";

const POINTS = [
  "Monthly consolidated invoicing in GEL, USD or EUR",
  "Priority dispatch for board members and visiting delegations",
  "Named account coordinator with a direct WhatsApp line",
  "Hotel, conference and roadshow logistics handled end to end",
];

export const Corporate = () => {
  const [f, setF] = useState<CorporateInput>({ company: "", contact_name: "", email: "", phone: "", monthly_rides: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = corporateSchema.safeParse(f);
    if (!res.success) {
      const fe = res.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, (v as string[])[0]])));
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await createCorporateInquiry(res.data);
      setSent(true);
      toast.success("Thank you — our corporate desk will be in touch.");
    } catch {
      toast.error("Could not send right now. Please email chigladze.a@gmail.com.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="corporate" className="reveal py-24 md:py-32 bg-onyx text-bone">
      <div className="container grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHead eyebrow="Corporate" title="Ground transport your executives never have to think about." />
          <p className="mt-6 text-bone/70 text-sm md:text-base leading-relaxed">
            Companies, hotels, embassies and event agencies across Georgia use Drivero as their standing ground
            transport partner. One account, one invoice, one standard of service.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-bone/85">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3"><span className="mt-2 size-1.5 bg-gold rotate-45 shrink-0" />{p}</li>
            ))}
          </ul>
        </div>

        {sent ? (
          <div className="lg:col-span-7 border border-gold/40 bg-gold/5 p-10 flex flex-col items-center justify-center text-center">
            <Check className="h-10 w-10 text-gold" />
            <h3 className="mt-5 font-display text-3xl">Enquiry received</h3>
            <p className="mt-3 text-sm text-bone/70 max-w-sm">We will send account terms and a rate card within one business day.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="lg:col-span-7 grid gap-px bg-bone/10 border border-bone/10" aria-label="Corporate enquiry">
            <div className="grid md:grid-cols-2 gap-px bg-bone/10">
              <In label="Company" value={f.company} onChange={(v) => setF({ ...f, company: v })} error={errors.company} />
              <In label="Contact name" value={f.contact_name} onChange={(v) => setF({ ...f, contact_name: v })} error={errors.contact_name} />
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-bone/10">
              <In label="Work email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} error={errors.email} />
              <In label="Phone" type="tel" value={f.phone || ""} onChange={(v) => setF({ ...f, phone: v })} />
            </div>
            <In label="Estimated rides per month" value={f.monthly_rides || ""} onChange={(v) => setF({ ...f, monthly_rides: v })} />
            <label className="bg-onyx p-6 block">
              <div className="text-[10px] uppercase tracking-[0.3em] text-bone/55 mb-2">Requirements</div>
              <textarea
                rows={4}
                value={f.notes || ""}
                onChange={(e) => setF({ ...f, notes: e.target.value })}
                className="w-full bg-transparent border-0 p-0 text-base focus:outline-none placeholder:text-bone/35"
                placeholder="Routes, vehicle preferences, billing entity…"
              />
            </label>
            <button type="submit" disabled={sending} className="bg-gold text-onyx h-14 text-xs uppercase tracking-[0.3em] hover:bg-gold/90 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2">
              {sending && <Loader2 className="h-4 w-4 animate-spin" />} Request corporate account
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

function In({ label, value, onChange, type = "text", error }: { label: string; value: string; onChange: (v: string) => void; type?: string; error?: string }) {
  return (
    <label className="bg-onyx p-6 block">
      <div className="text-[10px] uppercase tracking-[0.3em] text-bone/55 mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-0 border-b p-0 pb-1 text-base focus:outline-none transition-colors ${error ? "border-destructive" : "border-transparent focus:border-gold"}`}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
