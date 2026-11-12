import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const SERVICE_TYPES = ["transfer", "airport", "hourly", "tour", "corporate"] as const;
export const VEHICLES = ["Maybach", "S-Class", "V-Class"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];
export type Vehicle = (typeof VEHICLES)[number];

export const bookingSchema = z.object({
  service_type: z.enum(SERVICE_TYPES),
  pickup: z.string().trim().min(2, "Pickup is required").max(160),
  dropoff: z.string().trim().min(2, "Drop-off is required").max(160),
  pickup_at: z.string().trim().min(1, "Date & time is required"),
  vehicle: z.enum(VEHICLES),
  passengers: z.number().int().min(1).max(7),
  luggage: z.number().int().min(0).max(10),
  flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  meet_greet: z.boolean(),
  customer_name: z.string().trim().min(2, "Name is required").max(100),
  customer_phone: z.string().trim().min(6, "Phone is required").max(30),
  customer_email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingRow = BookingInput & {
  id: string;
  status: BookingStatus;
  created_at: string;
  locale: string | null;
};

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export async function createBooking(input: BookingInput, locale = "en") {
  const { error } = await supabase
    .from("booking_requests")
    .insert({
      service_type: String(input.service_type),
      pickup: String(input.pickup),
      dropoff: String(input.dropoff),
      pickup_at: input.pickup_at ? new Date(input.pickup_at).toISOString() : undefined,
      vehicle: String(input.vehicle),
      passengers: Number(input.passengers),
      luggage: Number(input.luggage),
      flight_number: input.flight_number || undefined,
      meet_greet: Boolean(input.meet_greet),
      customer_name: String(input.customer_name),
      customer_phone: String(input.customer_phone),
      customer_email: input.customer_email || undefined,
      notes: input.notes || undefined,
      locale,
    });
  if (error) throw error;
}

export const corporateSchema = z.object({
  company: z.string().trim().min(2, "Company is required").max(120),
  contact_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  monthly_rides: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});
export type CorporateInput = z.infer<typeof corporateSchema>;

export async function createCorporateInquiry(input: CorporateInput) {
  const { error } = await supabase.from("corporate_inquiries").insert({
    company: String(input.company),
    contact_name: String(input.contact_name),
    email: String(input.email),
    phone: input.phone || undefined,
    monthly_rides: input.monthly_rides || undefined,
    notes: input.notes || undefined,
  });
  if (error) throw error;
}

export async function listBookings() {
  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listCorporate() {
  const { data, error } = await supabase
    .from("corporate_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from("booking_requests").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function setCorporateStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from("corporate_inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}
