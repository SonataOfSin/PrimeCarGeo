CREATE TYPE public.app_role AS ENUM ('admin','staff','user');
CREATE TYPE public.booking_status AS ENUM ('new','contacted','confirmed','completed','cancelled');

CREATE TABLE public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null default 'transfer',
  pickup text not null,
  dropoff text not null,
  pickup_at timestamptz,
  vehicle text not null default 'V-Class',
  passengers int not null default 2,
  luggage int not null default 2,
  flight_number text,
  meet_greet boolean not null default false,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,
  locale text default 'en',
  status public.booking_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a booking request" ON public.booking_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view bookings" ON public.booking_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins can update bookings" ON public.booking_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins can delete bookings" ON public.booking_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_booking_requests_updated BEFORE UPDATE ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_booking_requests_created ON public.booking_requests (created_at DESC);

CREATE TABLE public.corporate_inquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null,
  phone text,
  monthly_rides text,
  notes text,
  status public.booking_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT INSERT ON public.corporate_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corporate_inquiries TO authenticated;
GRANT ALL ON public.corporate_inquiries TO service_role;
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a corporate inquiry" ON public.corporate_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view inquiries" ON public.corporate_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins can update inquiries" ON public.corporate_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins can delete inquiries" ON public.corporate_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_corporate_inquiries_updated BEFORE UPDATE ON public.corporate_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();