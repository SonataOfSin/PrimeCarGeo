import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BOOKING_STATUSES, listBookings, listCorporate, setBookingStatus, setCorporateStatus, type BookingStatus,
} from "@/services/bookings";

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

const Admin = () => {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <Center><Loader2 className="h-6 w-6 animate-spin text-gold" /></Center>;
  if (!session) return <SignIn />;
  return <Dashboard onSignOut={() => supabase.auth.signOut()} />;
};

const Center = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-dvh bg-onyx text-bone flex items-center justify-center p-6">{children}</div>
);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  return (
    <Center>
      <form onSubmit={submit} className="w-full max-w-sm border border-bone/15 p-8">
        <h1 className="font-display text-3xl">Drivero Operations</h1>
        <p className="mt-2 text-sm text-bone/60">Staff access only.</p>
        <label className="mt-8 block text-[10px] uppercase tracking-[0.28em] text-bone/50">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-bone/20 py-2 text-base text-bone focus:outline-none focus:border-gold" />
        </label>
        <label className="mt-6 block text-[10px] uppercase tracking-[0.28em] text-bone/50">Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-bone/20 py-2 text-base text-bone focus:outline-none focus:border-gold" />
        </label>
        <button disabled={busy} className="mt-8 w-full h-12 bg-gold text-onyx text-[11px] uppercase tracking-[0.28em] inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
    </Center>
  );
};

const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [tab, setTab] = useState<"bookings" | "corporate">("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [corp, setCorp] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([listBookings(), listCorporate()]);
      setBookings(b); setCorp(c); setDenied(false);
    } catch {
      setDenied(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const counts = useMemo(() => ({
    total: bookings.length,
    open: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
  }), [bookings]);

  return (
    <div className="min-h-dvh bg-onyx text-bone">
      <header className="border-b border-bone/10">
        <div className="container flex h-16 items-center justify-between">
          <span className="font-display text-xl">Driv<span className="text-gold">e</span>ro · Operations</span>
          <div className="flex items-center gap-2">
            <button onClick={load} aria-label="Refresh" className="size-11 inline-flex items-center justify-center hover:text-gold"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={onSignOut} aria-label="Sign out" className="size-11 inline-flex items-center justify-center hover:text-gold"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        {denied ? (
          <p className="text-bone/70">This account does not have operations access. Ask an administrator to grant you the admin role.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-px bg-bone/10 border border-bone/10 max-w-xl">
              {[["Requests", counts.total], ["New", counts.open], ["Confirmed", counts.confirmed]].map(([k, v]) => (
                <div key={String(k)} className="bg-onyx p-5">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-bone/50">{k}</div>
                  <div className="mt-2 font-display text-3xl text-gold">{v as number}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-2">
              {(["bookings", "corporate"] as const).map((k) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-5 h-11 text-[11px] uppercase tracking-[0.25em] border transition-colors ${tab === k ? "border-gold text-gold" : "border-bone/20 text-bone/55 hover:text-bone"}`}>
                  {k}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
            ) : tab === "bookings" ? (
              <div className="mt-6 overflow-x-auto border border-bone/10">
                <table className="w-full text-sm min-w-[900px]">
                  <thead className="text-[10px] uppercase tracking-[0.22em] text-bone/50">
                    <tr>{["Received", "Customer", "Journey", "Vehicle", "Party", "Status"].map((h) => <th key={h} className="text-left font-normal p-4">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t border-bone/10 align-top">
                        <td className="p-4 text-bone/60 whitespace-nowrap">{new Date(b.created_at).toLocaleString()}</td>
                        <td className="p-4">
                          <div>{b.customer_name}</div>
                          <div className="text-bone/55">{b.customer_phone}</div>
                          {b.customer_email && <div className="text-bone/40">{b.customer_email}</div>}
                        </td>
                        <td className="p-4">
                          <div>{b.pickup} → {b.dropoff}</div>
                          <div className="text-bone/55">{b.pickup_at ? new Date(b.pickup_at).toLocaleString() : "—"}</div>
                          {b.flight_number && <div className="text-bone/40">Flight {b.flight_number}</div>}
                          {b.notes && <div className="text-bone/40 max-w-xs">{b.notes}</div>}
                        </td>
                        <td className="p-4 whitespace-nowrap">{b.vehicle}<div className="text-bone/50">{b.service_type}</div></td>
                        <td className="p-4 whitespace-nowrap">{b.passengers} pax<div className="text-bone/50">{b.luggage} bags</div></td>
                        <td className="p-4">
                          <StatusSelect value={b.status} onChange={async (s) => {
                            await setBookingStatus(b.id, s);
                            setBookings((rows) => rows.map((r) => (r.id === b.id ? { ...r, status: s } : r)));
                          }} />
                        </td>
                      </tr>
                    ))}
                    {!bookings.length && <tr><td className="p-8 text-bone/50" colSpan={6}>No reservation requests yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto border border-bone/10">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="text-[10px] uppercase tracking-[0.22em] text-bone/50">
                    <tr>{["Received", "Company", "Contact", "Volume", "Status"].map((h) => <th key={h} className="text-left font-normal p-4">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {corp.map((c) => (
                      <tr key={c.id} className="border-t border-bone/10 align-top">
                        <td className="p-4 text-bone/60 whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</td>
                        <td className="p-4">{c.company}</td>
                        <td className="p-4">{c.contact_name}<div className="text-bone/55">{c.email}</div><div className="text-bone/40">{c.phone}</div></td>
                        <td className="p-4">{c.monthly_rides || "—"}</td>
                        <td className="p-4">
                          <StatusSelect value={c.status} onChange={async (s) => {
                            await setCorporateStatus(c.id, s);
                            setCorp((rows) => rows.map((r) => (r.id === c.id ? { ...r, status: s } : r)));
                          }} />
                        </td>
                      </tr>
                    ))}
                    {!corp.length && <tr><td className="p-8 text-bone/50" colSpan={5}>No corporate enquiries yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const StatusSelect = ({ value, onChange }: { value: BookingStatus; onChange: (s: BookingStatus) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as BookingStatus)}
    className="bg-transparent border border-bone/20 px-3 py-2 text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-gold"
    aria-label="Status"
  >
    {BOOKING_STATUSES.map((s) => <option key={s} value={s} className="bg-onyx">{s}</option>)}
  </select>
);

export default Admin;
