import { SectionHead } from "./Fleet";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Contact = () => {
  const { t } = useT();
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  return (
    <section id="contact" className="py-24 md:py-32 bg-onyx text-bone">
      <div className="container grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHead eyebrow={t("contact.eyebrow")} title={t("contact.title")} />
          <div className="mt-10 space-y-5 text-sm">
            <a className="flex items-start gap-4 group" href="tel:+995595140106">
              <Phone className="h-5 w-5 text-gold mt-0.5" />
              <div><div className="text-bone/55 text-xs uppercase tracking-[0.25em]">{t("contact.247")}</div><div className="text-lg group-hover:text-gold transition-colors">+995 595 14 01 06</div></div>
            </a>
            <a className="flex items-start gap-4 group" href="mailto:chigladze.a@gmail.com">
              <Mail className="h-5 w-5 text-gold mt-0.5" />
              <div><div className="text-bone/55 text-xs uppercase tracking-[0.25em]">{t("contact.email")}</div><div className="text-lg group-hover:text-gold transition-colors">chigladze.a@gmail.com</div></div>
            </a>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-gold mt-0.5" />
              <div><div className="text-bone/55 text-xs uppercase tracking-[0.25em]">{t("contact.based")}</div><div className="text-lg">{t("contact.based.val")}</div></div>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success(t("contact.toast")); setF({ name: "", email: "", phone: "", message: "" }); }}
          className="lg:col-span-7 grid gap-px bg-bone/10 border border-bone/10"
        >
          <Input label={t("contact.name")} value={f.name} onChange={(v) => setF({ ...f, name: v })} required />
          <div className="grid md:grid-cols-2 gap-px bg-bone/10">
            <Input label={t("contact.emailL")} type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} required />
            <Input label={t("contact.phone")} type="tel" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
          </div>
          <label className="bg-onyx p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-bone/55 mb-2">{t("contact.journey")}</div>
            <textarea
              required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })}
              rows={5} placeholder={t("contact.journey.ph")}
              className="w-full bg-transparent border-0 p-0 text-base focus:outline-none placeholder:text-bone/35"
            />
          </label>
          <button type="submit" className="bg-gold text-onyx h-14 text-xs uppercase tracking-[0.3em] hover:bg-gold/90 transition-colors">
            {t("contact.send")}
          </button>
        </form>
      </div>
    </section>
  );
};

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="bg-onyx p-6 block">
      <div className="text-[10px] uppercase tracking-[0.3em] text-bone/55 mb-2">{label}</div>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 p-0 text-base focus:outline-none placeholder:text-bone/35" />
    </label>
  );
}